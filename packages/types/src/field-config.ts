import { TitleContent } from './title';
import { SetterType, DynamicSetter } from './setter-config';
import { SettingTarget } from './setting-target';
import { LiveTextEditingConfig } from './metadata';

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
  // todo 这个 omit 是否合理？
  liveTextEditing?: Omit<LiveTextEditingConfig, 'propTarget'>;
}

export interface FieldConfig extends FieldExtraProps {
  type?: 'field' | 'group';
  /**
   * the name of this setting field, which used in quickEditor
   */
  name: string | number;
  /**
   * the field title
   * @default sameas .name
   */
  title?: TitleContent;
  /**
   * the field body contains when .type = 'field'
   */
  setter?: SetterType | DynamicSetter;
  /**
   * the setting items which group body contains when .type = 'group'
   */
  items?: FieldConfig[];
  /**
   * extra props for field
   */
  extraProps?: FieldExtraProps;
  /**
   * todo 待补充文档
   */
  description?: TitleContent;
  /**
   * todo 待补充文档
   */
  isExtends?: boolean;
}
