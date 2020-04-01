import React from 'react';

/**
 * 获取对象的类型
 * @param  {*} obj
 * @return {String}
 *
 * @example
 * typeOf([]) === 'Array'
 * typeOf() === 'Undefined'
 * typeOf(1) === 'Number'
 */
export function typeOf(obj) {
    return Object.prototype.toString.call(obj).replace(/\[object\s|]/g, '');
}

/**
 * 判断是否是数组或类数组对象
 * @param  {*}  obj
 * @return {Boolean}
 *
 * @example
 * isArrayLike([]) === true
 * isArrayLike(arguments) === true
 * isArrayLike(this.props.children) === true
 */
export function isArrayLike(obj) {
    const length = !!obj && 'length' in obj && obj.length;
    const type = typeOf(obj);

    return (
        type === 'Array' ||
        length === 0 ||
        (typeof length === 'number' && length > 0 && length - 1 in obj)
    );
}

/**
 * 判断对象是否是一个promise，即是否可以用.then
 * @param  {*}  obj
 * @return {Boolean}
 */
export function isPromise(obj) {
    return (
        !!obj &&
        (typeof obj === 'object' || typeof obj === 'function') &&
        typeof obj.then === 'function'
    );
}

/**
 * 是否是一个纯净的对象
 * @param  {*}  obj
 * @return {Boolean}
 * @reference https://github.com/jonschlinkert/is-plain-object
 */
export function isPlainObject(obj) {
    if (typeOf(obj) !== 'Object') {
        return false;
    }

    const ctor = obj.constructor;

    if (typeof ctor !== 'function') {
        return false;
    }

    const prot = ctor.prototype;

    if (typeOf(prot) !== 'Object') {
        return false;
    }

    if (!prot.hasOwnProperty('isPrototypeOf')) {
        return false;
    }

    return true;
}

/**
 * 对象浅比较
 * @param  {Object} objA
 * @param  {Object} objB
 * @param  {Function}  [compare] 手动调用方法比较
 * @return {Boolean}      对象浅比较是否相等
 *
 * @example
 * object.shallowEqual({a: 100}, {a: 100}); // true
 */
export function shallowEqual(objA, objB, compare) {
    if (objA === objB) {
        return true;
    }

    // 其中一个不是object，则不相等
    if (!objA || !objB || typeof objA + typeof objB !== 'objectobject') {
        return false;
    }

    const keyA = Object.keys(objA);
    const keyB = Object.keys(objB);
    const len = keyA.length;

    // key 数量不一致则不相等
    if (len !== keyB.length) {
        return false;
    }

    const hasCallback = typeof compare === 'function';

    for (let i = 0; i < len; i++) {
        const key = keyA[i];

        if (!Object.prototype.hasOwnProperty.call(objB, key)) {
            return false;
        }

        const valA = objA[key];
        const valB = objB[key];

        const ret = hasCallback ? compare(valA, valB, key) : void 0;

        if (ret === false || (ret === void 0 && valA !== valB)) {
            return false;
        }
    }

    return true;
}

/**
 * 遍历对象或数组，或者类数组，例如React中的children对象、arguments等
 * @param  {Object|Array}   obj
 * @param  {Function} callback fn(n, i) or fn(val, key)
 * @param  {Number}   [direction = 1] 是否倒序遍历，只对数组有效
 * @return {Object|Array}
 *
 * @example
 * // 遍历数组
 * object.each([100, 200, 300], (n, i) => console.log(n, i));
 * // 遍历json对象
 * object.each({a: 100, b: 200}, (value, key) => console.log(key, value));
 * // 遍历React子节点
 * object.each(this.props.children, (child, index) => console.log(child));
 * // 遍历arguments
 * object.each(arguments, (arg, i) => console.log(arg));
 */
export function each(obj, callback, direction) {
    const reversed = direction === -1;
    const length = obj.length;
    let value,
        i = reversed ? length - 1 : 0;

    if (isArrayLike(obj)) {
        for (; i < length && i >= 0; reversed ? i-- : i++) {
            value = callback.call(obj[i], obj[i], i);

            if (value === false) {
                break;
            }
        }
    } else {
        for (i in obj) {
            /* istanbul ignore else */
            if (obj.hasOwnProperty(i)) {
                value = callback.call(obj[i], obj[i], i);

                if (value === false) {
                    break;
                }
            }
        }
    }

    return obj;
}

// @private 判断key是否在数组或对象中
const _isInObj = (key, obj, isArray) =>
    isArray ? obj.indexOf(key) > -1 : key in obj;

/**
 * 过滤出其它属性
 * @param  {Object|Array} holdProps 过滤的参照对象，最终的结果只保留不在参照对象中的key
 * @param  {Object} props     被过滤的对象
 * @return {Object}           others
 *
 * @example
 * object.pickOthers(FooComponent.propTypes, this.props);
 * object.pickOthers(['className', 'onChange'], this.props);
 */
export function pickOthers(holdProps, props) {
    const others = {};
    const isArray = typeOf(holdProps) === 'Array';

    for (const key in props) {
        if (!_isInObj(key, holdProps, isArray)) {
            others[key] = props[key];
        }
    }

    return others;
}

/**
 * 过滤出带prefix的属性
 * @param  {Object} holdProps 过滤的参照对象，最终的结果只保留不在参照对象中的key
 * @param  {string} prefix    包含的字符串
 * @return {Object}           others
 *
 * @example
 * object.pickAttrsWith(FooComponent.propTypes, 'data-');
 */
export function pickAttrsWith(holdProps, prefix) {
    const others = {};

    for (const key in holdProps) {
        if (key.match(prefix)) {
            others[key] = holdProps[key];
        }
    }

    return others;
}

/**
 * Checks if value is `null` or `undefined`.
 * @param {*} value
 * @return {Boolean}
 */
export function isNil(value) {
    // It will returns `true` only if `null` or `undefined` compare with `null`
    // with loose equaliy
    return value == null; // eslint-disable-line eqeqeq
}

/**
 * Deep merge two objects.
 * @param target
 * @param ...sources
 * @reference https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge?page=1&tab=votes#tab-top
 */
export function deepMerge(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (!isPlainObject(target)) {
        target = {};
    }

    if (isPlainObject(target) && isPlainObject(source)) {
        for (const key in source) {
            // 如果是object 进行深拷贝
            if (
                isPlainObject(source[key]) &&
                !React.isValidElement(source[key])
            ) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                // fix {a: 'te'}, {a:{b:3}}
                if (!isPlainObject(target[key])) {
                    target[key] = source[key];
                }
                deepMerge(target[key], source[key]);
                // string/number/function/react node 等直接复制
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return deepMerge(target, ...sources);
}

/**
 * 组件是否为 Fucntion Component
 * @param {*} component 传入的组件
 */
export function isFunctionComponent(component) {
    return (
        typeOf(component) === 'Function' &&
        component.prototype.isReactComponent === undefined
    );
}

/**
 * 组件是否为 Class Component
 * @param {*} component  传入的组件
 */
export function isClassComponent(component) {
    return (
        typeOf(component) === 'Function' &&
        component.prototype.isReactComponent !== undefined
    );
}
