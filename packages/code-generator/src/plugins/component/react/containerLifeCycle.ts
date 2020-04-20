import { REACT_CHUNK_NAME } from './const';

import {
  getFuncExprBody,
  transformFuncExpr2MethodMember,
} from '../../utils/jsExpression';

import {
  BuilderComponentPlugin,
  BuilderComponentPluginFactory,
  ChunkType,
  CodeGeneratorError,
  FileType,
  ICodeChunk,
  ICodeStruct,
  IContainerInfo,
  IJSExpression,
} from '../../../types';

const pluginFactory: BuilderComponentPluginFactory<unknown> = () => {
  const plugin: BuilderComponentPlugin = async (pre: ICodeStruct) => {
    const next: ICodeStruct = {
      ...pre,
    };

    const ir = next.ir as IContainerInfo;

    if (ir.lifeCycles) {
      const lifeCycles = ir.lifeCycles;
      const chunks = Object.keys(lifeCycles).map<ICodeChunk>(lifeCycleName => {
        if (lifeCycleName === 'constructor') {
          return {
            type: ChunkType.STRING,
            fileType: FileType.JSX,
            name: REACT_CHUNK_NAME.ClassConstructorContent,
            content: getFuncExprBody(
              (lifeCycles[lifeCycleName] as IJSExpression).value,
            ),
            linkAfter: [REACT_CHUNK_NAME.ClassConstructorStart],
          };
        }
        if (lifeCycleName === 'render') {
          return {
            type: ChunkType.STRING,
            fileType: FileType.JSX,
            name: REACT_CHUNK_NAME.ClassRenderPre,
            content: getFuncExprBody(
              (lifeCycles[lifeCycleName] as IJSExpression).value,
            ),
            linkAfter: [REACT_CHUNK_NAME.ClassRenderStart],
          };
        }
        if (
          lifeCycleName === 'componentDidMount' ||
          lifeCycleName === 'componentDidUpdate' ||
          lifeCycleName === 'componentWillUnmount' ||
          lifeCycleName === 'componentDidCatch'
        ) {
          return {
            type: ChunkType.STRING,
            fileType: FileType.JSX,
            name: REACT_CHUNK_NAME.ClassLifeCycle,
            content: transformFuncExpr2MethodMember(
              lifeCycleName,
              (lifeCycles[lifeCycleName] as IJSExpression).value,
            ),
            linkAfter: [
              REACT_CHUNK_NAME.ClassStart,
              REACT_CHUNK_NAME.ClassConstructorEnd,
            ],
          };
        }

        throw new CodeGeneratorError('Unknown life cycle method name');
      });

      next.chunks.push.apply(next.chunks, chunks);
    }

    return next;
  };
  return plugin;
};

export default pluginFactory;
