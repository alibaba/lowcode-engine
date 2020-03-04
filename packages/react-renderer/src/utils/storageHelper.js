import localforage from 'localforage';
import Debug from 'debug';
import { serialize } from './index';

const debug = Debug('utils:storageHelper');
export default class StorageHelper {
  constructor(name) {
    this.store = localforage.createInstance(name);
  }

  getItem(key) {
    if (!this.store) {
      throw new Error('store instance not exist');
    }
    return this.store.getItem(key);
  }

  setItem(key, value) {
    if (!this.store) {
      throw new Error('store instance not exist');
    }
    return this.store.setItem(key, value);
  }

  removeItem(key) {
    if (!this.store) {
      throw new Error('store instance not exist');
    }
    return this.store.removeItem(key);
  }

  clear() {
    if (!this.store) {
      throw new Error('store instance not exist');
    }
    return this.store.clear();
  }

  addHistory(key, code, limit = 10) {
    return new Promise((resolve, reject) => {
      key = '__luna_history_' + key;
      this.store
        .getItem(key)
        .then(res => {
          let codeStr = serialize(code, {
            unsafe: true
          });
          if (res && res[0] && res[0].code) {
            if (codeStr === res[0].code) return;
          }
          res = res || [];
          let newId = 1;
          if (res && res[0] && res[0].id) {
            newId = res[0].id + 1;
          }
          res.unshift({
            id: newId,
            time: +new Date(),
            code: codeStr
          });
          this.store
            .setItem(key, res.slice(0, limit))
            .then(res => {
              resolve(res);
            })
            .catch(reject);
        })
        .catch(reject);
    });
  }

  getHistory(key) {
    key = '__luna_history_' + key;
    return this.store.getItem(key);
  }

  clearHistory(key) {
    key = '__luna_history_' + key;
    this.store.removeItem(key);
  }
}
