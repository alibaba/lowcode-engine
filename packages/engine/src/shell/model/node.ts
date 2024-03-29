import {
  IDocumentModel as InnerDocumentModel,
  INode as InnerNode,
} from '@alilc/lowcode-designer';
import {
  IPublicTypeCompositeValue,
  IPublicTypeNodeSchema,
  IPublicEnumTransformStage,
  IPublicModelNode,
  IPublicTypeIconType,
  IPublicTypeI18nData,
  IPublicModelComponentMeta,
  IPublicModelDocumentModel,
  IPublicModelNodeChildren,
  IPublicModelProp,
  IPublicModelProps,
  IPublicTypePropsMap,
  IPublicTypePropsList,
  IPublicModelSettingTopEntry,
  IPublicModelExclusiveGroup,
} from '@alilc/lowcode-types';
import { Prop as ShellProp } from './prop';
import { Props as ShellProps } from './props';
import { DocumentModel as ShellDocumentModel } from './document-model';
import { NodeChildren as ShellNodeChildren } from './node-children';
import { ComponentMeta as ShellComponentMeta } from './component-meta';
import { SettingTopEntry as ShellSettingTopEntry } from './setting-top-entry';
import { documentSymbol, nodeSymbol } from '../symbols';
import { ReactElement } from 'react';
import { ConditionGroup } from './condition-group';

const shellNodeSymbol = Symbol('shellNodeSymbol');

function isShellNode(node: any): node is IPublicModelNode {
  return node[shellNodeSymbol];
}

export class Node implements IPublicModelNode {
  private readonly [documentSymbol]: InnerDocumentModel | null;
  private readonly [nodeSymbol]: InnerNode;

  private _id: string;

  /**
   * 节点 id
   */
  get id() {
    return this._id;
  }

  /**
   * set id
   */
  set id(id: string) {
    this._id = id;
  }

  /**
   * 节点标题
   */
  get title(): string | IPublicTypeI18nData | ReactElement {
    return this[nodeSymbol].title;
  }

  /**
   * @deprecated
   * 是否为「容器型」节点
   */
  get isContainer(): boolean {
    return this[nodeSymbol].isContainerNode;
  }

  /**
   * 是否为「容器型」节点
   */
  get isContainerNode(): boolean {
    return this[nodeSymbol].isContainerNode;
  }

  /**
   * @deprecated
   * 是否为根节点
   */
  get isRoot(): boolean {
    return this[nodeSymbol].isRootNode;
  }

  /**
   * 是否为根节点
   */
  get isRootNode(): boolean {
    return this[nodeSymbol].isRootNode;
  }

  /**
   * @deprecated
   * 是否为空节点（无 children 或者 children 为空）
   */
  get isEmpty(): boolean {
    return this[nodeSymbol].isEmptyNode;
  }

  /**
   * 是否为空节点（无 children 或者 children 为空）
   */
  get isEmptyNode(): boolean {
    return this[nodeSymbol].isEmptyNode;
  }

  /**
   * @deprecated
   * 是否为 Page 节点
   */
  get isPage(): boolean {
    return this[nodeSymbol].isPageNode;
  }

  /**
   * 是否为 Page 节点
   */
  get isPageNode(): boolean {
    return this[nodeSymbol].isPageNode;
  }

  /**
   * @deprecated
   * 是否为 Component 节点
   */
  get isComponent(): boolean {
    return this[nodeSymbol].isComponentNode;
  }

  /**
   * 是否为 Component 节点
   */
  get isComponentNode(): boolean {
    return this[nodeSymbol].isComponentNode;
  }

  /**
   * @deprecated
   * 是否为「模态框」节点
   */
  get isModal(): boolean {
    return this[nodeSymbol].isModalNode;
  }

  /**
   * 是否为「模态框」节点
   */
  get isModalNode(): boolean {
    return this[nodeSymbol].isModalNode;
  }

  /**
   * @deprecated
   * 是否为插槽节点
   */
  get isSlot(): boolean {
    return this[nodeSymbol].isSlotNode;
  }

