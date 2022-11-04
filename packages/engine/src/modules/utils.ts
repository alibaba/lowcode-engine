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
  startTransaction: transactionManager.startTransaction,
};

export default utils;