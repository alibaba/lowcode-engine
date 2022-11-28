import { isFormEvent, compatibleLegaoSchema, getNodeSchemaById, transactionManager } from '@alilc/lowcode-utils';
import { isNodeSchema } from '@alilc/lowcode-types';
import { getConvertedExtraKey, getOriginalExtraKey } from '@alilc/lowcode-designer';
import { createIntl } from '@alilc/lowcode-editor-core';

const utils = {
  isNodeSchema,
  isFormEvent,
  compatibleLegaoSchema,
  getNodeSchemaById,
  getConvertedExtraKey,
  getOriginalExtraKey,
  executeTransaction: transactionManager.executeTransaction.bind(transactionManager),
  createIntl,
};

export default utils;