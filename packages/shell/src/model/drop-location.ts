import {
  DropLocation as InnerDropLocation,
} from '@alilc/lowcode-designer';
import { dropLocationSymbol } from '../symbols';
import { Node } from './node';
import { IPublicModelDropLocation } from '@alilc/lowcode-types';

export class DropLocation implements IPublicModelDropLocation {
  private readonly [dropLocationSymbol]: InnerDropLocation;

  constructor(dropLocation: InnerDropLocation) {
    this[dropLocationSymbol] = dropLocation;
  }

  static create(dropLocation: InnerDropLocation | null): DropLocation | null {
    if (!dropLocation) {
      return null;
    }
    return new DropLocation(dropLocation);
  }

  get target() {
    return Node.create(this[dropLocationSymbol].target);
  }
}
