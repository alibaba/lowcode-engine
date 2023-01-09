import { ReactElement } from 'react';

export interface IPublicModelResourceType {
  get description(): string | undefined;

  get icon(): ReactElement | undefined;
}