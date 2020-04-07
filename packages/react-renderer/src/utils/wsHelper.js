import Debug from 'debug';
import client from 'socket.io-client';
import { parseUrl } from '@ali/b3-one/lib/url';
const debug = Debug('utils:wsHelper');

export default class WSHelper {
  constructor(appHelper, namespace, options) {
    this.appHelper = appHelper;
    this.ws = null;
    this.init(namespace, options);
  }

  init(namespace = '/', options = {}) {
    if (this.ws) {
      this.close();
    }
    const urlInfo = parseUrl();
    const ws = (this.ws = client(namespace, {
      reconnectionDelay: 3000,
      transports: ['websocket'],
      query: urlInfo.params,
      ...options,
    }));
    const appHelper = this.appHelper;
    debug('ws.init');

    ws.on('connect', (msg) => {
      appHelper.emit('wsHelper.connect.success', msg);
      debug('ws.connect');
    });

    ws.on('error', (msg) => {
      appHelper.emit('wsHelper.connect.error', msg);
      debug('ws.error', msg);
    });

    ws.on('disconnect', (msg) => {
      appHelper.emit('wsHelper.connect.break', msg);
      debug('ws.disconnect', msg);
    });

    ws.on('reconnecting', (msg) => {
      appHelper.emit('wsHelper.connect.retry', msg);
      debug('ws.reconnecting', msg);
    });

    ws.on('ping', (msg) => {
      debug('ws.ping', msg);
    });

    ws.on('pong', (msg) => {
      debug('ws.pong', msg);
    });

    ws.on('data', (msg) => {
      appHelper.emit('wsHelper.data.receive', msg);
      if (msg.eventName) {
        appHelper.emit(`wsHelper.result.${msg.eventName}`, msg);
      }
      debug('ws.data', msg);
    });
  }

  close() {
    if (!this.ws) return;
    this.ws.close();
    this.ws = null;
    this.appHelper.emit('wsHelper.connect.close');
  }

  send(eventName, ...args) {
    return new Promise((resolve, reject) => {
      try {
        this.appHelper.emit('wsHelper.data.request', {
          eventName,
          params: args,
        });
        this.appHelper.once(`wsHelper.result.${eventName}`, resolve);
        this.ws && this.ws.emit(eventName, ...args);
        debug('ws.send', eventName);
      } catch (err) {
        console.error('websocket error:', err);
        reject(err);
      }
    });
  }
}
