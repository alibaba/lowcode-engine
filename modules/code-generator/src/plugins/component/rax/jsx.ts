import {
  IPublicTypeNodeSchema,
  IPublicTypeJSExpression,
  IPublicTypeNpmInfo,
  IPublicTypeCompositeValue,
  isJSExpression,
} from '@alilc/lowcode-types';

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
  IScope,
  NodeGeneratorConfig,
  NodePlugin,
  AttrPlugin,
} from '../../../types';

import { RAX_CHUNK_NAME } from './const';
import { COMMON_CHUNK_NAME } from '../../../const/generator';

import { generateExpression } from '../../../utils/jsExpression';
import {
  createNodeGenerator,
  generateConditionReactCtrl,
  generateReactExprInJS,
} from '../../../utils/nodeToJSX';
import { generateCompositeType } from '../../../utils/compositeType';
import { Scope } from '../../../utils/Scope';
import { parseExpressionGetGlobalVariables } from '../../../utils/expressionParser';
import { transformThis2Context } from '../../../core/jsx/handlers/transformThis2Context';
import { transformJsExpr } from '../../../core/jsx/handlers/transformJsExpression';

export interface PluginConfig {
  fileType: string;

  /** 是否要忽略小程序 */
  ignoreMiniApp?: boolean;
}

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
    const { tolerateEvalErrors = true, evalErrorsHandler = '' } = next.contextData;

    // Rax 构建到小程序的时候，不能给组件起起别名，得直接引用，故这里将所有的别名替换掉
    // 先收集下所有的 alias 的映射
    const componentsNameAliasMap = new Map<string, string>();
    next.chunks.forEach((chunk) => {
      if (isImportAliasDefineChunk(chunk)) {
        componentsNameAliasMap.set(chunk.ext.aliasName, chunk.ext.originalName);
      }
    });

    // 注意：这里其实隐含了一个假设：schema 中的 componentName 应该是一个有效的 JS 标识符，而且是大写字母打头的
    // FIXME: 为了快速修复临时加的逻辑，需要用 pre-process 的方式替代处理。
    const mapComponentNameToAliasOrKeepIt = (componentName: string) => componentsNameAliasMap.get(componentName) || componentName;

    // 然后过滤掉所有的别名 chunks
    next.chunks = next.chunks.filter((chunk) => !isImportAliasDefineChunk(chunk));

    // 如果直接按目前的 React 的方式之间出码 JSX 的话，会有 3 个问题：
    // 1. 小程序出码的时候，循环变量没法拿到
    // 2. 小程序出码的时候，很容易出现 Uncaught TypeError: Cannot read property 'avatar' of undefined 这样的异常(如下图的 50 行) -- 因为若直接出码，Rax 构建到小程序的时候会立即计算所有在视图中用到的变量
    // 3. 通过 this.xxx 能拿到的东西太多了，而且自定义的 methods 可能会无意间破坏 Rax 框架或小程序框架在页面 this 上的东东
    const customHandlers: HandlerSet<string> = {
      expression(input: IPublicTypeJSExpression, scope: IScope) {
        return transformJsExpr(generateExpression(input, scope), scope, {
          dontWrapEval: !tolerateEvalErrors,
        });
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
      attrPlugins: [generateNodeAttrForRax.bind({ cfg })],
    });

    // 生成 JSX 代码
    const jsxContent = commonNodeGenerator(ir, rootScope);

    if (!cfg.ignoreMiniApp) {
      next.chunks.push({
        type: ChunkType.STRING,
        fileType: cfg.fileType,
        name: COMMON_CHUNK_NAME.ExternalDepsImport,
        content: "import { isMiniApp as __$$isMiniApp } from 'universal-env';",
        linkAfter: [],
      });
    }

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
      content: [
        tolerateEvalErrors &&
          `
        function __$$eval(expr) {
          try {
            return expr();
          } catch (error) {
            ${evalErrorsHandler}
          }
        }

        function __$$evalArray(expr) {
          const res = __$$eval(expr);
          return Array.isArray(res) ? res : [];
        }
        `,
        `
        function __$$createChildContext(oldContext, ext) {
          return Object.assign({}, oldContext, ext);
        }
      `,
      ]
        .filter(Boolean)
        .join('\n'),
      linkAfter: [COMMON_CHUNK_NAME.FileExport],
    });

    return next;

    function generateRaxLoopCtrl(
      nodeItem: IPublicTypeNodeSchema,
      scope: IScope,
      config?: NodeGeneratorConfig,
      next?: NodePlugin,
    ): CodePiece[] {
      if (nodeItem.loop) {
        const loopItemName = nodeItem.loopArgs?.[0] || 'item';
        const loopIndexName = nodeItem.loopArgs?.[1] || 'index';
        const subScope = scope.createSubScope([loopItemName, loopIndexName]);
        const pieces: CodePiece[] = next ? next(nodeItem, subScope, config) : [];

        const loopDataExpr = tolerateEvalErrors
          ? `__$$evalArray(() => (${transformThis2Context(
              generateCompositeType(nodeItem.loop, scope, { handlers: config?.handlers }),
              scope,
            )}))`
          : `(${transformThis2Context(
              generateCompositeType(nodeItem.loop, scope, { handlers: config?.handlers }),
              scope,
            )})`;

        pieces.unshift({
          value: `${loopDataExpr}.map((${loopItemName}, ${loopIndexName}) => ((__$$context) => (`,
          type: PIECE_TYPE.BEFORE,
        });

        pieces.push({
          value: `))(__$$createChildContext(__$$context, { ${loopItemName}, ${loopIndexName} })))`,
          type: PIECE_TYPE.AFTER,
        });

        return pieces;
      }

      return next ? next(nodeItem, scope, config) : [];
    }
  };

  return plugin;
};

