import { isFormEvent, compatibleLegaoSchema, getNodeSchemaById, isNodeSchema } from '@alilc/lowcode-utils';

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