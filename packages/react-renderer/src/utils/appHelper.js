import EventEmitter from 'events';
import Debug from 'debug';
let instance = null;
const debug = Debug('utils:appHelper');
EventEmitter.defaultMaxListeners = 100;

export default class AppHelper extends EventEmitter {
  static getInstance = () => {
    if (!instance) {
      instance = new AppHelper();
    }
    return instance;
  };

  constructor(config) {
    super();
    instance = this;
    Object.assign(this, config);
  }

  get(key) {
    return this[key];
  }

  set(key, val) {
    if (typeof key === 'string') {
      this[key] = val;
    } else if (typeof key === 'object') {
      Object.keys(key).forEach((item) => {
        this[item] = key[item];
      });
    }
  }

  batchOn(events, lisenter) {
    if (!Array.isArray(events)) return;
    events.forEach((event) => this.on(event, lisenter));
  }

  batchOnce(events, lisenter) {
    if (!Array.isArray(events)) return;
    events.forEach((event) => this.once(event, lisenter));
  }

  batchOff(events, lisenter) {
    if (!Array.isArray(events)) return;
    events.forEach((event) => this.off(event, lisenter));
  }
}
