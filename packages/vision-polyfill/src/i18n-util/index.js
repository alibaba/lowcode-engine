import { EventEmitter } from 'events';

import { editorCabin } from '@ali/lowcode-engine';

const { obx } = editorCabin;

let keybase = Date.now();
function keygen(maps) {
  let key;
  do {
    key = `i18n-${(keybase).toString(36)}`;
    keybase += 1;
  } while (key in maps);
  return key;
}

class DocItem {
  constructor(parent, doc, unInitial) {
    this.parent = parent;
    const { use, ...strings } = doc;
    this.doc = obx.val({
      type: 'i18n',
      ...strings,
    });
    this.emitter = new EventEmitter();
    this.inited = unInitial !== true;
  }

  getKey() {
    return this.doc.key;
  }

  getDoc(lang) {
    if (lang) {
      return this.doc[lang];
    }
    return this.doc;
  }

  setDoc(doc, lang, initial) {
    if (lang) {
      this.doc[lang] = doc;
    } else {
      const { use, strings } = doc || {};
      Object.assign(this.doc, strings);
    }
    this.emitter.emit('change', this.doc);

    if (initial) {
      this.inited = true;
    } else if (this.inited) {
      this.parent._saveChange(this.doc.key, this.doc);
    }
  }

  remove() {
    if (!this.inited) return Promise.reject('not initialized');

    const { key, ...doc } = this.doc; // eslint-disable-line
    this.emitter.emit('change', doc);
    return this.parent.remove(this.getKey());
  }

  onChange(func) {
    this.emitter.on('change', func);
    return () => {
      this.emitter.removeListener('change', func);
    };
  }
}

class I18nUtil {
  constructor() {
    this.emitter = new EventEmitter();
    // original data source from remote
    this.i18nData = {};
    // current i18n records on the left pane
    this.items = [];
    this.maps = {};
    // full list of i18n records for synchronized call
    this.fullList = [];
    this.fullMap = {};

    this.config = {};
    this.ready = false;
    this.isInited = false;
  }

  _prepareItems(items, isFull = false, isSilent = false) {
    this[isFull ? 'fullList' : 'items'] = items.map((dict) => {
      let item = this[isFull ? 'fullMap' : 'maps'][dict.key];
      if (item) {
        item.setDoc(dict, null, true);
      } else {
        item = new DocItem(this, dict);
        this[isFull ? 'fullMap' : 'maps'][dict.key] = item;
      }
      return item;
    });

    if (this.ready && !isSilent) {
      this.emitter.emit('rowschange');
      this.emitter.emit('change');
    } else {
      this.ready = true;
      this.emitter.emit('ready');
    }
  }

  _load(configs = {}, silent) {
    if (!this.config.loader) {
      console.error(new Error('Please load loader while init I18nUtil.'));
      return Promise.reject();
    }

    return this.config.loader(configs).then((data) => {
      if (configs.i18nKey) {
        return Promise.resolve(data.i18nText);
      }
      this._prepareItems(data.data, configs.isFull, silent);
      // set pagination data to i18nData
      this.i18nData = data;
      if (!silent) {
        this.emitter.emit('rowschange');
        this.emitter.emit('change');
      }
      return Promise.resolve(this.items.map(i => i.getDoc()));
    });
  }

  _saveToItems(key, dict) {
    let item = null;
    item = this.items.find(doc => doc.getKey() === key);
    if (!item) {
      item = this.fullList.find(doc => doc.getKey() === key);
    }

    if (item) {
      item.setDoc(dict);
    } else {
      item = new DocItem(this, {
        key,
        ...dict,
      });
      this.items.unshift(item);
      this.fullList.unshift(item);
      this.maps[key] = item;
      this.fullMap[key] = item;
      this._saveChange(key, dict, true);
    }
  }

  _saveChange(key, dict, rowschange) {
    if (rowschange) {
      this.emitter.emit('rowschange');
    }
    this.emitter.emit('change');
    if (dict === null) {
      delete this.maps[key];
      delete this.fullMap[key];
    }
    return this._save(key, dict);
  }

  _save(key, dict) {
    const saver = dict === null ? this.config.remover : this.config.saver;
    if (!saver) return Promise.reject('Saver function is not set');
    return saver(key, dict);
  }

  init(config) {
    if (this.isInited) return;
    this.config = config || {};
    if (this.config.items) {
      // inject to current page
      this._prepareItems(this.config.items);
    }
    if (!this.config.disableInstantLoad) {
      this._load({ isFull: !this.config.disableFullLoad });
    }
    this.isInited = true;
  }

  isInitialized() {
    return this.isInited;
  }

  isReady() {
    return this.ready;
  }

  // add events updater when i18n record change
  // we should notify engine's view to change
  attach(prop, value, updator) {
    const isI18nValue = value && value.type === 'i18n' && value.key;
    const key = isI18nValue ? value.key : null;
    if (prop.i18nLink) {
      if (isI18nValue && (key === prop.i18nLink.key)) {
        return prop.i18nLink;
      }
      prop.i18nLink.detach();
    }

    if (isI18nValue) {
      return {
        key,
        detach: this.getItem(key, value).onChange(updator),
      };
    }

    return null;
  }

  /**
   * 搜索 i18n 词条
   *
   * @param {any} keyword 搜索关键字
   * @param {boolean} [silent=false] 是否刷新左侧的 i18n 数据
   * @returns
   *
   * @memberof I18nUtil
   */
  search(keyword, silent = false) {
    return this._load({ keyword }, silent);
  }

  load(configs = {}) {
    return this._load(configs);
  }

  get(key, lang) {
    const item = this.getItem(key);
    if (item) {
      return item.getDoc(lang);
    }
    return null;
  }

  getFromRemote(key) {
    return this._load({ i18nKey: key });
  }

  getItem(key, forceData) {
    if (forceData && !this.maps[key] && !this.fullList[key]) {
      const item = new DocItem(this, {
        key,
        ...forceData,
      }, true);
      this.maps[key] = item;
      this.fullMap[key] = item;
      this.fullList.push(item);
      this.items.push(item);
    }
    return this.maps[key] || this.fullMap[key];
  }

  getItems() {
    return this.items;
  }

  update(key, doc, lang) {
    let dict = this.get(key) || {};
    if (!lang) {
      dict = doc;
    } else {
      dict[lang] = doc;
    }
    this._saveToItems(key, dict);
  }

  create(doc, lang) {
    const dict = lang ? { [lang]: doc } : doc;
    const key = keygen(this.fullMap);
    this._saveToItems(key, dict);
    return key;
  }

  remove(key) {
    const index = this.items.findIndex(item => item.getKey() === key);
    const indexG = this.fullList.findIndex(item => item.getKey() === key);
    if (index > -1) {
      this.items.splice(index, 1);
    }
    if (indexG > -1) {
      this.fullList.splice(index, 1);
    }
    return this._saveChange(key, null, true);
  }

  onReady(func) {
    this.emitter.on('ready', func);
    return () => {
      this.emitter.removeListener('ready', func);
    };
  }

  onRowsChange(func) {
    this.emitter.on('rowschange', func);
    return () => {
      this.emitter.removeListener('rowschange', func);
    };
  }

  onChange(func) {
    this.emitter.on('change', func);
    return () => {
      this.emitter.removeListener('change', func);
    };
  }
}

export default new I18nUtil();
