import {
  Detecting as InnerDetecting,
  DocumentModel as InnerDocumentModel,
} from '@ali/lowcode-designer';
import { documentSymbol, detectingSymbol } from './symbols';

export default class Detecting {
  private readonly [documentSymbol]: InnerDocumentModel;
  private readonly [detectingSymbol]: InnerDetecting;

  constructor(document: InnerDocumentModel) {
    this[documentSymbol] = document;
    this[detectingSymbol] = document.designer.detecting;
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
}