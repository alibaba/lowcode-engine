import changeCase from 'change-case';
import { COMMON_CHUNK_NAME, CLASS_DEFINE_CHUNK_NAME } from '../../../const/generator';
import { REACT_CHUNK_NAME } from './const';

import {
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  ChunkType,
  FileType,
  ICodeStruct,
  IContainerInfo,
} from '../../../types';

const pluginFactory: BuilderComponentPluginFactory<unknown> = () => {
  const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
    const next: ICodeStruct = {
      ...pre,
    };

    const ir = next.ir as IContainerInfo;

    // 将模块名转换成 PascalCase 的格式，并添加特定后缀，防止命名冲突
    const componentClassName = `${changeCase.pascalCase(ir.moduleName)}$$Page`;

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.JSX,
      name: CLASS_DEFINE_CHUNK_NAME.Start,
      content: `class ${componentClassName} extends React.Component {`,
      linkAfter: [
        COMMON_CHUNK_NAME.ExternalDepsImport,
        COMMON_CHUNK_NAME.InternalDepsImport,
        COMMON_CHUNK_NAME.ImportAliasDefine,
        COMMON_CHUNK_NAME.FileVarDefine,
        COMMON_CHUNK_NAME.FileUtilDefine,
      ],
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.JSX,
      name: CLASS_DEFINE_CHUNK_NAME.End,
      content: `}`,
      linkAfter: [
        CLASS_DEFINE_CHUNK_NAME.Start,
        REACT_CHUNK_NAME.ClassRenderEnd,
      ],
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.JSX,
      name: CLASS_DEFINE_CHUNK_NAME.ConstructorStart,
      content: 'constructor(props, context) { super(props); ',
      linkAfter: [CLASS_DEFINE_CHUNK_NAME.Start],
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.JSX,
      name: CLASS_DEFINE_CHUNK_NAME.ConstructorEnd,
      content: '}',
      linkAfter: [
        CLASS_DEFINE_CHUNK_NAME.ConstructorStart,
        CLASS_DEFINE_CHUNK_NAME.ConstructorContent,
      ],
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.JSX,
      name: REACT_CHUNK_NAME.ClassRenderStart,
      content: 'render() {',
      linkAfter: [
        CLASS_DEFINE_CHUNK_NAME.Start,
        CLASS_DEFINE_CHUNK_NAME.ConstructorEnd,
        CLASS_DEFINE_CHUNK_NAME.InsMethod,
      ],
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.JSX,
      name: REACT_CHUNK_NAME.ClassRenderEnd,
      content: '}',
      linkAfter: [
        REACT_CHUNK_NAME.ClassRenderStart,
        REACT_CHUNK_NAME.ClassRenderPre,
        REACT_CHUNK_NAME.ClassRenderJSX,
      ],
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.JSX,
      name: COMMON_CHUNK_NAME.FileExport,
      content: `export default ${componentClassName};`,
      linkAfter: [
        COMMON_CHUNK_NAME.ExternalDepsImport,
        COMMON_CHUNK_NAME.InternalDepsImport,
        COMMON_CHUNK_NAME.ImportAliasDefine,
        COMMON_CHUNK_NAME.FileVarDefine,
        COMMON_CHUNK_NAME.FileUtilDefine,
        CLASS_DEFINE_CHUNK_NAME.End,
      ],
    });

    return next;
  };
  return plugin;
};

export default pluginFactory;
