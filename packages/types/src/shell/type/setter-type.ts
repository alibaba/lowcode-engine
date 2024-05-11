import { IPublicTypeCustomView, IPublicTypeSetterConfig } from './';

// if *string* passed must be a registered Setter Name, future support blockSchema

// eslint-disable-next-line max-len
export type IPublicTypeSetterType =
  | IPublicTypeSetterConfig
  | IPublicTypeSetterConfig[]
  | string
  | IPublicTypeCustomView;
