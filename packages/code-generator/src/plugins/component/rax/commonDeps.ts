import { COMMON_CHUNK_NAME } from '../../../const/generator';

import {
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  ChunkType,
  FileType,
  ICodeStruct,
} from '../../../types';

const pluginFactory: BuilderComponentPluginFactory<unknown> = () => {
  const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
    const next: ICodeStruct = {
      ...pre,
    };

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.JSX,
      name: COMMON_CHUNK_NAME.ExternalDepsImport,
      content: `
        // 注意: 出码引擎注入的临时变量默认都以 "__$$" 开头，禁止在搭建的代码中直接访问。
        // 例外：rax 框架的导出名和各种组件名除外。
        import { createElement, Component } from 'rax';
        import { getSearchParams as __$$getSearchParams } from 'rax-app';
      `,
      linkAfter: [],
    });

    return next;
  };
  return plugin;
};

export default pluginFactory;
