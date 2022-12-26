import { IPublicTypeLocationDetail } from '../type';
import { IPublicModelLocateEvent } from './';

export interface IPublicModelDropLocation {
  get target(): any;

  readonly detail: IPublicTypeLocationDetail;

  clone(event: IPublicModelLocateEvent): IPublicModelDropLocation;
}
