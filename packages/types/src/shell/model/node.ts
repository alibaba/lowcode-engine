import { NodeSchema, PropsMap, PropsList } from '../../schema';
import { TransformStage } from '../../transform-stage';
import { IconType } from '../../icon';
import { ReactElement } from 'react';
import { I18nData } from '../../i18n';
import { CompositeValue } from '../../value-type';
import { IPublicModelDocumentModel } from './document-model';
import { IPublicModelSettingTopEntry } from './setting-top-entry';
import { IPublicModelProps } from './props';
import { IPublicModelProp } from './prop';
import { IPublicModelNodeChildren } from './node-children';
import { IPublicModelComponentMeta } from './component-meta';

export interface IPublicModelNode {
  /**
   * 节点 id
   */
  id: string;
  /**
   * 节点标题
   */
  get title(): string | I18nData | ReactElement;

  /**
   * 是否为「容器型」节点
   */
  get isContainer(): boolean;

  /**
   * 是否为根节点
   */
  get isRoot(): boolean;

  /**
   * 是否为空节点（无 children 或者 children 为空）
   */
  get isEmpty(): boolean;

  /**
   * 是否为 Page 节点
   */
  get isPage(): boolean;

  /**
   * 是否为 Component 节点
   */
  get isComponent(): boolean;

  /**
   * 是否为「模态框」节点
   */
  get isModal(): boolean;

  /**
   * 是否为插槽节点
   */
  get isSlot(): boolean;

  /**
   * 是否为父类/分支节点
   */
  get isParental(): boolean;

  /**
   * 是否为叶子节点
   */
  get isLeaf(): boolean;

  /**
   * 获取当前节点的锁定状态
   */
  get isLocked(): boolean;

  /**
   * 下标
   */
  get index(): number;

  /**
   * 图标
   */
  get icon(): IconType;

  /**
   * 节点所在树的层级深度，根节点深度为 0
   */
  get zLevel(): number;

  /**
   * 节点 componentName
   */
  get componentName(): string;

  /**
   * 节点的物料元数据
   */
  get componentMeta(): IPublicModelComponentMeta | null;

  /**
   * 获取节点所属的文档模型对象
   * @returns
   */
  get document(): IPublicModelDocumentModel | null;

  /**
   * 获取当前节点的前一个兄弟节点
   * @returns
   */
  get prevSibling(): IPublicModelNode | null;

  /**
   * 获取当前节点的后一个兄弟节点
   * @returns
   */
  get nextSibling(): IPublicModelNode | null;

  /**
   * 获取当前节点的父亲节点
   * @returns
   */
  get parent(): IPublicModelNode | null;
  /**
   * 获取当前节点的孩子节点模型
   * @returns
   */
  get children(): IPublicModelNodeChildren | null;

  /**
   * 节点上挂载的插槽节点们
   */
  get slots(): IPublicModelNode[];

  /**
   * 当前节点为插槽节点时，返回节点对应的属性实例
   */
  get slotFor(): IPublicModelProp | null;

  /**
   * 返回节点的属性集
   */
  get props(): IPublicModelProps | null;

  /**
   * 返回节点的属性集
   */
  get propsData(): PropsMap | PropsList | null;

  /**
   * 获取符合搭建协议 - 节点 schema 结构
   */
  get schema(): NodeSchema;

  get settingEntry(): IPublicModelSettingTopEntry;

  /**
   * 执行新增、删除、排序等操作
   * @param remover
   * @param adder
   * @param sorter
   */
  mergeChildren(
    remover: (node: IPublicModelNode, idx: number) => boolean,
    adder: (children: IPublicModelNode[]) => any,
    sorter: (firstNode: IPublicModelNode, secondNode: IPublicModelNode) => number
  ): any;

  /**
   * 返回节点的尺寸、位置信息
   * @returns
   */
  getRect(): DOMRect | null;

  /**
   * 是否有挂载插槽节点
   * @returns
   */
  hasSlots(): boolean;

  /**
   * 是否设定了渲染条件
   * @returns
   */
  hasCondition(): boolean;

  /**
   * 是否设定了循环数据
   * @returns
   */
  hasLoop(): boolean;

  getVisible(): boolean;

  setVisible(flag: boolean): void;

  isConditionalVisible(): boolean | undefined;

  /**
   * 设置节点锁定状态
   * @param flag
   */
  lock(flag?: boolean): void;

  contains(node: IPublicModelNode): boolean;

  /**
   * 获取指定 path 的属性模型实例
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   * @returns
   */
  getProp(path: string, createIfNone: boolean): IPublicModelProp | null;

  /**
   * 获取指定 path 的属性模型实例，
   *  注：导出时，不同于普通属性，该属性并不挂载在 props 之下，而是与 props 同级
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   * @param createIfNone 当没有属性的时候，是否创建一个属性
   * @returns
   */
  getExtraProp(path: string, createIfNone?: boolean): IPublicModelProp | null;

  /**
   * 获取指定 path 的属性模型实例，
   *  注：导出时，不同于普通属性，该属性并不挂载在 props 之下，而是与 props 同级
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   * @returns
   */
  getExtraPropValue(path: string): any;

  /**
   * 设置指定 path 的属性模型实例值
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   * @param value 值
   * @returns
   */
  setPropValue(path: string, value: CompositeValue): void;

  /**
   * 设置指定 path 的属性模型实例值
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   * @param value 值
   * @returns
   */
  setExtraPropValue(path: string, value: CompositeValue): void;

  /**
   * 导入节点数据
   * @param data
   */
  importSchema(data: NodeSchema): void;

  /**
   * 导出节点数据
   * @param stage
   * @param options
   * @returns
   */
  exportSchema(stage: TransformStage, options?: any): NodeSchema;

  /**
   * 在指定位置之前插入一个节点
   * @param node
   * @param ref
   * @param useMutator
   */
  insertBefore(node: IPublicModelNode, ref?: IPublicModelNode | undefined, useMutator?: boolean): void;

  /**
   * 在指定位置之后插入一个节点
   * @param node
   * @param ref
   * @param useMutator
   */
  insertAfter(node: IPublicModelNode, ref?: IPublicModelNode | undefined, useMutator?: boolean): void;

  /**
   * 替换指定节点
   * @param node 待替换的子节点
   * @param data 用作替换的节点对象或者节点描述
   * @returns
   */
  replaceChild(node: IPublicModelNode, data: any): IPublicModelNode | null;

  /**
   * 将当前节点替换成指定节点描述
   * @param schema
   */
  replaceWith(schema: NodeSchema): any;

  /**
   * 选中当前节点实例
   */
  select(): void;

  /**
   * 设置悬停态
   * @param flag
   */
  hover(flag: boolean): void;

  /**
   * 删除当前节点实例
   */
  remove(): void;

  /**
   * 设置为磁贴布局节点
   */
  set isRGLContainer(flag: boolean);

  /**
   * 获取磁贴布局节点设置状态
   * @returns Boolean
   */
  get isRGLContainer();

  /**
   * 是否可执行某 action
   * @param actionName action 名字
   * @returns boolean
   */
  canPerformAction(actionName: string): boolean;
}
