import { Designer } from '@alilc/lowcode-designer';
import { designerSymbol } from './symbols';
import DropLocation from './drop-location';

export default class Canvas {
  private readonly [designerSymbol]: Designer;

  constructor(designer: Designer) {
    this[designerSymbol] = designer;
  }

  static create(designer: Designer) {
    if (!designer) return null;
    return new Canvas(designer);
  }

  get dropLocation() {
    return DropLocation.create(this[designerSymbol].dropLocation || null);
  }
}