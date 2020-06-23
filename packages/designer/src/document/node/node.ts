import { obx, computed, autorun } from '@ali/lowcode-editor-core';
import {
  isDOMText,
  isJSExpression,
  NodeSchema,
  PropsMap,
  PropsList,
  NodeData,
  TitleContent,
  I18nData,
  SlotSchema,
  PageSchema,
  ComponentSchema,
  NodeStatus,
} from '@ali/lowcode-types';
import { Props, getConvertedExtraKey } from './props/props';
import { DocumentModel } from '../document-model';
import { NodeChildren } from './node-children';
import { Prop } from './props/prop';
import { ComponentMeta } from '../../component-meta';
import { ExclusiveGroup, isExclusiveGroup } from './exclusive-group';
import { TransformStage } from './transform-stage';
import { ReactElement } from 'react';
import { SettingTopEntry } from 'designer/src/designer';

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
 *
 * 根容器节点
 *
 * [Node Properties]
 *  componentName: Page/Block/Component
 *  props
 *  children
 *
 * [Root Container Extra Properties]
 *  fileName
 *  meta
 *  state
 *  defaultProps
 *  dataSource
 *  lifeCycles
 *  methods
 *  css
 *
 * [Directives **not used**]
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
export class Node<Schema extends NodeSchema = NodeSchema> {
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
  /**
   * @deprecated
   */
  private _addons: { [key: string]: any } = {};
  @obx.ref private _parent: ParentalNode | null = null;
  /**
   * 父级节点
   */
  get parent(): ParentalNode | null {
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

  @computed get title(): string | I18nData | ReactElement {
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

  get icon() {
    return this.componentMeta.icon;
  }

  readonly settingEntry: SettingTopEntry;

  constructor(readonly document: DocumentModel, nodeSchema: Schema) {
    const { componentName, id, children, props, ...extras } = nodeSchema;
    this.id = id || `node_${document.nextId()}`;
    this.componentName = componentName;
    if (this.componentName === 'Leaf') {
      this.props = new Props(this, {
        children: isDOMText(children) || isJSExpression(children) ? children : '',
      });
    } else {
      this.props = new Props(this, props, extras);
      this._children = new NodeChildren(this as ParentalNode, this.initialChildren(children));
      this._children.interalInitParent();
      this.props.import(this.transformProps(props || {}), extras);
      this.setupAutoruns();
    }

    this.settingEntry = this.document.designer.createSettingEntry([ this ]);
  }

  private transformProps(props: any): any {
    // FIXME! support PropsList
    return this.document.designer.transformProps(props, this, TransformStage.Init);
    // TODO: run transducers in metadata.experimental
  }

  private autoruns?: Array<() => void>;
  private setupAutoruns() {
    const autoruns = this.componentMeta.getMetadata().experimental?.autoruns;
    if (!autoruns || autoruns.length < 1) {
      return;
    }
    this.autoruns = autoruns.map((item) => {
      return autorun(() => {
        item.autorun(this.props.get(item.name, true) as any);
      }, true);
    });
  }

  private initialChildren(children: any): NodeData[] {
    // FIXME! this is dirty code
    if (children == null) {
      const initialChildren = this.componentMeta.getMetadata().experimental?.initialChildren;
      if (initialChildren) {
        if (typeof initialChildren === 'function') {
          return initialChildren(this as any) || [];
        }
        return initialChildren;
      }
    }
    return children || [];
  }

  isContainer(): boolean {
    return this.isParental() && this.componentMeta.isContainer;
  }

  isRoot(): boolean {
    return this.document.rootNode == (this as any);
  }

  isPage(): boolean {
    return this.isRoot() && this.componentName === 'Page';
  }

  isComponent(): boolean {
    return this.isRoot() && this.componentName === 'Component';
  }

  isSlot(): boolean {
    return this._slotFor != null && this.componentName === 'Slot';
  }

  /**
   * 是否一个父亲类节点
   */
  isParental(): this is ParentalNode {
    return !this.isLeaf();
  }

  /**
   * 终端节点，内容一般为 文字 或者 表达式
   */
  isLeaf(): this is LeafNode {
    return this.componentName === 'Leaf';
  }

  internalSetWillPurge() {
    this.internalSetParent(null);
    this.document.addWillPurge(this);
  }
  /**
   * 内部方法，请勿使用
   */
  internalSetParent(parent: ParentalNode | null) {
    if (this._parent === parent) {
      return;
    }

    if (this._parent) {
      if (this.isSlot()) {
        this._parent.removeSlot(this, false);
      } else {
        this._parent.children.delete(this);
      }
    }

    this._parent = parent;
    if (parent) {
      this.document.removeWillPurge(this);
      if (!this.conditionGroup) {
        // initial conditionGroup
        const grp = this.getExtraProp('conditionGroup', false)?.getAsString();
        if (grp) {
          this.setConditionGroup(grp);
        }
      }
    }
  }

  private _slotFor?: Prop | null = null;
  internalSetSlotFor(slotFor: Prop | null | undefined) {
    this._slotFor = slotFor;
  }

  /**
   * 关联属性
   */
  get slotFor() {
    return this._slotFor;
  }

  /**
   * 移除当前节点
   */
  remove() {
    if (this.parent) {
      if (this.isSlot()) {
        this.parent.removeSlot(this, true);
      } else {
        this.parent.children.delete(this, true);
      }
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
      this.document.designer.detecting.capture(this);
    } else {
      this.document.designer.detecting.release(this);
    }
  }

  /**
   * 节点组件描述
   */
  @computed get componentMeta(): ComponentMeta {
    return this.document.getComponentMeta(this.componentName);
  }

  @computed get propsData(): PropsMap | PropsList | null {
    if (!this.isParental() || this.componentName === 'Fragment') {
      return null;
    }
    return this.props.export(TransformStage.Serilize).props || null;
  }

  @obx.val _slots: Node[] = [];
  @computed hasSlots() {
    return this._slots.length > 0;
  }

  get slots() {
    return this._slots;
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
    return v != null && v !== '' && v !== true;
  }

  @computed hasLoop() {
    const v = this.getExtraProp('loop', false)?.getValue();
    return v != null && v !== '';
  }

  wrapWith(schema: Schema) {
    // todo
  }

  replaceWith(schema: Schema, migrate = false): any {
    // reuse the same id? or replaceSelection
    schema = Object.assign({}, migrate ? this.export() : {}, schema);
    return this.parent?.replaceChild(this, schema);
  }

  /**
   * 替换子节点
   *
   * @param {Node} node
   * @param {object} data
   */
  replaceChild(node: Node, data: any): Node {
    if (this.children?.has(node)) {
      const selected = this.document.selection.has(node.id);

      delete data.id;
      const newNode = this.document.createNode(data);

      this.insertBefore(newNode, node);
      node.remove();

      if (selected) {
        this.document.selection.select(newNode.id);
      }
    }
    return node;
  }

  getProp(path: string, stash = true): Prop | null {
    return this.props.query(path, stash as any) || null;
  }

  getExtraProp(key: string, stash = true): Prop | null {
    return this.props.get(getConvertedExtraKey(key), stash) || null;
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
   * 清除已设置的值
   */
  clearPropValue(path: string): void {
    this.getProp(path, false)?.unset();
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
  get schema(): Schema {
    return this.export(TransformStage.Save);
  }

  set schema(data: Schema) {
    this.import(data);
  }

  import(data: Schema, checkId = false) {
    const { componentName, id, children, props, ...extras } = data;

    if (this.isParental()) {
      this.props.import(props, extras);
      (this._children as NodeChildren).import(children, checkId);
    } else {
      this.props.get('children', true)!.setValue(isDOMText(children) || isJSExpression(children) ? children : '');
    }
  }

  /**
   * 导出 schema
   */
  export(stage: TransformStage = TransformStage.Save): Schema {
    const baseSchema: any = {
      componentName: this.componentName,
    };

    if (stage !== TransformStage.Clone) {
      baseSchema.id = this.id;
    }

    if (this.isLeaf()) {
      baseSchema.children = this.props.get('children')?.export(stage);
      return baseSchema;
    }

    const { props = {}, extras } = this.props.export(stage) || {};
    const _extras_: { [key: string]: any } = {
      ...extras,
    };
    if (_extras_) {
      Object.keys(_extras_).forEach((key) => {
        const addon = this._addons[key];
        if (addon) {
          _extras_[key] = addon();
        }
      });
    }

    const schema: any = {
      ...baseSchema,
      props: this.document.designer.transformProps(props, this, stage),
      ...this.document.designer.transformProps(_extras_, this, stage),
    };

    if (this.isParental() && this.children.size > 0) {
      schema.children = this.children.export(stage);
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

  /**
   * 删除一个Slot节点
   */
  removeSlot(slotNode: Node, purge = false): boolean {
    const i = this._slots.indexOf(slotNode);
    if (i < 0) {
      return false;
    }
    const deleted = this._slots.splice(i, 1)[0];
    if (purge) {
      // should set parent null
      deleted.internalSetParent(null);
      deleted.purge();
    }
    return false;
  }

  addSlot(slotNode: Node) {
    slotNode.internalSetParent(this as ParentalNode);
    this._slots.push(slotNode);
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
    if (this.isParental()) {
      this.children.purge();
    }
    this.autoruns?.forEach((dispose) => dispose());
    this.props.purge();
    this.document.internalRemoveAndPurgeNode(this);

    this.document.destroyNode(this);
  }

  // ======= compatible apis ====
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
  insertAfter(node: any, ref?: Node) {
    if (!isNode(node)) {
      if (node.getComponentName) {
        node = this.document.createNode({
          componentName: node.getComponentName(),
        });
      } else {
        node = this.document.createNode(node);
      }
    }
    this.children?.insert(node, ref ? ref.index + 1 : null);
  }
  getParent() {
    return this.parent;
  }
  getId() {
    return this.id;
  }
  getIndex() {
    return this.index;
  }
  getNode() {
    return this;
  }
  getRoot() {
    return this.document.rootNode;
  }
  getProps() {
    return this.props;
  }

  onChildrenChange(fn: () => void) {
    return this.children?.onChange(fn);
  }

  mergeChildren(remover: () => any, adder: (children: Node[]) => NodeData[] | null, sorter: () => any) {
    this.children?.mergeChildren(remover, adder, sorter);
  }

  @obx.val status: NodeStatus = {
    inPlaceEditing: false,
    locking: false,
    pseudo: false,
  };

  /**
   * @deprecated
   */
  getStatus(field?: keyof NodeStatus) {
    if (field && this.status[field] != null) {
      return this.status[field];
    }

    return this.status;
  }
  /**
   * @deprecated
   */
  setStatus(field: keyof NodeStatus, flag: boolean) {
    if (!this.status.hasOwnProperty(field)) {
      return;
    }

    if (flag !== this.status[field]) {
      this.status[field] = flag;
    }
  }
  /**
   * @deprecated
   */
  getDOMNode(): any {
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
    // TODO:
    if (this.isRoot()) {
      return { container: this, ref };
    }
    return { container: this.parent, ref: this };
  }
  /**
   * @deprecated
   */
  getAddonData(key: string) {
    const addon = this._addons[key];
    if (addon) {
      return addon();
    }
    return this.getExtraProp(key)?.value;
  }
  /**
   * @deprecated
   */
  registerAddon(key: string, exportData: any) {
    if (this._addons[key]) {
      throw new Error(`node addon ${key} exist`);
    }

    this._addons[key] = exportData;
  }

  getRect(): DOMRect | null {
    if (this.isRoot()) {
      return this.document.simulator?.viewport.contentBounds || null;
    }
    return this.document.simulator?.computeRect(this) || null;
  }

  getPrototype() {
    return this.componentMeta.prototype;
  }

  getIcon() {
    return this.icon;
  }

  toString() {
    return this.id;
  }
}

export interface ParentalNode<T extends NodeSchema = NodeSchema> extends Node<T> {
  readonly children: NodeChildren;
}
export interface LeafNode extends Node {
  readonly children: null;
}

export type SlotNode = ParentalNode<SlotSchema>;
export type PageNode = ParentalNode<PageSchema>;
export type ComponentNode = ParentalNode<ComponentSchema>;
export type RootNode = PageNode | ComponentNode;

export function isNode(node: any): node is Node {
  return node && node.isNode;
}

export function isRootNode(node: Node): node is RootNode {
  return node && node.isRoot();
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

  if (!node1.isParental || !node2.parent) {
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

export function insertChild(container: ParentalNode, thing: Node | NodeData, at?: number | null, copy?: boolean): Node {
  let node: Node;
  if (isNode(thing) && (copy || thing.isSlot())) {
    thing = thing.export(TransformStage.Clone);
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
  container: ParentalNode,
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
