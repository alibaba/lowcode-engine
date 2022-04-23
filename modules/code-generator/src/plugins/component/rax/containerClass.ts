import changeCase from 'change-case';
import {
  COMMON_CHUNK_NAME,
  CLASS_DEFINE_CHUNK_NAME,
  DEFAULT_LINK_AFTER,
} from '../../../const/generator';
import { RAX_CHUNK_NAME } from './const';

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
      `${changeCase.pascalCase(ir.moduleName)}$$Page`,
    );

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.JSX,
      name: CLASS_DEFINE_CHUNK_NAME.Start,
      content: `class ${componentClassName} extends Component {`,
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
      content: '}',
      linkAfter: [
        CLASS_DEFINE_CHUNK_NAME.Start,
        CLASS_DEFINE_CHUNK_NAME.InsPrivateMethod,
        RAX_CHUNK_NAME.ClassRenderEnd,
        RAX_CHUNK_NAME.MethodsEnd,
      ],
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.JSX,
      name: CLASS_DEFINE_CHUNK_NAME.ConstructorStart,
      content: 'constructor(props, context) { super(props); ',
      linkAfter: DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.ConstructorStart],
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.JSX,
      name: CLASS_DEFINE_CHUNK_NAME.ConstructorEnd,
      content: '} /* end of constructor */',
      linkAfter: DEFAULT_LINK_AFTER[CLASS_DEFINE_CHUNK_NAME.ConstructorEnd],
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.JSX,
      name: RAX_CHUNK_NAME.ClassDidMountBegin,
      content: 'componentDidMount() {',
      linkAfter: [
        CLASS_DEFINE_CHUNK_NAME.Start,
        CLASS_DEFINE_CHUNK_NAME.InsVar,
        CLASS_DEFINE_CHUNK_NAME.InsMethod,
        CLASS_DEFINE_CHUNK_NAME.ConstructorEnd,
      ],
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.JSX,
      name: RAX_CHUNK_NAME.ClassDidMountEnd,
      content: '} /* end of componentDidMount */',
      linkAfter: [RAX_CHUNK_NAME.ClassDidMountBegin, RAX_CHUNK_NAME.ClassDidMountContent],
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.JSX,
      name: RAX_CHUNK_NAME.ClassWillUnmountBegin,
      content: 'componentWillUnmount() {',
      linkAfter: [
        CLASS_DEFINE_CHUNK_NAME.Start,
        CLASS_DEFINE_CHUNK_NAME.InsVar,
        CLASS_DEFINE_CHUNK_NAME.InsMethod,
        RAX_CHUNK_NAME.ClassDidMountEnd,
      ],
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.JSX,
      name: RAX_CHUNK_NAME.ClassWillUnmountEnd,
      content: '} /* end of componentWillUnmount */',
      linkAfter: [RAX_CHUNK_NAME.ClassWillUnmountBegin, RAX_CHUNK_NAME.ClassWillUnmountContent],
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.JSX,
      name: RAX_CHUNK_NAME.ClassRenderBegin,
      content: 'render() {',
      linkAfter: [RAX_CHUNK_NAME.ClassDidMountEnd, RAX_CHUNK_NAME.ClassWillUnmountEnd],
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.JSX,
      name: RAX_CHUNK_NAME.ClassRenderEnd,
      content: '} /* end of render */',
      linkAfter: [
        RAX_CHUNK_NAME.ClassRenderBegin,
        RAX_CHUNK_NAME.ClassRenderPre,
        RAX_CHUNK_NAME.ClassRenderJSX,
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
