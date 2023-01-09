import { ReactElement } from 'react';
import { IPublicModelResourceType } from './resource-type';

export interface IPublicModelResource {
  get title(): string;

  get icon(): ReactElement | undefined;

  get options(): Object;

  get resourceType(): IPublicModelResourceType | undefined;
}