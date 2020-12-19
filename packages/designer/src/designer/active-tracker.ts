import { EventEmitter } from 'events';
import { LocationDetail } from './location';
import { Node, isNode } from '../document/node/node';
import { ComponentInstance } from '../simulator';
import { obx } from '@ali/lowcode-editor-core';

export interface ActiveTarget {
  node: Node;
  detail?: LocationDetail;
  instance?: ComponentInstance;
}

export class ActiveTracker {
  private emitter = new EventEmitter();

  @obx.ref private _target?: ActiveTarget;

  track(target: ActiveTarget | Node) {
    if (isNode(target)) {
      target = { node: target };
    }
    this._target = target;
    this.emitter.emit('change', target);
  }

  get currentNode() {
    return this._target?.node;
  }

  get detail() {
    return this._target?.detail;
  }

  /**
   * @deprecated
   */
  /* istanbul ignore next */
  get intance() {
    return this.instance;
  }

  get instance() {
    return this._target?.instance;
  }

  onChange(fn: (target: ActiveTarget) => void): () => void {
    this.emitter.addListener('change', fn);
    return () => {
      this.emitter.removeListener('change', fn);
    };
  }
}
