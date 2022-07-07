import { EventEmitter } from 'events';
import { Node } from './node';
import { DocumentModel } from '../document-model';

function getModalNodes(node: Node) {
  if (!node) return [];
  let nodes: any = [];
  if (node.componentMeta.isModal) {
    nodes.push(node);
  }
  const children = node.getChildren();
  if (children) {
    children.forEach((child) => {
      nodes = nodes.concat(getModalNodes(child));
    });
  }
  return nodes;
}

export class ModalNodesManager {
  public willDestroy: any;

  private page: DocumentModel;

  private modalNodes: Node[];

  private nodeRemoveEvents: any;

  private emitter: EventEmitter;

  constructor(page: DocumentModel) {
    this.page = page;
    this.emitter = new EventEmitter();
    this.nodeRemoveEvents = {};
    this.setNodes();
    this.hideModalNodes();
    this.willDestroy = [
      page.onNodeCreate((node) => this.addNode(node)),
      page.onNodeDestroy((node) => this.removeNode(node)),
    ];
  }

  public getModalNodes() {
    return this.modalNodes;
  }

  public getVisibleModalNode() {
    const visibleNode = this.modalNodes
      ? this.modalNodes.find((node: Node) => {
        return node.getVisible();
      })
      : null;
    return visibleNode;
  }

  public hideModalNodes() {
    if (this.modalNodes) {
      this.modalNodes.forEach((node: Node) => {
        node.setVisible(false);
      });
    }
  }

  public setVisible(node: Node) {
    this.hideModalNodes();
    node.setVisible(true);
  }

  public setInvisible(node: Node) {
    node.setVisible(false);
  }

  public onVisibleChange(func: () => any) {
    this.emitter.on('visibleChange', func);
    return () => {
      this.emitter.removeListener('visibleChange', func);
    };
  }

  public onModalNodesChange(func: () => any) {
    this.emitter.on('modalNodesChange', func);
    return () => {
      this.emitter.removeListener('modalNodesChange', func);
    };
  }

  private addNode(node: Node) {
    if (node.componentMeta.isModal) {
      this.hideModalNodes();
      this.modalNodes.push(node);
      this.addNodeEvent(node);
      this.emitter.emit('modalNodesChange');
      this.emitter.emit('visibleChange');
    }
  }

  private removeNode(node: Node) {
    if (node.componentMeta.isModal) {
      const index = this.modalNodes.indexOf(node);
      if (index >= 0) {
        this.modalNodes.splice(index, 1);
      }
      this.removeNodeEvent(node);
      this.emitter.emit('modalNodesChange');
      if (node.getVisible()) {
        this.emitter.emit('visibleChange');
      }
    }
  }

  private addNodeEvent(node: Node) {
    this.nodeRemoveEvents[node.getId()] =
      node.onVisibleChange(() => {
        this.emitter.emit('visibleChange');
      });
  }

  private removeNodeEvent(node: Node) {
    if (this.nodeRemoveEvents[node.getId()]) {
      this.nodeRemoveEvents[node.getId()]();
      delete this.nodeRemoveEvents[node.getId()];
    }
  }

  public setNodes() {
    const nodes = getModalNodes(this.page.getRoot()!);
    this.modalNodes = nodes;
    this.modalNodes.forEach((node: Node) => {
      this.addNodeEvent(node);
    });

    this.emitter.emit('modalNodesChange');
  }
}
