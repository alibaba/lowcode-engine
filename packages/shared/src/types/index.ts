import * as Spec from './specs';

export { Spec };

export * from './material';

export type VoidFunction = (...args: any[]) => void;

export type AnyFunction = (...args: any[]) => any;

export type PlainObject = Record<string, any>;
