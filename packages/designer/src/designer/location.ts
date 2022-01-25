import { DocumentModel, Node as ComponentNode, ParentalNode } from '../document';
import { LocateEvent } from './dragon';

export interface LocationData {
  target: ParentalNode; // shadowNode | ConditionFlow | ElementNode | RootNode
  detail: LocationDetail;
  source: string;
  event: LocateEvent;
}

export enum LocationDetailType {
  Children = 'Children',
  Prop = 'Prop',
}

export interface LocationChildrenDetail {
  type: LocationDetailType.Children;
  index?: number | null;
  /**
   * 是否有效位置
   */
  valid?: boolean;
  edge?: DOMRect;
  near?: {
    node: ComponentNode;
    pos: 'before' | 'after' | 'replace';
    rect?: Rect;
    align?: 'V' | 'H';
  };
  focus?: { type: 'slots' } | { type: 'node'; node: ParentalNode };
}

export interface LocationPropDetail {
  // cover 形态，高亮 domNode，如果 domNode 为空，取 container 的值
  type: LocationDetailType.Prop;
  name: string;
  domNode?: HTMLElement;
}

export type LocationDetail = LocationChildrenDetail | LocationPropDetail | { type: string; [key: string]: any };

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

export type Rect = DOMRect & {
  elements: Array<Element | Text>;
  computed?: boolean;
};

export function isLocationData(obj: any): obj is LocationData {
  return obj && obj.target && obj.detail;
}

export function isLocationChildrenDetail(obj: any): obj is LocationChildrenDetail {
  return obj && obj.type === LocationDetailType.Children;
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

export function getRectTarget(rect: Rect | null) {
  if (!rect || rect.computed) {
    return null;
  }
  const els = rect.elements;
  return els && els.length > 0 ? els[0]! : null;
}

export function isVerticalContainer(rect: Rect | null) {
  const el = getRectTarget(rect);
  if (!el) {
    return false;
  }
  return isRowContainer(el);
}

export function isVertical(rect: Rect | null) {
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

export class DropLocation {
  readonly target: ParentalNode;

  readonly detail: LocationDetail;

  readonly event: LocateEvent;

  readonly source: string;

  get document(): DocumentModel {
    return this.target.document;
  }

  constructor({ target, detail, source, event }: LocationData) {
    this.target = target;
    this.detail = detail;
    this.source = source;
    this.event = event;
  }

  clone(event: LocateEvent): DropLocation {
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
