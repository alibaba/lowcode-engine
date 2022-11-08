import { isFormEvent, compatibleLegaoSchema, getNodeSchemaById, transactionManager } from '@alilc/lowcode-utils';
import { isNodeSchema } from '@alilc/lowcode-types';
import { getConvertedExtraKey, getOriginalExtraKey } from '@alilc/lowcode-designer';

const utils = {
  isNodeSchema,
  isFormEvent,
  compatibleLegaoSchema,
  getNodeSchemaById,
  getConvertedExtraKey,
  getOriginalExtraKey,
  executeTransaction: transactionManager.executeTransaction.bind(transactionManager),
};

export default utils;