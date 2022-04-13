import { ReactElement } from 'react';
import { EventEmitter } from 'events';
import { obx, computed, autorun, makeObservable, runInAction, wrapWithEventSwitch, action } from '@alilc/lowcode-editor-core';
import {
  isDOMText,
  isJSExpression,
  NodeSchema,
  PropsMap,
  PropsList,
  NodeData,
  I18nData,
  SlotSchema,
  PageSchema,
  ComponentSchema,
  NodeStatus,
  CompositeValue,
  GlobalEvent,
  ComponentAction,
} from '@alilc/lowcode-types';
import { compatStage } from '@alilc/lowcode-utils';
import { SettingTopEntry } from '@alilc/lowcode-designer';
import { Node as ShellNode } from '@alilc/lowcode-shell';
import { Props, getConvertedExtraKey } from './props/props';
import { DocumentModel } from '../document-model';
import { NodeChildren } from './node-children';
import { Prop } from './props/prop';
import { ComponentMeta } from '../../component-meta';
import { ExclusiveGroup, isExclusiveGroup } from './exclusive-group';
import { TransformStage } from './transform-stage';
import { includeSlot, removeSlot } from '../../utils/slot';
import { foreachReverse } from '../../utils/tree';
import { NodeRemoveOptions } from '../../types';

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
 *  isLocked       can not select/hover/ item on canvas and outline
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
 *  ignored
 *  isLocked
 *  hidden
 */
export class Node<Schema extends NodeSchema = NodeSchema> {
  private emitter: EventEmitter;

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
  props: Props;

  protected _children?: NodeChildren;

  /**
   * @deprecated
   */
  private _addons: { [key: string]: { exportData: () => any; isProp: boolean } } = {};

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
    // TODO: 暂时走不到这个分支
    // if (!t && this.componentMeta.descriptor) {
    //   t = this.getProp(this.componentMeta.descriptor, false);
    // }
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

  isInited = false;

  constructor(readonly document: DocumentModel, nodeSchema: Schema, options: any = {}) {
    makeObservable(this);
    const { componentName, id, children, props, ...extras } = nodeSchema;
    this.id = document.nextId(id);
    this.componentName = componentName;
    if (this.componentName === 'Leaf') {
      this.props = new Props(this, {
        children: isDOMText(children) || isJSExpression(children) ? children : '',
      });
    } else {
      this.props = new Props(this, props, extras);
      this._children = new NodeChildren(this as ParentalNode, this.initialChildren(children));
      this._children.internalInitParent();
      this.props.merge(
        this.upgradeProps(this.initProps(props || {})),
        this.upgradeProps(extras),
      );
      this.setupAutoruns();
    }

    this.initBuiltinProps();

    this.isInited = true;
    this.emitter = new EventEmitter();
  }

  _settingEntry: SettingTopEntry;

  get settingEntry(): SettingTopEntry {
    if (this._settingEntry) return this._settingEntry;
    this._settingEntry = this.document.designer.createSettingEntry([this]);
    return this._settingEntry;
  }

  /**
   * 节点初始化期间就把内置的一些 prop 初始化好，避免后续不断构造实例导致 reaction 执行多次
   */
  @action
  private initBuiltinProps() {
    this.props.has(getConvertedExtraKey('hidden')) || this.props.add(false, getConvertedExtraKey('hidden'));
    this.props.has(getConvertedExtraKey('title')) || this.props.add('', getConvertedExtraKey('title'));
    this.props.has(getConvertedExtraKey('isLocked')) || this.props.add(false, getConvertedExtraKey('isLocked'));
    this.props.has(getConvertedExtraKey('condition')) || this.props.add(true, getConvertedExtraKey('condition'));
    this.props.has(getConvertedExtraKey('conditionGroup')) || this.props.add('', getConvertedExtraKey('conditionGroup'));
    this.props.has(getConvertedExtraKey('loop')) || this.props.add(undefined, getConvertedExtraKey('loop'));
  }

  @action
  private initProps(props: any): any {
    return this.document.designer.transformProps(props, this, TransformStage.Init);
  }

  @action
  private upgradeProps(props: any): any {
    return this.document.designer.transformProps(props, this, TransformStage.Upgrade);
  }

  private autoruns?: Array<() => void>;

