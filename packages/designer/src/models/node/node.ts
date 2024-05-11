import { ComponentTreeNode } from '@alilc/lowcode-shared';
import { type ComponentMeta } from '../component-meta';
import { type Prop } from './prop';

export interface Node<Schema extends ComponentTreeNode = ComponentTreeNode> {
  /**
   * 节点 id
   * node id
   */
  readonly id: string;
  /**
   * 节点标题
   * title of node
   */
  readonly title: string;

  /**
   * 节点 componentName
   * componentName
   */
  readonly componentName: string;
  /**
   * 节点的物料元数据
   * get component meta of this node
   */
  readonly componentMeta: ComponentMeta | null;

  /**
   * 是否为「容器型」节点
   * check if node is a container type node
   */
  readonly isContainerNode: boolean;
  /**
   * 是否为根节点
   * check if node is root in the tree
   */
  readonly isRootNode: boolean;
  /**
   * 是否为空节点（无 children 或者 children 为空）
   * check if current node is empty, which means no children or children is empty
   */
  readonly isEmptyNode: boolean;
  /**
   * 是否为 Page 节点
   * check if node is Page
   */
  readonly isPageNode: boolean;
  /**
   * 是否为 Component 节点
   * check if node is Component
   */
  readonly isComponentNode: boolean;
  /**
   * 是否为「模态框」节点
   * check if node is Modal
   */
  readonly isModalNode: boolean;
  /**
   * 是否为插槽节点
   * check if node is a Slot
   */
  readonly isSlotNode: boolean;
  /**
   * 是否为父类/分支节点
   * check if node a parental node
   */
  readonly isParentalNode: boolean;
  /**
   * 是否为叶子节点
   * check if node is a leaf node in tree
   */
  readonly isLeafNode: boolean;

  /**
   * 获取当前节点的锁定状态
   * check if current node is locked
   */
  readonly isLocked: boolean;
  /**
   * 下标
   * index
   */
  readonly index: number | undefined;
  /**
   * 图标
   * get icon of this node
   */
  readonly icon: string;
  /**
   * 节点所在树的层级深度，根节点深度为 0
   * depth level of this node, value of root node is 0
   */
  readonly zLevel: number;

  /**
   * 获取节点所属的文档模型对象
   * get documentModel of this node
   */
  readonly document: Document | null;

  /**
   * 获取当前节点的前一个兄弟节点
   * get previous sibling of this node
   */
  readonly prevSibling: Node | null | undefined;

  /**
   * 获取当前节点的后一个兄弟节点
   * get next sibling of this node
   */
  readonly nextSibling: Node | null | undefined;

  /**
   * 获取当前节点的父亲节点
   * get parent of this node
   */
  readonly parent: Node | null;

  /**
   * 获取当前节点的孩子节点模型
   * get children of this node
   */
  readonly children: NodeChildren | null;

  /**
   * 节点上挂载的插槽节点们
   * get slots of this node
   */
  readonly slots: Node[];

  /**
   * 当前节点为插槽节点时，返回节点对应的属性实例
   * return coresponding prop when this node is a slot node
   */
  readonly slotFor: Prop | null | undefined;

  /**
   * 节点的属性集
   * get props
   */
  readonly props: Props | null;
  /**
   * 节点的属性集
   * get props data
   */
  readonly propsData: IPublicTypePropsMap | IPublicTypePropsList | null;

  /**
   * conditionGroup
   */
  readonly conditionGroup: ExclusiveGroup | null;

  /**
   * 获取符合搭建协议 - 节点 schema 结构
   * get schema of this node
   */
  readonly schema: Schema;

  /**
   * 获取对应的 setting entry
   * get setting entry of this node
   */
  readonly settingEntry: SettingTopEntry;

  /**
   * 磁贴布局节点
   */
  isRGLContainerNode: boolean;

  /**
   * 当前节点是否可见
   * check if current node is visible
   */
  visible: boolean;

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
  importSchema(data: Schema): void;
  /**
   * 导出节点数据
   * export schema from this node
   * @param stage
   * @param options
   */
  exportSchema(stage: IPublicEnumTransformStage, options?: any): Schema;
  /**
   * 在指定位置之前插入一个节点
   * insert a node befor current node
   * @param node
   * @param ref
   * @param useMutator
   */
  insertBefore(node: Node, ref?: Node | undefined, useMutator?: boolean): void;
  /**
   * 在指定位置之后插入一个节点
   * insert a node after this node
   * @param node
   * @param ref
   * @param useMutator
   */
  insertAfter(node: Node, ref?: Node | undefined, useMutator?: boolean): void;
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
  replaceWith(schema: Schema): any;
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
   */
  mergeChildren(
    remover: (node: Node, idx: number) => boolean,
    adder: (children: Node[]) => any,
    sorter: (firstNode: Node, secondNode: Node) => number,
  ): any;
  /**
   * 当前节点是否包含某子节点
   * check if current node contains another node as a child
   * @param node
   */
  contains(node: Node): boolean;
  /**
   * 是否可执行某 action
   * check if current node can perform certain aciton with actionName
   * @param actionName action 名字
   */
  canPerformAction(actionName: string): boolean;
  /**
   * 获取该节点的 ConditionalVisible 值
   * check if current node ConditionalVisible
   */
  isConditionalVisible(): boolean | undefined;
  /**
   * 设置该节点的 ConditionalVisible 为 true
   * make this node as conditionalVisible === true
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

export function createNode<Schema extends ComponentTreeNode>(nodeSchema: Schema): Node<Schema> {
  return {};
}
