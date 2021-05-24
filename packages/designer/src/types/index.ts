import { getSetter, registerSetter, getSettersMap } from '@ali/lowcode-editor-core';
import { isFormEvent, compatibleLegaoSchema, getNodeSchemaById } from '@ali/lowcode-utils';
import { isNodeSchema } from '@ali/lowcode-types';

export type Setters = {
  getSetter: typeof getSetter;
  registerSetter: typeof registerSetter;
  getSettersMap: typeof getSettersMap;
};

export type NodeRemoveOptions = {
  suppressRemoveEvent?: boolean;
};

const utils = {
  isNodeSchema,
  isFormEvent,
  compatibleLegaoSchema,
  getNodeSchemaById,
};
export type Utils = typeof utils;