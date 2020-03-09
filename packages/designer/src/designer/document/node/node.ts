import { obx, computed, untracked } from '@recore/obx';
import { NodeSchema, NodeData, PropsMap, PropsList } from '../../schema';
import Props from './props/props';
import DocumentModel from '../document-model';
import NodeChildren from './node-children';
import Prop from './props/prop';
import NodeContent from './node-content';
import { Component } from '../../simulator';
import { ComponentType } from '../../component-type';

const DIRECTIVES = ['condition', 'conditionGroup', 'loop', 'loopArgs', 'title', 'ignore', 'hidden', 'locked'];

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
  protected _props?: Props;
  protected _directives?: Props;
  protected _extras?: Props;
  protected _children: NodeChildren | NodeContent;
  @obx.ref private _parent: NodeParent | null = null;
  @obx.ref private _zLevel = 0;
  get props(): Props | undefined {
    return this._props;
  }
  get directives(): Props | undefined {
    return this._directives;
  }
  get extras(): Props | undefined {
    return this._extras;
  }
  /**
   * 父级节点
   */
  get parent(): NodeParent | null {
    return this._parent;
  }
  /**
   * 当前节点子集
   */
  get children(): NodeChildren | NodeContent {
    return this._children;
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
    let t = this.getDirective('x-title');
    if (!t && this.componentType.descriptor) {
      t = this.getProp(this.componentType.descriptor, false);
    }
    if (t) {
      const v = t.getAsString();
      if (v) {
        return v;
      }
    }
    return this.componentType.title;
  }

  get isSlotRoot(): boolean {
    return this._slotFor != null;
  }

  constructor(readonly document: DocumentModel, nodeSchema: NodeSchema, slotFor?: Prop) {
    const { componentName, id, children, props, ...extras } = nodeSchema;
    this.id = id || `node$${document.nextId()}`;
    this.componentName = componentName;
    this._slotFor = slotFor;
    if (isNodeParent(this)) {
      this._props = new Props(this, props);
      this._directives = new Props(this, {});
      Object.keys(extras).forEach(key => {
        if (DIRECTIVES.indexOf(key) > -1) {
          this._directives!.add((extras as any)[key], key);
          delete (extras as any)[key];
        }
      });
      this._extras = new Props(this, extras as any);
      this._children = new NodeChildren(this as NodeParent, children || []);
    } else {
      this._children = new NodeContent(children);
    }
  }

  /**
   * 是否一个父亲类节点
   */
  get isNodeParent(): boolean {
    return this.componentName.charAt(0) !== '#';
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
  hover(flag: boolean = true) {
    if (flag) {
      this.document.designer.hovering.hover(this);
    } else {
      this.document.designer.hovering.unhover(this);
    }
  }

  /**
   * 节点组件类
   */
  @obx.ref get component(): Component | null {
    if (this.isNodeParent) {
      return this.document.getComponent(this.componentName);
    }
    return null;
  }

  /**
   * 节点组件描述
   */
  @obx.ref get componentType(): ComponentType {
    return this.document.getComponentType(this.componentName, this.component);
  }

  @obx.ref get propsData(): PropsMap | PropsList | null {
    if (!this.isNodeParent || this.componentName === 'Fragment') {
      return null;
    }
    return this.props?.value || null;
  }

  get directivesData(): PropsMap | null {
    if (!this.isNodeParent) {
      return null;
    }
    return this.directives?.value as PropsMap || null;
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

  }

  replaceWith(schema: NodeSchema, migrate: boolean = true) {
    // reuse the same id? or replaceSelection
    //
  }

  getProp(path: string, useStash: boolean = true): Prop | null {
    return this.props?.query(path, useStash as any) || null;
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
    this.props?.merge(props);
  }

  /**
   * 设置多个属性值，替换原有值
   */
  setProps(props?: PropsMap | PropsList | null) {
    this.props?.import(props);
  }

  getDirective(name: string, useStash: boolean = true): Prop | null {
    return this.directives?.get(name, useStash as any) || null;
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

  import(data: NodeSchema, checkId: boolean = false) {
    const { componentName, id, children, props, ...extras } = data;

    if (isNodeParent(this)) {
      const directives: any = {};
      Object.keys(extras).forEach(key => {
        if (DIRECTIVES.indexOf(key) > -1) {
          directives[key] = (extras as any)[key];
          delete (extras as any)[key];
        }
      });
      this._props!.import(data.props);
      this._directives!.import(directives);
      this._extras!.import(extras as any);
      this._children.import(children, checkId);
    } else {
      this._children.import(children);
    }
  }

  /**
   * 导出 schema
   * @param serialize 序列化，加 id 标识符，用于储存为操作记录
   */
  export(serialize = false): NodeSchema {
    // TODO...
    const schema: any = {
      componentName: this.componentName,
      ...this.extras?.export(serialize),
      props: this.props?.export(serialize) || {},
      ...this.directives?.export(serialize),
    };
    if (serialize) {
      schema.id = this.id;
    }
    if (isNodeParent(this)) {
      if (this.children.size > 0) {
        schema.children = this.children.export(serialize);
      }
    } else {
      schema.children = (this.children as NodeContent).value;
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
  comparePosition(otherNode: Node): number {
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
    this.props?.purge();
    this.directives?.purge();
    this.extras?.purge();
    this.document.internalRemoveAndPurgeNode(this);
  }
}

export interface NodeParent extends Node {
  readonly children: NodeChildren;
  readonly props: Props;
  readonly directives: Props;
  readonly extras: Props;
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
export function comparePosition(node1: Node, node2: Node): number {
  if (node1 === node2) {
    return 0;
  }
  const l1 = node1.zLevel;
  const l2 = node2.zLevel;
  if (l1 === l2) {
    return 2;
  }

  let p: any;
  if (l1 > l2) {
    p = getZLevelTop(node2, l1);
    if (p && p === node1) {
      return 16;
    }
    return 2;
  }

  p = getZLevelTop(node1, l2);
  if (p && p === node2) {
    return 8;
  }

  return 2;
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

