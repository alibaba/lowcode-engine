import { isJSExpression, isJSFunction, JSExpression, JSFunction, NpmInfo } from '@ali/lowcode-types';

import {
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  ChunkType,
  FileType,
  ICodeChunk,
  ICodeStruct,
  IContainerInfo,
} from '../../../types';

import { RAX_CHUNK_NAME } from './const';
import { COMMON_CHUNK_NAME } from '../../../const/generator';

import { createNodeGenerator, generateReactCtrlLine, generateString } from '../../../utils/nodeToJSX';
import { generateExpression } from '../../../utils/jsExpression';

type PluginConfig = {
  fileType: string;
};

// TODO: componentName 若并非大写字符打头，甚至并非是一个有效的 JS 标识符怎么办？？
const pluginFactory: BuilderComponentPluginFactory<PluginConfig> = (config?) => {
  const cfg: PluginConfig = {
    fileType: FileType.JSX,
    ...config,
  };

  const transformers = {
    transformThis2Context,
    transformJsExpr: (expr: string) =>
      isLiteralAtomicExpr(expr) ? expr : `__$$eval(() => (${transformThis2Context(expr)}))`,
    transformLoopExpr: (expr: string) => `__$$evalArray(() => (${transformThis2Context(expr)}))`,
  };

  const handlers = {
    expression: (input: JSExpression) => transformers.transformJsExpr(generateExpression(input)),
    function: (input: JSFunction) => transformers.transformJsExpr(input.value || 'null'),
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

    const mapComponentNameToAliasOrKeepIt = (componentName: string) =>
      componentsNameAliasMap.get(componentName) || componentName;

    // 然后过滤掉所有的别名 chunks
    next.chunks = next.chunks.filter((chunk) => !isImportAliasDefineChunk(chunk));

    // 创建代码生成器
    const generator = createNodeGenerator(
      {
        string: generateString,
        expression: (input) => [handlers.expression(input)],
        function: (input) => [handlers.function(input)],
      },
      [generateReactCtrlLine],
      {
        expression: (input: JSExpression) => (isJSExpression(input) ? handlers.expression(input) : ''),
        function: (input: JSFunction) => (isJSFunction(input) ? handlers.function(input) : ''),
        loopDataExpr: (input: string) => (typeof input === 'string' ? transformers.transformLoopExpr(input) : ''),
        tagName: mapComponentNameToAliasOrKeepIt,
      },
    );

    // 生成 JSX 代码
    const jsxContent = generator(ir);

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
function transformThis2Context(expr: string): string {
  // TODO: 应该根据语法分析来搞
  // TODO: 如何替换自定义名字的循环变量？（generateReactCtrlLine）
  return expr
    .replace(/\bthis\.item\./, () => 'item.')
    .replace(/\bthis\.index\./, () => 'index.')
    .replace(/\bthis\./, () => '__$$context.');
}
