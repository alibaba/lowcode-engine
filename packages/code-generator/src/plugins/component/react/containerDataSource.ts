import { REACT_CHUNK_NAME } from './const';

import { generateCompositeType } from '../../utils/compositeType';

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

  if (ir.state) {
    const state = ir.state;
    const fields = Object.keys(state).map<string>(stateName => {
      const [isString, value] = generateCompositeType(state[stateName]);
      return `${stateName}: ${isString ? `'${value}'` : value},`;
    });

    next.chunks.push({
      type: ChunkType.STRING,
      fileType: FileType.JSX,
      name: REACT_CHUNK_NAME.ClassConstructorContent,
      content: `this.state = { ${fields.join('')} };`,
      linkAfter: [REACT_CHUNK_NAME.ClassConstructorStart],
    });
  }

  return next;
};

export default plugin;
