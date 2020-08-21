import _ from 'lodash';
import changeCase from 'change-case';
import { Expression, MemberExpression } from '@babel/types';
import {
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  ChunkType,
  CodePiece,
  CompositeValue,
  FileType,
  HandlerSet,
  ICodeChunk,
  ICodeStruct,
  IContainerInfo,
  JSExpression,
  NodeSchema,
  NpmInfo,
  PIECE_TYPE,
} from '../../../types';

import { RAX_CHUNK_NAME } from './const';
import { COMMON_CHUNK_NAME } from '../../../const/generator';

import { createNodeGenerator, generateReactCtrlLine, generateString, generateAttr } from '../../../utils/nodeToJSX';
import { generateExpression } from '../../../utils/jsExpression';
import { CustomHandlerSet, generateUnknownType } from '../../../utils/compositeType';

import { IScopeBindings, ScopeBindings } from '../../../utils/ScopeBindings';
import {
  parseExpression,
  parseExpressionConvertThis2Context,
  parseExpressionGetGlobalVariables,
} from '../../../utils/expressionParser';

type PluginConfig = {
  fileType: string;
};

const pluginFactory: BuilderComponentPluginFactory<PluginConfig> = (config?) => {
  const cfg: PluginConfig = {
    fileType: FileType.JSX,
    ...config,
  };

  const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
    const next: ICodeStruct = {
      ...pre,
    };

    const ir = next.ir as IContainerInfo;

    // Rax 构建到小程序的时候，不能给组件起起别名，得直接引用，故这里将所有的别名替换掉
    // 先收集下所有的 alias 的映射
    const componentsNameAliasMap = new Map<string, string>();
    next.chunks.forEach((chunk) => {
      if (isImportAliasDefineChunk(chunk)) {
        componentsNameAliasMap.set(chunk.ext.aliasName, chunk.ext.originalName);
      }
    });

    // 注意：这里其实隐含了一个假设：schema 中的 componentName 应该是一个有效的 JS 标识符，而且是大写字母打头的
    const mapComponentNameToAliasOrKeepIt = (componentName: string) =>
      componentsNameAliasMap.get(componentName) || componentName;

    // 然后过滤掉所有的别名 chunks
    next.chunks = next.chunks.filter((chunk) => !isImportAliasDefineChunk(chunk));

    // 如果直接按目前的 React 的方式之间出码 JSX 的话，会有 3 个问题：
    // 1. 小程序出码的时候，循环变量没法拿到
    // 2. 小程序出码的时候，很容易出现 Uncaught TypeError: Cannot read property 'avatar' of undefined 这样的异常(如下图的 50 行) -- 因为若直接出码，Rax 构建到小程序的时候会立即计算所有在视图中用到的变量
    // 3. 通过 this.xxx 能拿到的东西太多了，而且自定义的 methods 可能会无意间破坏 Rax 框架或小程序框架在页面 this 上的东东
    const customHandlers: CustomHandlerSet = {
      expression(this: CustomHandlerSet, input: JSExpression) {
        return transformJsExpr(generateExpression(input), this);
      },
      function(input) {
        return transformThis2Context(input.value || 'null', this);
      },
      loopDataExpr(input) {
        return typeof input === 'string' ? transformLoopExpr(input, this) : '';
      },
      tagName: mapComponentNameToAliasOrKeepIt,
      nodeAttr: generateNodeAttrForRax,
    };

    const generatorHandlers: HandlerSet<string> = {
      string: generateString,
      expression: (input) => [customHandlers.expression?.(input) || 'null'],
      function: (input) => [customHandlers.function?.(input) || 'null'],
    };

    // 创建代码生成器
    const commonNodeGenerator = createNodeGenerator(generatorHandlers, [generateReactCtrlLine], customHandlers);

    const raxCodeGenerator = (node: NodeSchema): string => {
      if (node.loop) {
        const loopItemName = node.loopArgs?.[0] || 'item';
        const loopIndexName = node.loopArgs?.[1] || 'index';

        return runInNewScope({
          scopeHost: customHandlers,
          newScopeOwnVariables: [loopItemName, loopIndexName],
          run: () => commonNodeGenerator(node),
        });
      }

      return commonNodeGenerator(node);
    };

    generatorHandlers.node = (node) => [raxCodeGenerator(node)];
    customHandlers.node = raxCodeGenerator;

    // 生成 JSX 代码
    const jsxContent = raxCodeGenerator(ir);

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: cfg.fileType,
      name: COMMON_CHUNK_NAME.ExternalDepsImport,
      content: `import { isMiniApp as __$$isMiniApp } from 'universal-env';`,
      linkAfter: [],
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: cfg.fileType,
      name: RAX_CHUNK_NAME.ClassRenderPre,
      content: `const __$$context = this._context;`,
      linkAfter: [RAX_CHUNK_NAME.ClassRenderBegin],
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: cfg.fileType,
      name: RAX_CHUNK_NAME.ClassRenderJSX,
      content: `return ${jsxContent};`,
      linkAfter: [RAX_CHUNK_NAME.ClassRenderBegin, RAX_CHUNK_NAME.ClassRenderPre],
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: cfg.fileType,
      name: COMMON_CHUNK_NAME.CustomContent,
      content: `

        function __$$eval(expr) {
          try {
            return expr();
          } catch (err) {
            console.warn('Failed to evaluate: ', expr, err);
          }
        }

        function __$$evalArray(expr) {
          const res = __$$eval(expr);
          return Array.isArray(res) ? res : [];
        }

      `,
      linkAfter: [COMMON_CHUNK_NAME.FileExport],
    });

    return next;
  };

  return plugin;
};

