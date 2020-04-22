import {
  isDOMText,
  isJSExpression,
  NodeSchema,
  PropsMap,
  PropsList,
  NodeData,
  TitleContent,
  obx,
  computed,
} from '@ali/lowcode-globals';
import { Props, EXTRA_KEY_PREFIX } from './props/props';
import { DocumentModel } from '../document-model';
import { NodeChildren } from './node-children';
import { Prop } from './props/prop';
import { ComponentMeta } from '../../component-meta';
import { ExclusiveGroup, isExclusiveGroup } from './exclusive-group';

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
 *  ------- addition support -----
 *  conditionGroup use for condition, for exclusive
 *  title          display on outline
 *  ignored        ignore this node will not publish to render, but will store
 *  locked         can not select/hover/ item on canvas but can control on outline
 *  hidden         not visible on canvas
 *  slotArgs       like loopArgs, for slot node
 */
export class Node {
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
   *  * Page 页面
   *  * Block 区块
   *  * Component 组件/元件
   *  * Fragment 碎片节点，无 props，有指令
   *  * Leaf 文字节点 | 表达式节点，无 props，无指令？
   *  * Slot 插槽节点，无 props，正常 children，有 slotArgs，有指令
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
    return 0;
  }

  @computed get title(): TitleContent {
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

  isRoot() {
    return (this.document.rootNode as any) == this;
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
      this._children.interalInitParent();
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
    if (parent && !this.conditionGroup) {
      // initial conditionGroup
      const grp = this.getExtraProp('conditionGroup', false)?.getAsString();
      if (grp) {
        this.setConditionGroup(grp);
      }
    }
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

  isContainer() {
    return this.isNodeParent && this.componentMeta.isContainer;
  }

  @computed isSlotContainer() {
    for (const item of this.props) {
      if (item.type === 'slot') {
        return true;
      }
    }
    return false;
  }

  @computed get slots() {
    // TODO: optimize recore/obx, array maked every time, donot as changed
    const slots: Node[] = [];
    this.props.forEach(item => {
      if (item.type === 'slot') {
        slots.push(item.slotNode!);
      }
    });
    return slots;
  }

  @obx.ref private _conditionGroup: ExclusiveGroup | null = null;
  get conditionGroup(): ExclusiveGroup | null {
    return this._conditionGroup;
  }

  setConditionGroup(grp: ExclusiveGroup | string | null) {
    if (!grp) {
      this.getExtraProp('conditionGroup', false)?.remove();
      if (this._conditionGroup) {
        this._conditionGroup.remove(this);
        this._conditionGroup = null;
      }
      return;
    }
    if (!isExclusiveGroup(grp)) {
      if (this.prevSibling?.conditionGroup?.name === grp) {
        grp = this.prevSibling.conditionGroup;
      } else if (this.nextSibling?.conditionGroup?.name === grp) {
        grp = this.nextSibling.conditionGroup;
      } else {
        grp = new ExclusiveGroup(grp);
      }
    }
    if (this._conditionGroup !== grp) {
      this.getExtraProp('conditionGroup', true)?.setValue(grp.name);
      if (this._conditionGroup) {
        this._conditionGroup.remove(this);
      }
      this._conditionGroup = grp;
      grp.add(this);
    }
  }

  @computed isConditionalVisible(): boolean | undefined {
    return this._conditionGroup?.isVisible(this);
  }

  setConditionalVisible() {
    this._conditionGroup?.setVisible(this);
  }

  @computed hasCondition() {
    const v = this.getExtraProp('condition', false)?.getValue();
    return v != null && v !== '';
  }

  @computed hasLoop() {
    const v = this.getExtraProp('loop', false)?.getValue();
    return v != null && v !== '';
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
    // FIXME! serilize?
    // for design - pass to Renderer
    // for save production data
    // for serilize mutation record
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

  // ======= compatibles ====
  isEmpty(): boolean {
    return this.children ? this.children.isEmpty() : true;
  }
  getChildren() {
    return this.children;
  }
  getComponentName() {
    return this.componentName;
  }
  insertBefore(node: Node, ref?: Node) {
    this.children?.insert(node, ref ? ref.index : null);
  }
  insertAfter(node: Node, ref?: Node) {
    this.children?.insert(node, ref ? (ref.index + 1) : null);
  }
  getParent() {
    return this.parent;
  }

  /**
   * @deprecated
   */
  getStatus() {
    return 'default';
  }
  /**
   * @deprecated
   */
  setStatus() {

  }
  /**
   * @deprecated
   */
  getDOMNode() {
    const instance = this.document.simulator?.getComponentInstances(this)?.[0];
    if (!instance) {
      return;
    }
    return this.document.simulator?.findDOMNodes(instance)?.[0];
  }
  /**
   * @deprecated
   */
  getPage() {
    console.warn('getPage is deprecated, use document instead');
    return this.document;
  }
  /**
   * @deprecated
   */
  getSuitablePlace(node: Node, ref: any): any {
    if (this.isRoot()) {
      return { container: this, ref };
    }
    return { container: this.parent, ref: this };
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
