import { IPublicModelActiveTracker, IPublicModelNode, IPublicTypeActiveTarget } from '@alilc/lowcode-types';
import { IActiveTracker as InnerActiveTracker, ActiveTarget } from '@alilc/lowcode-designer';
import { Node as ShellNode } from './node';
import { nodeSymbol } from '../symbols';

const activeTrackerSymbol = Symbol('activeTracker');

export class ActiveTracker implements IPublicModelActiveTracker {
  private readonly [activeTrackerSymbol]: InnerActiveTracker;

  constructor(innerTracker: InnerActiveTracker) {
    this[activeTrackerSymbol] = innerTracker;
  }

  get target() {
    const { node: innerNode, detail, instance } = this[activeTrackerSymbol]._target;
    const publicNode = ShellNode.create(innerNode);
    return {
      node: publicNode!,
      detail,
      instance,
    };
  }

  onChange(fn: (target: IPublicTypeActiveTarget) => void): () => void {
    if (!fn) {
      return () => {};
    }
    return this[activeTrackerSymbol].onChange((t: ActiveTarget) => {
      const { node: innerNode, detail, instance } = t;
      const publicNode = ShellNode.create(innerNode);
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