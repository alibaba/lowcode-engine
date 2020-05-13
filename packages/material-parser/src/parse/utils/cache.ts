export interface ICache {
  [name: string]: any;
}

const cache: ICache = {};

export function set(scope: string, name: string, value: any) {
  cache[scope] = cache[scope] || {};
  cache[scope][name] = value;
}

export function get(scope: string, name: string) {
  return (cache[scope] || {})[name];
}

export function has(scope: string, name: string) {
  return cache[scope] && cache[scope].hasOwnProperty(name);
}
