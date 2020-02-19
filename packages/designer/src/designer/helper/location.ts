import ComponentNode, { NodeParent } from '../document/node/node';
import DocumentModel from '../document/document-model';

export interface LocationData {
  target: NodeParent; // shadowNode | ConditionFlow | ElementNode | RootNode
  detail: LocationDetail;
}

export enum LocationDetailType {
  Children = 'Children',
  Prop = 'Prop',
}

export interface LocationChildrenDetail {
  type: LocationDetailType.Children;
  index: number;
  edge?: DOMRect;
  near?: {
    node: ComponentNode;
    pos: 'before' | 'after';
    rect?: Rect;
    align?: 'V' | 'H';
  };
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
  return false;
}

export function isChildInline(child: Element | Text, win?: Window) {
  if (isText(child)) {
    return true;
  }
  const style = (win || getWindow(child)).getComputedStyle(child);
  return /^inline/.test(style.getPropertyValue('display'));
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

export default class Location {
  readonly target: NodeParent;
  readonly detail: LocationDetail;
  get document(): DocumentModel {
    return this.target.document;
  }

  constructor({ target, detail }: LocationData) {
    this.target = target;
    this.detail = detail;
  }
}
