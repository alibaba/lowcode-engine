import {
  DocumentModel as InnerDocumentModel,
  Node as InnerNode,
  getConvertedExtraKey,
} from '@alilc/lowcode-designer';
import { CompositeValue, NodeSchema, TransformStage } from '@alilc/lowcode-types';
import Prop from './prop';
import Props from './props';
import DocumentModel from './document-model';
import NodeChildren from './node-children';
import ComponentMeta from './component-meta';
import SettingTopEntry from './setting-top-entry';
import { documentSymbol, nodeSymbol } from './symbols';

const shellNodeSymbol = Symbol('shellNodeSymbol');

export default class Node {
  private readonly [documentSymbol]: InnerDocumentModel;
  private readonly [nodeSymbol]: InnerNode;

  private _id: string;

  constructor(node: InnerNode) {
    this[nodeSymbol] = node;
    this[documentSymbol] = node.document;

    this._id = this[nodeSymbol].id;
  }

  static create(node: InnerNode | null | undefined) {
    if (!node) return null;
    // @ts-ignore 直接返回已挂载的 shell node 实例
    if (node[shellNodeSymbol]) return node[shellNodeSymbol];
    const shellNode = new Node(node);
    // @ts-ignore 挂载 shell node 实例
    node[shellNodeSymbol] = shellNode;
    return shellNode;
  }

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
  get title() {
    return this[nodeSymbol].title;
  }

  /**
   * 是否为「容器型」节点
   */
  get isContainer() {
    return this[nodeSymbol].isContainer();
  }

  /**
   * 是否为根节点
   */
  get isRoot() {
    return this[nodeSymbol].isRoot();
  }

  /**
   * 是否为空节点（无 children 或者 children 为空）
   */
  get isEmpty() {
    return this[nodeSymbol].isEmpty();
  }

  /**
   * 是否为 Page 节点
   */
  get isPage() {
    return this[nodeSymbol].isPage();
  }

  /**
   * 是否为 Component 节点
   */
  get isComponent() {
    return this[nodeSymbol].isComponent();
  }

  /**
   * 是否为「模态框」节点
   */
  get isModal() {
    return this[nodeSymbol].isModal();
  }

  /**
   * 是否为插槽节点
   */
  get isSlot() {
    return this[nodeSymbol].isSlot();
  }

  /**
   * 是否为父类/分支节点
   */
  get isParental() {
    return this[nodeSymbol].isParental();
  }

  /**
   * 是否为叶子节点
   */
  get isLeaf() {
    return this[nodeSymbol].isLeaf();
  }

