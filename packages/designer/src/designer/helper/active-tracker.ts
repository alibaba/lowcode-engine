import { EventEmitter } from 'events';
import { LocationDetail } from './location';
import Node, { isNode } from '../document/node/node';

interface ActiveTarget {
  node: Node;
  detail?: LocationDetail;
}

export default class ActiveTracker {
  private emitter = new EventEmitter();

  track(target: ActiveTarget | Node) {
    this.emitter.emit('change', isNode(target) ? { node: target } : target);
  }

  onChange(fn: (target: ActiveTarget) => void): () => void {
    this.emitter.addListener('change', fn);
    return () => {
      this.emitter.removeListener('change', fn);
    };
  }
}
