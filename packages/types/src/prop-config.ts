export type PropType = BasicType | RequiredType | ComplexType;
export type BasicType = 'array' | 'bool' | 'func' | 'number' | 'object' | 'string' | 'node' | 'element' | 'any';
export type ComplexType = OneOf | OneOfType | ArrayOf | ObjectOf | Shape | Exact;

export interface RequiredType {
  type: BasicType;
  isRequired?: boolean;
}

export interface OneOf {
  type: 'oneOf';
  value: string[];
  isRequired?: boolean;
}
export interface OneOfType {
  type: 'oneOfType';
  value: PropType[];
  isRequired?: boolean;
}
export interface ArrayOf {
  type: 'arrayOf';
  value: PropType;
  isRequired?: boolean;
}
export interface ObjectOf {
  type: 'objectOf';
  value: PropType;
  isRequired?: boolean;
}
export interface Shape {
  type: 'shape';
  value: PropConfig[];
  isRequired?: boolean;
}
export interface Exact {
  type: 'exact';
  value: PropConfig[];
  isRequired?: boolean;
}

export interface PropConfig {
  name: string;
  propType: PropType;
  description?: string;
  defaultValue?: any;
  setter?: any;
}
