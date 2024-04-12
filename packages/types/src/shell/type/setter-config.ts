import { IPublicTypeCustomView, IPublicTypeCompositeValue, IPublicTypeTitleContent, IPublicModelSettingField } from '..';
import { IPublicTypeDynamicProps } from './dynamic-props';

/**
 * 设置器配置
 */
export interface IPublicTypeSetterConfig {

  // if *string* passed must be a registered Setter Name
  /**
   * 配置设置器用哪一个 setter
   */
  componentName: string | IPublicTypeCustomView;

  /**
   * 传递给 setter 的属性
   *
   * the props pass to Setter Component
   */
  props?: Record<string, unknown> | IPublicTypeDynamicProps;

  /**
   * 是否必填？
   *
   * ArraySetter 里有个快捷预览，可以在不打开面板的情况下直接编辑
   */
  isRequired?: boolean;

  /**
   * Setter 的初始值
   *
   * @todo initialValue 可能要和 defaultValue 二选一
   */
  initialValue?: any | ((target: IPublicModelSettingField) => any);

  defaultValue?: any;

  // for MixedSetter
  /**
   * 给 MixedSetter 时切换 Setter 展示用的
   */
  title?: IPublicTypeTitleContent;

  // for MixedSetter check this is available
  /**
   * 给 MixedSetter 用于判断优先选中哪个
   */
  condition?: (target: IPublicModelSettingField) => boolean;

  /**
   * 给 MixedSetter，切换值时声明类型
   *
   * @todo 物料协议推进
   */
  valueType?: IPublicTypeCompositeValue[];

  // 标识是否为动态 setter，默认为 true
  isDynamic?: boolean;
}
