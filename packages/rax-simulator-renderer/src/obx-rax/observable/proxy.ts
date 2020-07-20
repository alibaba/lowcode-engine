import { addHiddenFinalProp } from '../utils';

export const SYMBOL_PROXY = Symbol.for('proxy');
export const SYMBOL_RAW = Symbol.for('raw');
export interface Proxied<T> {
  [SYMBOL_PROXY]: T;
}

export function isProxied<T>(target: T): target is T & Proxied<T> {
  return SYMBOL_PROXY in target;
}

export function getProxy<T>(target: T & Proxied<T>) {
  return target[SYMBOL_PROXY];
}

export function setProxy(target: object, proxy: object) {
  addHiddenFinalProp(target, SYMBOL_PROXY, proxy);
}

export function getProxiedValue(target: any) {
  return (target && getProxy(target)) || target;
}

export function getRawValue(target: any) {
  return (target && target[SYMBOL_RAW]) || target;
}

export const supportProxy = 'Proxy' in global;

export function createProxy<T extends object>(target: T, taps: ProxyHandler<T>) {
  if (isProxied(target)) {
    return getProxy(target);
  }

  const proxy = new Proxy(target, taps);
  setProxy(target, proxy);

  return proxy;
}
