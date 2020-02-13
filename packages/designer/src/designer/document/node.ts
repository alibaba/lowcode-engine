import { obx } from '@recore/obx';
import { NodeSchema, NodeData, PropsMap, PropsList } from '../schema';
import Props, { Prop } from './props';
import DocumentContext from './document-context';

/**
 * nodeSchema are:
 *  [basic]
 *   .componentName
 *   .props
 *   .children
 *  [directive]
 *   .condition
 *   .loop
 *   .loopArgs
 *   [addon]
 *    .conditionGroup = 'abc' // 当移动时值会改
 *    .title
 *    .ignore
 *    .hidden
 *    .locked
 */
const DIRECTIVES = ['condition', 'conditionGroup', 'loop', 'loopArgs', 'title', 'ignore', 'hidden', 'locked'];
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

  readonly props?: Props<Node>;
  readonly directives?: Props<Node>;
  readonly extras?: Props<Node>;

  constructor(readonly document: DocumentContext, private nodeSchema: NodeSchema) {
    const { componentName, id, children, props, ...extras } = nodeSchema;
    this.id = id || `node$${document.nextId()}`;
    this.componentName = componentName;
    if (this.isNodeParent()) {
      this.props = new Props(this, props);
      this.directives = new Props(this, {});
      Object.keys(extras).forEach(key => {
        this.directives!.add((extras as any)[key], key);
        delete (extras as any)[key];
      });
      this.extras = new Props(this, extras as any);
      if (children) {
        this._children = (Array.isArray(children) ? children : [children]).map(child => {
          const node = this.document.createNode(child);
          node.internalSetParent(this as INodeParent);
          return node;
        });
      }
    }
  }

  /**
   * 是否一个父亲类节点
   */
  isNodeParent(): boolean {
    return this.componentName.charAt(0) !== '#';
  }

  private _parent: INodeParent | null = null;

  /**
   * 父级节点
   */
  get parent(): INodeParent | null {
    return this._parent;
  }
  /**
   * 内部方法，请勿使用
   *
   * @ignore
   */
  internalSetParent(parent: INodeParent | null) {
    if (this._parent === parent) {
      return;
    }
    if (this._parent) {
      removeChild(this._parent, this);
    }

    this._parent = parent;
    if (parent) {
      this._zLevel = parent.zLevel + 1;
    } else {
      this._zLevel = -1;
    }
  }

  private _zLevel = 0;
  /**
   * 当前节点深度
   */
  get zLevel(): number {
    return this._zLevel;
  }

  private _children: Node[] | null = null;
  /**
   * 当前节点子集
   */
  get children(): Node[] | null {
    if (this.purged) {
      return null;
    }
    return this._children;
  }

  /*
  @obx.ref get component(): ReactType {
    return this.document.getComponent(this.tagName);
  }
  @obx.ref get prototype(): Prototype {
    return this.document.getPrototype(this.component, this.tagName);
  }
  */

  @obx.ref get propsData(): PropsMap | PropsList | null {
    if (!this.isNodeParent() || this.componentName === 'Fragment') {
      return null;
    }
    return this.props?.value || null;
  }

  get directivesData(): PropsMap | null {
    if (!this.isNodeParent()) {
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

  private mergeChildren(data: NodeData[]) {
    for (let i = 0, l = data.length; i < l; i++) {
      const item = this.children[i];
      if (item && isMergeable(item) && item.tagName === data[i].tagName) {
        item.merge(data[i]);
      } else {
        if (item) {
          item.purge();
        }
        this.children[i] = this.document.createNode(data[i]);
        this.children[i].internalSetParent(this);
      }
    }
    if (this.children.length > data.length) {
      this.children.splice(data.length).forEach(child => child.purge());
    }
  }
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
    return indexOf(this.parent, this);
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
    return getChildAt(this.parent, index + 1);
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
    return getChildAt(this.parent, index - 1);
  }

  /**
   * 获取符合搭建协议-节点 schema 结构
   */
  get schema(): NodeSchema {
    return this.exportSchema();
  }

  /**
   * 导出 schema
   * @param serialize 序列化，加 id 标识符，用于储存为操作记录
   */
  exportSchema(serialize = false): NodeSchema {
    const schema: any = {
      componentName: this.componentName,
      props: this.props,
      condition: this.condition,
      conditionGroup: this.conditionGroup,
      ...this.directives,
    };
    if (serialize) {
      schema.id = this.id;
    }
    const children = this.children;
    if (children && children.length > 0) {
      schema.children = children.map(node => node.exportSchema(serialize));
    }
    return schema;
  }

  // TODO: 再利用历史数据，不产生历史数据
  reuse(timelineData: NodeSchema) {}

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
   * 销毁
   */
  purge() {
    if (this.purged) {
      return;
    }
    this.purged = true;
    if (this._children) {
      this._children.forEach(child => child.purge());
    }
    // TODO: others dispose...
  }
}

export interface INodeParent extends Node {
  readonly children: Node[];
}

export function isNode(node: any): node is Node {
  return node && node.isNode;
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

  if (!node1.isNodeParent() || !node1.children || !node2.parent) {
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

export function insertChild(container: INodeParent, thing: Node | NodeData, at?: number | null, copy?: boolean): Node {
  let node: Node;
  if (copy && isNode(thing)) {
    thing = thing.schema;
  }
  if (isNode(thing)) {
    node = thing;
  } else {
    node = container.document.createNode(thing);
  }
  const children = container.children;
  let index = at == null ? children.length : at;

  const i = children.indexOf(node);

  if (i < 0) {
    if (index < children.length) {
      children.splice(index, 0, node);
    } else {
      children.push(node);
    }
    node.internalSetParent(container);
  } else {
    if (index > i) {
      index -= 1;
    }

    if (index === i) {
      return node;
    }

    children.splice(i, 1);
    children.splice(index, 0, node);
  }

  // check condition group
  node.conditionGroup = null;
  if (node.prevSibling && node.nextSibling) {
    const conditionGroup = node.prevSibling.conditionGroup;
    if (conditionGroup && conditionGroup === node.nextSibling.conditionGroup) {
      node.conditionGroup = conditionGroup;
    }
  }

  return node;
}

export function insertChildren(
  container: INodeParent,
  nodes: Node[] | NodeSchema[],
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

export function getChildAt(parent: INodeParent, index: number): Node | null {
  if (!parent.children) {
    return null;
  }
  return parent.children[index];
}

export function indexOf(parent: INodeParent, child: Node): number {
  if (!parent.children) {
    return -1;
  }
  return parent.children.indexOf(child);
}

export function removeChild(parent: INodeParent, child: Node) {
  if (!parent.children) {
    return;
  }
  const i = parent.children.indexOf(child);
  if (i > -1) {
    parent.children.splice(i, 1);
  }
}
