import changeCase from 'change-case';
import {
  COMMON_CHUNK_NAME,
  CLASS_DEFINE_CHUNK_NAME,
  DEFAULT_LINK_AFTER,
} from '../../../const/generator';
import { REACT_CHUNK_NAME } from './const';

import {
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  ChunkType,
  FileType,
  ICodeStruct,
  IContainerInfo,
} from '../../../types';
import { ensureValidClassName } from '../../../utils/validate';

const pluginFactory: BuilderComponentPluginFactory<unknown> = () => {
  const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
    const next: ICodeStruct = {
      ...pre,
    };

    const ir = next.ir as IContainerInfo;

    // 将模块名转换成 PascalCase 的格式，并添加特定后缀，防止命名冲突
    const componentClassName = ensureValidClassName(
      `${changeCase.pascalCase(ir.moduleName)}$$${ir.containerType}`,
    );

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

    if (ir.containerType === 'Component') {
      next.chunks.push({
        type: ChunkType.STRING,
        fileType: FileType.JSX,
        name: CLASS_DEFINE_CHUNK_NAME.InsVar,
        content: `static displayName = '${ir.moduleName}';`,
        linkAfter: [
          CLASS_DEFINE_CHUNK_NAME.Start,
        ],
      });
    }

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.JSX,
      name: CLASS_DEFINE_CHUNK_NAME.End,
      content: '}',
      linkAfter: [
        ...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.End],
        REACT_CHUNK_NAME.ClassRenderEnd,
        REACT_CHUNK_NAME.ClassDidMountEnd,
      ],
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.JSX,
      name: CLASS_DEFINE_CHUNK_NAME.ConstructorStart,
      content: 'constructor(props, context) { super(props); ',
      linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.ConstructorStart]],
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.JSX,
      name: CLASS_DEFINE_CHUNK_NAME.ConstructorEnd,
      content: '}',
      linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.ConstructorEnd]],
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.JSX,
      name: REACT_CHUNK_NAME.ClassDidMountStart,
      content: 'componentDidMount() {',
      linkAfter: [...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.End]],
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.JSX,
      name: REACT_CHUNK_NAME.ClassDidMountEnd,
      content: '}',
      linkAfter: [REACT_CHUNK_NAME.ClassDidMountContent, REACT_CHUNK_NAME.ClassDidMountStart],
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.JSX,
      name: REACT_CHUNK_NAME.ClassRenderStart,
      content: 'render() {',
      linkAfter: [
        ...DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.End],
        REACT_CHUNK_NAME.ClassDidMountEnd,
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
