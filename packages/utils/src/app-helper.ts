import EventEmitter from 'events';

let instance: AppHelper | null = null;

EventEmitter.defaultMaxListeners = 100;

export class AppHelper extends EventEmitter {
  static getInstance = () => {
    if (!instance) {
      instance = new AppHelper();
    }
    return instance;
  };

  [key: string]: any;

  constructor(config?: Record<string, any>) {
    super();
    instance = this;
    Object.assign(this, config);
  }

  get(key: string) {
    return this[key];
  }

  set(key: any, val: any) {
    if (typeof key === 'string') {
      this[key] = val;
    } else if (typeof key === 'object') {
      Object.keys(key).forEach((item) => {
        this[item] = key[item];
      });
    }
  }

  batchOn(events: Array<string | symbol>, listener: (...args: any[]) => void) {
    if (!Array.isArray(events)) return;
    events.forEach((event) => this.on(event, listener));
  }

  batchOnce(events: Array<string | symbol>, listener: (...args: any[]) => void) {
    if (!Array.isArray(events)) return;
    events.forEach((event) => this.once(event, listener));
  }

  batchOff(events: Array<string | symbol>, listener: (...args: any[]) => void) {
    if (!Array.isArray(events)) return;
    events.forEach((event) => this.off(event, listener));
  }
}
