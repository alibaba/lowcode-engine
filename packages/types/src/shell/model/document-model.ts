import { IPublicTypeRootSchema, IPublicTypeDragNodeDataObject, IPublicTypeDragNodeObject, IPublicTypePropChangeOptions, IPublicTypeDisposable } from '../type';
import { IPublicEnumTransformStage } from '../enum';
import { IPublicApiProject } from '../api';
import { IPublicModelDropLocation, IPublicModelDetecting, IPublicModelNode, IPublicModelSelection, IPublicModelHistory, IPublicModelModalNodesManager } from './';
import { IPublicOnChangeOptions } from '@alilc/lowcode-types';

export interface IPublicModelDocumentModel {

  /**
   * id
   */
  get id(): string;

  set id(id);

  selection: IPublicModelSelection;

  detecting: IPublicModelDetecting;

  history: IPublicModelHistory;

  /**
   * 获取当前文档所属的 project
   * @returns
   */
  get project(): IPublicApiProject | null;

  /**
   * 获取文档的根节点
   * @returns
   */
  get root(): IPublicModelNode | null;

  get focusNode(): IPublicModelNode | null;

  set focusNode(node: IPublicModelNode | null);

  /**
   * 获取文档下所有节点
   * @returns
   */
  get nodesMap(): any;

  /**
   * 模态节点管理
   */
  get modalNodesManager(): IPublicModelModalNodesManager | null;

  /**
   * 根据 nodeId 返回 Node 实例
   * @param nodeId
   * @returns
   */
  getNodeById(nodeId: string): IPublicModelNode | null;

  /**
   * 导入 schema
   * @param schema
   */
  importSchema(schema: IPublicTypeRootSchema): void;

  /**
   * 导出 schema
   * @param stage
   * @returns
   */
  exportSchema(stage: IPublicEnumTransformStage): any;

  /**
   * 插入节点
   * @param parent
   * @param thing
   * @param at
   * @param copy
   * @returns
   */
  insertNode(
    parent: IPublicModelNode,
    thing: IPublicModelNode,
    at?: number | null | undefined,
    copy?: boolean | undefined
  ): IPublicModelNode | null;

  /**
   * 创建一个节点
   * @param data
   * @returns
   */
  createNode(data: any): IPublicModelNode | null;

  /**
   * 移除指定节点/节点id
   * @param idOrNode
   */
  removeNode(idOrNode: string | IPublicModelNode): void;

  /**
   * componentsMap of documentModel
   * @param extraComps
   * @returns
   */
  getComponentsMap(extraComps?: string[]): any;

  /**
   * 检查拖拽放置的目标节点是否可以放置该拖拽对象
   * @param dropTarget 拖拽放置的目标节点
   * @param dragObject 拖拽的对象
   * @returns boolean 是否可以放置
   */
  checkNesting(
    dropTarget: IPublicModelNode,
    dragObject: IPublicTypeDragNodeObject | IPublicTypeDragNodeDataObject
  ): boolean;

  /**
   * 当前 document 新增节点事件
   */
  onAddNode(fn: (node: IPublicModelNode) => void): IPublicTypeDisposable;

  /**
   * 当前 document 新增节点事件，此时节点已经挂载到 document 上
   */
  onMountNode(fn: (payload: { node: IPublicModelNode }) => void): IPublicTypeDisposable;

  /**
   * 当前 document 删除节点事件
   */
  onRemoveNode(fn: (node: IPublicModelNode) => void): IPublicTypeDisposable;

  /**
   * 当前 document 的 hover 变更事件
   */
  onChangeDetecting(fn: (node: IPublicModelNode) => void): IPublicTypeDisposable;

  /**
   * 当前 document 的选中变更事件
   */
  onChangeSelection(fn: (ids: string[]) => void): IPublicTypeDisposable;

  /**
   * 当前 document 的节点显隐状态变更事件
   * @param fn
   */
  onChangeNodeVisible(fn: (node: IPublicModelNode, visible: boolean) => void): void;


  /**
   * 当前 document 的节点 children 变更事件
   * @param fn
   */
  onChangeNodeChildren(fn: (info: IPublicOnChangeOptions) => void): void;

  /**
   * 当前 document 节点属性修改事件
   * @param fn
   */
  onChangeNodeProp(fn: (info: IPublicTypePropChangeOptions) => void): void;

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
  isDetectingNode(node: IPublicModelNode): boolean;

  /**
   * 获取当前的 DropLocation 信息
   * get current drop location
   * @since v1.1.0
   */
  get dropLocation(): IPublicModelDropLocation;

  /**
   * 设置当前的 DropLocation 信息
   * set current drop location
   * @since v1.1.0
   */
  set dropLocation(loc: IPublicModelDropLocation | null);


  /**
   * 设置聚焦节点变化的回调
   * triggered focused node is set mannually from plugin
   * @param fn
   * @since v1.1.0
   */
  onFocusNodeChanged(
    fn: (doc: IPublicModelDocumentModel, focusNode: IPublicModelNode) => void,
  ): IPublicTypeDisposable;

  /**
   * 设置 DropLocation 变化的回调
   * triggered when drop location changed
   * @param fn
   * @since v1.1.0
   */
  onDropLocationChanged(fn: (doc: IPublicModelDocumentModel) => void): IPublicTypeDisposable;
}
