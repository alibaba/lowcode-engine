import { IPublicModelSettingField } from '../model';
import { IPublicTypeLiveTextEditingConfig } from './';

/**
 * extra props for field
 */
export interface IPublicTypeFieldExtraProps {

  /**
   * 是否必填参数
   */
  isRequired?: boolean;

  /**
   * default value of target prop for setter use
   */
  defaultValue?: any;

  /**
   * get value for field
   */
  getValue?: (target: IPublicModelSettingField, fieldValue: any) => any;

  /**
   * set value for field
   */
  setValue?: (target: IPublicModelSettingField, value: any) => void;

  /**
   * the field conditional show, is not set always true
   * @default undefined
   */
  condition?: (target: IPublicModelSettingField) => boolean;

  /**
   * 配置当前 prop 是否忽略默认值处理逻辑，如果返回值是 true 引擎不会处理默认值
   * @returns boolean
   */
  ignoreDefaultValue?: (target: IPublicModelSettingField) => boolean;

  /**
   * autorun when something change
   */
  autorun?: (target: IPublicModelSettingField) => void;

  /**
   * default collapsed when display accordion
   */
  defaultCollapsed?: boolean;

  /**
   * important field
   */
  important?: boolean;

  /**
   * internal use
   */
  forceInline?: number;

  /**
   * 是否支持变量配置
   */
  supportVariable?: boolean;

  /**
   * compatiable vision display
   */
  display?: 'accordion' | 'inline' | 'block' | 'plain' | 'popup' | 'entry';

  // @todo 这个 omit 是否合理？
  /**
   * @todo 待补充文档
   */
  liveTextEditing?: Omit<IPublicTypeLiveTextEditingConfig, 'propTarget'>;

  /**
   * onChange 事件
   */
  onChange?: (value: any, field: any) => void;
}
