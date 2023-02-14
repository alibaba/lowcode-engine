import type { IPublicTypeContainerSchema } from '@alilc/lowcode-types';

export interface ICompAnalyzeResult {
  isUsingRef: boolean;
}

export type TComponentAnalyzer = (container: IPublicTypeContainerSchema) => ICompAnalyzeResult;
