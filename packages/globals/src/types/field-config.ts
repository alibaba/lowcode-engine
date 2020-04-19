import { TitleContent } from './title';
import { SetterType, DynamicSetter } from './setter-config';


export interface FieldExtraProps {
  /**
   * 是否必填参数
   */
  isRequired?: boolean;
  /**
   * default value of target prop for setter use
   */
  defaultValue?: any;
  getValue?: (field: any, fieldValue: any) => any;
  setValue?: (field: any, value: any) => void;
  /**
   * the field conditional show, is not set always true
   * @default undefined
   */
  condition?: (field: any) => boolean;
  /**
   * autorun when something change
   */
  autorun?: (field: any) => void;
  /**
   * is this field is a virtual field that not save to schema
   */
  virtual?: (field: any) => boolean;
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
}
