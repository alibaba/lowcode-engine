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
  // filePath: string;
  componentName: string;
  props?: PropsSection['props'];
  meta?: {
    exportName?: string;
    subName?: string;
  };
}
