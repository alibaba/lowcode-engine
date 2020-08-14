import { isProduction } from './env';

/* eslint no-console: 0 */

/**
 * 反对使用某一方法或属性的警告
 * @param  {String} props     过时的属性或方法名
 * @param  {String} instead   替代的属性或方法名
 * @param  {String} component 组件名
 *
 * @example
 * log.deprecated('onBeforeClose', 'beforeClose', 'Dialog');
 * // Warning: onBeforeClose is deprecated at [ Dialog ], use [ beforeClose ] instead of it.
 */
export function deprecated(props, instead, component) {
    /* istanbul ignore else */
    if (!isProduction() && typeof console !== 'undefined' && console.error) {
        return console.error('Warning: [ ' + props + ' ] is deprecated at [ ' + component + ' ], ' + ('use [ ' + instead + ' ] instead of it.'));
    }
}

/**
 * 控制台警告日志
 * @param {String} msg
 * @return {Console<Error> | void}
 */
export function warning(msg) {
    /* istanbul ignore else */
    if (!isProduction() && typeof console !== 'undefined' && console.error) {
        return console.error('Warning: ' + msg);
    }
}