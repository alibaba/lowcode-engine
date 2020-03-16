import { obx, computed } from '@recore/obx';
import { NodeSchema, NodeData, PropsMap, PropsList, isDOMText, isJSExpression } from '../../schema';
import Props, { EXTRA_KEY_PREFIX } from './props/props';
import DocumentModel from '../document-model';
import NodeChildren from './node-children';
import Prop from './props/prop';
import { ComponentMeta } from '../../component-meta';

/**
 * 基础节点
 *
 * [Node Properties]
 *  componentName: Page/Block/Component
 *  props
 *  children
 *
 * [Directives]
 *  loop
 *  loopArgs
 *  condition
 *  ------- future support -----
 *  conditionGroup
 *  x-title
 *  x-ignore
 *  x-locked
 *  x-hidden
 */
export default class Node {
  /**
   * 是节点实例
   */
  readonly isNode = true;

  /**
   * 节点 id
   */
  readonly id: string;

  /**
   * 节点组件类型
   * 特殊节点:
   *  * #text 文字节点
   *  * #expression 表达式节点
   *  * Page 页面
   *  * Block/Fragment 区块
   *  * Component 组件/元件
   */
  readonly componentName: string;
  /**
   * 属性抽象
   */
  readonly props: Props;
  protected _children?: NodeChildren;
  @obx.ref private _parent: NodeParent | null = null;
  /**
   * 父级节点
   */
  get parent(): NodeParent | null {
    return this._parent;
  }
  /**
   * 当前节点子集
   */
  get children(): NodeChildren | null {
    return this._children || null;
  }
  /**
   * 当前节点深度
   */
  @computed get zLevel(): number {
    if (this._parent) {
      return this._parent.zLevel + 1;
    }
    return -1;
  }

  @computed get title(): string {
    let t = this.getExtraProp('title');
    if (!t && this.componentMeta.descriptor) {
      t = this.getProp(this.componentMeta.descriptor, false);
    }
    if (t) {
      const v = t.getAsString();
      if (v) {
        return v;
      }
    }
    return this.componentMeta.title;
  }

  get isSlotRoot(): boolean {
    return this._slotFor != null;
  }

  constructor(readonly document: DocumentModel, nodeSchema: NodeSchema, slotFor?: Prop) {
    const { componentName, id, children, props, ...extras } = nodeSchema;
    this.id = id || `node$${document.nextId()}`;
    this.componentName = componentName;
    this._slotFor = slotFor;
    let _props: Props;
    if (isNodeParent(this)) {
      _props = new Props(this, props, extras);
      this._children = new NodeChildren(this as NodeParent, children || []);
    } else {
      _props = new Props(this, {
        children: isDOMText(children) || isJSExpression(children) ? children : '',
      });
    }
    this.props = _props;
  }

  /**
   * 是否一个父亲类节点
   */
  get isNodeParent(): boolean {
    return this.componentName !== 'Leaf';
  }

  /**
   * 内部方法，请勿使用
   */
  internalSetParent(parent: NodeParent | null) {
    if (this._parent === parent) {
      return;
    }

    if (this._parent && !this.isSlotRoot) {
      this._parent.children.delete(this);
    }

    this._parent = parent;
  }

  private _slotFor?: Prop | null = null;
  internalSetSlotFor(slotFor: Prop | null | undefined) {
    this._slotFor = slotFor;
  }

  get slotFor() {
    return this._slotFor;
  }

  /**
   * 移除当前节点
   */
  remove() {
    if (this.parent && !this.isSlotRoot) {
      this.parent.children.delete(this, true);
    }
  }

  /**
   * 选择当前节点
   */
  select() {
    this.document.selection.select(this.id);
  }

  /**
   * 悬停高亮
   */
  hover(flag = true) {
    if (flag) {
      this.document.designer.hovering.hover(this);
    } else {
      this.document.designer.hovering.unhover(this);
    }
  }

