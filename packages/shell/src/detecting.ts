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

  capture(id: string) {
    this[detectingSymbol].capture(this[documentSymbol].getNode(id));
  }

  release(id: string) {
    this[detectingSymbol].release(this[documentSymbol].getNode(id));
  }

  leave() {
    this[detectingSymbol].leave(this[documentSymbol]);
  }
}