export default pluginFactory;

function isImportAliasDefineChunk(chunk: ICodeChunk): chunk is ICodeChunk & {
  ext: {
    aliasName: string;
    originalName: string;
    dependency: IPublicTypeNpmInfo;
  };
} {
  return (
    chunk.name === COMMON_CHUNK_NAME.ImportAliasDefine &&
    !!chunk.ext &&
    typeof chunk.ext.aliasName === 'string' &&
    typeof chunk.ext.originalName === 'string' &&
    !!(chunk.ext.dependency as IPublicTypeNpmInfo | null)?.componentName
  );
}

function generateNodeAttrForRax(
  this: { cfg: PluginConfig },
  attrData: { attrName: string; attrValue: IPublicTypeCompositeValue },
  scope: IScope,
  config?: NodeGeneratorConfig,
  next?: AttrPlugin,
): CodePiece[] {
  if (!this.cfg.ignoreMiniApp && /^on/.test(attrData.attrName)) {
    // else: onXxx 的都是事件处理函数需要特殊处理下
    return generateEventHandlerAttrForRax(attrData.attrName, attrData.attrValue, scope, config);
  }

  if (attrData.attrName === 'ref') {
    return [
      {
        name: attrData.attrName,
        value: `__$$context._refsManager.linkRef('${attrData.attrValue}')`,
        type: PIECE_TYPE.ATTR,
      },
    ];
  }

  return next ? next(attrData, scope, config) : [];
}

function generateEventHandlerAttrForRax(
  attrName: string,
  attrValue: IPublicTypeCompositeValue,
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
        name: attrName,
        value: valueExpr,
      },
    ];
  }

  // 提取出所有的未定义的全局变量
  const undeclaredVariablesInValueExpr = parseExpressionGetGlobalVariables(valueExpr);
  const referencedLocalVariables = _.intersection(
    undeclaredVariablesInValueExpr,
    currentScopeVariables,
  );
  if (referencedLocalVariables.length <= 0) {
    return [
      {
        type: PIECE_TYPE.ATTR,
        name: attrName,
        value: valueExpr,
      },
    ];
  }

  const wrappedAttrValueExpr = [
    '(...__$$args) => {',
    '  if (__$$isMiniApp) {',
    '    const __$$event = __$$args[0];',
    ...referencedLocalVariables.map(
      (localVar) => `const ${localVar} = __$$event.target.dataset.${localVar};`,
    ),
    `    return (${valueExpr}).apply(this, __$$args);`,
    '  } else {',
    `    return (${valueExpr}).apply(this, __$$args);`,
    '  }',
    '}',
  ].join('\n');

  return [
    ...referencedLocalVariables.map((localVar) => ({
      type: PIECE_TYPE.ATTR,
      name: `data-${changeCase.snake(localVar)}`,
      value: localVar,
    })),
    {
      type: PIECE_TYPE.ATTR,
      name: attrName,
      value: wrappedAttrValueExpr,
    },
  ];
}
