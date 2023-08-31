import { ReactElement } from 'react';
import { IPublicTypeNodeSchema, IPublicTypeIconType, IPublicTypeI18nData, IPublicTypeCompositeValue, IPublicTypePropsMap, IPublicTypePropsList } from '../type';
import { IPublicEnumTransformStage } from '../enum';
import { IPublicModelNodeChildren, IPublicModelComponentMeta, IPublicModelProp, IPublicModelProps, IPublicModelSettingTopEntry, IPublicModelDocumentModel, IPublicModelExclusiveGroup } from './';

export interface IBaseModelNode<
  Document = IPublicModelDocumentModel,
  Node = IPublicModelNode,
  NodeChildren = IPublicModelNodeChildren,
  ComponentMeta = IPublicModelComponentMeta,
  SettingTopEntry = IPublicModelSettingTopEntry,
  Props = IPublicModelProps,
  Prop = IPublicModelProp,
  ExclusiveGroup = IPublicModelExclusiveGroup
> {

  /**
   * 节点 id
   * node id
   */
  id: string;

  /**
   * 节点标题
   * title of node
   */
  get title(): string | IPublicTypeI18nData | ReactElement;

  /**
   * @deprecated please use isContainerNode
   */
  get isContainer(): boolean;

  /**
   * 是否为「容器型」节点
   * check if node is a container type node
   * @since v1.1.0
   */
  get isContainerNode(): boolean;

  /**
   * @deprecated please use isRootNode
   */
  get isRoot(): boolean;

  /**
   * 是否为根节点
   * check if node is root in the tree
   * @since v1.1.0
   */
  get isRootNode(): boolean;

  /**
   * @deprecated please use isEmptyNode
   */
  get isEmpty(): boolean;

  /**
   * 是否为空节点（无 children 或者 children 为空）
   * check if current node is empty, which means no children or children is empty
   * @since v1.1.0
   */
  get isEmptyNode(): boolean;

  /**
   * @deprecated please use isPageNode
   * 是否为 Page 节点
   */
  get isPage(): boolean;

  /**
   * 是否为 Page 节点
   * check if node is Page
   * @since v1.1.0
   */
  get isPageNode(): boolean;

  /**
   * @deprecated please use isComponentNode
   */
  get isComponent(): boolean;

  /**
   * 是否为 Component 节点
   * check if node is Component
   * @since v1.1.0
   */
  get isComponentNode(): boolean;

  /**
   * @deprecated please use isModalNode
   */
  get isModal(): boolean;

  /**
   * 是否为「模态框」节点
   * check if node is Modal
   * @since v1.1.0
   */
  get isModalNode(): boolean;

  /**
   * @deprecated please use isSlotNode
   */
  get isSlot(): boolean;

  /**
   * 是否为插槽节点
   * check if node is a Slot
   * @since v1.1.0
   */
  get isSlotNode(): boolean;

  /**
   * @deprecated please use isParentalNode
   */
  get isParental(): boolean;

  /**
   * 是否为父类/分支节点
   * check if node a parental node
   * @since v1.1.0
   */
  get isParentalNode(): boolean;

  /**
   * @deprecated please use isLeafNode
   */
  get isLeaf(): boolean;

  /**
   * 是否为叶子节点
   * check if node is a leaf node in tree
   * @since v1.1.0
   */
  get isLeafNode(): boolean;

  /**
   * 获取当前节点的锁定状态
   * check if current node is locked
   * @since v1.0.16
   */
  get isLocked(): boolean;

  /**
   * @deprecated please use isRGLContainerNode
   */
  set isRGLContainer(flag: boolean);

  /**
   * @deprecated please use isRGLContainerNode
   * @returns Boolean
   */
  get isRGLContainer();

  /**
   * 设置为磁贴布局节点
   * @since v1.1.0
   */
  set isRGLContainerNode(flag: boolean);

  /**
   * 获取磁贴布局节点设置状态
   * @returns Boolean
   * @since v1.1.0
   */
  get isRGLContainerNode();

  /**
   * 下标
   * index
   */
  get index(): number | undefined;

  /**
   * 图标
   * get icon of this node
   */
  get icon(): IPublicTypeIconType;

  /**
   * 节点所在树的层级深度，根节点深度为 0
   * depth level of this node, value of root node is 0
   */
  get zLevel(): number;

  /**
   * 节点 componentName
   * componentName
   */
  get componentName(): string;

  /**
   * 节点的物料元数据
   * get component meta of this node
   */
  get componentMeta(): ComponentMeta | null;

  /**
   * 获取节点所属的文档模型对象
   * get documentModel of this node
   */
  get document(): Document | null;

  /**
   * 获取当前节点的前一个兄弟节点
   * get previous sibling of this node
   */
  get prevSibling(): Node | null | undefined;

  /**
   * 获取当前节点的后一个兄弟节点
   * get next sibling of this node
   */
  get nextSibling(): Node | null | undefined;

  /**
   * 获取当前节点的父亲节点
   * get parent of this node
   */
  get parent(): Node | null;

  /**
   * 获取当前节点的孩子节点模型
   * get children of this node
   */
  get children(): NodeChildren | null;

  /**
   * 节点上挂载的插槽节点们
   * get slots of this node
   */
  get slots(): Node[];

  /**
   * 当前节点为插槽节点时，返回节点对应的属性实例
   * return coresponding prop when this node is a slot node
   */
  get slotFor(): Prop | null | undefined;

  /**
   * 返回节点的属性集
   * get props
   */
  get props(): Props | null;

  /**
   * 返回节点的属性集
   * get props data
   */
  get propsData(): IPublicTypePropsMap | IPublicTypePropsList | null;

  /**
   * get conditionGroup
   */
  get conditionGroup(): ExclusiveGroup | null;

  /**
   * 获取符合搭建协议 - 节点 schema 结构
   * get schema of this node
   * @since v1.1.0
   */
  get schema(): IPublicTypeNodeSchema;

  /**
   * 获取对应的 setting entry
   * get setting entry of this node
   * @since v1.1.0
   */
  get settingEntry(): SettingTopEntry;

  /**
   * 返回节点的尺寸、位置信息
   * get rect information for this node
   */
  getRect(): DOMRect | null;

  /**
   * 是否有挂载插槽节点
   * check if current node has slots
   */
  hasSlots(): boolean;

  /**
   * 是否设定了渲染条件
   * check if current node has condition value set
   */
  hasCondition(): boolean;

  /**
   * 是否设定了循环数据
   * check if loop is set for this node
   */
  hasLoop(): boolean;

  /**
   * 获取指定 path 的属性模型实例
   * get prop by path
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   * @param createIfNone 如果不存在，是否新建，默认为 true
   */
  getProp(path: string | number, createIfNone?: boolean): Prop | null;

  /**
   * 获取指定 path 的属性模型实例值
   * get prop value by path
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   */
  getPropValue(path: string): any;

  /**
   * 获取指定 path 的属性模型实例，
   *  注：导出时，不同于普通属性，该属性并不挂载在 props 之下，而是与 props 同级
   *
   * get extra prop by path, an extra prop means a prop not exists in the `props`
   * but as siblint of the `props`
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   * @param createIfNone 当没有属性的时候，是否创建一个属性
   */
  getExtraProp(path: string, createIfNone?: boolean): Prop | null;

  /**
   * 获取指定 path 的属性模型实例，
   *  注：导出时，不同于普通属性，该属性并不挂载在 props 之下，而是与 props 同级
   *
   * get extra prop value by path, an extra prop means a prop not exists in the `props`
   * but as siblint of the `props`
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   * @returns
   */
  getExtraPropValue(path: string): any;

  /**
   * 设置指定 path 的属性模型实例值
   * set value for prop with path
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   * @param value 值
   */
  setPropValue(path: string | number, value: IPublicTypeCompositeValue): void;

  /**
   * 设置指定 path 的属性模型实例值
   * set value for extra prop with path
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   * @param value 值
   */
  setExtraPropValue(path: string, value: IPublicTypeCompositeValue): void;

  /**
   * 导入节点数据
   * import node schema
   * @param data
   */
  importSchema(data: IPublicTypeNodeSchema): void;

  /**
   * 导出节点数据
   * export schema from this node
   * @param stage
   * @param options
   */
  exportSchema(stage: IPublicEnumTransformStage, options?: any): IPublicTypeNodeSchema;

  /**
   * 在指定位置之前插入一个节点
   * insert a node befor current node
   * @param node
   * @param ref
   * @param useMutator
   */
  insertBefore(
      node: Node,
      ref?: Node | undefined,
      useMutator?: boolean,
    ): void;

  /**
   * 在指定位置之后插入一个节点
   * insert a node after this node
   * @param node
   * @param ref
   * @param useMutator
   */
  insertAfter(
      node: Node,
      ref?: Node | undefined,
      useMutator?: boolean,
    ): void;

  /**
   * 替换指定节点
   * replace a child node with data provided
   * @param node 待替换的子节点
   * @param data 用作替换的节点对象或者节点描述
   * @returns
   */
  replaceChild(node: Node, data: any): Node | null;

  /**
   * 将当前节点替换成指定节点描述
   * replace current node with a new node schema
   * @param schema
   */
  replaceWith(schema: IPublicTypeNodeSchema): any;

  /**
   * 选中当前节点实例
   * select current node
   */
  select(): void;

  /**
   * 设置悬停态
   * set hover value for current node
   * @param flag
   */
  hover(flag: boolean): void;

  /**
   * 设置节点锁定状态
   * set lock value for current node
   * @param flag
   * @since v1.0.16
   */
  lock(flag?: boolean): void;

  /**
   * 删除当前节点实例
   * remove current node
   */
  remove(): void;

  /**
   * 执行新增、删除、排序等操作
   * excute remove/add/sort operations on node`s children
   *
   * @since v1.1.0
   */
  mergeChildren(
    remover: (node: Node, idx: number) => boolean,
    adder: (children: Node[]) => any,
    sorter: (firstNode: Node, secondNode: Node) => number
  ): any;

  /**
   * 当前节点是否包含某子节点
   * check if current node contains another node as a child
   * @param node
   * @since v1.1.0
   */
  contains(node: Node): boolean;

  /**
   * 是否可执行某 action
   * check if current node can perform certain aciton with actionName
   * @param actionName action 名字
   * @since v1.1.0
   */
  canPerformAction(actionName: string): boolean;

  /**
   * 当前节点是否可见
   * check if current node is visible
   * @since v1.1.0
   */
  get visible(): boolean;

  /**
   * 设置当前节点是否可见
   * set visible value for current node
   * @since v1.1.0
   */
  set visible(value: boolean);

  /**
   * 获取该节点的 ConditionalVisible 值
   * check if current node ConditionalVisible
   * @since v1.1.0
   */
  isConditionalVisible(): boolean | undefined;

  /**
   * 设置该节点的 ConditionalVisible 为 true
   * make this node as conditionalVisible === true
   * @since v1.1.0
   */
  setConditionalVisible(): void;

  /**
   * 获取节点实例对应的 dom 节点
   */
  getDOMNode(): HTMLElement;

  /**
   * 获取磁贴相关信息
   */
  getRGL(): {
    isContainerNode: boolean;
    isEmptyNode: boolean;
    isRGLContainerNode: boolean;
    isRGLNode: boolean;
    isRGL: boolean;
    rglNode: Node | null;
  };
}

export interface IPublicModelNode extends IBaseModelNode<IPublicModelDocumentModel, IPublicModelNode> {}