  /**
   * 是否为插槽节点
   */
  get isSlotNode(): boolean {
    return this[nodeSymbol].isSlotNode;
  }

  /**
   * @deprecated
   * 是否为父类/分支节点
   */
  get isParental(): boolean {
    return this[nodeSymbol].isParentalNode;
  }

  /**
   * 是否为父类/分支节点
   */
  get isParentalNode(): boolean {
    return this[nodeSymbol].isParentalNode;
  }

  /**
   * @deprecated
   * 是否为叶子节点
   */
  get isLeaf(): boolean {
    return this[nodeSymbol].isLeafNode;
  }

  /**
   * 是否为叶子节点
   */
  get isLeafNode(): boolean {
    return this[nodeSymbol].isLeafNode;
  }

  /**
   * judge if it is a node or not
   */
  readonly isNode = true;

  /**
   * 获取当前节点的锁定状态
   */
  get isLocked(): boolean {
    return this[nodeSymbol].isLocked;
  }

  /**
   * 下标
   */
  get index() {
    return this[nodeSymbol].index;
  }

  /**
   * 图标
   */
  get icon(): IPublicTypeIconType {
    return this[nodeSymbol].icon;
  }

  /**
   * 节点所在树的层级深度，根节点深度为 0
   */
  get zLevel(): number {
    return this[nodeSymbol].zLevel;
  }

  /**
   * 节点 componentName
   */
  get componentName(): string {
    return this[nodeSymbol].componentName;
  }

  /**
   * 节点的物料元数据
   */
  get componentMeta(): IPublicModelComponentMeta | null {
    return ShellComponentMeta.create(this[nodeSymbol].componentMeta);
  }

  /**
   * 获取节点所属的文档模型对象
   * @returns
   */
  get document(): IPublicModelDocumentModel | null {
    return ShellDocumentModel.create(this[documentSymbol]);
  }

  /**
   * 获取当前节点的前一个兄弟节点
   * @returns
   */
  get prevSibling(): IPublicModelNode | null {
    return Node.create(this[nodeSymbol].prevSibling);
  }

  /**
   * 获取当前节点的后一个兄弟节点
   * @returns
   */
  get nextSibling(): IPublicModelNode | null {
    return Node.create(this[nodeSymbol].nextSibling);
  }

  /**
   * 获取当前节点的父亲节点
   * @returns
   */
  get parent(): IPublicModelNode | null {
    return Node.create(this[nodeSymbol].parent);
  }

  /**
   * 获取当前节点的孩子节点模型
   * @returns
   */
  get children(): IPublicModelNodeChildren | null {
    return ShellNodeChildren.create(this[nodeSymbol].children);
  }

  /**
   * 节点上挂载的插槽节点们
   */
  get slots(): IPublicModelNode[] {
    return this[nodeSymbol].slots.map((node: InnerNode) => Node.create(node)!);
  }

  /**
   * 当前节点为插槽节点时，返回节点对应的属性实例
   */
  get slotFor(): IPublicModelProp | null | undefined {
    return ShellProp.create(this[nodeSymbol].slotFor);
  }

  /**
   * 返回节点的属性集
   */
  get props(): IPublicModelProps | null {
    return ShellProps.create(this[nodeSymbol].props);
  }

  /**
   * 返回节点的属性集
   */
  get propsData(): IPublicTypePropsMap | IPublicTypePropsList | null {
    return this[nodeSymbol].propsData;
  }

  /**
   * 获取符合搭建协议 - 节点 schema 结构
   */
  get schema(): IPublicTypeNodeSchema {
    return this[nodeSymbol].schema;
  }

  get settingEntry(): IPublicModelSettingTopEntry {
    return ShellSettingTopEntry.create(this[nodeSymbol].settingEntry as any);
  }

  constructor(node: InnerNode) {
    this[nodeSymbol] = node;
    this[documentSymbol] = node.document;

    this._id = this[nodeSymbol].id;
  }

