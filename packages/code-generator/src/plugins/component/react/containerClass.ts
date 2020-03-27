import { COMMON_CHUNK_NAME } from '../../../const/generator';
import { REACT_CHUNK_NAME } from './const';

import {
  BuilderComponentPlugin,
  ChunkType,
  FileType,
  ICodeStruct,
  IContainerInfo,
} from '../../../types';

const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
  const next: ICodeStruct = {
    ...pre,
  };

  const ir = next.ir as IContainerInfo;

  next.chunks.push({
    type: ChunkType.STRING,
    fileType: FileType.JSX,
    name: REACT_CHUNK_NAME.ClassStart,
    content: `class ${ir.componentName} extends React.Component {`,
    linkAfter: [
      COMMON_CHUNK_NAME.ExternalDepsImport,
      COMMON_CHUNK_NAME.InternalDepsImport,
      COMMON_CHUNK_NAME.FileVarDefine,
      COMMON_CHUNK_NAME.FileUtilDefine,
    ],
  });

  next.chunks.push({
    type: ChunkType.STRING,
    fileType: FileType.JSX,
    name: REACT_CHUNK_NAME.ClassEnd,
    content: `}`,
    linkAfter: [REACT_CHUNK_NAME.ClassStart, REACT_CHUNK_NAME.ClassRenderEnd],
  });

  next.chunks.push({
    type: ChunkType.STRING,
    fileType: FileType.JSX,
    name: REACT_CHUNK_NAME.ClassConstructorStart,
    content: 'constructor(props, context) { super(props); ',
    linkAfter: [REACT_CHUNK_NAME.ClassStart],
  });

  next.chunks.push({
    type: ChunkType.STRING,
    fileType: FileType.JSX,
    name: REACT_CHUNK_NAME.ClassConstructorEnd,
    content: '}',
    linkAfter: [
      REACT_CHUNK_NAME.ClassConstructorStart,
      REACT_CHUNK_NAME.ClassConstructorContent,
    ],
  });

  next.chunks.push({
    type: ChunkType.STRING,
    fileType: FileType.JSX,
    name: REACT_CHUNK_NAME.ClassRenderStart,
    content: 'render() {',
    linkAfter: [
      REACT_CHUNK_NAME.ClassStart,
      REACT_CHUNK_NAME.ClassConstructorEnd,
      REACT_CHUNK_NAME.ClassLifeCycle,
      REACT_CHUNK_NAME.ClassMethod,
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
    content: `export default ${ir.componentName};`,
    linkAfter: [
      COMMON_CHUNK_NAME.ExternalDepsImport,
      COMMON_CHUNK_NAME.InternalDepsImport,
      COMMON_CHUNK_NAME.FileVarDefine,
      COMMON_CHUNK_NAME.FileUtilDefine,
      REACT_CHUNK_NAME.ClassEnd,
    ],
  });

  return next;
};

export default plugin;