export default pluginFactory;

function transformLoopExpr(expr: string, handlers: CustomHandlerSet) {
  return `__$$evalArray(() => (${transformThis2Context(expr, handlers)}))`;
}

function transformJsExpr(expr: string, handlers: CustomHandlerSet) {
  if (!expr) {
    return 'undefined';
  }

  if (isLiteralAtomicExpr(expr)) {
    return expr;
  }

  const exprAst = parseExpression(expr);

  // 对于下面这些比较安全的字面值，可以直接返回对应的表达式，而非包一层
  if (isSimpleStraightLiteral(exprAst)) {
    return expr;
  }

  switch (exprAst.type) {
    // 对于直接写个函数的，则不用再包下，因为这样不会抛出异常的
    case 'ArrowFunctionExpression':
    case 'FunctionExpression':
      return transformThis2Context(exprAst, handlers);

    default:
      break;
  }

  // 其他的都需要包一层
  return `__$$eval(() => (${transformThis2Context(exprAst, handlers)}))`;
}

/** this.xxx */
function isSimpleDirectlyAccessingThis(exprAst: MemberExpression) {
  return !exprAst.computed && exprAst.object.type === 'ThisExpression';
}

/** this.state.xxx 和 this.utils.xxx 等安全的肯定应该存在的东东 */
function isSimpleDirectlyAccessingSafeProperties(exprAst: MemberExpression): boolean {
  const isPropertySimpleStraight =
    !exprAst.computed || (exprAst.property.type !== 'PrivateName' && isSimpleStraightLiteral(exprAst.property));

  return (
    isPropertySimpleStraight &&
    exprAst.object.type === 'MemberExpression' &&
    exprAst.object.object.type === 'ThisExpression' &&
    !exprAst.object.computed &&
    exprAst.object.property.type === 'Identifier' &&
    /^(state|utils|constants|i18n)$/.test(exprAst.object.property.name)
  );
}

/** 判断是非是一些简单直接的字面值 */
function isSimpleStraightLiteral(expr: Expression): boolean {
  switch (expr.type) {
    case 'BigIntLiteral':
    case 'BooleanLiteral':
    case 'DecimalLiteral':
    case 'NullLiteral':
    case 'NumericLiteral':
    case 'RegExpLiteral':
    case 'StringLiteral':
      return true;
    default:
      return false;
  }
}

