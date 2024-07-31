import { ComponentType, ReactElement } from 'react';

export interface IBaseModelResource<
  Resource
> {
  get title(): string | undefined;

  get id(): string | undefined;

  get icon(): ReactElement | undefined | ComponentType;

  get options(): Record<string, any>;

  get name(): string | undefined;

  get type(): string | undefined;

  get category(): string | undefined;

  get children(): Resource[];

  get viewName(): string | undefined;

  get description(): string | undefined;

  get config(): {
    [key: string]: any;
  } | undefined;
}

export type IPublicModelResource = IBaseModelResource<IPublicModelResource>;
