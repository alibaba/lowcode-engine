import { isFormEvent, compatibleLegaoSchema, getNodeSchemaById, startTransaction } from '@alilc/lowcode-utils';
import { isNodeSchema } from '@alilc/lowcode-types';
import { getConvertedExtraKey, getOriginalExtraKey } from '@alilc/lowcode-designer';

const utils = {
  isNodeSchema,
  isFormEvent,
  compatibleLegaoSchema,
  getNodeSchemaById,
  getConvertedExtraKey,
  getOriginalExtraKey,
  startTransaction: startTransaction.startTransaction,
};

export default utils;