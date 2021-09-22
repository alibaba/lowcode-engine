export * as Prop from './prop';

export interface RerenderOptions {
  time: number;
  componentName?: string;
  type?: string;
  nodeCount?: number;
}

export const Rerender = 'node.edit.rerender.time';
