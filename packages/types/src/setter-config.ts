import { ComponentClass, Component, ComponentType, ReactElement, isValidElement } from 'react';
import { TitleContent } from './title';
import { SettingTarget } from './setting-target';

function isReactClass(obj: any): obj is ComponentClass<any> {
  return obj && obj.prototype && (obj.prototype.isReactComponent || obj.prototype instanceof Component);
}

function isReactComponent(obj: any): obj is ComponentType<any> {
  return obj && (isReactClass(obj) || typeof obj === 'function');
}

export type CustomView = ReactElement | ComponentType<any>;

export type DynamicProps = (target: SettingTarget) => object;
export type DynamicSetter = (target: SettingTarget) => string | SetterConfig | CustomView;

export interface SetterConfig {
  /**
   * if *string* passed must be a registered Setter Name
   */
  componentName: string | CustomView;
  /**
   * the props pass to Setter Component
   */
  props?: object | DynamicProps;
  children?: any;
  isRequired?: boolean;
  initialValue?: any | ((target: SettingTarget) => any);
  /* for MixedSetter */
  title?: TitleContent;
  // for MixedSetter check this is available
  condition?: (target: SettingTarget) => boolean;
}

/**
 * if *string* passed must be a registered Setter Name, future support blockSchema
 */
export type SetterType = SetterConfig | SetterConfig[] | string | CustomView;

export function isSetterConfig(obj: any): obj is SetterConfig {
  return obj && typeof obj === 'object' && 'componentName' in obj && !isCustomView(obj);
}

export function isCustomView(obj: any): obj is CustomView {
  return obj && (isValidElement(obj) || isReactComponent(obj));
}

export function isDynamicSetter(obj: any): obj is DynamicSetter {
  return obj && typeof obj === 'function' && !isReactClass(obj);
}
