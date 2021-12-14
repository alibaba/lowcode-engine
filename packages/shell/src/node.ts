import {
  DocumentModel as InnerDocumentModel,
  Node as InnerNode,
  getConvertedExtraKey,
} from '@ali/lowcode-designer';
import { CompositeValue, NodeSchema, TransformStage } from '@ali/lowcode-types';
import Prop from './prop';
import DocumentModel from './document-model';
import { documentSymbol, nodeSymbol } from './symbols';

export default class Node {
  private readonly [documentSymbol]: InnerDocumentModel;
  private readonly [nodeSymbol]: InnerNode;

  constructor(node: InnerNode) {
    this[nodeSymbol] = node;
    this[documentSymbol] = node.document;
  }

  static create(node: InnerNode | null) {
    if (!node) return null;
    return new Node(node);
  }

  getDocumentModel() {
    return DocumentModel.create(this[documentSymbol]);
  }

  getProp(path: string): Prop | null {
    return Prop.create(this[nodeSymbol].getProp(path));
  }

  getPropValue(path: string) {
    return this.getProp(path)?.getValue();
  }

  getExtraProp(path: string): Prop | null {
    return Prop.create(this[nodeSymbol].getProp(getConvertedExtraKey(path)));
  }

  getExtraPropValue(path: string) {
    return this.getExtraProp(path)?.getValue();
  }

  setPropValue(path: string, value: CompositeValue) {
    return this.getProp(path)?.setValue(value);
  }

  setExtraPropValue(path: string, value: CompositeValue) {
    return this.getExtraProp(path)?.setValue(value);
  }

  getPrevSibling() {
    return this[nodeSymbol].prevSibling;
  }
  getNextSibling() {
    return this[nodeSymbol].nextSibling;
  }

  getParent() {
    return this[nodeSymbol].parent;
  }

  getChildren() {
    return this[nodeSymbol].children;
  }

  importSchema(data: NodeSchema) {
    this[nodeSymbol].import(data);
  }

  exportSchema(stage?: TransformStage, options?: any) {
    return this[nodeSymbol].export(stage, options);
  }

  insertBefore(node: InnerNode<NodeSchema>, ref?: InnerNode<NodeSchema> | undefined, useMutator?: boolean) {
    this[nodeSymbol].insertBefore(node, ref, useMutator);
  }

  insertAfter(node: InnerNode<NodeSchema>, ref?: InnerNode<NodeSchema> | undefined, useMutator?: boolean) {
    this[nodeSymbol].insertAfter(node, ref, useMutator);
  }

  replaceChild(node: InnerNode<NodeSchema>, data: any) {
    return Node.create(this[nodeSymbol].replaceChild(node, data));
  }

  replaceWith(schema: NodeSchema) {
    this[nodeSymbol].replaceWith(schema);
  }
}
