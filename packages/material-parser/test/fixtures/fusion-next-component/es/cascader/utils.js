/* eslint-disable valid-jsdoc */
export function normalizeToArray(values) {
    if (values !== undefined && values !== null) {
        if (Array.isArray(values)) {
            return [].concat(values);
        }

        return [values];
    }

    return [];
}

/**
 * 判断子节点是否是选中状态，如果 checkable={false} 则向下递归，
 * @param {Node} child
 * @param {Array} checkedValues
 */
export function isNodeChecked(node, checkedValues) {
    if (node.disabled || node.checkboxDisabled) return true;
    /* istanbul ignore next */
    if (node.checkable === false) {
        return !node.children || node.children.length === 0 || node.children.every(function (c) {
            return isNodeChecked(c, checkedValues);
        });
    }
    return checkedValues.indexOf(node.value) > -1;
}

/**
 * 遍历所有可用的子节点
 * @param {Node}
 * @param {Function} callback
 */
export function forEachEnableNode(node) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

    if (node.disabled || node.checkboxDisabled) return;
    // eslint-disable-next-line callback-return
    callback(node);
    if (node.children && node.children.length > 0) {
        node.children.forEach(function (child) {
            return forEachEnableNode(child, callback);
        });
    }
}
/**
 * 判断节点是否禁用checked
 * @param {Node} node
 * @returns {Boolean}
 */
export function isNodeDisabledChecked(node) {
    if (node.disabled || node.checkboxDisabled) return true;
    /* istanbul ignore next */
    if (node.checkable === false) {
        return !node.children || node.children.length === 0 || node.children.every(isNodeDisabledChecked);
    }

    return false;
}

/**
 * 递归获取一个 checkable = {true} 的父节点，当 checkable={false} 时继续往上查找
 * @param {Node} node
 * @param {Map} _p2n
 * @return {Node}
 */
export function getCheckableParentNode(node, _p2n) {
    var parentPos = node.pos.split(['-']);
    if (parentPos.length === 2) return node;
    parentPos.splice(parentPos.length - 1, 1);
    parentPos = parentPos.join('-');
    var parentNode = _p2n[parentPos];
    if (parentNode.disabled || parentNode.checkboxDisabled) return false;
    /* istanbul ignore next */
    if (parentNode.checkable === false) {
        return getCheckableParentNode(parentNode, _p2n);
    }

    return parentNode;
}
/**
 * 过滤子节点
 * @param {Array} values
 * @param {Object} _v2n
 */
export function filterChildValue(values, _v2n, _p2n) {
    var newValues = [];
    values.forEach(function (value) {
        var node = getCheckableParentNode(_v2n[value], _p2n);
        if (!node || node.checkable === false || node === _v2n[value] || values.indexOf(node.value) === -1) {
            newValues.push(value);
        }
    });
    return newValues;
}

export function filterParentValue(values, _v2n) {
    var newValues = [];

    for (var i = 0; i < values.length; i++) {
        var node = _v2n[values[i]];
        if (!node.children || node.children.length === 0 || node.children.every(isNodeDisabledChecked)) {
            newValues.push(values[i]);
        }
    }

    return newValues;
}

export function isDescendantOrSelf(currentPos, targetPos) {
    if (!currentPos || !targetPos) {
        return false;
    }

    var currentNums = currentPos.split('-');
    var targetNums = targetPos.split('-');

    return currentNums.length <= targetNums.length && currentNums.every(function (num, index) {
        return num === targetNums[index];
    });
}

export function isSiblingOrSelf(currentPos, targetPos) {
    var currentNums = currentPos.split('-').slice(0, -1);
    var targetNums = targetPos.split('-').slice(0, -1);

    return currentNums.length === targetNums.length && currentNums.every(function (num, index) {
        return num === targetNums[index];
    });
}

// eslint-disable-next-line max-statements
export function getAllCheckedValues(checkedValues, _v2n, _p2n) {
    checkedValues = normalizeToArray(checkedValues);
    var filteredValues = checkedValues.filter(function (value) {
        return !!_v2n[value];
    });
    var flatValues = [].concat(filterChildValue(filteredValues, _v2n, _p2n), filteredValues.filter(function (value) {
        return _v2n[value].disabled || _v2n[value].checkboxDisabled;
    }));
    var removeValue = function removeValue(child) {
        if (child.disabled || child.checkboxDisabled) return;
        if (child.checkable === false && child.children && child.children.length > 0) {
            return child.children.forEach(removeValue);
        }
        flatValues.splice(flatValues.indexOf(child.value), 1);
    };

    var addParentValue = function addParentValue(i, parent) {
        return flatValues.splice(i, 0, parent.value);
    };

    var values = [].concat(flatValues);
    for (var i = 0; i < values.length; i++) {
        var pos = _v2n[values[i]].pos;
        var nums = pos.split('-');
        if (nums.length === 2) {
            break;
        }
        for (var j = nums.length - 2; j > 0; j--) {
            var parentPos = nums.slice(0, j + 1).join('-');
            var parent = _p2n[parentPos];
            if (parent.checkable === false || parent.disabled || parent.checkboxDisabled) continue;
            var parentChecked = parent.children.every(function (child) {
                return isNodeChecked(child, flatValues);
            });
            if (parentChecked) {
                parent.children.forEach(removeValue);
                addParentValue(i, parent);
            } else {
                break;
            }
        }
    }

    var newValues = [];
    flatValues.forEach(function (value) {
        if (_v2n[value].disabled || _v2n[value].checkboxDisabled) {
            newValues.push(value);
            return;
        }
        forEachEnableNode(_v2n[value], function (node) {
            if (node.checkable === false) return;
            newValues.push(node.value);
        });
    });

    return newValues;
}