  /**
   * 节点组件描述
   */
  @computed get componentMeta(): ComponentMeta {
    return this.document.getComponentMeta(this.componentName);
  }

  @computed get propsData(): PropsMap | PropsList | null {
    if (!this.isNodeParent || this.componentName === 'Fragment') {
      return null;
    }
    return this.props.export(true).props || null;
  }

  private _conditionGroup: string | null = null;
  /**
   * 条件组
   */
  get conditionGroup(): string | null {
    if (this._conditionGroup) {
      return this._conditionGroup;
    }
    // 如果 condition 有值，且没有 group
    if (this._condition) {
      return this.id;
    }
    return null;
  }
  set conditionGroup(val) {
    this._conditionGroup = val;
  }

  private _condition: any;
  /**
   *
   */
  get condition() {
    if (this._condition == null) {
      if (this._conditionGroup) {
        // FIXME: should be expression
        return true;
      }
      return null;
    }
    return this._condition;
  }

  wrapWith(schema: NodeSchema) {
    // todo
  }

  replaceWith(schema: NodeSchema, migrate = true) {
    // reuse the same id? or replaceSelection
    //
  }

  getProp(path: string, stash = true): Prop | null {
    return this.props.query(path, stash as any) || null;
  }

  getExtraProp(key: string, stash = true): Prop | null {
    return this.props.get(EXTRA_KEY_PREFIX + key, stash) || null;
  }

  /**
   * 获取单个属性值
   */
  getPropValue(path: string): any {
    return this.getProp(path, false)?.value;
  }

  /**
   * 设置单个属性值
   */
  setPropValue(path: string, value: any) {
    this.getProp(path, true)!.setValue(value);
  }

  /**
   * 设置多个属性值，和原有值合并
   */
  mergeProps(props: PropsMap) {
    this.props.merge(props);
  }

  /**
   * 设置多个属性值，替换原有值
   */
  setProps(props?: PropsMap | PropsList | null) {
    this.props.import(props);
  }

  /**
   * 获取节点在父容器中的索引
   */
  @computed get index(): number {
    if (!this.parent) {
      return -1;
    }
    return this.parent.children.indexOf(this);
  }

  /**
   * 获取下一个兄弟节点
   */
  get nextSibling(): Node | null {
    if (!this.parent) {
      return null;
    }
    const index = this.index;
    if (index < 0) {
      return null;
    }
    return this.parent.children.get(index + 1);
  }

  /**
   * 获取上一个兄弟节点
   */
  get prevSibling(): Node | null {
    if (!this.parent) {
      return null;
    }
    const index = this.index;
    if (index < 1) {
      return null;
    }
    return this.parent.children.get(index - 1);
  }

  /**
   * 获取符合搭建协议-节点 schema 结构
   */
  get schema(): NodeSchema {
    return this.export(true);
  }

  set schema(data: NodeSchema) {
    this.import(data);
  }

  import(data: NodeSchema, checkId = false) {
    const { componentName, id, children, props, ...extras } = data;

    if (isNodeParent(this)) {
      this.props.import(props, extras);
      (this._children as NodeChildren).import(children, checkId);
    } else {
      this.props.get('children', true)!.setValue(isDOMText(children) || isJSExpression(children) ? children : '');
    }
  }

  /**
   * 导出 schema
   * @param serialize 序列化，加 id 标识符，用于储存为操作记录
   */
  export(serialize = false): NodeSchema {
    const baseSchema: any = {
      componentName: this.componentName === 'Leaf' ? 'Fragment' : this.componentName,
    };

    if (serialize) {
      baseSchema.id = this.id;
    }

    if (!isNodeParent(this)) {
      baseSchema.children = this.props.get('children')?.export(serialize);
      // FIXME!
      return baseSchema.children;
    }

    const { props = {}, extras } = this.props.export(serialize) || {};
    const schema: any = {
      ...baseSchema,
      props,
      ...extras,
    };

    if (this.children.size > 0) {
      schema.children = this.children.export(serialize);
    }

    return schema;
  }

