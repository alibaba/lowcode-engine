import { Node } from './node';
import { DocumentModel } from '../document-model';
import { IPublicModelModalNodesManager } from '@alilc/lowcode-types';
import { createModuleEventBus, IEventBus } from '@alilc/lowcode-editor-core';

export function getModalNodes(node: Node) {
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

export interface IModalNodesManager extends IPublicModelModalNodesManager {

}

export class ModalNodesManager implements IModalNodesManager {
  public willDestroy: any;

  private page: DocumentModel;

  private modalNodes: Node[];

  private nodeRemoveEvents: any;

  private emitter: IEventBus;

  constructor(page: DocumentModel) {
    this.page = page;
    this.emitter = createModuleEventBus('ModalNodesManager');
    this.nodeRemoveEvents = {};
    this.setNodes();
    this.hideModalNodes();
    this.willDestroy = [
      page.onNodeCreate((node) => this.addNode(node)),
      page.onNodeDestroy((node) => this.removeNode(node)),
    ];
  }

  getModalNodes() {
    return this.modalNodes;
  }

  getVisibleModalNode() {
    return this.getModalNodes().find((node: Node) => node.getVisible());
  }

  hideModalNodes() {
    this.modalNodes.forEach((node: Node) => {
      node.setVisible(false);
    });
  }

  setVisible(node: Node) {
    this.hideModalNodes();
    node.setVisible(true);
  }

  setInvisible(node: Node) {
    node.setVisible(false);
  }

  onVisibleChange(func: () => any) {
    this.emitter.on('visibleChange', func);
    return () => {
      this.emitter.removeListener('visibleChange', func);
    };
  }

  onModalNodesChange(func: () => any) {
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

  setNodes() {
    const nodes = getModalNodes(this.page.getRoot()!);
    this.modalNodes = nodes;
    this.modalNodes.forEach((node: Node) => {
      this.addNodeEvent(node);
    });

    this.emitter.emit('modalNodesChange');
  }
}
