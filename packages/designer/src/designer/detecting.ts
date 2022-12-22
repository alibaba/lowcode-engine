import { makeObservable, obx, IEventBus, createModuleEventBus } from '@alilc/lowcode-editor-core';
import { IPublicModelDetecting, IPublicModelNode, IPublicModelDocumentModel } from '@alilc/lowcode-types';

const DETECTING_CHANGE_EVENT = 'detectingChange';
export interface IDetecting extends IPublicModelDetecting {

}

export class Detecting implements IDetecting {
  @obx.ref private _enable = true;

  /**
   * 控制大纲树 hover 时是否出现悬停效果
   * TODO: 将该逻辑从设计器中抽离出来
   */
  get enable() {
    return this._enable;
  }

  set enable(flag: boolean) {
    this._enable = flag;
    if (!flag) {
      this._current = null;
    }
  }

  @obx.ref xRayMode = false;

  @obx.ref private _current: IPublicModelNode | null = null;

  private emitter: IEventBus = createModuleEventBus('Detecting');

  constructor() {
    makeObservable(this);
  }

  get current() {
    return this._current;
  }

  capture(node: IPublicModelNode | null) {
    if (this._current !== node) {
      this._current = node;
      this.emitter.emit(DETECTING_CHANGE_EVENT, this.current);
    }
  }

  release(node: IPublicModelNode | null) {
    if (this._current === node) {
      this._current = null;
      this.emitter.emit(DETECTING_CHANGE_EVENT, this.current);
    }
  }

  leave(document: IPublicModelDocumentModel | undefined) {
    if (this.current && this.current.document === document) {
      this._current = null;
    }
  }

  onDetectingChange(fn: (node: IPublicModelNode) => void) {
    this.emitter.on(DETECTING_CHANGE_EVENT, fn);
    return () => {
      this.emitter.off(DETECTING_CHANGE_EVENT, fn);
    };
  }
}