  /**
   * 判断是否包含特定节点
   */
  contains(node: Node): boolean {
    return contains(this, node);
  }

  /**
   * 获取特定深度的父亲节点
   */
  getZLevelTop(zLevel: number): Node | null {
    return getZLevelTop(this, zLevel);
  }

  /**
   * 判断与其它节点的位置关系
   *
   *  16 thisNode contains otherNode
   *  8  thisNode contained_by otherNode
   *  2  thisNode before or after otherNode
   *  0  thisNode same as otherNode
   */
  comparePosition(otherNode: Node): PositionNO {
    return comparePosition(this, otherNode);
  }

  private purged = false;
  /**
   * 是否已销毁
   */
  get isPurged() {
    return this.purged;
  }
  /**
   * 销毁
   */
  purge() {
    if (this.purged) {
      return;
    }
    if (this._parent) {
      // should remove thisNode before purge
      this.remove();
      return;
    }
    this.purged = true;
    if (isNodeParent(this)) {
      this.children.purge();
    }
    this.props.purge();
    this.document.internalRemoveAndPurgeNode(this);
  }
}

export interface NodeParent extends Node {
  readonly children: NodeChildren;
  readonly props: Props;
}

export function isNode(node: any): node is Node {
  return node && node.isNode;
}

export function isNodeParent(node: Node): node is NodeParent {
  return node.isNodeParent;
}

export function getZLevelTop(child: Node, zLevel: number): Node | null {
  let l = child.zLevel;
  if (l < zLevel || zLevel < 0) {
    return null;
  }
  if (l === zLevel) {
    return child;
  }
  let r: any = child;
  while (r && l-- > zLevel) {
    r = r.parent;
  }
  return r;
}

export function contains(node1: Node, node2: Node): boolean {
  if (node1 === node2) {
    return true;
  }

  if (!node1.isNodeParent || !node2.parent) {
    return false;
  }

  const p = getZLevelTop(node2, node1.zLevel);
  if (!p) {
    return false;
  }

  return node1 === p;
}

// 16 node1 contains node2
// 8  node1 contained_by node2
// 2  node1 before or after node2
// 0  node1 same as node2
export enum PositionNO {
  Contains = 16,
  ContainedBy = 8,
  BeforeOrAfter = 2,
  TheSame = 0,
}
export function comparePosition(node1: Node, node2: Node): PositionNO {
  if (node1 === node2) {
    return PositionNO.TheSame;
  }
  const l1 = node1.zLevel;
  const l2 = node2.zLevel;
  if (l1 === l2) {
    return PositionNO.BeforeOrAfter;
  }

  let p: any;
  if (l1 < l2) {
    p = getZLevelTop(node2, l1);
    if (p && p === node1) {
      return PositionNO.Contains;
    }
    return PositionNO.BeforeOrAfter;
  }

  p = getZLevelTop(node1, l2);
  if (p && p === node2) {
    return PositionNO.ContainedBy;
  }

  return PositionNO.BeforeOrAfter;
}

export function insertChild(container: NodeParent, thing: Node | NodeData, at?: number | null, copy?: boolean): Node {
  let node: Node;
  if (isNode(thing) && (copy || thing.isSlotRoot)) {
    thing = thing.export(false);
  }
  if (isNode(thing)) {
    node = thing;
  } else {
    node = container.document.createNode(thing);
  }

  container.children.insert(node, at);

  return node;
}

export function insertChildren(
  container: NodeParent,
  nodes: Node[] | NodeData[],
  at?: number | null,
  copy?: boolean,
): Node[] {
  let index = at;
  let node: any;
  const results: Node[] = [];
  // tslint:disable-next-line
  while ((node = nodes.pop())) {
    node = insertChild(container, node, index, copy);
    results.push(node);
    index = node.index;
  }
  return results;
}
