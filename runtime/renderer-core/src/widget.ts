import type { NodeType, ComponentTreeNode, ComponentTreeNodeProps } from './types';
import { isJSExpression, isI18nNode } from './utils/type-guard';

export class Widget<Data, Element> {
  protected _raw: Data;
  protected proxyElements: Element[] = [];
  protected renderObject: Element | undefined;

  constructor(data: Data) {
    this._raw = data;
    this.init();
  }

  protected init() {}

  get raw() {
    return this._raw;
  }

  setRenderObject(el: Element) {
    this.renderObject = el;
  }
  getRenderObject() {
    return this.renderObject;
  }

  addProxyELements(el: Element) {
    this.proxyElements.push(el);
  }

  build(builder: (elements: Element[]) => Element) {
    return builder(this.proxyElements);
  }
}

export type TextWidgetData = Exclude<NodeType, ComponentTreeNode>;
export type TextWidgetType = 'string' | 'expression' | 'i18n';

export class TextWidget<E = unknown> extends Widget<TextWidgetData, E> {
  type: TextWidgetType = 'string';

  protected init() {
    if (isJSExpression(this.raw)) {
      this.type = 'expression';
    } else if (isI18nNode(this.raw)) {
      this.type = 'i18n';
    }
  }
}

export class ComponentWidget<E = unknown> extends Widget<ComponentTreeNode, E> {
  private _children: (TextWidget<E> | ComponentWidget<E>)[] = [];
  private _propsValue: ComponentTreeNodeProps = {};

  protected init() {
    if (this._raw.props) {
      this._propsValue = this._raw.props;
    }
    if (this._raw.children) {
      this._children = this._raw.children.map((child) => createWidget<E>(child));
    }
  }

  get componentName() {
    return this.raw.componentName;
  }
  get props() {
    return this._propsValue;
  }
  get children() {
    return this._children;
  }
  get condition() {
    return this._raw.condition ?? true;
  }
  get loop() {
    return this._raw.loop;
  }
  get loopArgs() {
    return this._raw.loopArgs ?? ['item', 'index'];
  }
}

export function createWidget<E = unknown>(data: NodeType) {
  if (typeof data === 'string' || isJSExpression(data) || isI18nNode(data)) {
    return new TextWidget<E>(data);
  } else if (data.componentName) {
    return new ComponentWidget<E>(data);
  }

  throw Error(`unknown node data: ${JSON.stringify(data)}`);
}
