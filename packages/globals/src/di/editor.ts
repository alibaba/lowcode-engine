import { EventEmitter } from 'events';
import { RegisterOptions } from 'power-di';

export type KeyType = Function | symbol | string;
export type ClassType = Function | (new (...args: any[]) => any);
export interface GetOptions {
  forceNew?: boolean;
  sourceCls?: ClassType;
}
export type GetReturnType<T, ClsType> = T extends undefined
  ? ClsType extends {
      prototype: infer R;
    }
    ? R
    : any
  : T;

export interface IEditor extends EventEmitter {
  get<T = undefined, KeyOrType = any>(keyOrType: KeyOrType, opt?: GetOptions): GetReturnType<T, KeyOrType> | undefined;

  has(keyOrType: KeyType): boolean;

  set(key: KeyType, data: any): void;

  onceGot<T = undefined, KeyOrType extends KeyType = any>(keyOrType: KeyOrType): Promise<GetReturnType<T, KeyOrType>>;

  onGot<T = undefined, KeyOrType extends KeyType = any>(
    keyOrType: KeyOrType,
    fn: (data: GetReturnType<T, KeyOrType>) => void,
  ): () => void;

  register(data: any, key?: KeyType, options?: RegisterOptions): void;
}
