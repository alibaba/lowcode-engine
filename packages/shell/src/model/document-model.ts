import {
  IDocumentModel as InnerDocumentModel,
  INode as InnerNode,
} from '@alilc/lowcode-designer';
import {
  IPublicEnumTransformStage,
  IPublicTypeRootSchema,
  GlobalEvent,
  IPublicModelDocumentModel,
  IPublicTypeOnChangeOptions,
  IPublicTypeDragNodeObject,
  IPublicTypeDragNodeDataObject,
  IPublicModelNode,
  IPublicModelSelection,
  IPublicModelDetecting,
  IPublicModelHistory,
  IPublicApiProject,
  IPublicModelModalNodesManager,
  IPublicTypePropChangeOptions,
  IPublicModelDropLocation,
  IPublicApiCanvas,
  IPublicTypeDisposable,
  IPublicModelEditor,
  IPublicTypeNodeSchema,
} from '@alilc/lowcode-types';
import { isDragNodeObject } from '@alilc/lowcode-utils';
import { Node as ShellNode } from './node';
import { Selection as ShellSelection } from './selection';
import { Detecting as ShellDetecting } from './detecting';
import { History as ShellHistory } from './history';
import { DropLocation as ShellDropLocation } from './drop-location';
import { Project as ShellProject, Canvas as ShellCanvas } from '../api';
import { Prop as ShellProp } from './prop';
import { ModalNodesManager } from './modal-nodes-manager';
import { documentSymbol, editorSymbol, nodeSymbol } from '../symbols';

const shellDocSymbol = Symbol('shellDocSymbol');

export class DocumentModel implements IPublicModelDocumentModel {
  private readonly [documentSymbol]: InnerDocumentModel;
  private readonly [editorSymbol]: IPublicModelEditor;
  private _focusNode: IPublicModelNode | null;
  selection: IPublicModelSelection;
  detecting: IPublicModelDetecting;
  history: IPublicModelHistory;

  /**
   * @deprecated use canvas API instead
   */
  canvas: IPublicApiCanvas;

  constructor(document: InnerDocumentModel) {
    this[documentSymbol] = document;
    this[editorSymbol] = document.designer?.editor as IPublicModelEditor;
    this.selection = new ShellSelection(document);
    this.detecting = new ShellDetecting(document);
    this.history = new ShellHistory(document);
    this.canvas = new ShellCanvas(this[editorSymbol]);

    this._focusNode = ShellNode.create(this[documentSymbol].focusNode);
  }

  static create(document: InnerDocumentModel | undefined | null): IPublicModelDocumentModel | null {
    if (!document) {
      return null;
    }
    // @ts-ignore 直接返回已挂载的 shell doc 实例
    if (document[shellDocSymbol]) {
      return (document as any)[shellDocSymbol];
    }
    const shellDoc = new DocumentModel(document);
    // @ts-ignore 直接返回已挂载的 shell doc 实例
    document[shellDocSymbol] = shellDoc;
    return shellDoc;
  }

  /**
   * id
   */
  get id(): string {
    return this[documentSymbol].id;
  }

  set id(id) {
    this[documentSymbol].id = id;
  }

  /**
   * 获取当前文档所属的 project
   * @returns
   */
  get project(): IPublicApiProject {
    return ShellProject.create(this[documentSymbol].project, true);
  }

  /**
   * 获取文档的根节点
   * root node of this documentModel
   * @returns
   */
  get root(): IPublicModelNode | null {
    return ShellNode.create(this[documentSymbol].rootNode);
  }

  get focusNode(): IPublicModelNode | null {
    return this._focusNode || this.root;
  }

  set focusNode(node: IPublicModelNode | null) {
    this._focusNode = node;
    this[editorSymbol].eventBus.emit(
      'shell.document.focusNodeChanged',
        { document: this, focusNode: node },
      );
  }

  /**
   * 获取文档下所有节点 Map, key 为 nodeId
   * get map of all nodes , using node.id as key
   */
  get nodesMap(): Map<string, IPublicModelNode> {
    const map = new Map<string, IPublicModelNode>();
    for (let id of this[documentSymbol].nodesMap.keys()) {
      map.set(id, this.getNodeById(id)!);
    }
    return map;
  }

  /**
   * 模态节点管理
   */
  get modalNodesManager(): IPublicModelModalNodesManager | null {
    return ModalNodesManager.create(this[documentSymbol].modalNodesManager);
  }

  get dropLocation(): IPublicModelDropLocation | null {
    return ShellDropLocation.create(this[documentSymbol].dropLocation);
  }

  set dropLocation(loc: IPublicModelDropLocation | null) {
    this[documentSymbol].dropLocation = loc;
  }

  /**
   * 根据 nodeId 返回 Node 实例
   * get node instance by nodeId
   * @param {string} nodeId
   */
  getNodeById(nodeId: string): IPublicModelNode | null {
    return ShellNode.create(this[documentSymbol].getNode(nodeId));
  }

  /**
   * 导入 schema
   * @param schema
   */
  importSchema(schema: IPublicTypeRootSchema): void {
    this[documentSymbol].import(schema);
    this[editorSymbol].eventBus.emit('shell.document.importSchema', schema);
  }

