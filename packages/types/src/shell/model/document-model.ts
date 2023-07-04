import { IPublicTypeRootSchema, IPublicTypeDragNodeDataObject, IPublicTypeDragNodeObject, IPublicTypePropChangeOptions, IPublicTypeDisposable } from '../type';
import { IPublicEnumTransformStage } from '../enum';
import { IPublicApiProject } from '../api';
import { IPublicModelDropLocation, IPublicModelDetecting, IPublicModelNode, IPublicModelSelection, IPublicModelHistory, IPublicModelModalNodesManager } from './';
import { IPublicTypeNodeData, IPublicTypeNodeSchema, IPublicTypeOnChangeOptions } from '@alilc/lowcode-types';

export interface IPublicModelDocumentModel<
  Selection = IPublicModelSelection,
  History = IPublicModelHistory,
  Node = IPublicModelNode,
  DropLocation = IPublicModelDropLocation,
  ModalNodesManager = IPublicModelModalNodesManager,
  Project = IPublicApiProject
> {

  /**
     * 节点选中区模型实例
     * instance of selection
     */
  selection: Selection;

  /**
   * 画布节点 hover 区模型实例
   * instance of detecting
   */
  detecting: IPublicModelDetecting;

  /**
   * 操作历史模型实例
   * instance of history
   */
  history: History;

  /**
   * id
   */
  get id(): string;

  set id(id);

  /**
   * 获取当前文档所属的 project
   * get project which this documentModel belongs to
   * @returns
   */
  get project(): Project;

  /**
   * 获取文档的根节点
   * root node of this documentModel
   * @returns
   */
  get root(): Node | null;

  get focusNode(): Node | null;

  set focusNode(node: Node | null);

  /**
   * 获取文档下所有节点
   * @returns
   */
  get nodesMap(): Map<string, Node>;

  /**
   * 模态节点管理
   * get instance of modalNodesManager
   */
  get modalNodesManager(): ModalNodesManager | null;

  /**
   * 根据 nodeId 返回 Node 实例
   * get node by nodeId
   * @param nodeId
   * @returns
   */
  getNodeById(nodeId: string): Node | null;

  /**
   * 导入 schema
   * import schema data
   * @param schema
   */
  importSchema(schema: IPublicTypeRootSchema): void;

  /**
   * 导出 schema
   * export schema
   * @param stage
   * @returns
   */
  exportSchema(stage: IPublicEnumTransformStage): IPublicTypeRootSchema | undefined;

  /**
   * 插入节点
   * insert a node
   */
  insertNode(
    parent: Node,
    thing: Node | IPublicTypeNodeData,
    at?: number | null | undefined,
    copy?: boolean | undefined
  ): Node | null;

  /**
   * 创建一个节点
   * create a node
   * @param data
   * @returns
   */
  createNode<T = Node>(data: IPublicTypeNodeSchema): T | null;

  /**
   * 移除指定节点/节点id
   * remove a node by node instance or nodeId
   * @param idOrNode
   */
  removeNode(idOrNode: string | Node): void;

  /**
   * componentsMap of documentModel
   * @param extraComps
   * @returns
   */
  getComponentsMap(extraComps?: string[]): any;

  /**
   * 检查拖拽放置的目标节点是否可以放置该拖拽对象
   * check if dragOjbect can be put in this dragTarget
   * @param dropTarget 拖拽放置的目标节点
   * @param dragObject 拖拽的对象
   * @returns boolean 是否可以放置
   * @since v1.0.16
   */
  checkNesting(
    dropTarget: Node,
    dragObject: IPublicTypeDragNodeObject | IPublicTypeDragNodeDataObject
  ): boolean;

  /**
   * 当前 document 新增节点事件
   * set callback for event on node is created for a document
   */
  onAddNode(fn: (node: Node) => void): IPublicTypeDisposable;

  /**
   * 当前 document 新增节点事件，此时节点已经挂载到 document 上
   * set callback for event on node is mounted to canvas
   */
  onMountNode(fn: (payload: { node: Node }) => void): IPublicTypeDisposable;

  /**
   * 当前 document 删除节点事件
   * set callback for event on node is removed
   */
  onRemoveNode(fn: (node: Node) => void): IPublicTypeDisposable;

  /**
   * 当前 document 的 hover 变更事件
   *
   * set callback for event on detecting changed
   */
  onChangeDetecting(fn: (node: Node) => void): IPublicTypeDisposable;

  /**
   * 当前 document 的选中变更事件
   * set callback for event on selection changed
   */
  onChangeSelection(fn: (ids: string[]) => void): IPublicTypeDisposable;

  /**
   * 当前 document 的节点显隐状态变更事件
   * set callback for event on visibility changed for certain node
   * @param fn
   */
  onChangeNodeVisible(fn: (node: Node, visible: boolean) => void): IPublicTypeDisposable;

  /**
   * 当前 document 的节点 children 变更事件
   * @param fn
   */
  onChangeNodeChildren(fn: (info: IPublicTypeOnChangeOptions<Node>) => void): IPublicTypeDisposable;

  /**
   * 当前 document 节点属性修改事件
   * @param fn
   */
  onChangeNodeProp(fn: (info: IPublicTypePropChangeOptions<Node>) => void): IPublicTypeDisposable;

  /**
   * import schema event
   * @param fn
   * @since v1.0.15
   */
  onImportSchema(fn: (schema: IPublicTypeRootSchema) => void): IPublicTypeDisposable;

  /**
   * 判断是否当前节点处于被探测状态
   * check is node being detected
   * @param node
   * @since v1.1.0
   */
  isDetectingNode(node: Node): boolean;

  /**
   * 获取当前的 DropLocation 信息
   * get current drop location
   * @since v1.1.0
   */
  get dropLocation(): DropLocation | null;

  /**
   * 设置当前的 DropLocation 信息
   * set current drop location
   * @since v1.1.0
   */
  set dropLocation(loc: DropLocation | null);

  /**
   * 设置聚焦节点变化的回调
   * triggered focused node is set mannually from plugin
   * @param fn
   * @since v1.1.0
   */
  onFocusNodeChanged(
    fn: (doc: IPublicModelDocumentModel, focusNode: Node) => void,
  ): IPublicTypeDisposable;

  /**
   * 设置 DropLocation 变化的回调
   * triggered when drop location changed
   * @param fn
   * @since v1.1.0
   */
  onDropLocationChanged(fn: (doc: IPublicModelDocumentModel) => void): IPublicTypeDisposable;
}
