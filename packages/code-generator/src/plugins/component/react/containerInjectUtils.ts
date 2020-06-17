import { REACT_CHUNK_NAME } from './const';

import {
  BuilderComponentPlugin,
  ChunkType,
  FileType,
  ICodeStruct,
} from '../../../types';

const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
  const next: ICodeStruct = {
    ...pre,
  };

  next.chunks.push({
    type: ChunkType.STRING,
    fileType: FileType.JSX,
    name: REACT_CHUNK_NAME.ClassConstructorContent,
    content: `this.utils = utils;`,
    linkAfter: [REACT_CHUNK_NAME.ClassConstructorStart],
  });

  return next;
};

export default plugin;
