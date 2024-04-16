import store from 'store';
import { createLogger } from '@alilc/lowcode-utils';

const logger = createLogger({ level: 'warn', bizName: 'Preference' });
const STORAGE_KEY_PREFIX = 'ale';

/**
 * used to store user preferences, such as pinned status of a pannel.
 * save to local storage.
 */
export default class Preference {
  private getStorageKey(key: string, module?: string): string {
    const moduleKey = module || '__inner__';
    return `${STORAGE_KEY_PREFIX}_${moduleKey}.${key}`;
  }

  /**
   * set value from local storage by module and key
   */
  set(key: string, value: any, module?: string): void {
    if (!key || typeof key !== 'string' || key.length === 0) {
      logger.error('Invalid key when setting preference', key);
      return;
    }
    const storageKey = this.getStorageKey(key, module);
    logger.debug('storageKey:', storageKey, 'set with value:', value);
    store.set(storageKey, value);
  }

  /**
   * get value from local storage by module and key
   */
  get(key: string, module: string): any {
    if (!key || typeof key !== 'string' || key.length === 0) {
      logger.error('Invalid key when getting from preference', key);
      return;
    }
    const storageKey = this.getStorageKey(key, module);
    const result = store.get(storageKey);
    logger.debug('storageKey:', storageKey, 'get with result:', result);
    return result;
  }

  /**
   * check if local storage contain certain key
   *
   * @param {string} key
   * @param {string} module
   */
  contains(key: string, module: string): boolean {
    if (!key || typeof key !== 'string' || key.length === 0) {
      logger.error('Invalid key when getting from preference', key);
      return false;
    }
    const storageKey = this.getStorageKey(key, module);
    const result = store.get(storageKey);

    return !(result === undefined || result === null);
  }
}
