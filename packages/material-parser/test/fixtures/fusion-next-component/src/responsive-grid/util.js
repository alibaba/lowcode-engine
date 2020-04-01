import { obj } from '../util';

const { isPlainObject } = obj;

/**
 * 过滤 undefined 类型的值
 * @param  {*}  obj
 * @return {Object}
 */
export function filterUndefinedValue(object) {
    if (!isPlainObject(object)) {
        return object;
    }

    const obj = {};

    Object.keys(object).forEach(key => {
        const value = object[key];

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
    const newObject = {};

    Object.keys(obj).forEach(key => {
        if (!(key in subObj)) {
            newObject[key] = obj[key];
        }
    });
    return newObject;
}
