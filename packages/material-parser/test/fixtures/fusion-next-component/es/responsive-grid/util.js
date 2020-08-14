import { obj } from '../util';

var isPlainObject = obj.isPlainObject;

/**
 * 过滤 undefined 类型的值
 * @param  {*}  obj
 * @return {Object}
 */

export function filterUndefinedValue(object) {
    if (!isPlainObject(object)) {
        return object;
    }

    var obj = {};

    Object.keys(object).forEach(function (key) {
        var value = object[key];

        if (value !== undefined) {
            obj[key] = value;
        }
    });

    return obj;
}

/**
 * 从 obj 中去除 subObj
 * @param  {*}  obj
 * @param  {*}  subObj
 * @return {Object}
 */
export function stripObject(obj, subObj) {
    var newObject = {};

    Object.keys(obj).forEach(function (key) {
        if (!(key in subObj)) {
            newObject[key] = obj[key];
        }
    });
    return newObject;
}