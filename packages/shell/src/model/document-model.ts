import { Editor } from '@alilc/lowcode-editor-core';
import {
  DocumentModel as InnerDocumentModel,
  Node as InnerNode,
  isDragNodeObject,
  IOnChangeOptions as InnerOnChangeOptions,
} from '@alilc/lowcode-designer';
import {
  IPublicEnumTransformStage,
  IPublicTypeRootSchema,
  GlobalEvent,
  IPublicModelDocumentModel,
  IPublicOnChangeOptions,
  IPublicModelDragObject,
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
} from '@alilc/lowcode-types';
import { Node } from './node';
import { Selection } from './selection';
import { Detecting } from './detecting';
import { History } from './history';
import { Project } from '../api/project';
import { Prop } from './prop';
import { ModalNodesManager } from './modal-nodes-manager';
import { documentSymbol, editorSymbol, nodeSymbol } from '../symbols';
import { Canvas } from '../api';

const shellDocSymbol = Symbol('shellDocSymbol');

export class DocumentModel implements IPublicModelDocumentModel {
  private readonly [documentSymbol]: InnerDocumentModel;
  private readonly [editorSymbol]: Editor;
  private _focusNode: IPublicModelNode | null;
  selection: IPublicModelSelection;
  detecting: IPublicModelDetecting;
  history: IPublicModelHistory;
  /**
   * @deprecated
   */
  canvas: IPublicApiCanvas;

  constructor(document: InnerDocumentModel) {
    this[documentSymbol] = document;
    this[editorSymbol] = document.designer?.editor as Editor;
    this.selection = new Selection(document);
    this.detecting = new Detecting(document);
    this.history = new History(document);
    this.canvas = new Canvas(this[editorSymbol]);

    this._focusNode = Node.create(this[documentSymbol].focusNode);
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
  get project(): IPublicApiProject | null {
    return Project.create(this[documentSymbol].project);
  }

  /**
   * 获取文档的根节点
   * @returns
   */
  get root(): IPublicModelNode | null {
    return Node.create(this[documentSymbol].getRoot());
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
   * 获取文档下所有节点
   * @returns
   */
  get nodesMap(): any {
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

  /**
   * @TODO: 能不能直接暴露
   */
  get dropLocation(): IPublicModelDropLocation {
    return this[documentSymbol].dropLocation;
  }

  set dropLocation(loc: IPublicModelDropLocation | null) {
    this[documentSymbol].dropLocation = loc;
  }
  /**
   * 根据 nodeId 返回 Node 实例
   * @param nodeId
   * @returns
   */
  getNodeById(nodeId: string): IPublicModelNode | null {
    return Node.create(this[documentSymbol].getNode(nodeId));
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
    return Node.create(node);
  }

  /**
   * 创建一个节点
   * @param data
   * @returns
   */
  createNode(data: any): IPublicModelNode | null {
    return Node.create(this[documentSymbol].createNode(data));
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
    let innerDragObject: IPublicModelDragObject = dragObject;
    if (isDragNodeObject(dragObject)) {
      innerDragObject.nodes = innerDragObject.nodes.map((node: Node) => (node[nodeSymbol] || node));
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
      fn(Node.create(node)!);
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
      fn(Node.create(node)!);
    });
  }

  /**
   * 当前 document 的 hover 变更事件
   */
  onChangeDetecting(fn: (node: IPublicModelNode) => void): IPublicTypeDisposable {
    return this[documentSymbol].designer.detecting.onDetectingChange((node: InnerNode) => {
      fn(Node.create(node)!);
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
  onChangeNodeVisible(fn: (node: IPublicModelNode, visible: boolean) => void): void {
    // TODO: history 变化时需要重新绑定
    this[documentSymbol].nodesMap?.forEach((node) => {
      node.onVisibleChange((flag: boolean) => {
        fn(Node.create(node)!, flag);
      });
    });
  }

  /**
   * 当前 document 的节点 children 变更事件
   * @param fn
   */
  onChangeNodeChildren(fn: (info?: IPublicOnChangeOptions) => void): void {
    // TODO: history 变化时需要重新绑定
    this[documentSymbol].nodesMap?.forEach((node) => {
      node.onChildrenChange((info?: InnerOnChangeOptions) => {
        return info
          ? fn({
              type: info.type,
              node: Node.create(node)!,
            })
          : fn();
      });
    });
  }

  /**
   * 当前 document 节点属性修改事件
   * @param fn
   */
  onChangeNodeProp(fn: (info: IPublicTypePropChangeOptions) => void): void {
    this[editorSymbol].on(
      GlobalEvent.Node.Prop.InnerChange,
      (info: GlobalEvent.Node.Prop.ChangeOptions) => {
        fn({
          key: info.key,
          oldValue: info.oldValue,
          newValue: info.newValue,
          prop: Prop.create(info.prop)!,
          node: Node.create(info.node as any)!,
        });
      },
    );
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
