import store from 'store';
import { getLogger } from './logger';

const logger = getLogger({ level: 'log', bizName: 'Preference' });
const STORAGE_KEY_PREFIX = 'ale';

/**
 * used to store user preferences, such as pinned status of a pannel.
 * save to local storage.
 *
 * @class PreferenceStore
 */
export default class Preference {
  getStorageKey(key: string, module?: string): string {
    const moduleKey = module || '__inner__';
    return `${STORAGE_KEY_PREFIX}_${moduleKey}.${key}`;
  }

  set(key: string, value: any, module?: string) {
    if (!key || typeof key !== 'string' || key.length === 0) {
      logger.error('Invalid key when setting preference', key);
      return;
    }
    const storageKey = this.getStorageKey(key, module);
    logger.log('storageKey:', storageKey, 'set with value:', value);
    store.set(storageKey, value);
  }

  get(key: string, module: string): any {
    if (!key || typeof key !== 'string' || key.length === 0) {
      logger.error('Invalid key when getting from preference', key);
      return;
    }
    const storageKey = this.getStorageKey(key, module);
    const result = store.get(storageKey);
    logger.log('storageKey:', storageKey, 'get with result:', result);
    return result;
  }
  /**
   * check if local storage contain certain key
   *
   * @param {string} key
   * @param {string} module
   * @returns {boolean}
   * @memberof Preference
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