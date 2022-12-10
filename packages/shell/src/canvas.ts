import { Designer } from '@alilc/lowcode-designer';
import { designerSymbol } from './symbols';
import DropLocation from './drop-location';
import { IPublicModelCanvas } from '@alilc/lowcode-types';

export default class Canvas implements IPublicModelCanvas {
  private readonly [designerSymbol]: Designer;

  constructor(designer: Designer) {
    this[designerSymbol] = designer;
  }

  static create(designer: Designer): IPublicModelCanvas | null {
    if (!designer) {
      return null;
    }
    return new Canvas(designer);
  }

  get dropLocation() {
    return DropLocation.create(this[designerSymbol].dropLocation || null);
  }
}