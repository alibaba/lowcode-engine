import _debug from 'debug';

export * from './schema/types';

/**
 * Dev helper
 */
export const debug = _debug('lowcode');
export const enableDebug = () => _debug.enable('lowcode:*');
export const disableDebug = () => _debug.disable();
