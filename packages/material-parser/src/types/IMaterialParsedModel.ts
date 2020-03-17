import { PropsSection } from '../otter-core';
/**
 * 对应解析器分析出的一些关键信息
 */
export interface IPropType {
  name: string;
  type: string;
  value?: IPropTypes;
  required: boolean;
}

export type IPropTypes = IPropType[];

export interface IMaterialParsedModel {
  filePath: string;
  defaultExportName: string;
  props?: PropsSection['props'];
  componentNames: Array<{
    exportedName: string;
    localName: string;
    source?: string;
  }>;
  importModules: Array<{
    importDefaultName?: string;
    importName?: string;
    localName?: string;
    source: string;
  }>;
  exportModules: Array<{
    exportedName: string;
    localName: string;
    source?: string;
  }>;
  /**
   * 子模块，形如：Demo.SubModule = value; 或者 Demo.SubModule.Sub = subValue;
   */
  subModules: Array<{
    objectName: string[];
    propertyName: string;
    value?: string;
    // value 是否对应匿名函数
    isValueAnonymousFunc: boolean;
  }>;
  propsTypes: IPropTypes;
  propsDefaults: Array<{
    name: string;
    defaultValue: any;
  }>;
}
