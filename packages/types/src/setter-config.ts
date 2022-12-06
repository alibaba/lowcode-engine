import { ComponentType, ReactElement } from 'react';
import { TitleContent } from './title';
import { SettingTarget } from './setting-target';
import { CompositeValue } from './value-type';

export type CustomView = ReactElement | ComponentType<any>;
export type DynamicProps = (target: SettingTarget) => Record<string, unknown>;
export type DynamicSetter = (target: SettingTarget) => string | SetterConfig | CustomView;

/**
 * 设置器配置
 */
export interface SetterConfig {
  // if *string* passed must be a registered Setter Name
  /**
   * 配置设置器用哪一个 setter
   */
  componentName: string | CustomView;
  /**
   * 传递给 setter 的属性
   *
   * the props pass to Setter Component
   */
  props?: Record<string, unknown> | DynamicProps;
  /**
   * @deprecated
   */
  children?: any;
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
  initialValue?: any | ((target: SettingTarget) => any);
  // for MixedSetter
  /**
   * 给 MixedSetter 时切换 Setter 展示用的
   */
  title?: TitleContent;
  // for MixedSetter check this is available
  /**
   * 给 MixedSetter 用于判断优先选中哪个
   */
  condition?: (target: SettingTarget) => boolean;
  /**
   * 给 MixedSetter，切换值时声明类型
   *
   * @todo 物料协议推进
   */
  valueType?: CompositeValue[];
  // 标识是否为动态 setter，默认为 true
  isDynamic?: boolean;
}

// if *string* passed must be a registered Setter Name, future support blockSchema
export type SetterType = SetterConfig | SetterConfig[] | string | CustomView;