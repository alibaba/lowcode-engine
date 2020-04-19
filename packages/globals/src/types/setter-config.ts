import { isReactComponent } from '../utils';
import { ComponentType, ReactElement, isValidElement } from 'react';
import { TitleContent } from './title';

export type CustomView = ReactElement | ComponentType<any>;

export type DynamicProps = (field: any) => object;
export type DynamicSetter = (field: any) => string | SetterConfig | CustomView;

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
  initialValue?: any | ((field: any) => any);
  /* for MixedSetter */
  title?: TitleContent;
  // for MixedSetter check this is available
  condition?: (field: any) => boolean;
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
  return obj && typeof obj === 'function' && !obj.displayName;
}
