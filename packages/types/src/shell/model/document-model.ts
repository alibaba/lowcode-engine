import { RootSchema } from '../../schema';
import { TransformStage } from '../../transform-stage';
import { DragNodeDataObject, DragNodeObject } from '../../dragon';
import { IPublicApiProject } from '../api';
import { PropChangeOptions } from '../index';
import { IPublicModelModalNodesManager } from './modal-nodes-manager';
import { IPublicModelNode } from './node';
import { IPublicModelSelection } from './selection';
import { IPublicModelHistory } from './history';


export interface IPublicModelDocumentModel {

  /**
   * id
   */
  get id(): string;

  set id(id);

  selection: IPublicModelSelection;

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
  importSchema(schema: RootSchema): void;

  /**
   * 导出 schema
   * @param stage
   * @returns
   */
  exportSchema(stage: TransformStage): any;

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
    dragObject: DragNodeObject | DragNodeDataObject
  ): boolean;

  /**
   * 当前 document 新增节点事件
   */
  onAddNode(fn: (node: IPublicModelNode) => void): () => void;

  /**
   * 当前 document 新增节点事件，此时节点已经挂载到 document 上
   */
  onMountNode(fn: (payload: { node: IPublicModelNode }) => void): () => void;

  /**
   * 当前 document 删除节点事件
   */
  onRemoveNode(fn: (node: IPublicModelNode) => void): () => void;

  /**
   * 当前 document 的 hover 变更事件
   */
  onChangeDetecting(fn: (node: IPublicModelNode) => void): () => void;

  /**
   * 当前 document 的选中变更事件
   */
  onChangeSelection(fn: (ids: string[]) => void): () => void;

  /**
   * 当前 document 的节点显隐状态变更事件
   * @param fn
   */
  onChangeNodeVisible(fn: (node: IPublicModelNode, visible: boolean) => void): void;


  /**
   * 当前 document 节点属性修改事件
   * @param fn
   */
  onChangeNodeProp(fn: (info: PropChangeOptions) => void): void;

  /**
   * import schema event
   * @param fn
   */
  onImportSchema(fn: (schema: RootSchema) => void): void;
}
