import { findIndex } from 'lodash';
import { DocumentModel, Node, Root } from '@ali/lowcode-designer';

/**
 * RootNodeVisitor for VisualEngine Page
 *
 * - store / cache node
 * - quickly find / search or do operations on Node
 */
export default class RootNodeVisitor {
  public nodeIdMap: {[id: string]: Node} = {};

  public nodeFieldIdMap: {[fieldId: string]: Node} = {};

  public nodeList: Node[] = [];

  private page: DocumentModel;

  private root: RootNode;

  private cancelers: Function[] = [];

  constructor(page: DocumentModel, rootNode: RootNode) {
    this.page = page;
    this.root = rootNode;

    this._findNode(this.root);
    this._init();
  }

  public getNodeList() {
    return this.nodeList;
  }

  public getNodeIdMap() {
    return this.nodeIdMap;
  }

  public getNodeFieldIdMap() {
    return this.nodeFieldIdMap;
  }

  public getNodeById(id?: string) {
    if (!id) { return this.nodeIdMap; }
    return this.nodeIdMap[id];
  }

  public getNodeByFieldId(fieldId?: string) {
    if (!fieldId) { return this.nodeFieldIdMap; }
    return this.nodeFieldIdMap[fieldId];
  }

  public destroy() {
    this.cancelers.forEach((canceler) => canceler());
  }

  private _init() {
    this.cancelers.push(
      this.page.onNodeCreate((node) => {
        this.nodeList.push(node);
        this.nodeIdMap[node.id] = node;
        if (node.getPropValue('fieldId')) {
          this.nodeFieldIdMap[node.getPropValue('fieldId')] = node;
        }
      }),
    );

    this.cancelers.push(
      this.page.onNodeDestroy((node) => {
        const idx = findIndex(this.nodeList, (n) => node.id === n.id);
        this.nodeList.splice(idx, 1);
        delete this.nodeIdMap[node.id];
        if (node.getPropValue('fieldId')) {
          delete this.nodeFieldIdMap[node.getPropValue('fieldId')];
        }
      }),
    );
  }

  private _findNode(node: Node) {
    const props = node.getProps();
    const fieldId = props && props.getPropValue('fieldId');

    this.nodeIdMap[node.getId()] = node;
    this.nodeList.push(node);
    if (fieldId) {
      this.nodeFieldIdMap[fieldId] = node;
    }

    const children = node.getChildren();
    if (children) {
      children.forEach((child) => this._findNode(child));
    }
  }
}
