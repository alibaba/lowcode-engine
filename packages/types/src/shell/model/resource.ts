import { ReactElement } from 'react';

export interface IBaseModelResource<
  Resource
> {
  get title(): string | undefined;

  get icon(): ReactElement | undefined;

  get options(): Record<string, any>;

  get name(): string | undefined;

  get type(): string | undefined;

  get category(): string | undefined;

  get children(): Resource[];

  get viewName(): string | undefined;
}

export type IPublicModelResource = IBaseModelResource<IPublicModelResource>;