  static create(node: InnerNode | IPublicModelNode | null | undefined): IPublicModelNode | null {
    if (!node) {
      return null;
    }
    // @ts-ignore 直接返回已挂载的 shell node 实例
    if (isShellNode(node)) {
      return (node as any)[shellNodeSymbol];
    }
    const shellNode = new Node(node);
    // @ts-ignore 挂载 shell node 实例
    // eslint-disable-next-line no-param-reassign
    node[shellNodeSymbol] = shellNode;
    return shellNode;
  }

  /**
   * @deprecated use .children instead
   */
  getChildren() {
    return this.children;
  }

  /**
   * 获取节点实例对应的 dom 节点
   */
  getDOMNode() {
    return (this[nodeSymbol] as any).getDOMNode();
  }

  /**
   * 执行新增、删除、排序等操作
   * @param remover
   * @param adder
   * @param sorter
   */
  mergeChildren(
    remover: (node: IPublicModelNode, idx: number) => boolean,
    adder: (children: IPublicModelNode[]) => any,
    sorter: (firstNode: IPublicModelNode, secondNode: IPublicModelNode) => number,
  ): any {
    return this.children?.mergeChildren(remover, adder, sorter);
  }

  /**
   * 返回节点的尺寸、位置信息
   * @returns
   */
  getRect(): DOMRect | null {
    return this[nodeSymbol].getRect();
  }

  /**
   * 是否有挂载插槽节点
   * @returns
   */
  hasSlots(): boolean {
    return this[nodeSymbol].hasSlots();
  }

  /**
   * 是否设定了渲染条件
   * @returns
   */
  hasCondition(): boolean {
    return this[nodeSymbol].hasCondition();
  }

  /**
   * 是否设定了循环数据
   * @returns
   */
  hasLoop(): boolean {
    return this[nodeSymbol].hasLoop();
  }

  get visible(): boolean {
    return this[nodeSymbol].getVisible();
  }

  set visible(value: boolean) {
    this[nodeSymbol].setVisible(value);
  }

  getVisible(): boolean {
    return this[nodeSymbol].getVisible();
  }

  setVisible(flag: boolean): void {
    this[nodeSymbol].setVisible(flag);
  }

  isConditionalVisible(): boolean | undefined {
    return this[nodeSymbol].isConditionalVisible();
  }

  /**
   * 设置节点锁定状态
   * @param flag
   */
  lock(flag?: boolean): void {
    this[nodeSymbol].lock(flag);
  }

  /**
   * @deprecated use .props instead
   */
  getProps() {
    return this.props;
  }

  contains(node: IPublicModelNode): boolean {
    return this[nodeSymbol].contains((node as any)[nodeSymbol]);
  }

  /**
   * 获取指定 path 的属性模型实例
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   * @returns
   */
  getProp(path: string, createIfNone = true): IPublicModelProp | null {
    return ShellProp.create(this[nodeSymbol].getProp(path, createIfNone));
  }

  /**
   * 获取指定 path 的属性模型实例值
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   * @returns
   */
  getPropValue(path: string) {
    return this.getProp(path, false)?.getValue();
  }

  /**
   * 获取指定 path 的属性模型实例，
   *  注：导出时，不同于普通属性，该属性并不挂载在 props 之下，而是与 props 同级
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   * @param createIfNone 当没有属性的时候，是否创建一个属性
   * @returns
   */
  getExtraProp(path: string, createIfNone?: boolean): IPublicModelProp | null {
    return ShellProp.create(this[nodeSymbol].getExtraProp(path, createIfNone));
  }

  /**
   * 获取指定 path 的属性模型实例，
   *  注：导出时，不同于普通属性，该属性并不挂载在 props 之下，而是与 props 同级
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   * @returns
   */
  getExtraPropValue(path: string): any {
    return this.getExtraProp(path)?.getValue();
  }

  /**
   * 设置指定 path 的属性模型实例值
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   * @param value 值
   * @returns
   */
  setPropValue(path: string, value: IPublicTypeCompositeValue): void {
    return this.getProp(path)?.setValue(value);
  }

  /**
   * 设置指定 path 的属性模型实例值
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   * @param value 值
   * @returns
   */
  setExtraPropValue(path: string, value: IPublicTypeCompositeValue): void {
    return this.getExtraProp(path)?.setValue(value);
  }

