import { getProxiedValue } from './proxy';

export function is(a: any, b: any) {
  return getProxiedValue(a) === getProxiedValue(b);
}
