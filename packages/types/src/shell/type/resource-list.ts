export interface IPublicResourceData {
  resourceName: string;
  title: string;
  category?: string;
  options: {
    [key: string]: any;
  };
}

export type IPublicResourceList = IPublicResourceData[];