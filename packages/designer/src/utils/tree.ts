import { NodeChildren } from '../document/node/node-children';

type IterableArray = NodeChildren | any[];

export function foreachReverse(
  arr: IterableArray,
  action: (item: any) => void,
  getter: (arr: IterableArray, index: number) => any,
  context: any = {},
) {
  for (let i = arr.length - 1; i >= 0; i--) {
    action.call(context, getter(arr, i));
  }
}
