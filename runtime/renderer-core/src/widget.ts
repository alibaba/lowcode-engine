import type { NodeType, ComponentTreeNode, ComponentTreeNodeProps } from './types';
import { isJSExpression, isI18nNode } from './utils/type-guard';
import { guid } from './utils/guid';

export class Widget<Data, Element> {
  protected proxyElements: Element[] = [];
  protected renderObject: Element | undefined;

  constructor(public raw: Data) {
    this.init();
  }

  protected init() {}

  get key(): string {
    return (this.raw as any)?.id ?? `${guid()}`;
  }

  mapRenderObject(mapper: (widget: Widget<Data, Element>) => Element | undefined) {
    this.renderObject = mapper(this);
    return this;
  }

  addProxyELements(el: Element) {
    this.proxyElements.unshift(el);
  }

  build<C>(builder: (elements: Element[]) => C): C {
    return builder(this.renderObject ? [...this.proxyElements, this.renderObject] : []);
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
    if (this.raw.props) {
      this._propsValue = this.raw.props;
    }
    if (this.raw.children) {
      this._children = this.raw.children.map((child) => createWidget<E>(child));
    }
  }

  get componentName() {
    return this.raw.componentName;
  }
  get props() {
    return this._propsValue ?? {};
  }
  get condition() {
    return this.raw.condition !== false;
  }
  get loop() {
    return this.raw.loop;
  }
  get loopArgs() {
    return this.raw.loopArgs ?? ['item', 'index'];
  }
  get children() {
    return this._children;
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
