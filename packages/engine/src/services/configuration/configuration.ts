import { get as lodashGet, isPlainObject, cloneDeep } from 'lodash-es';
import { type PlainObject } from '@alilc/lowcode-shared';
import { invariant } from '@alilc/lowcode-shared';

export class Configuration<Config extends PlainObject, K extends keyof Config = keyof Config> {
  private config: Config;

  private setterValidator: ((key: K, value: Config[K]) => boolean | string) | undefined;

  private waits = new Map<
    K,
    {
      once?: boolean;
      resolve: (data: any) => void;
    }[]
  >();

  constructor(config: Config, setterValidator?: (key: K, value: Config[K]) => boolean | string) {
    invariant(config, 'config must exist', 'Configuration');

    this.config = cloneDeep(config);

    if (setterValidator) {
      invariant(
        typeof setterValidator === 'function',
        'setterValidator must be a function',
        'Configuration',
      );
      this.setterValidator = setterValidator;
    }
  }

  /**
   * 判断指定 key 是否有值
   * @param key
   */
  has(key: K): boolean {
    return this.config[key] !== undefined;
  }
  /**
   * 获取指定 key 的值
   * @param key
   * @param defaultValue
   */
  get<T = any>(key: K, defaultValue?: T): T | undefined {
    return lodashGet(this.config, key, defaultValue);
  }
  /**
   * 设置指定 key 的值
   * @param key
   * @param value
   */
  set(key: K, value: any) {
    if (this.setterValidator) {
      const valid = this.setterValidator(key, value);

      invariant(
        valid === false || typeof valid === 'string',
        `failed to config ${key.toString()}, only predefined options can be set under strict mode, predefined options: ${valid ? valid : ''}`,
        'Configuration',
      );
    }

    this.config[key] = value;
    this.notifyGot(key);
  }
  /**
   * 批量设值，set 的对象版本
   * @param config
   */
  setConfig(config: Partial<Config>) {
    if (isPlainObject(config)) {
      Object.keys(config).forEach((key) => {
        this.set(key as K, config[key]);
      });
    }
  }
  /**
   * 获取指定 key 的值，若此时还未赋值，则等待，若已有值，则直接返回值
   *  注：此函数返回 Promise 实例，只会执行（fullfill）一次
   * @param key
   * @returns
   */
  onceGot(key: K) {
    const val = this.get(key);
    if (val !== undefined) {
      return Promise.resolve(val);
    }
    return new Promise((resolve) => {
      this.setWait(key, resolve, true);
    });
  }
  /**
   * 获取指定 key 的值，函数回调模式，若多次被赋值，回调会被多次调用
   * @param key
   * @param fn
   * @returns
   */
  onGot(key: K, fn: (data: Config[K]) => void): () => void {
    const val = this.config[key];
    if (val !== undefined) {
      fn(val);
    }
    this.setWait(key, fn);
    return () => {
      this.delWait(key, fn);
    };
  }

  private notifyGot(key: K): void {
    let waits = this.waits.get(key);
    if (!waits) {
      return;
    }
    waits = waits.slice().reverse();
    let i = waits.length;
    while (i--) {
      waits[i].resolve(this.get(key));
      if (waits[i].once) {
        waits.splice(i, 1);
      }
    }
    if (waits.length > 0) {
      this.waits.set(key, waits);
    } else {
      this.waits.delete(key);
    }
  }

  private setWait(key: K, resolve: (data: any) => void, once?: boolean) {
    const waits = this.waits.get(key);
    if (waits) {
      waits.push({ resolve, once });
    } else {
      this.waits.set(key, [{ resolve, once }]);
    }
  }

  private delWait(key: K, fn: any) {
    const waits = this.waits.get(key);
    if (!waits) {
      return;
    }
    let i = waits.length;
    while (i--) {
      if (waits[i].resolve === fn) {
        waits.splice(i, 1);
      }
    }
    if (waits.length < 1) {
      this.waits.delete(key);
    }
  }
}
