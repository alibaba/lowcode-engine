/* tslint:disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * json schema for low code component protocol
 */
export type ComponentMeta = BasicSection & PropsSection & ConfigureSection;
export type PropType = BasicType | RequiredType | ComplexType;
export type BasicType = "array" | "bool" | "func" | "number" | "object" | "string" | "node" | "element" | "any";
export type ComplexType = OneOf | OneOfType | ArrayOf | ObjectOf | Shape | Exact;
export type ConfigureProp = {
  title?: string;
  extraProps?: {
    [k: string]: any;
  };
  [k: string]: any;
} & (ConfigureFieldProp | ConfigureGroupProp);

export interface BasicSection {
  componentName: string;
  title: string;
  description?: string;
  docUrl?: string;
  screenshot?: string;
  icon?: string;
  tags?: string[];
  devMode?: "proCode" | "lowCode";
  npm: Npm;
  [k: string]: any;
}
export interface Npm {
  package: string;
  exportName: string;
  subName: string;
  main: string;
  destructuring: boolean;
  version: string;
  [k: string]: any;
}
export interface PropsSection {
  props: {
    name: string;
    propType: PropType;
    description?: string;
    defaultValue?: any;
    [k: string]: any;
  }[];
  [k: string]: any;
}
export interface RequiredType {
  type: BasicType;
  isRequired?: boolean;
}
export interface OneOf {
  type: "oneOf";
  value: (string | number | boolean)[];
  isRequired?: boolean;
  [k: string]: any;
}
export interface OneOfType {
  type: "oneOfType";
  value: PropType[];
  isRequired?: boolean;
  [k: string]: any;
}
export interface ArrayOf {
  type: "arrayOf";
  value: PropType;
  isRequired?: boolean;
  [k: string]: any;
}
export interface ObjectOf {
  type: "objectOf";
  value: PropType;
  isRequired?: boolean;
  [k: string]: any;
}
export interface Shape {
  type: 'shape';
  value: {
    name?: string;
    propType?: PropType;
  }[];
  isRequired?: boolean;
  [k: string]: any;
}
export interface Exact {
  type: 'exact';
  value: {
    name?: string;
    propType?: PropType;
  }[];
  isRequired?: boolean;
  [k: string]: any;
}
export interface ConfigureSection {
  configure?: {
    props?: ConfigureProp[];
    styles?: {
      [k: string]: any;
    };
    events?: {
      [k: string]: any;
    };
    component?: ConfigureComponent;
    [k: string]: any;
  };
  [k: string]: any;
}
export interface ConfigureFieldProp {
  type: "field";
  name?: string;
  setter?: ConfigureFieldSetter;
  [k: string]: any;
}
export interface ConfigureFieldSetter {
  componentName:
    | "List"
    | "Object"
    | "Function"
    | "Node"
    | "Mixin"
    | "Expression"
    | "Switch"
    | "Number"
    | "Input"
    | "TextArea"
    | "Date"
    | "DateYear"
    | "DateMonth"
    | "DateRange"
    | "ColorPicker"
    | "CodeEditor"
    | "Select"
    | "RadioGroup";
  props?: {
    [k: string]: any;
  };
  [k: string]: any;
}
export interface ConfigureGroupProp {
  type: "group";
  items: ConfigureProp[];
  [k: string]: any;
}
export interface ConfigureComponent {
  isContainer?: boolean;
  isModal?: boolean;
  descriptor?: string;
  nestingRule?: {
    childWhitelist?: string[];
    parentWhitelist?: string[];
    descendantBlacklist?: string[];
    ancestorWhitelist?: string[];
    [k: string]: any;
  };
  isNullNode?: boolean;
  isLayout?: boolean;
  [k: string]: any;
}
