import { NodeChildren } from '../document/node/node-children';

export function foreachReverse(arr: NodeChildren, fn: Function, context: any = {}) {
  for (let i = arr.length - 1; i >= 0; i--) {
    fn.call(context, arr.get(i));
  }
}