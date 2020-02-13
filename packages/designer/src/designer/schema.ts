// 表达式
export interface JSExpression {
  type: 'JSExpression';
  /**
   * 表达式字符串
   */
  value: string;
  /**
   * 模拟值
   */
  mock?: any;
}

export interface JSSlot {
  type: 'JSSlot';
  value: NodeSchema;
}

// JSON 基本类型
export type JSONValue = boolean | string | number | null | JSONArray | JSONObject;
export type JSONArray = JSONValue[];
export interface JSONObject {
  [key: string]: JSONValue;
}

// 复合类型
export type CompositeValue = JSONValue | JSExpression | JSSlot | CompositeArray | CompositeObject;
export type CompositeArray = CompositeValue[];
export interface CompositeObject {
  [key: string]: CompositeValue;
}

export interface NpmInfo {
  componentName: string;
  package: string;
  version: string;
  destructuring?: boolean;
  exportName?: string;
  subName?: string;
  main?: string;
}

export type ComponentsMap = NpmInfo[];

export type UtilsMap = Array<
| {
  name: string;
  type: 'npm';
  content: NpmInfo;
}
| {
  name: string;
  type: '';
}
>;

// lang "en-US" | "zh-CN" | "zh-TW" | ...
export interface I18nMap {
  [lang: string]: { [key: string]: string };
}

export interface DataSourceConfig {
  id: string;
  isInit: boolean;
  type: string;
  options: {
    uri: string;
    [option: string]: CompositeValue;
  };
  [otherKey: string]: CompositeValue;
}

export interface NodeSchema {
  id?: string;
  componentName: string;
  props?: PropsMap | PropsList;
  leadingComponents?: string;
  condition?: CompositeValue;
  loop?: CompositeValue;
  loopArgs?: [string, string];
  children?: NodeData | NodeData[];
}

export type PropsMap = CompositeObject;
export type PropsList = Array<{
  spread?: boolean;
  name?: string;
  value: CompositeValue;
}>;

export type NodeData = NodeSchema | JSExpression | DOMText;

export interface JSExpression {
  type: 'JSExpression';
  value: string;
}

export function isJSExpression(data: any): data is JSExpression {
  return data && data.type === 'JSExpression';
}

export function isDOMText(data: any): data is DOMText {
  return typeof data === 'string';
}

export type DOMText = string;

export interface RootSchema extends NodeSchema {
  componentName: 'Block' | 'Page' | 'Component';
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
  dataSource?: {
    items: DataSourceConfig[];
  };
  defaultProps?: CompositeObject;
}

export interface BlockSchema extends RootSchema {
  componentName: 'Block';
}

export interface PageSchema extends RootSchema {
  componentName: 'Page';
}

export interface ComponentSchema extends RootSchema {
  componentName: 'Component';
}

export interface ProjectSchema {
  version: string;
  componentsMap: ComponentsMap;
  componentsTree: RootSchema[];
  i18n?: I18nMap;
  utils?: UtilsMap;
  constants?: JSONObject;
  css?: string;
  dataSource?: {
    items: DataSourceConfig[];
  };
}

export function isNodeSchema(data: any): data is NodeSchema {
  return data && data.componentName;
}

export function isProjectSchema(data: any): data is ProjectSchema {
  return data && data.componentsTree;
}
