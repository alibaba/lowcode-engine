import { ReactElement } from 'react';

export interface IPublicModelResource {
  get title(): string | undefined;

  get icon(): ReactElement | undefined;

  get options(): Record<string, any>;

  get name(): string | undefined;

  get type(): string | undefined;

  get category(): string | undefined;

  get children(): IPublicModelResource[];

  get viewName(): string | undefined;
}