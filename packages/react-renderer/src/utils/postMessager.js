import EventEmitter from 'events';
import Debug from 'debug';
const debug = Debug('utils:postMessager');
EventEmitter.defaultMaxListeners = 100;

export class InnerMessager extends EventEmitter {
  constructor() {
    super();
    this.handleReceive = this.handleReceive.bind(this);
    window.addEventListener('message', this.handleReceive, false);
  }

  sendMsg(type, data, targetOrigin = '*') {
    window.parent &&
      window.parent.postMessage(
        {
          type,
          data
        },
        targetOrigin
      );
  }

  handleReceive(e) {
    if (!e.data || !e.data.type) return;
    this.emit(e.data.type, e.data.data);
  }

  destroy() {
    window.removeEventListener('message', this.handleReceive);
  }
}

export class OuterMessager extends EventEmitter {
  constructor(innerWindow) {
    super();
    this.innerWindow = innerWindow;
    this.handleReceive = this.handleReceive.bind(this);
    window.addEventListener('message', this.handleReceive, false);
  }
  sendMsg(type, data, targetOrigin = '*') {
    this.innerWindow &&
      this.innerWindow.postMessage(
        {
          type,
          data
        },
        targetOrigin
      );
  }

  handleReceive(e) {
    if (!e.data || !e.data.type) return;
    this.emit(e.data.type, e.data.data);
  }
  destroy() {
    window.removeEventListener('message', this.handleReceive);
  }
}
