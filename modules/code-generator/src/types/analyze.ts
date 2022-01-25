import type { ContainerSchema } from '@alilc/lowcode-types';

export interface ICompAnalyzeResult {
  isUsingRef: boolean;
}

export type TComponentAnalyzer = (container: ContainerSchema) => ICompAnalyzeResult;
