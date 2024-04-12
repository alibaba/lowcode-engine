import { IPublicTypeTitleContent, IPublicTypeSetterType, IPublicTypeFieldExtraProps, IPublicTypeDynamicSetter } from './';

/**
 * 属性面板配置
 */
export interface IPublicTypeFieldConfig extends IPublicTypeFieldExtraProps {

  /**
   * 面板配置隶属于单个 field 还是分组
   */
  type?: 'field' | 'group';

  /**
   * the name of this setting field, which used in quickEditor
   */
  name?: string | number;

  /**
   * the field title
   * @default sameas .name
   */
  title?: IPublicTypeTitleContent;

  /**
   * 单个属性的 setter 配置
   *
   * the field body contains when .type = 'field'
   */
  setter?: IPublicTypeSetterType | IPublicTypeDynamicSetter;

  /**
   * the setting items which group body contains when .type = 'group'
   */
  items?: IPublicTypeFieldConfig[];

  /**
   * extra props for field
   * 其他配置属性（不做流通要求）
   */
  extraProps?: IPublicTypeFieldExtraProps;
}
