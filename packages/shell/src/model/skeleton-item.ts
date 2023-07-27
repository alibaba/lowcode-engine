import { skeletonItemSymbol } from '../symbols';
import { IPublicModelSkeletonItem } from '@alilc/lowcode-types';
import { Dock, IWidget, Panel, PanelDock, Stage, Widget } from '@alilc/lowcode-editor-skeleton';

export class SkeletonItem implements IPublicModelSkeletonItem {
  private [skeletonItemSymbol]: IWidget | Widget | Panel | Stage | Dock | PanelDock;

  constructor(skeletonItem: IWidget | Widget | Panel | Stage | Dock | PanelDock) {
    this[skeletonItemSymbol] = skeletonItem;
  }

  get name() {
    return this[skeletonItemSymbol].name;
  }

  get visible() {
    return this[skeletonItemSymbol].visible;
  }

  disable() {
    this[skeletonItemSymbol].disable?.();
  }

  enable() {
    this[skeletonItemSymbol].enable?.();
  }

  hide() {
    this[skeletonItemSymbol].hide();
  }

  show() {
    this[skeletonItemSymbol].show();
  }
}