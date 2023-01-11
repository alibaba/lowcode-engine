import { INode, Node } from './node';
import { DocumentModel } from '../document-model';
import { IPublicModelModalNodesManager } from '@alilc/lowcode-types';
import { createModuleEventBus, IEventBus } from '@alilc/lowcode-editor-core';

export function getModalNodes(node: INode | Node) {
  if (!node) return [];
  let nodes: any = [];
  if (node.componentMeta.isModal) {
    nodes.push(node);
  }
  const { children } = node;
  if (children) {
    children.forEach((child) => {
      nodes = nodes.concat(getModalNodes(child));
    });
  }
  return nodes;
}

export interface IModalNodesManager extends IPublicModelModalNodesManager {

  getModalNodes(): INode[];

  getVisibleModalNode(): INode | null;
}

export class ModalNodesManager implements IModalNodesManager {
  willDestroy: any;

  private page: DocumentModel;

  private modalNodes: INode[];

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

  getModalNodes(): INode[] {
    return this.modalNodes;
  }

  getVisibleModalNode(): INode | null {
    const visibleNode = this.getModalNodes().find((node: INode) => node.getVisible());
    return visibleNode || null;
  }

  hideModalNodes() {
    this.modalNodes.forEach((node: INode) => {
      node.setVisible(false);
    });
  }

  setVisible(node: INode) {
    this.hideModalNodes();
    node.setVisible(true);
  }

  setInvisible(node: INode) {
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

  private addNode(node: INode) {
    if (node.componentMeta.isModal) {
      this.hideModalNodes();
      this.modalNodes.push(node);
      this.addNodeEvent(node);
      this.emitter.emit('modalNodesChange');
      this.emitter.emit('visibleChange');
    }
  }

  private removeNode(node: INode) {
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

  private addNodeEvent(node: INode) {
    this.nodeRemoveEvents[node.id] =
      node.onVisibleChange(() => {
        this.emitter.emit('visibleChange');
      });
  }

  private removeNodeEvent(node: INode) {
    if (this.nodeRemoveEvents[node.id]) {
      this.nodeRemoveEvents[node.id]();
      delete this.nodeRemoveEvents[node.id];
    }
  }

  setNodes() {
    const nodes = getModalNodes(this.page.rootNode!);
    this.modalNodes = nodes;
    this.modalNodes.forEach((node: INode) => {
      this.addNodeEvent(node);
    });

    this.emitter.emit('modalNodesChange');
  }
}
