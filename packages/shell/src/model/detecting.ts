import { Node } from './node';
import {
  Detecting as InnerDetecting,
  DocumentModel as InnerDocumentModel,
} from '@alilc/lowcode-designer';
import { documentSymbol, detectingSymbol } from '../symbols';
import { IPublicModelDetecting, IPublicModelNode } from '@alilc/lowcode-types';

export class Detecting implements IPublicModelDetecting {
  private readonly [documentSymbol]: InnerDocumentModel;
  private readonly [detectingSymbol]: InnerDetecting;

  constructor(document: InnerDocumentModel) {
    this[documentSymbol] = document;
    this[detectingSymbol] = document.designer?.detecting;
  }

  /**
   * 控制大纲树 hover 时是否出现悬停效果
   */
  get enable(): boolean {
    return this[detectingSymbol].enable;
  }

  /**
   * 当前 hover 的节点
   */
  get current() {
    return Node.create(this[detectingSymbol].current);
  }

  /**
   * hover 指定节点
   * @param id 节点 id
   */
  capture(id: string) {
    this[detectingSymbol].capture(this[documentSymbol].getNode(id));
  }

  /**
   * hover 离开指定节点
   * @param id 节点 id
   */
  release(id: string) {
    this[detectingSymbol].release(this[documentSymbol].getNode(id));
  }

  /**
   * 清空 hover 态
   */
  leave() {
    this[detectingSymbol].leave(this[documentSymbol]);
  }

  onDetectingChange(fn: (node: IPublicModelNode) => void): () => void {
    return this[detectingSymbol].onDetectingChange(fn);
  }
}