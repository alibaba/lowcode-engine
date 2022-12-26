import { INode } from '../document/node/node';
import { obx, IEventBus, createModuleEventBus } from '@alilc/lowcode-editor-core';
import {
  IPublicTypeActiveTarget,
  IPublicModelActiveTracker,
} from '@alilc/lowcode-types';
import { isNode } from '@alilc/lowcode-utils';

export interface IActiveTracker extends IPublicModelActiveTracker {
  track(originalTarget: IPublicTypeActiveTarget | INode): void;
}

export class ActiveTracker implements IActiveTracker {
  private emitter: IEventBus = createModuleEventBus('ActiveTracker');

  @obx.ref private _target?: IPublicTypeActiveTarget | INode;

  track(originalTarget: IPublicTypeActiveTarget | INode) {
    let target = originalTarget;
    if (isNode(originalTarget)) {
      target = { node: originalTarget as INode };
    }
    this._target = target;
    this.emitter.emit('change', target);
  }

  get currentNode() {
    return (this._target as IPublicTypeActiveTarget)?.node;
  }

  get detail() {
    return (this._target as IPublicTypeActiveTarget)?.detail;
  }

  /**
   * @deprecated
   */
  /* istanbul ignore next */
  get intance() {
    return this.instance;
  }

  get instance() {
    return (this._target as IPublicTypeActiveTarget)?.instance;
  }

  onChange(fn: (target: IPublicTypeActiveTarget) => void): () => void {
    this.emitter.addListener('change', fn);
    return () => {
      this.emitter.removeListener('change', fn);
    };
  }
}
