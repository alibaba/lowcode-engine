import { IPublicModelSettingField } from '../model';

export type IPublicTypeDynamicProps = (target: IPublicModelSettingField) => Record<string, unknown>;
