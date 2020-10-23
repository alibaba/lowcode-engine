/* eslint-disable valid-jsdoc */
export function normalizeToArray(keys) {
    if (keys !== undefined && keys !== null) {
        if (Array.isArray(keys)) {
            return [].concat(keys);
        }

        return [keys];
    }

    return [];
}

/**
 * 判断子节点是否是选中状态，如果 checkable={false} 则向下递归，
 * @param {Node} child
 * @param {Array} checkedKeys
 */
export function isNodeChecked(node, checkedKeys) {
    if (node.disabled || node.checkboxDisabled) return true;
    /* istanbul ignore next */
    if (node.checkable === false) {
        return !node.children || node.children.length === 0 || node.children.every(function (c) {
            return isNodeChecked(c, checkedKeys);
        });
    }
    return checkedKeys.indexOf(node.key) > -1;
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
 * @param {Array} keys
 * @param {Object} _k2n
 */
export function filterChildKey(keys, _k2n, _p2n) {
    var newKeys = [];
    keys.forEach(function (key) {
        var node = getCheckableParentNode(_k2n[key], _p2n);
        if (!node || node.checkable === false || node === _k2n[key] || keys.indexOf(node.key) === -1) {
            newKeys.push(key);
        }
    });
    return newKeys;
}

export function filterParentKey(keys, _k2n) {
    var newKeys = [];

    for (var i = 0; i < keys.length; i++) {
        var node = _k2n[keys[i]];
        if (!node.children || node.children.length === 0 || node.children.every(isNodeDisabledChecked)) {
            newKeys.push(keys[i]);
        }
    }

    return newKeys;
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
export function getAllCheckedKeys(checkedKeys, _k2n, _p2n) {
    checkedKeys = normalizeToArray(checkedKeys);
    var filteredKeys = checkedKeys.filter(function (key) {
        return !!_k2n[key];
    });
    var flatKeys = [].concat(filterChildKey(filteredKeys, _k2n, _p2n), filteredKeys.filter(function (key) {
        return _k2n[key].disabled || _k2n[key].checkboxDisabled;
    }));
    var removeKey = function removeKey(child) {
        if (child.disabled || child.checkboxDisabled) return;
        if (child.checkable === false && child.children && child.children.length > 0) {
            return child.children.forEach(removeKey);
        }
        flatKeys.splice(flatKeys.indexOf(child.key), 1);
    };

    var addParentKey = function addParentKey(i, parent) {
        return flatKeys.splice(i, 0, parent.key);
    };

    var keys = [].concat(flatKeys);
    for (var i = 0; i < keys.length; i++) {
        var pos = _k2n[keys[i]].pos;
        var nums = pos.split('-');
        if (nums.length === 2) {
            break;
        }
        for (var j = nums.length - 2; j > 0; j--) {
            var parentPos = nums.slice(0, j + 1).join('-');
            var parent = _p2n[parentPos];
            if (parent.checkable === false || parent.disabled || parent.checkboxDisabled) continue;
            var parentChecked = parent.children.every(function (child) {
                return isNodeChecked(child, flatKeys);
            });
            if (parentChecked) {
                parent.children.forEach(removeKey);
                addParentKey(i, parent);
            } else {
                break;
            }
        }
    }

    var newKeys = [];
    flatKeys.forEach(function (key) {
        if (_k2n[key].disabled || _k2n[key].checkboxDisabled) {
            newKeys.push(key);
            return;
        }
        forEachEnableNode(_k2n[key], function (node) {
            if (node.checkable === false) return;
            newKeys.push(node.key);
        });
    });

    return newKeys;
}