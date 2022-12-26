import { IPublicModelActiveTracker, IPublicModelNode, IPublicTypeActiveTarget } from '@alilc/lowcode-types';
import { IActiveTracker } from '@alilc/lowcode-designer';
import { Node } from './node';
import { nodeSymbol } from '../symbols';

const activeTrackerSymbol = Symbol('activeTracker');


export class ActiveTracker implements IPublicModelActiveTracker {
  private readonly [activeTrackerSymbol]: IActiveTracker;


  constructor(innerTracker: IActiveTracker) {
    this[activeTrackerSymbol] = innerTracker;
  }

  onChange(fn: (target: IPublicTypeActiveTarget) => void): () => void {
    if (!fn) {
      return () => {};
    }
    return this[activeTrackerSymbol].onChange((t: IPublicTypeActiveTarget) => {
      const { node: innerNode, detail, instance } = t;
      const publicNode = Node.create(innerNode);
      const publicActiveTarget = {
        node: publicNode!,
        detail,
        instance,
      };
      fn(publicActiveTarget);
    });
  }

  track(node: IPublicModelNode) {
    this[activeTrackerSymbol].track((node as any)[nodeSymbol]);
  }
}