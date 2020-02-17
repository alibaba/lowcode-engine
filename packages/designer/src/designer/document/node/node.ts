import { obx } from '@recore/obx';
import { NodeSchema, NodeData, PropsMap, PropsList } from '../../schema';
import Props from './props/props';
import DocumentModel from '../document-model';
import NodeChildren from './node-children';
import Prop from './props/prop';
import NodeContent from './node-content';
import { Component } from '../../simulator';
import { ComponentConfig } from './component-config';

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
 *  title
 *  ignore
 *  locked
 *  hidden
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
  protected _props?: Props<Node>;
  protected _directives?: Props<Node>;
  protected _extras?: Props<Node>;
  protected _children: NodeChildren | NodeContent;
  private _parent: NodeParent | null = null;
  private _zLevel = 0;
  get props(): Props<Node> | undefined {
    return this._props;
  }
  get directives(): Props<Node> | undefined {
    return this._directives;
  }
  get extras(): Props<Node> | undefined {
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
  get zLevel(): number {
    return this._zLevel;
  }

  constructor(readonly document: DocumentModel, nodeSchema: NodeSchema) {
    const { componentName, id, children, props, ...extras } = nodeSchema;
    this.id = id || `node$${document.nextId()}`;
    this.componentName = componentName;
    if (this.isNodeParent) {
      this._props = new Props(this, props);
      this._directives = new Props(this, {});
      Object.keys(extras).forEach(key => {
        if (DIRECTIVES.indexOf(key) > -1) {
          this.directives!.add((extras as any)[key], key);
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
   *
   * @ignore
   */
  internalSetParent(parent: NodeParent | null) {
    if (this._parent === parent) {
      return;
    }
    if (this._parent) {
      this._parent.children.delete(this);
    }

    this._parent = parent;
    if (parent) {
      this._zLevel = parent.zLevel + 1;
    } else {
      this._zLevel = -1;
    }
  }

  /**
   * 移除当前节点
   */
  remove() {
    if (this.parent) {
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
   * 节点组件类
   */
  @obx.ref get component(): Component {
    return this.document.getComponent(this.componentName);
  }

  /**
   * 节点组件描述
   */
  @obx.ref get componentConfig(): ComponentConfig {
    return this.document.getComponentConfig(this.component, this.componentName);
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

    //
  }

  /*
  // TODO
  // 外部修改，merge 进来，产生一次可恢复的历史数据
  merge(data: ElementData) {
    this.elementData = data;
    const { leadingComments } = data;
    this.leadingComments = leadingComments ? leadingComments.slice() : [];
    this.parse();
    this.mergeChildren(data.children || []);
  }

  // TODO: 再利用历史数据，不产生历史数据
  reuse(timelineData: NodeSchema) {}
  */

  getProp(path: string, useStash: boolean = true): Prop | null {
    return this.props?.query(path, useStash as any) || null;
  }

  getDirective(name: string, useStash: boolean = true): Prop | null {
    return this.directives?.get(name, useStash as any) || null;
  }

  /**
   * 获取节点在父容器中的索引
   */
  get index(): number {
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
    // TODO: ..
    return this.exportSchema(true);
  }

  /**
   * 导出 schema
   * @param serialize 序列化，加 id 标识符，用于储存为操作记录
   */
  exportSchema(serialize = false): NodeSchema {
    // TODO...
    const schema: any = {
      componentName: this.componentName,
      ...this.extras,
      props: this.props,
      ...this.directives,
    };
    if (serialize) {
      schema.id = this.id;
    }
    if (isNodeParent(this)) {
      if (this.children.size > 0) {
        schema.children = this.children.exportSchema(serialize);
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
  readonly props: Props<Node>;
  readonly directives: Props<Node>;
  readonly extras: Props<Node>;
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
  if (copy && isNode(thing)) {
    thing = thing.schema;
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
    results.push(insertChild(container, node, index, copy));
    index = node.index;
  }
  return results;
}

