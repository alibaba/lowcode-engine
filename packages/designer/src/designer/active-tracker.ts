import { INode } from '../document/node/node';
import { obx, IEventBus, createModuleEventBus } from '@alilc/lowcode-editor-core';
import {
  IPublicTypeActiveTarget,
  IPublicModelActiveTracker,
} from '@alilc/lowcode-types';
import { isNode } from '@alilc/lowcode-utils';

export interface IActiveTracker extends Omit< IPublicModelActiveTracker, 'track' | 'onChange' > {
  _target: ActiveTarget | INode;

  track(originalTarget: ActiveTarget | INode): void;

  onChange(fn: (target: ActiveTarget) => void): () => void;
}

export interface ActiveTarget extends Omit< IPublicTypeActiveTarget, 'node' > {
  node: INode;
}

export class ActiveTracker implements IActiveTracker {
  @obx.ref private _target?: ActiveTarget | INode;

  private emitter: IEventBus = createModuleEventBus('ActiveTracker');

  track(originalTarget: ActiveTarget | INode) {
    let target = originalTarget;
    if (isNode(originalTarget)) {
      target = { node: originalTarget as INode };
    }
    this._target = target;
    this.emitter.emit('change', target);
  }

  get currentNode() {
    return (this._target as ActiveTarget)?.node;
  }

  get detail() {
    return (this._target as ActiveTarget)?.detail;
  }

  /**
   * @deprecated
   */
  /* istanbul ignore next */
  get intance() {
    return this.instance;
  }

  get instance() {
    return (this._target as ActiveTarget)?.instance;
  }

  onChange(fn: (target: ActiveTarget) => void): () => void {
    this.emitter.addListener('change', fn);
    return () => {
      this.emitter.removeListener('change', fn);
    };
  }
}