function isImportAliasDefineChunk(
  chunk: ICodeChunk,
): chunk is ICodeChunk & {
  ext: {
    aliasName: string;
    originalName: string;
    dependency: NpmInfo;
  };
} {
  return (
    chunk.name === COMMON_CHUNK_NAME.ImportAliasDefine &&
    !!chunk.ext &&
    typeof chunk.ext.aliasName === 'string' &&
    typeof chunk.ext.originalName === 'string' &&
    !!(chunk.ext.dependency as NpmInfo | null)?.componentName
  );
}

/**
 * 判断是否是原子类型的表达式
 */
function isLiteralAtomicExpr(expr: string): boolean {
  return expr === 'null' || expr === 'undefined' || expr === 'true' || expr === 'false' || /^-?\d+(\.\d+)?$/.test(expr);
}

/**
 * 将所有的 this.xxx 替换为 __$$context.xxx
 * @param expr
 */
function transformThis2Context(expr: string | Expression, customHandlers: CustomHandlerSet): string {
  // 下面这种字符串替换的方式虽然简单直接，但是对于复杂场景会误匹配，故后期改成了解析 AST 然后修改 AST 最后再重新生成代码的方式
  // return expr
  //   .replace(/\bthis\.item\./g, () => 'item.')
  //   .replace(/\bthis\.index\./g, () => 'index.')
  //   .replace(/\bthis\./g, () => '__$$context.');

  return parseExpressionConvertThis2Context(expr, '__$$context', customHandlers.scopeBindings?.getAllBindings() || []);
}

function generateNodeAttrForRax(this: CustomHandlerSet, attrName: string, attrValue: CompositeValue): CodePiece[] {
  if (!/^on/.test(attrName)) {
    return generateAttr(attrName, attrValue, {
      ...this,
      nodeAttr: undefined,
    });
  }

  // 先出个码
  const valueExpr = generateUnknownType(attrValue, this);

  // 查询当前作用域下的变量
  const currentScopeVariables = this.scopeBindings?.getAllBindings() || [];
  if (currentScopeVariables.length <= 0) {
    return [
      {
        type: PIECE_TYPE.ATTR,
        value: `${attrName}={${valueExpr}}`,
      },
    ];
  }

  // 提取出所有的未定义的全局变量
  const undeclaredVariablesInValueExpr = parseExpressionGetGlobalVariables(valueExpr);
  const referencedLocalVariables = _.intersection(undeclaredVariablesInValueExpr, currentScopeVariables);
  if (referencedLocalVariables.length <= 0) {
    return [
      {
        type: PIECE_TYPE.ATTR,
        value: `${attrName}={${valueExpr}}`,
      },
    ];
  }

  const wrappedAttrValueExpr = [
    `(...__$$args) => {`,
    `  if (__$$isMiniApp) {`,
    `    const __$$event = __$$args[0];`,
    ...referencedLocalVariables.map((localVar) => `const ${localVar} = __$$event.target.dataset.${localVar};`),
    `    return (${valueExpr}).apply(this, __$$args);`,
    `  } else {`,
    `    return (${valueExpr}).apply(this, __$$args);`,
    `  }`,
    `}`,
  ].join('\n');

  return [
    ...referencedLocalVariables.map((localVar) => ({
      type: PIECE_TYPE.ATTR,
      value: `data-${changeCase.snake(localVar)}={${localVar}}`,
    })),
    {
      type: PIECE_TYPE.ATTR,
      value: `${attrName}={${wrappedAttrValueExpr}}`,
    },
  ];
}

function runInNewScope<T>({
  scopeHost,
  newScopeOwnVariables,
  run,
}: {
  scopeHost: {
    scopeBindings?: IScopeBindings;
  };
  newScopeOwnVariables: string[];
  run: () => T;
}): T {
  const originalScopeBindings = scopeHost.scopeBindings;

  try {
    const newScope = new ScopeBindings(originalScopeBindings);

    newScopeOwnVariables.forEach((varName) => {
      newScope.addBinding(varName);
    });

    scopeHost.scopeBindings = newScope;

    return run();
  } finally {
    scopeHost.scopeBindings = originalScopeBindings;
  }
}
