import { Editor } from '@alilc/lowcode-editor-core';
import {
  DocumentModel as InnerDocumentModel,
  Node as InnerNode,
  ParentalNode,
  IOnChangeOptions as InnerIOnChangeOptions,
  PropChangeOptions as InnerPropChangeOptions,
} from '@alilc/lowcode-designer';
import {
  TransformStage,
  RootSchema,
  NodeSchema,
  NodeData,
  GlobalEvent,
} from '@alilc/lowcode-types';
import Node from './node';
import Selection from './selection';
import Detecting from './detecting';
import History from './history';
import Project from './project';
import Prop from './prop';
import Canvas from './canvas';
import ModalNodesManager from './modal-nodes-manager';
import { documentSymbol, editorSymbol, nodeSymbol } from './symbols';

type IOnChangeOptions = {
  type: string;
  node: Node;
};

type PropChangeOptions = {
  key?: string | number;
  prop?: Prop;
  node: Node;
  newValue: any;
  oldValue: any;
};

export default class DocumentModel {
  private readonly [documentSymbol]: InnerDocumentModel;
  private readonly [editorSymbol]: Editor;
  private _focusNode: Node;
  public selection: Selection;
  public detecting: Detecting;
  public history: History;
  public canvas: Canvas;

  constructor(document: InnerDocumentModel) {
    this[documentSymbol] = document;
    this[editorSymbol] = document.designer.editor as Editor;
    this.selection = new Selection(document);
    this.detecting = new Detecting(document);
    this.history = new History(document.getHistory());
    this.canvas = new Canvas(document.designer);

    this._focusNode = Node.create(this[documentSymbol].focusNode);
  }

  static create(document: InnerDocumentModel | undefined | null) {
    if (document == undefined) return null;
    return new DocumentModel(document);
  }

  /**
   * 获取当前文档所属的 project
   * @returns
   */
  get project() {
    return Project.create(this[documentSymbol].project);
  }

  /**
   * 获取文档的根节点
   * @returns
   */
  get root(): Node | null {
    return Node.create(this[documentSymbol].getRoot());
  }

  get focusNode(): Node {
    return this._focusNode;
  }

  set focusNode(node: Node) {
    this._focusNode = node;
  }

  /**
   * 获取文档下所有节点
   * @returns
   */
  get nodesMap() {
    const map = new Map<string, Node>();
    for (let id of this[documentSymbol].nodesMap.keys()) {
      map.set(id, this.getNodeById(id)!);
    }
    return map;
  }

  /**
   * 模态节点管理
   */
  get modalNodesManager() {
    return ModalNodesManager.create(this[documentSymbol].modalNodesManager);
  }

  // @TODO: 不能直接暴露
  get dropLocation() {
    return this[documentSymbol].dropLocation;
  }

  /**
   * 根据 nodeId 返回 Node 实例
   * @param nodeId
   * @returns
   */
  getNodeById(nodeId: string) {
    return Node.create(this[documentSymbol].getNode(nodeId));
  }

  /**
   * 导入 schema
   * @param schema
   */
  importSchema(schema: RootSchema) {
    this[documentSymbol].import(schema);
  }

  /**
   * 导出 schema
   * @param stage
   * @returns
   */
  exportSchema(stage: TransformStage = TransformStage.Render) {
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
    parent: Node,
    thing: Node,
    at?: number | null | undefined,
    copy?: boolean | undefined,
  ) {
    const node = this[documentSymbol].insertNode(
      parent[nodeSymbol] as any,
      thing?.[nodeSymbol],
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
  createNode(data: any) {
    return Node.create(this[documentSymbol].createNode(data));
  }

  /**
   * 移除指定节点/节点id
   * @param idOrNode
   */
  removeNode(idOrNode: string | Node) {
    this[documentSymbol].removeNode(idOrNode as any);
  }

  /**
   * 当前 document 新增节点事件
   */
  onAddNode(fn: (node: Node) => void) {
    return this[documentSymbol].onNodeCreate((node: InnerNode) => {
      fn(Node.create(node)!);
    });
  }

  /**
   * 当前 document 删除节点事件
   */
  onRemoveNode(fn: (node: Node) => void) {
    return this[documentSymbol].onNodeDestroy((node: InnerNode) => {
      fn(Node.create(node)!);
    });
  }

  /**
   * 当前 document 的 hover 变更事件
   */
  onChangeDetecting(fn: (node: Node) => void) {
    this[documentSymbol].designer.detecting.onDetectingChange((node: InnerNode) => {
      fn(Node.create(node)!);
    });
  }

  /**
   * 当前 document 的选中变更事件
   */
  onChangeSelection(fn: (ids: string[]) => void) {
    this[documentSymbol].selection.onSelectionChange((ids: string[]) => {
      fn(ids);
    });
  }

  /**
   * 当前 document 的节点显隐状态变更事件
   * @param fn
   */
  onChangeNodeVisible(fn: (node: Node, visible: boolean) => void) {
    // TODO: history 变化时需要重新绑定
    this[documentSymbol].nodesMap.forEach((node) => {
      node.onVisibleChange((flag: boolean) => {
        fn(Node.create(node)!, flag);
      });
    });
  }

  /**
   * 当前 document 的节点 children 变更事件
   * @param fn
   */
  onChangeNodeChildren(fn: (info?: IOnChangeOptions) => void) {
    // TODO: history 变化时需要重新绑定
    this[documentSymbol].nodesMap.forEach((node) => {
      node.onChildrenChange((info?: InnerIOnChangeOptions) => {
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
  onChangeNodeProp(fn: (info: PropChangeOptions) => void) {
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
}
