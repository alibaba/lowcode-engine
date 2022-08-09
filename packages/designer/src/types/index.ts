import { getSetter, registerSetter, getSettersMap } from '@alilc/lowcode-editor-core';
import { isFormEvent, compatibleLegaoSchema, getNodeSchemaById } from '@alilc/lowcode-common-utils';
import { isNodeSchema } from '@alilc/lowcode-types';

export type Setters = {
  getSetter: typeof getSetter;
  registerSetter: typeof registerSetter;
  getSettersMap: typeof getSettersMap;
};

export type NodeRemoveOptions = {
  suppressRemoveEvent?: boolean;
};

export const utils = {
  isNodeSchema,
  isFormEvent,
  compatibleLegaoSchema,
  getNodeSchemaById,
};
export type Utils = typeof utils;

export enum PROP_VALUE_CHANGED_TYPE {
  /**
   * normal set value
   */
  SET_VALUE = 'SET_VALUE',
  /**
   * value changed caused by sub-prop value change
   */
  SUB_VALUE_CHANGE = 'SUB_VALUE_CHANGE',
}

export interface ISetValueOptions {
  disableMutator?: boolean;
  type?: PROP_VALUE_CHANGED_TYPE;
  fromSetHotValue?: boolean;
}