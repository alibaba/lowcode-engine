
import { Component, ReactNode } from 'react';
import { NodeSchema } from '../../schema';
import { TransitionType } from '../../start-transaction';

export interface IPublicCommonUtils {
  isNodeSchema(data: any): boolean;

  isFormEvent(e: KeyboardEvent | MouseEvent): boolean;

  compatibleLegaoSchema(props: any): any;

  getNodeSchemaById(schema: NodeSchema, nodeId: string): NodeSchema | undefined;

  getConvertedExtraKey(key: string): string;

  getOriginalExtraKey(key: string): string;

  executeTransaction(fn: () => void, type: TransitionType): void;

  createIntl(instance: string | object): {
    intlNode(id: string, params?: object): ReactNode;
    intl(id: string, params?: object): string;
    getLocale(): string;
    setLocale(locale: string): void;
  };
}
export interface IPublicCommonSkeletonCabin {
  get Workbench(): Component;
}

export interface IPublicCommonDesignerCabin {
  /**
   * 是否是 SettingField 实例
   *
   * @param {*} obj
   * @returns {obj is SettingField}
   * @memberof DesignerCabin
   */
  isSettingField(obj: any): boolean;
}

export interface IPublicApiCommon {

  get utils(): IPublicCommonUtils;

  get designerCabin(): IPublicCommonDesignerCabin;

  get skeletonCabin(): IPublicCommonSkeletonCabin;
}
