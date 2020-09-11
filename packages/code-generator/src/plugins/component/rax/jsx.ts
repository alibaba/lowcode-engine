import { NodeSchema, JSExpression, NpmInfo, CompositeValue, isJSExpression } from '@ali/lowcode-types';

import _ from 'lodash';
import changeCase from 'change-case';
import { Expression } from '@babel/types';
import {
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  ChunkType,
  CodePiece,
  FileType,
  ICodeChunk,
  ICodeStruct,
  IContainerInfo,
  PIECE_TYPE,
  HandlerSet,
  IScope,
  NodeGeneratorConfig,
  NodePlugin,
  AttrPlugin,
} from '../../../types';

import { RAX_CHUNK_NAME } from './const';
import { COMMON_CHUNK_NAME } from '../../../const/generator';

import { generateExpression } from '../../../utils/jsExpression';
import { createNodeGenerator, generateConditionReactCtrl, generateReactExprInJS } from '../../../utils/nodeToJSX';
import { generateCompositeType } from '../../../utils/compositeType';
import Scope from '../../../utils/Scope';
import {
  parseExpression,
  parseExpressionConvertThis2Context,
  parseExpressionGetGlobalVariables,
} from '../../../utils/expressionParser';

type PluginConfig = {
  fileType: string;
};

// TODO: componentName 若并非大写字符打头，甚至并非是一个有效的 JS 标识符怎么办？？
// FIXME: 我想了下，这块应该放到解析阶段就去做掉，对所有 componentName 做 identifier validate，然后对不合法的做统一替换。
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
    const rootScope = Scope.createRootScope();

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
    const customHandlers: HandlerSet<string> = {
      expression(input: JSExpression, scope: IScope) {
        return transformJsExpr(generateExpression(input), scope);
      },
      function(input, scope: IScope) {
        return transformThis2Context(input.value || 'null', scope);
      },
    };

    // 创建代码生成器
    const commonNodeGenerator = createNodeGenerator({
      handlers: customHandlers,
      tagMapping: mapComponentNameToAliasOrKeepIt,
      nodePlugins: [generateReactExprInJS, generateConditionReactCtrl, generateRaxLoopCtrl],
      attrPlugins: [generateNodeAttrForRax],
    });

    // 生成 JSX 代码
    const jsxContent = commonNodeGenerator(ir, rootScope);

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
      // TODO: setState, dataSourceMap, reloadDataSource, utils, i18n, i18nFormat, getLocale, setLocale 这些在 Rax 的编译模式下不能在视图中直接访问，需要转化成 this.xxx
      content: `
        const __$$context = this._context;
        const { state, setState, dataSourceMap, reloadDataSource, utils, constants, i18n, i18nFormat, getLocale, setLocale } = __$$context;
      `,
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

function transformJsExpr(expr: string, scope: IScope) {
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
      return transformThis2Context(exprAst, scope);

    default:
      break;
  }

  // 其他的都需要包一层
  return `__$$eval(() => (${transformThis2Context(exprAst, scope)}))`;
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
function transformThis2Context(expr: string | Expression, scope: IScope): string {
  // 下面这种字符串替换的方式虽然简单直接，但是对于复杂场景会误匹配，故后期改成了解析 AST 然后修改 AST 最后再重新生成代码的方式
  // return expr
  //   .replace(/\bthis\.item\./g, () => 'item.')
  //   .replace(/\bthis\.index\./g, () => 'index.')
  //   .replace(/\bthis\./g, () => '__$$context.');

  return parseExpressionConvertThis2Context(expr, '__$$context', scope.bindings?.getAllBindings() || []);
}

function generateRaxLoopCtrl(
  nodeItem: NodeSchema,
  scope: IScope,
  config?: NodeGeneratorConfig,
  next?: NodePlugin,
): CodePiece[] {
  if (nodeItem.loop) {
    const loopItemName = nodeItem.loopArgs?.[0] || 'item';
    const loopIndexName = nodeItem.loopArgs?.[1] || 'index';
    const subScope = scope.createSubScope([loopItemName, loopIndexName]);
    const pieces: CodePiece[] = next ? next(nodeItem, subScope, config) : [];

    const loopDataExpr = `__$$evalArray(() => (${transformThis2Context(
      generateCompositeType(nodeItem.loop, scope, { handlers: config?.handlers }),
      scope,
    )}))`;

    pieces.unshift({
      value: `${loopDataExpr}.map((${loopItemName}, ${loopIndexName}) => (`,
      type: PIECE_TYPE.BEFORE,
    });

    pieces.push({
      value: '))',
      type: PIECE_TYPE.AFTER,
    });

    return pieces;
  }

  return next ? next(nodeItem, scope, config) : [];
}

function generateNodeAttrForRax(
  attrData: { attrName: string; attrValue: CompositeValue },
  scope: IScope,
  config?: NodeGeneratorConfig,
  next?: AttrPlugin,
): CodePiece[] {
  if (!/^on/.test(attrData.attrName)) {
    return next ? next(attrData, scope, config) : [];
  }
  // else: onXxx 的都是事件处理函数需要特殊处理下
  return generateEventHandlerAttrForRax(attrData.attrName, attrData.attrValue, scope, config);
}

function generateEventHandlerAttrForRax(
  attrName: string,
  attrValue: CompositeValue,
  scope: IScope,
  config?: NodeGeneratorConfig,
): CodePiece[] {
  // -- 事件处理函数中 JSExpression 转成 JSFunction 来处理，避免当 JSExpression 处理的时候多包一层 eval 而导致 Rax 转码成小程序的时候出问题
  const valueExpr = generateCompositeType(
    isJSExpression(attrValue) ? { type: 'JSFunction', value: attrValue.value } : attrValue,
    scope,
    {
      handlers: config?.handlers,
    },
  );

  // 查询当前作用域下的变量
  const currentScopeVariables = scope.bindings?.getAllBindings() || [];
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
