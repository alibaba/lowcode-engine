import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _typeof from 'babel-runtime/helpers/typeof';
import _extends from 'babel-runtime/helpers/extends';
import { Children } from 'react';

/**
 * util module
 */

/**
 * 是否是单选模式
 * @param {string} mode
 * @return {boolean} is single mode
 */
export function isSingle(mode) {
    return !mode || mode === 'single';
}

/**
 * 在 Select 中，认为 null 和 undefined 都是空值
 * @param {*} n any object
 * @return {boolean}
 */
export function isNull(n) {
    return n === null || n === undefined;
}

/**
 * 将字符串中的正则表达式关键字符添加转义
 * @param {string} str
 * @return {string}
 */
export function escapeForReg(str) {
    return str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

/**
 * filter by key
 * @param {string} key filter key
 * @param {object} item item object
 * @return {boolean} it's filtered
 */
export function filter(key, item) {
    var _key = escapeForReg('' + key);
    var regExp = new RegExp('(' + _key + ')', 'ig');

    return regExp.test('' + item.value) || regExp.test('' + item.label);
}

/**
 * loop map
 * @param {Array} dataSource
 * @param {function} callback
 * @return {Array}
 * ----
 * @callback ~loopCallback
 * @param {object} option
 */
export function loopMap(dataSource, callback) {
    var result = [];
    dataSource.forEach(function (option) {
        if (option.children) {
            var children = loopMap(option.children, callback);
            children.length && result.push(_extends({}, option, {
                children: children
            }));
        } else {
            // eslint-disable-next-line callback-return
            var tmp = callback(option);
            tmp && result.push(tmp);
        }
    });

    return result;
}

/**
 * Parse dataSource from MenuItem
 * @static
 * @param {Array<Element>} children
 * @param {number} [deep=0] recursion deep level
 */
export function parseDataSourceFromChildren(children) {
    var deep = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    var source = [];

    Children.forEach(children, function (child, index) {
        if (!child) {
            return;
        }
        var type = child.type,
            childProps = child.props;

        var item2 = { deep: deep };

        var isOption = false;
        var isOptionGroup = false;

        if (typeof type === 'function' && type._typeMark === 'next_select_option' || type === 'option') {
            isOption = true;
        }
        if (typeof type === 'function' && type._typeMark === 'next_select_option_group' || type === 'optgroup') {
            isOptionGroup = true;
        }

        if (!isOption && !isOptionGroup) {
            return;
        }

        if (isOption) {
            // option
            // If children is a string, it can be used as value
            var isStrChild = typeof childProps.children === 'string';
            // value > key > string children > index
            item2.value = 'value' in childProps ? childProps.value : 'key' in childProps ? childProps.key : isStrChild ? childProps.children : '' + index;

            item2.label = childProps.label || childProps.children || '' + item2.value;
            item2.title = childProps.title;
            childProps.disabled === true && (item2.disabled = true);
            // You can put your extra data here, and use it in `itemRender` or `labelRender`
            _extends(item2, childProps['data-extra'] || {});
        } else if (isOptionGroup && deep < 1) {
            // option group
            item2.label = childProps.label || 'Group';
            // parse children nodes
            item2.children = parseDataSourceFromChildren(childProps.children, deep + 1);
        }

        source.push(item2);
    });

    return source;
}

/**
 * Normalize dataSource
 * @static
 * @param {Array} dataSource
 * @param {number} [deep=0] recursion deep level
 * ----
 * value priority: value > 'index'
 * label priority: label > 'value' > 'index'
 * disabled: disabled === true
 */
export function normalizeDataSource(dataSource) {
    var deep = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    var source = [];

    dataSource.forEach(function (item, index) {
        // enable array of basic type
        if (/string|boolean|number/.test(typeof item === 'undefined' ? 'undefined' : _typeof(item))) {
            item = { label: '' + item, value: item };
        }

        // filter off addon item
        if (item.__isAddon) {
            return;
        }

        var item2 = { deep: deep };
        // deep < 1: only 2 level allowed
        if (Array.isArray(item.children) && deep < 1) {
            // handle group
            item2.label = item.label || item.value || 'Group ' + index;
            // parse children
            item2.children = normalizeDataSource(item.children, deep + 1);
        } else {
            var _item = item,
                value = _item.value,
                label = _item.label,
                title = _item.title,
                disabled = _item.disabled,
                others = _objectWithoutProperties(_item, ['value', 'label', 'title', 'disabled']);

            item2.value = !isNull(value) ? value : '' + index;
            item2.label = label || '' + item2.value;
            item2.title = title;
            disabled === true && (item2.disabled = true);

            _extends(item2, others);
        }

        source.push(item2);
    });

    return source;
}

/**
 * Get flatten dataSource
 * @static
 * @param  {Array} dataSource structured dataSource
 * @return {Array}
 */
export function flattingDataSource(dataSource) {
    var source = [];

    dataSource.forEach(function (item) {
        if (Array.isArray(item.children)) {
            source.push.apply(source, flattingDataSource(item.children));
        } else {
            source.push(item);
        }
    });

    return source;
}

export function filterDataSource(dataSource, key, filter, addonKey) {
    if (!Array.isArray(dataSource)) {
        return [];
    }
    if (typeof key === 'undefined' || key === null) {
        return [].concat(dataSource);
    }

    var addKey = true;
    var menuDataSource = loopMap(dataSource, function (option) {
        if (key === '' + option.value) {
            addKey = false;
        }
        return filter(key, option) && !option.__isAddon && option;
    });

    // if key not in menuDataSource, add key to dataSource
    if (addonKey && key && addKey) {
        menuDataSource.unshift({
            value: key,
            label: key,
            title: key,
            __isAddon: true
        });
    }

    return menuDataSource;
}

function getKeyItemByValue(value, valueMap) {
    var item = void 0;

    if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value.hasOwnProperty('value')) {
        item = value;
    } else {
        item = valueMap['' + value] || {
            value: value,
            label: value
        };
    }

    return item;
}