  /**
   * judge if it is a node or not
   */
  get isNode() {
    return true;
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
  get icon() {
    return this[nodeSymbol].icon;
  }

  /**
   * 节点所在树的层级深度，根节点深度为 0
   */
  get zLevel() {
    return this[nodeSymbol].zLevel;
  }

  /**
   * 节点 componentName
   */
  get componentName() {
    return this[nodeSymbol].componentName;
  }

  /**
   * 节点的物料元数据
   */
  get componentMeta() {
    return ComponentMeta.create(this[nodeSymbol].componentMeta);
  }

  /**
   * 获取节点所属的文档模型对象
   * @returns
   */
  get document() {
    return DocumentModel.create(this[documentSymbol]);
  }

  /**
   * 获取当前节点的前一个兄弟节点
   * @returns
   */
  get prevSibling(): Node | null {
    return Node.create(this[nodeSymbol].prevSibling);
  }

  /**
   * 获取当前节点的后一个兄弟节点
   * @returns
   */
  get nextSibling(): Node | null {
    return Node.create(this[nodeSymbol].nextSibling);
  }

  /**
   * 获取当前节点的父亲节点
   * @returns
   */
  get parent(): Node | null {
    return Node.create(this[nodeSymbol].parent);
  }

  /**
   * 获取当前节点的孩子节点模型
   * @returns
   */
  get children() {
    return NodeChildren.create(this[nodeSymbol].children);
  }

  /**
   * 节点上挂载的插槽节点们
   */
  get slots(): Node[] {
    return this[nodeSymbol].slots.map((node: InnerNode) => Node.create(node)!);
  }

  /**
   * 当前节点为插槽节点时，返回节点对应的属性实例
   */
  get slotFor() {
    return Prop.create(this[nodeSymbol].slotFor);
  }

  /**
   * 返回节点的属性集
   */
  get props() {
    return Props.create(this[nodeSymbol].props);
  }

  /**
   * 返回节点的属性集
   */
  get propsData() {
    return this[nodeSymbol].propsData;
  }

  /**
   * 获取符合搭建协议-节点 schema 结构
   */
  get schema(): any {
    return this[nodeSymbol].schema;
  }

  get settingEntry(): any {
    return SettingTopEntry.create(this[nodeSymbol].settingEntry as any);
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
    return this[nodeSymbol].getDOMNode();
  }

  /**
   * 执行新增、删除、排序等操作
   * @param remover
   * @param adder
   * @param sorter
   */
  mergeChildren(
    remover: (node: Node, idx: number) => boolean,
    adder: (children: Node[]) => any,
    sorter: (firstNode: Node, secondNode: Node) => number,
  ) {
    return this.children?.mergeChildren(remover, adder, sorter);
  }

  /**
   * 返回节点的尺寸、位置信息
   * @returns
   */
  getRect() {
    return this[nodeSymbol].getRect();
  }

  /**
   * 是否有挂载插槽节点
   * @returns
   */
  hasSlots() {
    return this[nodeSymbol].hasSlots();
  }

  /**
   * 是否设定了渲染条件
   * @returns
   */
  hasCondition() {
    return this[nodeSymbol].hasCondition();
  }

  /**
   * 是否设定了循环数据
   * @returns
   */
  hasLoop() {
    return this[nodeSymbol].hasLoop();
  }

  getVisible() {
    return this[nodeSymbol].getVisible();
  }

  isConditionalVisible() {
    return this[nodeSymbol].isConditionalVisible();
  }

  /**
   * @deprecated use .props instead
   */
  getProps() {
    return this.props;
  }

  contains(node: Node) {
    return this[nodeSymbol].contains(node[nodeSymbol]);
  }

  /**
   * 获取指定 path 的属性模型实例
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   * @returns
   */
  getProp(path: string): Prop | null {
    return Prop.create(this[nodeSymbol].getProp(path));
  }

  /**
   * 获取指定 path 的属性模型实例值
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   * @returns
   */
  getPropValue(path: string) {
    return this.getProp(path)?.getValue();
  }

  /**
   * 获取指定 path 的属性模型实例，
   *  注：导出时，不同于普通属性，该属性并不挂载在 props 之下，而是与 props 同级
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   * @returns
   */
  getExtraProp(path: string): Prop | null {
    return Prop.create(this[nodeSymbol].getProp(getConvertedExtraKey(path)));
  }

  /**
   * 获取指定 path 的属性模型实例，
   *  注：导出时，不同于普通属性，该属性并不挂载在 props 之下，而是与 props 同级
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   * @returns
   */
  getExtraPropValue(path: string) {
    return this.getExtraProp(path)?.getValue();
  }

  /**
   * 设置指定 path 的属性模型实例值
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   * @param value 值
   * @returns
   */
  setPropValue(path: string, value: CompositeValue) {
    return this.getProp(path)?.setValue(value);
  }

  /**
   * 设置指定 path 的属性模型实例值
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   * @param value 值
   * @returns
   */
  setExtraPropValue(path: string, value: CompositeValue) {
    return this.getExtraProp(path)?.setValue(value);
  }

  /**
   * 导入节点数据
   * @param data
   */
  importSchema(data: NodeSchema) {
    this[nodeSymbol].import(data);
  }

  /**
   * 导出节点数据
   * @param stage
   * @param options
   * @returns
   */
  exportSchema(stage: TransformStage = TransformStage.Render, options?: any) {
    return this[nodeSymbol].export(stage, options);
  }

  /**
   * 在指定位置之前插入一个节点
   * @param node
   * @param ref
   * @param useMutator
   */
  insertBefore(node: Node, ref?: Node | undefined, useMutator?: boolean) {
    this[nodeSymbol].insertBefore(node[nodeSymbol] || node, ref?.[nodeSymbol], useMutator);
  }

  /**
   * 在指定位置之后插入一个节点
   * @param node
   * @param ref
   * @param useMutator
   */
  insertAfter(node: Node, ref?: Node | undefined, useMutator?: boolean) {
    this[nodeSymbol].insertAfter(node[nodeSymbol] || node, ref?.[nodeSymbol], useMutator);
  }

  /**
   * 替换指定节点
   * @param node 待替换的子节点
   * @param data 用作替换的节点对象或者节点描述
   * @returns
   */
  replaceChild(node: Node, data: any) {
    return Node.create(this[nodeSymbol].replaceChild(node[nodeSymbol], data));
  }

  /**
   * 将当前节点替换成指定节点描述
   * @param schema
   */
  replaceWith(schema: NodeSchema) {
    this[nodeSymbol].replaceWith(schema);
  }

  /**
   * 选中当前节点实例
   */
  select() {
    this[nodeSymbol].select();
  }

  /**
   * 设置悬停态
   * @param flag
   */
  hover(flag = true) {
    this[nodeSymbol].hover(flag);
  }

  /**
   * 删除当前节点实例
   */
  remove() {
    this[nodeSymbol].remove();
  }
}
