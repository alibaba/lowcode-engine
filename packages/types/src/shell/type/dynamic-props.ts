import { IPublicModelSettingTarget } from '../model/setting-target';

export type IPublicTypeDynamicProps = (target: IPublicModelSettingTarget) => Record<string, unknown>;