  /**
   * 导入节点数据
   * @param data
   */
  importSchema(data: IPublicTypeNodeSchema): void {
    this[nodeSymbol].import(data);
  }

  /**
   * 导出节点数据
   * @param stage
   * @param options
   * @returns
   */
  exportSchema(
      stage: IPublicEnumTransformStage = IPublicEnumTransformStage.Render,
      options?: any,
    ): IPublicTypeNodeSchema {
    return this[nodeSymbol].export(stage, options);
  }

  /**
   * 在指定位置之前插入一个节点
   * @param node
   * @param ref
   * @param useMutator
   */
  insertBefore(
      node: IPublicModelNode,
      ref?: IPublicModelNode | undefined,
      useMutator?: boolean,
    ): void {
    this[nodeSymbol].insertBefore(
        (node as any)[nodeSymbol] || node,
        (ref as any)?.[nodeSymbol],
        useMutator,
      );
  }

  /**
   * 在指定位置之后插入一个节点
   * @param node
   * @param ref
   * @param useMutator
   */
  insertAfter(
      node: IPublicModelNode,
      ref?: IPublicModelNode | undefined,
      useMutator?: boolean,
    ): void {
    this[nodeSymbol].insertAfter(
        (node as any)[nodeSymbol] || node,
        (ref as any)?.[nodeSymbol],
        useMutator,
      );
  }

  /**
   * 替换指定节点
   * @param node 待替换的子节点
   * @param data 用作替换的节点对象或者节点描述
   * @returns
   */
  replaceChild(node: IPublicModelNode, data: any): IPublicModelNode | null {
    return Node.create(this[nodeSymbol].replaceChild((node as any)[nodeSymbol], data));
  }

  /**
   * 将当前节点替换成指定节点描述
   * @param schema
   */
  replaceWith(schema: IPublicTypeNodeSchema): any {
    this[nodeSymbol].replaceWith(schema);
  }

  /**
   * 选中当前节点实例
   */
  select(): void {
    this[nodeSymbol].select();
  }

  /**
   * 设置悬停态
   * @param flag
   */
  hover(flag = true): void {
    this[nodeSymbol].hover(flag);
  }

  /**
   * 删除当前节点实例
   */
  remove(): void {
    this[nodeSymbol].remove();
  }

  /**
   * @deprecated
   * 设置为磁贴布局节点
   */
  set isRGLContainer(flag: boolean) {
    this[nodeSymbol].isRGLContainerNode = flag;
  }

  /**
   * @deprecated
   * 获取磁贴布局节点设置状态
   * @returns Boolean
   */
  get isRGLContainer() {
    return this[nodeSymbol].isRGLContainerNode;
  }

  /**
   * 设置为磁贴布局节点
   */
  set isRGLContainerNode(flag: boolean) {
    this[nodeSymbol].isRGLContainerNode = flag;
  }

  /**
   * 获取磁贴布局节点设置状态
   * @returns Boolean
   */
  get isRGLContainerNode() {
    return this[nodeSymbol].isRGLContainerNode;
  }

  internalToShellNode() {
    return this;
  }

  canPerformAction(actionName: string): boolean {
    return this[nodeSymbol].canPerformAction(actionName);
  }

  /**
   * get conditionGroup
   * @since v1.1.0
   */
  get conditionGroup(): IPublicModelExclusiveGroup | null {
    return ConditionGroup.create(this[nodeSymbol].conditionGroup);
  }

  /**
   * set value for conditionalVisible
   * @since v1.1.0
   */
  setConditionalVisible(): void {
    this[nodeSymbol].setConditionalVisible();
  }

  getRGL() {
    const {
      isContainerNode,
      isEmptyNode,
      isRGLContainerNode,
      isRGLNode,
      isRGL,
      rglNode,
    } = this[nodeSymbol].getRGL();

    return {
      isContainerNode,
      isEmptyNode,
      isRGLContainerNode,
      isRGLNode,
      isRGL,
      rglNode: Node.create(rglNode),
    };
  }
}
