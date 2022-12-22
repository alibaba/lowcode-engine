import { IPublicTypeCustomView, IPublicTypeTitleContent } from './';

export interface IPublicTypeRegisteredSetter {
  component: IPublicTypeCustomView;
  defaultProps?: object;
  title?: IPublicTypeTitleContent;
  /**
   * for MixedSetter to check this setter if available
   */
  condition?: (field: any) => boolean;
  /**
   * for MixedSetter to manual change to this setter
   */
  initialValue?: any | ((field: any) => any);
  recommend?: boolean;
  // 标识是否为动态 setter，默认为 true
  isDynamic?: boolean;
}
