import { ComponentsMap } from './npm';
import { CompositeValue, JSExpression, CompositeObject, JSONObject } from './value-type';
import { DataSource } from './data-source';
import { I18nMap } from './i18n';
import { UtilsMap } from './utils';

export interface NodeSchema {
  id?: string;
  componentName: string;
  props?: PropsMap | PropsList;
  leadingComponents?: string;
  condition?: CompositeValue;
  loop?: CompositeValue;
  loopArgs?: [string, string];
  children?: NodeData | NodeData[];

  // ------- future support -----
  conditionGroup?: string;
  title?: string;
  ignore?: boolean;
  locked?: boolean;
  hidden?: boolean;
}

export type PropsMap = CompositeObject;
export type PropsList = Array<{
  spread?: boolean;
  name?: string;
  value: CompositeValue;
}>;

export type NodeData = NodeSchema | JSExpression | DOMText;

export function isDOMText(data: any): data is DOMText {
  return typeof data === 'string';
}

export type DOMText = string;

export interface ContainerSchema extends NodeSchema {
  componentName: string; // 'Block' | 'Page' | 'Component';
  fileName: string;
  meta?: object;
  state?: {
    [key: string]: CompositeValue;
  };
  methods?: {
    [key: string]: JSExpression;
  };
  lifeCycles?: {
    [key: string]: JSExpression;
  };
  css?: string;
  dataSource?: DataSource;
  defaultProps?: CompositeObject;
}

export interface PageSchema extends ContainerSchema {
  componentName: 'Page';
}

export interface ComponentSchema extends ContainerSchema {
  componentName: 'Component';
}

export type RootSchema = PageSchema | ComponentSchema;

export interface BlockSchema extends NodeSchema {
  componentName: 'Block';
}
export interface SlotSchema extends NodeSchema {
  name?: string;
  componentName: 'Slot';
  params?: string[];
}

export interface ProjectSchema {
  version: string;
  componentsMap: ComponentsMap;
  componentsTree: RootSchema[];
  i18n?: I18nMap;
  utils?: UtilsMap;
  constants?: JSONObject;
  css?: string;
  dataSource?: DataSource;
  id?: string;
}

export function isNodeSchema(data: any): data is NodeSchema {
  return data && data.componentName;
}

export function isProjectSchema(data: any): data is ProjectSchema {
  return data && data.componentsTree;
}