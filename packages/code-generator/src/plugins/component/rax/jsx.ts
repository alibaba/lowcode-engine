import { NodeSchema, JSExpression, NpmInfo, CompositeValue } from '@ali/lowcode-types';

import _ from 'lodash';
import changeCase from 'change-case';
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
} from '../../../types';

import { RAX_CHUNK_NAME } from './const';
import { COMMON_CHUNK_NAME } from '../../../const/generator';

import { generateExpression } from '../../../utils/jsExpression';
import { createNodeGenerator, generateReactCtrlLine, generateAttr } from '../../../utils/nodeToJSX';
import { generateCompositeType } from '../../../utils/compositeType';

import { IScopeBindings, ScopeBindings } from '../../../utils/ScopeBindings';
import { parseExpressionConvertThis2Context, parseExpressionGetGlobalVariables } from '../../../utils/expressionParser';

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

  // 什么都不做的的话，会有 3 个问题：
  // 1. 小程序出码的时候，循环变量没法拿到
  // 2. 小程序出码的时候，很容易出现 Uncaught TypeError: Cannot read property 'avatar' of undefined 这样的异常(如下图的 50 行) -- 因为若直接出码，Rax 构建到小程序的时候会立即计算所有在视图中用到的变量
  // 3. 通过 this.xxx 能拿到的东西太多了，而且自定义的 methods 可能会无意间破坏 Rax 框架或小程序框架在页面 this 上的东东
  // const transformers = {
  //   transformThis2Context: (expr: string) => expr,
  //   transformJsExpr: (expr: string) => expr,
  //   transformLoopExpr: (expr: string) => expr,
  // };

  // 不转换 this.xxx 到 __$$context.xxx 的话，依然会有上述的 1 和 3 的问题。
  // const transformers = {
  //   transformThis2Context: (expr: string) => expr,
  //   transformJsExpr: (expr: string) => (isLiteralAtomicExpr(expr) ? expr : `__$$eval(() => (${expr}))`),
  //   transformLoopExpr: (expr: string) => `__$$evalArray(() => (${expr}))`,
  // };

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

    const mapComponentNameToAliasOrKeepIt = (componentName: string) =>
      componentsNameAliasMap.get(componentName) || componentName;

    // 然后过滤掉所有的别名 chunks
    next.chunks = next.chunks.filter((chunk) => !isImportAliasDefineChunk(chunk));

    const customHandlers: HandlerSet<string> = {
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

    // 创建代码生成器
    const commonNodeGenerator = createNodeGenerator({
      handlers: customHandlers,
      plugins: [generateReactCtrlLine],
    });

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
  return isLiteralAtomicExpr(expr) ? expr : `__$$eval(() => (${transformThis2Context(expr, handlers)}))`;
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
  return expr === 'null' || expr === 'undefined' || expr === 'true' || expr === 'false' || /^\d+$/.test(expr);
}

/**
 * 将所有的 this.xxx 替换为 __$$context.xxx
 * @param expr
 */
function transformThis2Context(expr: string, customHandlers: CustomHandlerSet): string {
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
  const valueExpr = generateCompositeType(attrValue, this);

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