  private setupAutoruns() {
    const autoruns = this.componentMeta.getMetadata().configure.advanced?.autoruns;
    if (!autoruns || autoruns.length < 1) {
      return;
    }
    this.autoruns = autoruns.map((item) => {
      return autorun(() => {
        item.autorun(this.props.get(item.name, true) as any);
      });
    });
  }

  private initialChildren(children: any): NodeData[] {
    // FIXME! this is dirty code
    if (children == null) {
      const initialChildren = this.componentMeta.getMetadata().configure.advanced?.initialChildren;
      if (initialChildren) {
        if (typeof initialChildren === 'function') {
          return initialChildren(this as any) || [];
        }
        return initialChildren;
      }
    }
    return children || [];
  }

  private _isRGLContainer = false;

  set isRGLContainer(status: boolean) {
    this._isRGLContainer = status;
  }

  get isRGLContainer(): boolean {
    return !!this._isRGLContainer;
  }

  isContainer(): boolean {
    return this.isParental() && this.componentMeta.isContainer;
  }

  isModal(): boolean {
    return this.componentMeta.isModal;
  }

  isRoot(): boolean {
    return this.document.rootNode === (this as any);
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

  private didDropIn(dragment: Node) {
    const callbacks = this.componentMeta.getMetadata().configure.advanced?.callbacks;
    if (callbacks?.onNodeAdd) {
      const cbThis = this.internalToShellNode();
      callbacks?.onNodeAdd.call(cbThis, dragment.internalToShellNode(), cbThis);
    }
    if (this._parent) {
      this._parent.didDropIn(dragment);
    }
  }

  private didDropOut(dragment: Node) {
    const callbacks = this.componentMeta.getMetadata().configure.advanced?.callbacks;
    if (callbacks?.onNodeRemove) {
      const cbThis = this.internalToShellNode();
      callbacks?.onNodeRemove.call(cbThis, dragment.internalToShellNode(), cbThis);
    }
    if (this._parent) {
      this._parent.didDropOut(dragment);
    }
  }

  /**
   * 内部方法，请勿使用
   * @param useMutator 是否触发联动逻辑
   */
  internalSetParent(parent: ParentalNode | null, useMutator = false) {
    if (this._parent === parent) {
      return;
    }

    // 解除老的父子关系，但不需要真的删除节点
    if (this._parent) {
      if (this.isSlot()) {
        this._parent.unlinkSlot(this);
      } else {
        this._parent.children.unlinkChild(this);
      }
    }
    if (useMutator) {
      this._parent?.didDropOut(this);
    }
    if (parent) {
      // 建立新的父子关系，尤其注意：对于 parent 为 null 的场景，不会赋值，因为 subtreeModified 等事件可能需要知道该 node 被删除前的父子关系
      this._parent = parent;
      this.document.removeWillPurge(this);
      /* istanbul ignore next */
      if (!this.conditionGroup) {
        // initial conditionGroup
        const grp = this.getExtraProp('conditionGroup', false)?.getAsString();
        if (grp) {
          this.setConditionGroup(grp);
        }
      }

      if (useMutator) {
        parent.didDropIn(this);
      }
    }
  }

  private _slotFor?: Prop | null = null;

  internalSetSlotFor(slotFor: Prop | null | undefined) {
    this._slotFor = slotFor;
  }

  internalToShellNode(): ShellNode | null {
    return ShellNode.create(this);
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
  remove(
    useMutator = true,
    purge = true,
    options: NodeRemoveOptions = { suppressRemoveEvent: false },
  ) {
    if (this.parent) {
      if (!options.suppressRemoveEvent) {
        this.document.designer.editor?.emit('node.remove.topLevel', {
          node: this,
          index: this.parent?.children?.indexOf(this),
        });
      }
      if (this.isSlot()) {
        this.parent.removeSlot(this, purge);
        this.parent.children.delete(this, purge, useMutator, { suppressRemoveEvent: true });
      } else {
        this.parent.children.delete(this, purge, useMutator, { suppressRemoveEvent: true });
      }
    }
  }

  /**
   * 锁住当前节点
   */
  lock(flag = true) {
    this.setExtraProp('isLocked', flag);
  }

  /**
   * 获取当前节点的锁定状态
   */
  get isLocked(): boolean {
    return !!this.getExtraProp('isLocked')?.getValue();
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

  @obx.shallow _slots: Node[] = [];

  hasSlots() {
    return this._slots.length > 0;
  }

  get slots() {
    return this._slots;
  }

  /* istanbul ignore next */
  @obx.ref private _conditionGroup: ExclusiveGroup | null = null;

  /* istanbul ignore next */
  get conditionGroup(): ExclusiveGroup | null {
    return this._conditionGroup;
  }

  /* istanbul ignore next */
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

  /* istanbul ignore next */
  isConditionalVisible(): boolean | undefined {
    return this._conditionGroup?.isVisible(this);
  }

  /* istanbul ignore next */
  setConditionalVisible() {
    this._conditionGroup?.setVisible(this);
  }

  hasCondition() {
    const v = this.getExtraProp('condition', false)?.getValue();
    return v != null && v !== '' && v !== true;
  }

  /**
   * has loop when 1. loop is validArray with length > 1 ; OR  2. loop is variable object
   * @return boolean, has loop config or not
   */
  hasLoop() {
    const value = this.getExtraProp('loop', false)?.getValue();
    if (value === undefined || value === null) {
      return false;
    }

    if (Array.isArray(value)) {
      return true;
    }
    if (isJSExpression(value)) {
      return true;
    }
    return false;
  }

  /* istanbul ignore next */
  wrapWith(schema: Schema) {
    const wrappedNode = this.replaceWith({ ...schema, children: [this.export()] });
    return wrappedNode.children!.get(0);
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

      this.insertBefore(newNode, node, false);
      node.remove(false);

      if (selected) {
        this.document.selection.select(newNode.id);
      }
      return newNode;
    }
    return node;
  }

  setVisible(flag: boolean): void {
    this.getExtraProp('hidden')?.setValue(!flag);
    this.emitter.emit('visibleChange', flag);
  }

  getVisible(): boolean {
    return !this.getExtraProp('hidden')?.getValue();
  }

  onVisibleChange(func: (flag: boolean) => any): () => void {
    const wrappedFunc = wrapWithEventSwitch(func);
    this.emitter.on('visibleChange', wrappedFunc);
    return () => {
      this.emitter.removeListener('visibleChange', wrappedFunc);
    };
  }

  getProp(path: string, createIfNone = true): Prop | null {
    return this.props.query(path, createIfNone) || null;
  }

  getExtraProp(key: string, createIfNone = true): Prop | null {
    return this.props.get(getConvertedExtraKey(key), createIfNone) || null;
  }

  setExtraProp(key: string, value: CompositeValue) {
    this.getProp(getConvertedExtraKey(key), true)?.setValue(value);
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
  setProps(props?: PropsMap | PropsList | Props | null) {
    if (props instanceof Props) {
      this.props = props;
      return;
    }
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
    const { index } = this;
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
    const { index } = this;
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
    runInAction(() => this.import(data));
  }

  import(data: Schema, checkId = false) {
    const { componentName, id, children, props, ...extras } = data;
    if (this.isSlot()) {
      foreachReverse(
        this.children!,
        (subNode: Node) => {
          subNode.remove(true, true);
        },
        (iterable, idx) => (iterable as NodeChildren).get(idx),
      );
    }
    if (this.isParental()) {
      this.props.import(props, extras);
      (this._children as NodeChildren).import(children, checkId);
    } else {
      this.props
        .get('children', true)!
        .setValue(isDOMText(children) || isJSExpression(children) ? children : '');
    }
  }

  toData() {
    return this.export();
  }

  /**
   * 导出 schema
   */
  export(stage: TransformStage = TransformStage.Save, options: any = {}): Schema {
    stage = compatStage(stage);
    const baseSchema: any = {
      componentName: this.componentName,
    };

    if (stage !== TransformStage.Clone) {
      baseSchema.id = this.id;
    }
    if (stage === TransformStage.Render) {
      baseSchema.docId = this.document.id;
    }

    if (this.isLeaf()) {
      if (!options.bypassChildren) {
        baseSchema.children = this.props.get('children')?.export(stage);
      }
      return baseSchema;
    }

    const { props = {}, extras } = this.props.export(stage) || {};
    const _extras_: { [key: string]: any } = {
      ...extras,
    };
    /* istanbul ignore next */
    Object.keys(this._addons).forEach((key) => {
      const addon = this._addons[key];
      if (addon) {
        if (addon.isProp) {
          (props as any)[getConvertedExtraKey(key)] = addon.exportData();
        } else {
          _extras_[key] = addon.exportData();
        }
      }
    });

    const schema: any = {
      ...baseSchema,
      props: this.document.designer.transformProps(props, this, stage),
      ...this.document.designer.transformProps(_extras_, this, stage),
    };

    if (this.isParental() && this.children.size > 0 && !options.bypassChildren) {
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

  unlinkSlot(slotNode: Node) {
    const i = this._slots.indexOf(slotNode);
    if (i < 0) {
      return false;
    }
    this._slots.splice(i, 1);
  }

  /**
   * 删除一个Slot节点
   */
  removeSlot(slotNode: Node, purge = false): boolean {
    // if (purge) {
    //   // should set parent null
    //   slotNode?.internalSetParent(null, false);
    //   slotNode?.purge();
    // }
    // this.document.unlinkNode(slotNode);
    // this.document.selection.remove(slotNode.id);
    const i = this._slots.indexOf(slotNode);
    if (i < 0) {
      return false;
    }
    this._slots.splice(i, 1);
    return false;
  }

  addSlot(slotNode: Node) {
    const slotName = slotNode?.getExtraProp('name')?.getAsString();
    // 一个组件下的所有 slot，相同 slotName 的 slot 应该是唯一的
    if (includeSlot(this, slotName)) {
      removeSlot(this, slotName);
    }
    slotNode.internalSetParent(this as ParentalNode, true);
    this._slots.push(slotNode);
  }

  /**
   * 当前node对应组件是否已注册可用
   */
  isValidComponent() {
    const allComponents = this.document?.designer?.componentsMap;
    if (allComponents && allComponents[this.componentName]) {
      return true;
    }
    return false;
  }

  /**
   * 删除一个节点
   * @param node
   */
  removeChild(node: Node) {
    this.children?.delete(node);
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
    this.purged = true;
    this.autoruns?.forEach((dispose) => dispose());
    this.props.purge();
    this.settingEntry?.purge();
    // this.document.destroyNode(this);
  }

  private purging: boolean = false;
  internalPurgeStart() {
    this.purging = true;
  }

  /**
   * 是否正在销毁
   */
  get isPurging() {
    return this.purging;
  }

  /**
   * 是否可执行某action
   */
  canPerformAction(actionName: string): boolean {
    const availableActions =
      this.componentMeta?.availableActions?.filter((action: ComponentAction) => {
        const { condition } = action;
        return typeof condition === 'function' ?
          condition(this) !== false :
          condition !== false;
      })
      .map((action: ComponentAction) => action.name) || [];

    return availableActions.indexOf(actionName) >= 0;
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

  insert(node: Node, ref?: Node, useMutator = true) {
    this.insertAfter(node, ref, useMutator);
  }

  insertBefore(node: Node, ref?: Node, useMutator = true) {
    const nodeInstance = ensureNode(node, this.document);
    this.children?.insert(nodeInstance, ref ? ref.index : null, useMutator);
  }

  insertAfter(node: any, ref?: Node, useMutator = true) {
    const nodeInstance = ensureNode(node, this.document);
    this.children?.insert(nodeInstance, ref ? ref.index + 1 : null, useMutator);
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

  onChildrenChange(fn: (param?: { type: string; node: Node }) => void): (() => void) | undefined {
    const wrappedFunc = wrapWithEventSwitch(fn);
    return this.children?.onChange(wrappedFunc);
  }

  mergeChildren(
    remover: () => any,
    adder: (children: Node[]) => NodeData[] | null,
    sorter: () => any,
  ) {
    this.children?.mergeChildren(remover, adder, sorter);
  }

  @obx.shallow status: NodeStatus = {
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
   * 获取磁贴相关信息
   */
  getRGL() {
    const isContainerNode = this.isContainer();
    const isEmptyNode = this.isEmpty();
    const isRGLContainerNode = this.isRGLContainer;
    const isRGLNode = this.getParent()?.isRGLContainer;
    const isRGL = isRGLContainerNode || (isRGLNode && (!isContainerNode || !isEmptyNode));
    let rglNode = isRGLContainerNode ? this : isRGL ? this?.getParent() : {};
    return { isContainerNode, isEmptyNode, isRGLContainerNode, isRGLNode, isRGL, rglNode };
  }

  /**
   * @deprecated
   */
  getSuitablePlace(node: Node, ref: any): any {
    const focusNode = this.document?.focusNode;
    // 如果节点是模态框，插入到根节点下
    if (node?.componentMeta?.isModal) {
      return { container: focusNode, ref };
    }

    if (!ref && this.contains(focusNode)) {
      const rootCanDropIn = focusNode.componentMeta?.prototype?.options?.canDropIn;
      if (
        rootCanDropIn === undefined ||
        rootCanDropIn === true ||
        (typeof rootCanDropIn === 'function' && rootCanDropIn(node))
      ) {
        return { container: focusNode };
      }

      return null;
    }

    if (this.isRoot() && this.children) {
      const dropElement = this.children.filter((c) => {
        if (!c.isContainer()) {
          return false;
        }
        const canDropIn = c.componentMeta?.prototype?.options?.canDropIn;
        if (
          canDropIn === undefined ||
          canDropIn === true ||
          (typeof canDropIn === 'function' && canDropIn(node))
        ) {
          return true;
        }
        return false;
      })[0];

      if (dropElement) {
        return { container: dropElement, ref };
      }

      const rootCanDropIn = this.componentMeta?.prototype?.options?.canDropIn;
      if (
        rootCanDropIn === undefined ||
        rootCanDropIn === true ||
        (typeof rootCanDropIn === 'function' && rootCanDropIn(node))
      ) {
        return { container: this, ref };
      }

      return null;
    }

    const canDropIn = this.componentMeta?.prototype?.options?.canDropIn;
    if (this.isContainer()) {
      if (
        canDropIn === undefined ||
        (typeof canDropIn === 'boolean' && canDropIn) ||
        (typeof canDropIn === 'function' && canDropIn(node))
      ) {
        return { container: this, ref };
      }
    }

    if (this.parent) {
      return this.parent.getSuitablePlace(node, { index: this.index });
    }

    return null;
  }

  /**
   * @deprecated
   */
  getAddonData(key: string) {
    const addon = this._addons[key];
    if (addon) {
      return addon.exportData();
    }
    return this.getExtraProp(key)?.getValue();
  }

  /**
   * @deprecated
   */
  registerAddon(key: string, exportData: () => any, isProp = false) {
    this._addons[key] = { exportData, isProp };
  }

  getRect(): DOMRect | null {
    if (this.isRoot()) {
      return this.document.simulator?.viewport.contentBounds || null;
    }
    return this.document.simulator?.computeRect(this) || null;
  }

  /**
   * @deprecated
   */
  getPrototype() {
    return this.componentMeta.prototype;
  }

  /**
   * @deprecated
   */
  setPrototype(proto: any) {
    this.componentMeta.prototype = proto;
  }

  getIcon() {
    return this.icon;
  }

  toString() {
    return this.id;
  }

  emitPropChange(val: PropChangeOptions) {
    this.emitter?.emit('propChange', val);
  }

  onPropChange(func: (info: PropChangeOptions) => void): Function {
    const wrappedFunc = wrapWithEventSwitch(func);
    this.emitter.on('propChange', wrappedFunc);
    return () => {
      this.emitter.removeListener('propChange', wrappedFunc);
    };
  }
}

function ensureNode(node: any, document: DocumentModel): Node {
  let nodeInstance = node;
  if (!isNode(node)) {
    if (node.getComponentName) {
      nodeInstance = document.createNode({
        componentName: node.getComponentName(),
      });
    } else {
      nodeInstance = document.createNode(node);
    }
  }
  return nodeInstance;
}

export interface ParentalNode<T extends NodeSchema = NodeSchema> extends Node<T> {
  readonly children: NodeChildren;
}
export interface LeafNode extends Node {
  readonly children: null;
}

export type PropChangeOptions = Omit<GlobalEvent.Node.Prop.ChangeOptions, 'node'>;

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

export function isLowCodeComponent(node: Node): boolean {
  return node.componentMeta?.getMetadata().devMode === 'lowCode';
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

/**
 * 测试两个节点是否为包含关系
 * @param node1 测试的父节点
 * @param node2 测试的被包含节点
 * @returns 是否包含
 */
export function contains(node1: Node, node2: Node): boolean {
  if (node1 === node2) {
    return true;
  }

  if (!node1.isParental() || !node2.parent) {
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

export function insertChild(
  container: ParentalNode,
  thing: Node | NodeData,
  at?: number | null,
  copy?: boolean,
): Node {
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
  // eslint-disable-next-line no-cond-assign
  while ((node = nodes.pop())) {
    node = insertChild(container, node, index, copy);
    results.push(node);
    index = node.index;
  }
  return results;
}
