import {
  ActiveTracker as InnerActiveTracker,
  ActiveTarget,
} from '@alilc/lowcode-designer';
import { activeTrackerSymbol } from './symbols';
import Node from './node';

export default class ActiveTracker {
  private readonly [activeTrackerSymbol]: InnerActiveTracker;

  constructor(activeTracker: InnerActiveTracker) {
    this[activeTrackerSymbol] = activeTracker;
  }

  static create(activeTracker: any) {
    if (!activeTracker) return activeTracker;
    return new ActiveTracker(activeTracker);
  }

  get currentNode() {
    return Node.create(this[activeTrackerSymbol].currentNode);
  }

  get detail() {
    return this[activeTrackerSymbol].detail;
  }

  get instance() {
    return this[activeTrackerSymbol].instance;
  }

  track(target: ActiveTarget | Node) {
    this[activeTrackerSymbol].track(target as any);
  }

  onChange(fn: (target: any) => void): () => void {
    return this[activeTrackerSymbol].onChange(fn);
  }
}
