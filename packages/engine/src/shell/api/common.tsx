import {
  isFormEvent as innerIsFormEvent,
  getNodeSchemaById as innerGetNodeSchemaById,
  transactionManager,
  isNodeSchema as innerIsNodeSchema,
} from '@alilc/lowcode-utils';
import {
  IPublicTypeNodeSchema,
  IPublicEnumTransitionType,
  IPublicApiCommonUtils,
  IPublicTypeI18nData,
} from '@alilc/lowcode-types';
import {
  getConvertedExtraKey as innerGetConvertedExtraKey,
  getOriginalExtraKey as innerGetOriginalExtraKey,
} from '@alilc/lowcode-designer';
import {
  createIntl as innerCreateIntl,
  intl as innerIntl,
} from '@alilc/lowcode-editor-core';
import { ReactNode } from 'react';

export interface IPublicApiCommon {
  get utils(): IPublicApiCommonUtils;
}

export class Common implements IPublicApiCommon {
  private readonly __utils: Utils;

  constructor() {
    this.__utils = new Utils();
  }

  get utils(): Utils {
    return this.__utils;
  }
}


class Utils implements IPublicApiCommonUtils {
  isNodeSchema(data: any): data is IPublicTypeNodeSchema {
    return innerIsNodeSchema(data);
  }

  isFormEvent(e: KeyboardEvent | MouseEvent): boolean {
    return innerIsFormEvent(e);
  }

  getNodeSchemaById(
    schema: IPublicTypeNodeSchema,
    nodeId: string,
  ): IPublicTypeNodeSchema | undefined {
    return innerGetNodeSchemaById(schema, nodeId);
  }

  getConvertedExtraKey(key: string): string {
    return innerGetConvertedExtraKey(key);
  }

  getOriginalExtraKey(key: string): string {
    return innerGetOriginalExtraKey(key);
  }

  executeTransaction(
    fn: () => void,
    type: IPublicEnumTransitionType = IPublicEnumTransitionType.REPAINT,
  ): void {
    transactionManager.executeTransaction(fn, type);
  }

  createIntl(instance: string | object): {
    intlNode(id: string, params?: object): ReactNode;
    intl(id: string, params?: object): string;
    getLocale(): string;
    setLocale(locale: string): void;
  } {
    return innerCreateIntl(instance);
  }

  intl(data: IPublicTypeI18nData | string, params?: object): any {
    return innerIntl(data, params);
  }
}
