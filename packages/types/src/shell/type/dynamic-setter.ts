import { IPublicModelSettingTarget } from '../model/setting-target';
import { IPublicTypeCustomView } from '..';
import { IPublicTypeSetterConfig } from './setter-config';

export type IPublicTypeDynamicSetter = (target: IPublicModelSettingTarget) => string | IPublicTypeSetterConfig | IPublicTypeCustomView;
