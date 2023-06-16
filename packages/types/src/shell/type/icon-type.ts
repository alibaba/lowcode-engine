import { ReactElement, ComponentType } from 'react';
import { IPublicTypeIconConfig } from './';

export type IPublicTypeIconType = string | ReactElement | ComponentType<any> | IPublicTypeIconConfig;
