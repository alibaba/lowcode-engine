import { Editor } from '@ali/lowcode-editor-core';
import {
  DocumentModel as InnerDocumentModel,
  Node as InnerNode,
  ParentalNode,
  IOnChangeOptions as InnerIOnChangeOptions,
  PropChangeOptions as InnerPropChangeOptions,
} from '@ali/lowcode-designer';
import { TransformStage, RootSchema, NodeSchema, NodeData, GlobalEvent } from '@ali/lowcode-types';
import Node from './node';
import Selection from './selection';
import Detecting from './detecting';
import History from './history';
import Project from './project';
import Prop from './prop';
import { documentSymbol, editorSymbol } from './symbols';

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
  public selection: Selection;
  public detecting: Detecting;
  public history: History;

  constructor(document: InnerDocumentModel) {
    this[documentSymbol] = document;
    this[editorSymbol] = document.designer.editor as Editor;
    this.selection = new Selection(document);
    this.detecting = new Detecting(document);
    this.history = new History(document);
  }

  static create(document: InnerDocumentModel | undefined | null) {
    if (document == undefined) return null;
    return new DocumentModel(document);
  }

  getProject() {
    return Project.create(this[documentSymbol].project);
  }

  getRoot() {
    return Node.create(this[documentSymbol].getRoot());
  }

  getNodesMap() {
    const map = new Map<string, Node>();
    for (let id in this[documentSymbol].nodesMap.keys()) {
      map.set(id, this.getNodeById(id)!);
    }
    return map;
  }

  getNodeById(nodeId: string) {
    return Node.create(this[documentSymbol].getNode(nodeId));
  }

  importSchema(schema: RootSchema) {
    this[documentSymbol].import(schema);
  }

  exportSchema(stage?: TransformStage) {
    return this[documentSymbol].export(stage);
  }

  insertNode(
    parent: ParentalNode<NodeSchema>,
    thing: InnerNode<NodeSchema> | NodeData,
    at?: number | null | undefined,
    copy?: boolean | undefined,
  ) {
    const node = this[documentSymbol].insertNode(parent, thing, at, copy);
    return Node.create(node);
  }

  removeNode(idOrNode: string | InnerNode<NodeSchema>) {
    this[documentSymbol].removeNode(idOrNode);
  }

  /**
   * 当前 document 新增节点事件
   */
  onAddNode(fn: (node: Node) => void) {
    this[documentSymbol].onNodeCreate((node: InnerNode) => {
      fn(Node.create(node)!);
    });
  }

  /**
   * 当前 document 删除节点事件
   */
  onRemoveNode(fn: (node: Node) => void) {
    this[documentSymbol].onNodeDestroy((node: InnerNode) => {
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

  onChangeNodeVisible(fn: (node: Node, visible: boolean) => void) {
    // TODO: history 变化时需要重新绑定
    this[documentSymbol].nodesMap.forEach((node) => {
      node.onVisibleChange((flag: boolean) => {
        fn(Node.create(node)!, flag);
      });
    });
  }

  onChangeNodeChildren(fn: (info?: IOnChangeOptions) => void) {
    // TODO: history 变化时需要重新绑定
    this[documentSymbol].nodesMap.forEach((node) => {
      node.onChildrenChange((info?: InnerIOnChangeOptions) => {
        return info ? fn({
          type: info.type,
          node: Node.create(node)!,
        }) : fn();
      });
    });
  }

  /**
   * 当前 document 节点属性修改事件
   */
  onChangeNodeProp(fn: (info: PropChangeOptions) => void) {
    this[editorSymbol].on(GlobalEvent.Node.Prop.InnerChange, (info: GlobalEvent.Node.Prop.ChangeOptions) => {
      fn({
        key: info.key,
        oldValue: info.oldValue,
        newValue: info.newValue,
        prop: Prop.create(info.prop)!,
        node: Node.create(info.node as any)!,
      });
    });
  }
}
