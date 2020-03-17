import _debug from 'debug';
import _lodash from 'lodash';

import _OtterError from './OtterError';

export * from './types';
export * from './schema/types';

/**
 * Dev helper
 */
export const debug = _debug('otter');
export const enableDebug = () => _debug.enable('otter:*');
export const disableDebug = () => _debug.disable();

export const OtterError = _OtterError;

/**
 * Dev utils
 */
export const _ = _lodash;
