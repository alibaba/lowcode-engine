import { IPublicModelDragObject } from './drag-object';

export interface IPublicModelLocateEvent {

  get type(): string;

  get globalX(): number;

  get globalY(): number;

  get originalEvent(): MouseEvent | DragEvent;

  get target(): Element | null | undefined;

  get canvasX(): number | undefined;

  get canvasY(): number | undefined;

  get dragObject(): IPublicModelDragObject | null;
}
