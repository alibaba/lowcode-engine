import type { ContainerSchema } from '@ali/lowcode-types';

export interface ICompAnalyzeResult {
  isUsingRef: boolean;
}

export type TComponentAnalyzer = (container: ContainerSchema) => ICompAnalyzeResult;
