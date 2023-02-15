import { ReactElement } from 'react';

export interface IPublicResourceData {
  resourceName: string;
  title: string;
  category?: string;
  viewType?: string;
  icon?: ReactElement;
  options: {
    [key: string]: any;
  };
  children?: IPublicResourceData[];
}

export type IPublicResourceList = IPublicResourceData[];