import { INode } from '../document';
import { ILocateEvent } from './dragon';
import {
  IPublicModelDocumentModel,
  IPublicModelDropLocation,
  IPublicTypeLocationDetailType,
  IPublicTypeRect,
  IPublicTypeLocationDetail,
  IPublicTypeLocationData,
} from '@alilc/lowcode-types';


export interface Point {
  clientX: number;
  clientY: number;
}

export interface CanvasPoint {
  canvasX: number;
  canvasY: number;
}

export type Rects = DOMRect[] & {
  elements: Array<Element | Text>;
};

/**
 * @deprecated use same function in @alilc/lowcode-utils
 */
export function isLocationData(obj: any): boolean {
  return obj && obj.target && obj.detail;
}

/**
 * @deprecated use same function in @alilc/lowcode-utils
 */
export function isLocationChildrenDetail(obj: any): boolean {
  return obj && obj.type === IPublicTypeLocationDetailType.Children;
}

export function isRowContainer(container: Element | Text, win?: Window) {
  if (isText(container)) {
    return true;
  }
  const style = (win || getWindow(container)).getComputedStyle(container);
  const display = style.getPropertyValue('display');
  if (/flex$/.test(display)) {
    const direction = style.getPropertyValue('flex-direction') || 'row';
    if (direction === 'row' || direction === 'row-reverse') {
      return true;
    }
  }
  if (/grid$/.test(display)) {
    return true;
  }
  return false;
}

export function isChildInline(child: Element | Text, win?: Window) {
  if (isText(child)) {
    return true;
  }
  const style = (win || getWindow(child)).getComputedStyle(child);
  return /^inline/.test(style.getPropertyValue('display')) || /^(left|right)$/.test(style.getPropertyValue('float'));
}

export function getRectTarget(rect: IPublicTypeRect | null) {
  if (!rect || rect.computed) {
    return null;
  }
  const els = rect.elements;
  return els && els.length > 0 ? els[0]! : null;
}

export function isVerticalContainer(rect: IPublicTypeRect | null) {
  const el = getRectTarget(rect);
  if (!el) {
    return false;
  }
  return isRowContainer(el);
}

export function isVertical(rect: IPublicTypeRect | null) {
  const el = getRectTarget(rect);
  if (!el) {
    return false;
  }
  return isChildInline(el) || (el.parentElement ? isRowContainer(el.parentElement) : false);
}

function isText(elem: any): elem is Text {
  return elem.nodeType === Node.TEXT_NODE;
}

function isDocument(elem: any): elem is Document {
  return elem.nodeType === Node.DOCUMENT_NODE;
}

export function getWindow(elem: Element | Document): Window {
  return (isDocument(elem) ? elem : elem.ownerDocument!).defaultView!;
}
export interface IDropLocation extends IPublicModelDropLocation {

  readonly source: string;

  get document(): IPublicModelDocumentModel;
}

export class DropLocation implements IDropLocation {
  readonly target: INode;

  readonly detail: IPublicTypeLocationDetail;

  readonly event: ILocateEvent;

  readonly source: string;

  get document(): IPublicModelDocumentModel {
    return this.target.document;
  }

  constructor({ target, detail, source, event }: IPublicTypeLocationData) {
    this.target = target;
    this.detail = detail;
    this.source = source;
    this.event = event;
  }

  clone(event: ILocateEvent): DropLocation {
    return new DropLocation({
      target: this.target,
      detail: this.detail,
      source: this.source,
      event,
    });
  }

  /**
   * @deprecated
   * 兼容 vision
   */
  getContainer() {
    return this.target;
  }

  /**
   * @deprecated
   * 兼容 vision
   */
  getInsertion() {
    if (!this.detail) {
      return null;
    }
    if (this.detail.type === 'Children') {
      if (this.detail.index <= 0) {
        return null;
      }
      return this.target.children.get(this.detail.index - 1);
    }
    return (this.detail as any)?.near?.node;
  }
}
