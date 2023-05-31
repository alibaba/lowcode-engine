import {
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  ChunkType,
  FileType,
  HandlerSet,
  ICodeStruct,
  IContainerInfo,
  IScope,
  NodeGeneratorConfig,
  PIECE_TYPE,
} from '../../../types';

import { REACT_CHUNK_NAME } from './const';
import { COMMON_CHUNK_NAME } from '../../../const/generator';

import { createReactNodeGenerator } from '../../../utils/nodeToJSX';
import { Scope } from '../../../utils/Scope';
import { IPublicTypeJSExpression } from '@alilc/lowcode-types';
import { generateExpression } from '../../../utils/jsExpression';
import { transformJsExpr } from '../../../core/jsx/handlers/transformJsExpression';
import { transformThis2Context } from '../../../core/jsx/handlers/transformThis2Context';
import { generateCompositeType } from '../../../utils/compositeType';

export interface PluginConfig {
  fileType?: string;
  nodeTypeMapping?: Record<string, string>;
}

const pluginFactory: BuilderComponentPluginFactory<PluginConfig> = (config?) => {
  const cfg = {
    fileType: FileType.JSX,
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    nodeTypeMapping: {} as Record<string, string>,
    ...config,
  };

  const { nodeTypeMapping } = cfg;

  const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
    const next: ICodeStruct = {
      ...pre,
    };

    const { tolerateEvalErrors = true, evalErrorsHandler = '' } = next.contextData;

    // 这里会将内部的一些子上下文的访问(this.xxx)转换为 __$$context.xxx 的形式
    // 与 Rax 所不同的是，这里不会将最顶层的 this 转换掉
    const customHandlers: HandlerSet<string> = {
      expression(input: IPublicTypeJSExpression, scope: IScope, config) {
        return transformJsExpr(generateExpression(input, scope), scope, {
          dontWrapEval: !(config?.tolerateEvalErrors ?? tolerateEvalErrors),
          dontTransformThis2ContextAtRootScope: true,
        });
      },
      function(input, scope: IScope) {
        return transformThis2Context(
          generateCompositeType(
            {
              type: 'JSFunction',
              value: input.value || 'function () {}',
            },
            Scope.createRootScope(),
          ),
          scope,
          { ignoreRootScope: true },
        );
      },
    };

    const generatorPlugins: NodeGeneratorConfig = {
      handlers: customHandlers,
      tagMapping: (v) => nodeTypeMapping[v] || v,
      tolerateEvalErrors,
    };

    if (next.contextData.useRefApi) {
      generatorPlugins.attrPlugins = [
        (attrData, scope, pluginCfg, nextFunc) => {
          if (attrData.attrName === 'ref') {
            return [
              {
                name: attrData.attrName,
                value: `this._refsManager.linkRef('${attrData.attrValue}')`,
                type: PIECE_TYPE.ATTR,
              },
            ];
          }

          return nextFunc ? nextFunc(attrData, scope, pluginCfg) : [];
        },
      ];
    }

    const generator = createReactNodeGenerator(generatorPlugins);

    const ir = next.ir as IContainerInfo;
    const scope: IScope = Scope.createRootScope();
    const jsxContent = generator(ir, scope);

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: cfg.fileType,
      name: REACT_CHUNK_NAME.ClassRenderJSX,
      content: `
        const __$$context = this._context || this;
        const { state } = __$$context;
        return ${jsxContent};
      `,
      linkAfter: [REACT_CHUNK_NAME.ClassRenderStart, REACT_CHUNK_NAME.ClassRenderPre],
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
          const childContext = {
            ...oldContext,
            ...ext,
          };
          childContext.__proto__ = oldContext;
          return childContext;
        }
      `,
      ]
        .filter(Boolean)
        .join('\n'),
      linkAfter: [COMMON_CHUNK_NAME.FileExport],
    });
    return next;
  };
  return plugin;
};

export default pluginFactory;
