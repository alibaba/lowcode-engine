import { IPublicModelActiveTracker, IPublicModelNode, IPublicTypeActiveTarget } from '@alilc/lowcode-types';
import { IActiveTracker as InnerActiveTracker, INode as InnerNode } from '@alilc/lowcode-designer';
import { Node as ShellNode } from './node';
import { nodeSymbol } from '../symbols';

const activeTrackerSymbol = Symbol('activeTracker');

export class ActiveTracker implements IPublicModelActiveTracker {
  private readonly [activeTrackerSymbol]: InnerActiveTracker;

  constructor(innerTracker: InnerActiveTracker) {
    this[activeTrackerSymbol] = innerTracker;
  }

  onChange(fn: (target: IPublicTypeActiveTarget) => void): () => void {
    if (!fn) {
      return () => {};
    }
    return this[activeTrackerSymbol].onChange((t: IPublicTypeActiveTarget) => {
      const { node: innerNode, detail, instance } = t;
      const publicNode = ShellNode.create(innerNode as InnerNode);
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