  /**
   * 导出 schema
   * @param stage
   * @returns
   */
  exportSchema(stage: IPublicEnumTransformStage = IPublicEnumTransformStage.Render): any {
    return this[documentSymbol].export(stage);
  }

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
    copy?: boolean | undefined,
  ): IPublicModelNode | null {
    const node = this[documentSymbol].insertNode(
      (parent as any)[nodeSymbol] ? (parent as any)[nodeSymbol] : parent,
      (thing as any)?.[nodeSymbol] ? (thing as any)[nodeSymbol] : thing,
      at,
      copy,
    );
    return ShellNode.create(node);
  }

  /**
   * 创建一个节点
   * @param data
   * @returns
   */
  createNode<IPublicModelNode>(data: IPublicTypeNodeSchema): IPublicModelNode | null {
    return ShellNode.create(this[documentSymbol].createNode(data));
  }

  /**
   * 移除指定节点/节点id
   * @param idOrNode
   */
  removeNode(idOrNode: string | IPublicModelNode): void {
    this[documentSymbol].removeNode(idOrNode as any);
  }

  /**
   * componentsMap of documentModel
   * @param extraComps
   * @returns
   */
  getComponentsMap(extraComps?: string[]): any {
    return this[documentSymbol].getComponentsMap(extraComps);
  }

  /**
   * 检查拖拽放置的目标节点是否可以放置该拖拽对象
   * @param dropTarget 拖拽放置的目标节点
   * @param dragObject 拖拽的对象
   * @returns boolean 是否可以放置
   */
  checkNesting(
      dropTarget: IPublicModelNode,
      dragObject: IPublicTypeDragNodeObject | IPublicTypeDragNodeDataObject,
    ): boolean {
    let innerDragObject = dragObject;
    if (isDragNodeObject(dragObject)) {
      innerDragObject.nodes = innerDragObject.nodes?.map(
          (node: IPublicModelNode) => ((node as any)[nodeSymbol] || node),
        );
    }
    return this[documentSymbol].checkNesting(
      ((dropTarget as any)[nodeSymbol] || dropTarget) as any,
      innerDragObject as any,
    );
  }

  /**
   * 当前 document 新增节点事件
   */
  onAddNode(fn: (node: IPublicModelNode) => void): IPublicTypeDisposable {
    return this[documentSymbol].onNodeCreate((node: InnerNode) => {
      fn(ShellNode.create(node)!);
    });
  }

  /**
   * 当前 document 新增节点事件，此时节点已经挂载到 document 上
   */
  onMountNode(fn: (payload: { node: IPublicModelNode }) => void): IPublicTypeDisposable {
    this[editorSymbol].eventBus.on('node.add', fn as any);
    return () => {
      this[editorSymbol].eventBus.off('node.add', fn as any);
    };
  }

  /**
   * 当前 document 删除节点事件
   */
  onRemoveNode(fn: (node: IPublicModelNode) => void): IPublicTypeDisposable {
    return this[documentSymbol].onNodeDestroy((node: InnerNode) => {
      fn(ShellNode.create(node)!);
    });
  }

  /**
   * 当前 document 的 hover 变更事件
   */
  onChangeDetecting(fn: (node: IPublicModelNode) => void): IPublicTypeDisposable {
    return this[documentSymbol].designer.detecting.onDetectingChange((node: InnerNode) => {
      fn(ShellNode.create(node)!);
    });
  }

  /**
   * 当前 document 的选中变更事件
   */
  onChangeSelection(fn: (ids: string[]) => void): IPublicTypeDisposable {
    return this[documentSymbol].selection.onSelectionChange((ids: string[]) => {
      fn(ids);
    });
  }

  /**
   * 当前 document 的节点显隐状态变更事件
   * @param fn
   */
  onChangeNodeVisible(fn: (node: IPublicModelNode, visible: boolean) => void): IPublicTypeDisposable {
    return this[documentSymbol].onChangeNodeVisible((node: InnerNode, visible: boolean) => {
      fn(ShellNode.create(node)!, visible);
    });
  }

  /**
   * 当前 document 的节点 children 变更事件
   * @param fn
   */
  onChangeNodeChildren(fn: (info: IPublicTypeOnChangeOptions) => void): IPublicTypeDisposable {
    return this[documentSymbol].onChangeNodeChildren((info?: IPublicTypeOnChangeOptions<InnerNode>) => {
      if (!info) {
        return;
      }
      fn({
        type: info.type,
        node: ShellNode.create(info.node)!,
      });
    });
  }

  /**
   * 当前 document 节点属性修改事件
   * @param fn
   */
  onChangeNodeProp(fn: (info: IPublicTypePropChangeOptions) => void): IPublicTypeDisposable {
    const callback = (info: GlobalEvent.Node.Prop.ChangeOptions) => {
      fn({
        key: info.key,
        oldValue: info.oldValue,
        newValue: info.newValue,
        prop: ShellProp.create(info.prop)!,
        node: ShellNode.create(info.node as any)!,
      });
    };
    this[editorSymbol].on(
      GlobalEvent.Node.Prop.InnerChange,
      callback,
    );

    return () => {
      this[editorSymbol].off(
        GlobalEvent.Node.Prop.InnerChange,
        callback,
      );
    };
  }

  /**
   * import schema event
   * @param fn
   */
  onImportSchema(fn: (schema: IPublicTypeRootSchema) => void): IPublicTypeDisposable {
    return this[editorSymbol].eventBus.on('shell.document.importSchema', fn as any);
  }

  isDetectingNode(node: IPublicModelNode): boolean {
    return this.detecting.current === node;
  }

  onFocusNodeChanged(
    fn: (doc: IPublicModelDocumentModel, focusNode: IPublicModelNode) => void,
  ): IPublicTypeDisposable {
    if (!fn) {
      return () => {};
    }
    return this[editorSymbol].eventBus.on(
      'shell.document.focusNodeChanged',
      (payload) => {
        const { document, focusNode } = payload;
        fn(document, focusNode);
      },
    );
  }

  onDropLocationChanged(fn: (doc: IPublicModelDocumentModel) => void): IPublicTypeDisposable {
    if (!fn) {
      return () => {};
    }
    return this[editorSymbol].eventBus.on(
      'document.dropLocation.changed',
      (payload) => {
        const { document } = payload;
        fn(document);
      },
    );
  }
}
