import * as Node from './node';

export interface EventConfig {
  [Node.Prop.InnerChange]: (options: Node.Prop.ChangeOptions) => any;
  [Node.Rerender]: (options: Node.RerenderOptions) => void;
  [eventName: string]: any;
}

export * as Node from './node';
