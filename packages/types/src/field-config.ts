import { TitleContent } from './title';
import { SetterType, DynamicSetter } from './setter-config';
import { SettingTarget } from './setting-target';
import { LiveTextEditingConfig } from './metadata';

/**
 * extra props for field
 */
export interface FieldExtraProps {
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
  getValue?: (target: SettingTarget, fieldValue: any) => any;
  /**
   * set value for field
   */
  setValue?: (target: SettingTarget, value: any) => void;
  /**
   * the field conditional show, is not set always true
   * @default undefined
   */
  condition?: (target: SettingTarget) => boolean;
  /**
   * autorun when something change
   */
  autorun?: (target: SettingTarget) => void;
  /**
   * is this field is a virtual field that not save to schema
   */
  virtual?: (target: SettingTarget) => boolean;
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
  liveTextEditing?: Omit<LiveTextEditingConfig, 'propTarget'>;
}

export interface BaseConfig extends FieldExtraProps {
  /**
   * the field title
   * @default sameas .name
   */
  title?: TitleContent;
  /**
   * extra props for field
   * 其他配置属性（不做流通要求）
   */
  extraProps?: FieldExtraProps;
  /**
   * @deprecated
   */
  description?: TitleContent;
  /**
   * @deprecated
   */
  isExtends?: boolean;
}

/**
 * 属性面板配置
 */
export interface FieldConfig extends BaseConfig {
  /**
   * 面板配置隶属于单个 field 还是分组
   */
  type?: 'field';
  /**
   * the name of this setting field, which used in quickEditor
   */
  name: string | number;
  /**
   * 单个属性的 setter 配置
   *
   * the field body contains when .type = 'field'
   */
  setter: SetterType | DynamicSetter;
}

export interface GroupConfig extends BaseConfig {
  type: 'group';
  /**
   * the name of this setting field, which used in quickEditor
   */
  name?: string | number;
  /**
   * the setting items which group body contains when .type = 'group'
   */
  items: FieldConfig[];
}


// setting

export type SettingFieldConfig = FieldConfig | GroupConfig;

export function isGroupConifg(obj: GroupConfig | FieldConfig): obj is GroupConfig {
  return obj && obj.type === 'group';
}

export function isFieldConfig(obj: GroupConfig | FieldConfig): obj is FieldConfig {
  return (obj && !obj.type) || (obj && obj.type === 'field');
}

