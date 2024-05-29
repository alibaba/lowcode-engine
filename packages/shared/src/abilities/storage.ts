import { invariant } from '../utils';
import { PlainObject } from '../types';

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
export class KeyValueStore<O = PlainObject, K extends keyof O = keyof O> {
  private setterValidation: ((key: K, value: O[K]) => boolean | string) | undefined;

  private waits = new Map<
    K,
    {
      once?: boolean;
      resolve: (data: any) => void;
    }[]
  >();

  constructor(
    private readonly store: IStore<O, K> = new Map(),
    options?: {
      setterValidation?: (key: K, value: O[K]) => boolean | string;
    },
  ) {
    if (options?.setterValidation) {
      this.setterValidation = options.setterValidation;
    }
  }

  get(key: K, defaultValue: O[K]): O[K];
  get(key: K, defaultValue?: O[K] | undefined): O[K] | undefined;
  get(key: K, defaultValue?: O[K]): O[K] | undefined {
    const value = this.store.get(key, defaultValue);
    return value;
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
    this.dispatchValue(key);
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

  /**
   * 获取指定 key 的值，若此时还未赋值，则等待，若已有值，则直接返回值
   *  注：此函数返回 Promise 实例，只会执行（fullfill）一次
   * @param key
   * @returns
   */
  waitForValue(key: K) {
    const val = this.get(key);
    if (val !== undefined) {
      return Promise.resolve(val);
    }
    return new Promise((resolve) => {
      this.addWaiter(key, resolve, true);
    });
  }

  /**
   * 获取指定 key 的值，函数回调模式，若多次被赋值，回调会被多次调用
   * @param key
   * @param fn
   * @returns
   */
  onValueChange<T extends K>(key: T, fn: (value: O[T]) => void): () => void {
    const val = this.get(key);
    if (val !== undefined) {
      // @ts-expect-error: val is not undefined
      fn(val);
    }
    this.addWaiter(key, fn as any);
    return () => {
      this.removeWaiter(key, fn as any);
    };
  }

  private dispatchValue(key: K): void {
    const waits = this.waits.get(key);
    if (!waits) return;

    for (let i = waits.length - 1; i >= 0; i--) {
      const waiter = waits[i];
      waiter.resolve(this.get(key)!);
      if (waiter.once) {
        waits.splice(i, 1); // Remove the waiter if it only waits once
      }
    }

    if (waits.length === 0) {
      this.waits.delete(key); // No more waiters for the key
    }
  }

  private addWaiter(key: K, resolve: (value: O[K]) => void, once?: boolean) {
    if (this.waits.has(key)) {
      this.waits.get(key)!.push({ resolve, once });
    } else {
      this.waits.set(key, [{ resolve, once }]);
    }
  }

  private removeWaiter(key: K, resolve: (value: O[K]) => void) {
    const waits = this.waits.get(key);
    if (!waits) return;

    this.waits.set(
      key,
      waits.filter((waiter) => waiter.resolve !== resolve),
    );

    if (this.waits.get(key)!.length === 0) {
      this.waits.delete(key);
    }
  }
}
