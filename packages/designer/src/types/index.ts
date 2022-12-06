import { getSetter, registerSetter, getSettersMap } from '@alilc/lowcode-editor-core';
import { isFormEvent, compatibleLegaoSchema, getNodeSchemaById, isNodeSchema } from '@alilc/lowcode-utils';

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