/**
 * compute valueDataSource by new value
 * @param {Array/String} value 数据
 * @param {Object} mapValueDS   上个value的缓存数据 value => {value,label} 的映射关系表
 * @param {*} mapMenuDS  通过 dataSource 建立 value => {value,label} 的映射关系表
 * @returns {Object} value: [value]; valueDS: [{value,label}]; mapValueDS: {value: {value,label}}
 */
export function getValueDataSource(value, mapValueDS, mapMenuDS) {
    if (isNull(value)) {
        return {};
    }

    var newValue = [];
    var newValueDS = [];
    var newMapValueDS = {};
    var _newMapDS = _extends({}, mapValueDS, mapMenuDS);

    if (Array.isArray(value)) {
        value.forEach(function (v) {
            var item = getKeyItemByValue(v, _newMapDS);

            newValueDS.push(item);
            newMapValueDS['' + item.value] = item;
            newValue.push(item.value);
        });

        return {
            value: newValue, // [value]
            valueDS: newValueDS, // [{value,label}]
            mapValueDS: newMapValueDS // {value: {value,label}}
        };
    } else {
        var _mapValueDS;

        var item = getKeyItemByValue(value, _newMapDS);

        return {
            value: item.value,
            valueDS: item,
            mapValueDS: (_mapValueDS = {}, _mapValueDS['' + item.value] = item, _mapValueDS)
        };
    }
}

/**
 * Get flatten dataSource
 * @static
 * @param  {any} value structured dataSource
 * @return {String}
 */
export function valueToSelectKey(value) {
    var val = void 0;
    if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value.hasOwnProperty('value')) {
        val = value.value;
    } else {
        val = value;
    }
    return '' + val;
}

/**
 * UP Down 改进双向链表方法
 */
// function DoubleLinkList(element){
//     this.prev = null;
//     this.next = null;
//     this.element = element;
// }
//
// export function mapDoubleLinkList(dataSource){
//
//     const mapDS = {};
//     let doubleLink = null;
//
//     let head = null;
//     let tail = null;
//
//     function  append(element) {
//         if (!doubleLink) {
//             doubleLink = new DoubleLinkList(element);
//             head = doubleLink;
//             tail = doubleLink;
//             return doubleLink;
//         }
//
//         const node = new DoubleLinkList(element);
//         tail.next = node;
//         node.prev = tail;
//         tail = node;
//
//         return tail;
//     }
//
//     dataSource.forEach((item => {
//         if (item.disabled) {
//             return;
//         }
//         mapDS[`${item.value}`] = append(item);
//     }));
//
//     return mapDS;
// }
//