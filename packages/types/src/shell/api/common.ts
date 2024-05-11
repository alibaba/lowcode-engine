import { Component, ReactNode } from 'react';
import { IPublicTypeNodeSchema, IPublicTypeTitleContent } from '../type';
import { IPublicEnumTransitionType } from '../enum';

export interface IPublicApiCommonUtils {
  /**
   * 是否为合法的 schema 结构
   * check if data is valid NodeSchema
   *
   * @param {*} data
   * @returns {boolean}
   */
  isNodeSchema(data: any): boolean;

  /**
   * 是否为表单事件类型
   * check if e is a form event
   * @param {(KeyboardEvent | MouseEvent)} e
   * @returns {boolean}
   */
  isFormEvent(e: KeyboardEvent | MouseEvent): boolean;

  /**
   * 从 schema 结构中查找指定 id 节点
   * get node schema from a larger schema with node id
   * @param {IPublicTypeNodeSchema} schema
   * @param {string} nodeId
   * @returns {(IPublicTypeNodeSchema | undefined)}
   */
  getNodeSchemaById(
    schema: IPublicTypeNodeSchema,
    nodeId: string,
  ): IPublicTypeNodeSchema | undefined;

  // TODO: add comments
  getConvertedExtraKey(key: string): string;

  // TODO: add comments
  getOriginalExtraKey(key: string): string;

  /**
   * 批处理事务，用于优化特定场景的性能
   * excute something in a transaction for performence
   *
   * @param {() => void} fn
   * @param {IPublicEnumTransitionType} type
   * @since v1.0.16
   */
  executeTransaction(fn: () => void, type: IPublicEnumTransitionType): void;

  /**
   * i18n 相关工具
   * i18n tools
   *
   * @param {(string | object)} instance
   * @returns {{
   *     intlNode(id: string, params?: object): ReactNode;
   *     intl(id: string, params?: object): string;
   *     getLocale(): string;
   *     setLocale(locale: string): void;
   *   }}
   * @since v1.0.17
   */
  createIntl(instance: string | object): {
    intlNode(id: string, params?: object): ReactNode;
    intl(id: string, params?: object): string;
    getLocale(): string;
    setLocale(locale: string): void;
  };
}

export interface IPublicApiCommonSkeletonCabin {
  /**
   * 编辑器框架 View
   * get Workbench Component
   */
  get Workbench(): Component;
}

export interface IPublicApiCommonEditorCabin {
  /**
   * Title 组件
   * @experimental unstable API, pay extra caution when trying to use this
   */
  get Tip(): React.ComponentClass;

  /**
   * Tip 组件
   * @experimental unstable API, pay extra caution when trying to use this
   */
  get Title(): React.ComponentClass<{
    title: IPublicTypeTitleContent | undefined;
    match?: boolean;
    keywords?: string | null;
  }>;
}
