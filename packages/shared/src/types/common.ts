export type VoidFunction = (...args: any[]) => void;

export type AnyFunction = (...args: any[]) => any;

export type PlainObject<T = any> = Record<PropertyKey, T>;

export type StringDictionary<T = any> = Record<string, T>;

export type NumberDictionary<T = any> = Record<number, T>;
