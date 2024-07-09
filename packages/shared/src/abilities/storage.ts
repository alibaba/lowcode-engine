import { StringDictionary } from '../types';

/**
 * MapLike interface
 */
export interface IStore<O, K extends keyof O> {
  readonly size: number;

  get(key: K, defaultValue: O[K]): O[K];
  get(key: K, defaultValue?: O[K]): O[K] | undefined;

  set(key: K, value: O[K]): void;

  delete(key: K): void;

  clear(): void;
}

/**
 * 统一存储接口
 */
export class KeyValueStore<O = StringDictionary, K extends keyof O = keyof O>
  implements IStore<O, K>
{
  private readonly store = new Map();

  private setterValidation: ((key: K, value: O[K]) => boolean | string) | undefined;

  constructor(options?: { setterValidation?: (key: K, value: O[K]) => boolean | string }) {
    if (options?.setterValidation) {
      this.setterValidation = options.setterValidation;
    }
  }

  get(key: K, defaultValue: O[K]): O[K];
  get(key: K, defaultValue?: O[K] | undefined): O[K] | undefined;
  get(key: K, defaultValue?: O[K]): O[K] | undefined {
    const value = this.store.get(key);
    return value ?? defaultValue;
  }

  set(key: K, value: O[K]): void {
    if (this.setterValidation) {
      const valid = this.setterValidation(key, value);

      if (valid !== true) {
        console.warn(`failed to config ${key.toString()}, validation error: ${valid ? valid : ''}`);
        return;
      }
    }

    this.store.set(key, value);
  }

  delete(key: K): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  get size(): number {
    return this.store.size;
  }
}
