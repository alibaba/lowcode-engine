import { warning } from './log';
import { typeOf } from './object';

/**
 * 将字符串转化为驼峰式写法
 * @param  {String} str 例：-webkit-transition
 * @return {String}     例：WebkitTransition
 */
export function camelcase(str) {
    if (!/-/.test(str)) {
        return str || '';
    }
    return str.toLowerCase().replace(/-([a-z])/g, function ($0, $1) {
        return $1.toUpperCase();
    });
}

/**
 * 将驼峰式字符串转化为连字符写法
 * @param  {String} str 例：WebkitTransition
 * @return {String}     例：-webkit-transition
 */
export function hyphenate(str) {
    var strType = typeOf(str);
    if (strType !== 'String') {
        warning('[ hyphenate(str: string): string ] ' + ('Expected arguments[0] to be a string but get a ' + strType + '.') + 'It will return an empty string without any processing.');
        return '';
    }
    return str.replace(/([A-Z])/g, function ($0) {
        return '-' + $0.toLowerCase();
    });
}

/**
 * 替换模板字符串
 * @param {String} tpl     例：当前{current}, 共{total}页
 * @param {Object} object  例：{current: 1, total: 9}
 * @return {String}        例：
 */
export function template(tpl) {
    var object = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var tplType = typeOf(tpl);
    if (tplType !== 'String') {
        warning('[ template(tpl: string, object: object): string ] ' + ('Expected arguments[0] to be a string but get a ' + tplType + '.') + 'It will return an empty string without any processing.');
        return '';
    }

    return tpl.replace(/\{[a-z]*\}/g, function (str) {
        var key = str.substring(1, str.length - 1);
        return object[key] || '';
    });
}