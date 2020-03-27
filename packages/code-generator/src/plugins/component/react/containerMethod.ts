import { REACT_CHUNK_NAME } from './const';

import { transformFuncExpr2MethodMember } from '../../utils/jsExpression';

import {
  BuilderComponentPlugin,
  ChunkType,
  FileType,
  ICodeChunk,
  ICodeStruct,
  IContainerInfo,
  IJSExpression,
} from '../../../types';

const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
  const next: ICodeStruct = {
    ...pre,
  };

  const ir = next.ir as IContainerInfo;

  if (ir.methods) {
    const methods = ir.methods;
    const chunks = Object.keys(methods).map<ICodeChunk>(methodName => ({
      type: ChunkType.STRING,
      fileType: FileType.JSX,
      name: REACT_CHUNK_NAME.ClassMethod,
      content: transformFuncExpr2MethodMember(
        methodName,
        (methods[methodName] as IJSExpression).value,
      ),
      linkAfter: [
        REACT_CHUNK_NAME.ClassStart,
        REACT_CHUNK_NAME.ClassConstructorEnd,
        REACT_CHUNK_NAME.ClassLifeCycle,
      ],
    }));

    next.chunks.push.apply(next.chunks, chunks);
  }

  return next;
};

export default plugin;
