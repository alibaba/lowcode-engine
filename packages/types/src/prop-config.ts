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

/**
 * 组件属性信息
 */
export interface PropConfig {
  /**
   * 属性名称
   */
  name: string;
  /**
   * 属性类型
   */
  propType: PropType;
  /**
   * 属性描述
   */
  description?: string;
  /**
   * 属性默认值
   */
  defaultValue?: any;
  /**
   * @deprecated 已被弃用
   */
  setter?: any;
}
