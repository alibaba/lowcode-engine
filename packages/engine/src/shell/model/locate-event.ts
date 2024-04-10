import { ILocateEvent } from '@alilc/lowcode-designer';
import { locateEventSymbol } from '../symbols';
import { DragObject } from './drag-object';
import { IPublicModelLocateEvent, IPublicModelDragObject } from '@alilc/lowcode-types';

export default class LocateEvent implements IPublicModelLocateEvent {
  private readonly [locateEventSymbol]: ILocateEvent;

  constructor(locateEvent: ILocateEvent) {
    this[locateEventSymbol] = locateEvent;
  }

  static create(locateEvent: ILocateEvent): IPublicModelLocateEvent | null {
    if (!locateEvent) {
      return null;
    }
    return new LocateEvent(locateEvent);
  }

  get type(): string {
    return this[locateEventSymbol].type;
  }

  get globalX(): number {
    return this[locateEventSymbol].globalX;
  }

  get globalY(): number {
    return this[locateEventSymbol].globalY;
  }

  get originalEvent(): MouseEvent | DragEvent {
    return this[locateEventSymbol].originalEvent;
  }

  get target(): Element | null | undefined {
    return this[locateEventSymbol].target;
  }

  get canvasX(): number | undefined {
    return this[locateEventSymbol].canvasX;
  }

  get canvasY(): number | undefined {
    return this[locateEventSymbol].canvasY;
  }

  get dragObject(): IPublicModelDragObject | null {
    return DragObject.create(this[locateEventSymbol].dragObject);
  }
}
