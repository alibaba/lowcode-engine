import { IPublicModelSettingPropEntry, IPublicTypeCustomView } from '..';
import { IPublicTypeSetterConfig } from './setter-config';

export type IPublicTypeDynamicSetter = (
  target: IPublicModelSettingPropEntry,
) => string | IPublicTypeSetterConfig | IPublicTypeCustomView;
