import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

/* eslint-disable max-depth */
import React, { Component, Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { func, dom, obj, KEYCODE } from '../../util';
import TreeNode from './tree-node';
import { normalizeToArray, isDescendantOrSelf, isSiblingOrSelf, filterChildKey, filterParentKey, getAllCheckedKeys, forEachEnableNode, isNodeChecked } from './util';

var bindCtx = func.bindCtx,
    noop = func.noop;
var getOffset = dom.getOffset;
var pickOthers = obj.pickOthers,
    isPlainObject = obj.isPlainObject;

/**
 * Tree
 */

var Tree = (_temp = _class = function (_Component) {
    _inherits(Tree, _Component);

    function Tree(props) {
        _classCallCheck(this, Tree);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        _this.updateCache(props);

        var _this$props = _this.props,
            focusable = _this$props.focusable,
            autoFocus = _this$props.autoFocus,
            focusedKey = _this$props.focusedKey;


        if (focusable) {
            _this.tabbableKey = _this.getFirstAvaliablelChildKey('0');
        }

        _this.indeterminateKeys = [];
        _this.state = {
            expandedKeys: _this.getExpandedKeys(props),
            selectedKeys: _this.getSelectedKeys(props),
            checkedKeys: _this.getCheckedKeys(props),
            focusedKey: 'focusedKey' in _this.props ? focusedKey : focusable && autoFocus ? _this.tabbableKey : null
        };

        bindCtx(_this, ['handleExpand', 'handleSelect', 'handleCheck', 'handleBlur']);
        return _this;
    }

    Tree.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        this.updateCache(nextProps);

        var st = {};

        if ('expandedKeys' in nextProps) {
            st.expandedKeys = this.getExpandedKeys(nextProps, true);
        }
        if ('selectedKeys' in nextProps) {
            st.selectedKeys = this.getSelectedKeys(nextProps, true);
        }
        if ('checkedKeys' in nextProps) {
            st.checkedKeys = this.getCheckedKeys(nextProps, true);
        }

        this.indeterminateKeys = this.getIndeterminateKeys(st.checkedKeys || this.state.checkedKeys || []);

        if (Object.keys(st).length) {
            this.setState(st);
        }
    };

    Tree.prototype.updateCache = function updateCache(props) {
        var _this2 = this;

        this._k2n = {};
        this._p2n = {};

        if ('dataSource' in props) {
            var loop = function loop(data) {
                var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '0';
                return data.forEach(function (item, index) {
                    var pos = prefix + '-' + index;
                    var key = item.key;

                    key = key || pos;
                    var newItem = _extends({}, item, { key: key, pos: pos });
                    var children = item.children;

                    if (children && children.length) {
                        loop(children, pos);
                    }
                    _this2._k2n[key] = _this2._p2n[pos] = newItem;
                });
            };
            loop(props.dataSource);
        } else if ('children' in props) {
            var _loop = function _loop(children) {
                var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '0';
                return Children.map(children, function (node, index) {
                    if (!React.isValidElement(node)) {
                        return;
                    }

                    var pos = prefix + '-' + index;
                    var key = node.key;

                    key = key || pos;
                    var newItem = _extends({}, node.props, { key: key, pos: pos });

                    var children = node.props.children;

                    if (children && Children.count(children)) {
                        newItem.children = _loop(children, pos);
                    }
                    _this2._k2n[key] = _this2._p2n[pos] = newItem;
                    return newItem;
                });
            };
            _loop(props.children);
        }
    };

    Tree.prototype.setFocusKey = function setFocusKey() {
        var _state$selectedKeys = this.state.selectedKeys,
            selectedKeys = _state$selectedKeys === undefined ? [] : _state$selectedKeys;

        this.setState({
            focusedKey: selectedKeys.length > 0 ? selectedKeys[0] : this.getFirstAvaliablelChildKey('0')
        });
    };

    Tree.prototype.getExpandedKeys = function getExpandedKeys(props, willReceiveProps) {
        var _this3 = this;

        var expandedKeys = void 0;

        if (!willReceiveProps && props.defaultExpandAll) {
            expandedKeys = Object.keys(this._k2n).filter(function (key) {
                var children = _this3._k2n[key].children;
                return children && children.length;
            });
        } else {
            expandedKeys = 'expandedKeys' in props ? props.expandedKeys : willReceiveProps ? [] : props.defaultExpandedKeys;
            expandedKeys = normalizeToArray(expandedKeys);

            if (props.autoExpandParent) {
                var newExpandedKeys = [];

                var expandedPoss = expandedKeys.reduce(function (ret, key) {
                    var pos = _this3._k2n[key] && _this3._k2n[key].pos;
                    if (pos) {
                        ret.push(pos);
                        newExpandedKeys.push(key);
                    }
                    return ret;
                }, []);

                expandedPoss.forEach(function (pos) {
                    var nums = pos.split('-');
                    if (nums.length === 2) {
                        return;
                    }
                    for (var i = 1; i <= nums.length - 2; i++) {
                        var ancestorPos = nums.slice(0, i + 1).join('-');
                        var ancestorKey = _this3._p2n[ancestorPos].key;
                        if (newExpandedKeys.indexOf(ancestorKey) === -1) {
                            newExpandedKeys.push(ancestorKey);
                        }
                    }
                });

                return newExpandedKeys;
            }
        }

        return expandedKeys;
    };

    Tree.prototype.getAvailableKey = function getAvailableKey(pos, prev) {
        var _this4 = this;

        var ps = Object.keys(this._p2n).filter(function (p) {
            return _this4.isAvailablePos(pos, p);
        });
        if (ps.length > 1) {
            var index = ps.indexOf(pos);
            var targetIndex = void 0;
            if (prev) {
                targetIndex = index === 0 ? ps.length - 1 : index - 1;
            } else {
                targetIndex = index === ps.length - 1 ? 0 : index + 1;
            }

            return this._p2n[ps[targetIndex]].key;
        }

        return null;
    };

    Tree.prototype.getFirstAvaliablelChildKey = function getFirstAvaliablelChildKey(parentPos) {
        var _this5 = this;

        var pos = Object.keys(this._p2n).find(function (p) {
            return _this5.isAvailablePos(parentPos + '-0', p);
        });
        return pos ? this._p2n[pos].key : null;
    };

    Tree.prototype.isAvailablePos = function isAvailablePos(refPos, targetPos) {
        var disabled = this._p2n[targetPos].disabled;


        return this.isSibling(refPos, targetPos) && !disabled;
    };

    Tree.prototype.isSibling = function isSibling(currentPos, targetPos) {
        var currentNums = currentPos.split('-').slice(0, -1);
        var targetNums = targetPos.split('-').slice(0, -1);

        return currentNums.length === targetNums.length && currentNums.every(function (num, index) {
            return num === targetNums[index];
        });
    };

    Tree.prototype.getParentKey = function getParentKey(pos) {
        return this._p2n[pos.slice(0, pos.length - 2)].key;
    };

    Tree.prototype.getSelectedKeys = function getSelectedKeys(props, willReceiveProps) {
        var _this6 = this;

        var selectedKeys = 'selectedKeys' in props ? props.selectedKeys : willReceiveProps ? [] : props.defaultSelectedKeys;
        selectedKeys = normalizeToArray(selectedKeys);

        var newSelectKeys = selectedKeys.filter(function (key) {
            return _this6._k2n[key];
        });
        return newSelectKeys;
    };

    /* istanbul ignore next */


    Tree.prototype.getCheckedKeys = function getCheckedKeys(props, willReceiveProps) {
        var _this7 = this;

        var checkedKeys = props.defaultCheckedKeys;

        if ('checkedKeys' in props) {
            checkedKeys = props.checkedKeys;
        } else if (willReceiveProps) {
            checkedKeys = [];
        }

        var checkStrictly = this.props.checkStrictly;

        if (checkStrictly) {
            if (isPlainObject(checkedKeys)) {
                var _checkedKeys = checkedKeys,
                    checked = _checkedKeys.checked,
                    indeterminate = _checkedKeys.indeterminate;

                checkedKeys = normalizeToArray(checked);
                this.indeterminateKeys = normalizeToArray(indeterminate);
            } else {
                checkedKeys = normalizeToArray(checkedKeys);
            }

            checkedKeys = checkedKeys.filter(function (key) {
                return !!_this7._k2n[key];
            });
        } else {
            checkedKeys = getAllCheckedKeys(checkedKeys, this._k2n, this._p2n);
            checkedKeys = checkedKeys.filter(function (key) {
                return !!_this7._k2n[key];
            });

            this.indeterminateKeys = this.getIndeterminateKeys(checkedKeys);
        }

        return checkedKeys;
    };

    Tree.prototype.processKey = function processKey(keys, key, add) {
        var index = keys.indexOf(key);
        if (add && index === -1) {
            keys.push(key);
        } else if (!add && index > -1) {
            keys.splice(index, 1);
        }
        return keys;
    };
    /*eslint-disable max-statements*/


    Tree.prototype.handleItemKeyDown = function handleItemKeyDown(key, item, e) {
        if ([KEYCODE.UP, KEYCODE.DOWN, KEYCODE.RIGHT, KEYCODE.LEFT, KEYCODE.ENTER, KEYCODE.ESC, KEYCODE.SPACE].indexOf(e.keyCode) > -1) {
            e.preventDefault();
            e.stopPropagation();
        }

        var focusedKey = this.state.focusedKey;

        var node = this._k2n[key];
        var pos = this._k2n[key].pos;
        var level = pos.split('-').length - 1;
        switch (e.keyCode) {
            case KEYCODE.UP:
                {
                    var avaliableKey = this.getAvailableKey(pos, true);
                    if (avaliableKey) {
                        focusedKey = avaliableKey;
                    }
                    break;
                }
            case KEYCODE.DOWN:
                {
                    var _avaliableKey = this.getAvailableKey(pos, false);
                    if (_avaliableKey) {
                        focusedKey = _avaliableKey;
                    }
                    break;
                }
            case KEYCODE.RIGHT:
                {
                    this.handleExpand(true, key, node);
                    var _avaliableKey2 = this.getFirstAvaliablelChildKey(pos);
                    if (_avaliableKey2) {
                        focusedKey = _avaliableKey2;
                    }
                    break;
                }
            case KEYCODE.LEFT:
            case KEYCODE.ESC:
                {
                    if (level === 1) {
                        var _avaliableKey3 = this.getAvailableKey(pos, true);
                        if (_avaliableKey3) {
                            focusedKey = _avaliableKey3;
                        }
                    } else if (level > 1) {
                        var parentKey = this.getParentKey(pos);
                        this.handleExpand(false, parentKey, node);
                        focusedKey = parentKey;
                    }
                    break;
                }

            case KEYCODE.ENTER:
            case KEYCODE.SPACE:
                {
                    var checkable = item.props.checkable === true || this.props.checkable;
                    var selectable = item.props.selectable === true || this.props.selectable;

                    if (checkable) {
                        this.handleCheck(!item.props.checked, key, node);
                    } else if (selectable) {
                        this.handleSelect(!item.props.selected, key, node, e);
                    }
                    break;
                }
            case KEYCODE.TAB:
                focusedKey = null;
                break;
            default:
                break;
        }

        if (focusedKey !== this.state.focusedKey) {
            if (!('focusedKey' in this.props)) {
                this.setState({
                    focusedKey: focusedKey
                });
            }
        }

        this.props.onItemKeyDown(focusedKey, item, e);
        this.props.onItemFocus(focusedKey, e);
    };

    Tree.prototype.handleBlur = function handleBlur(e) {
        this.setState({
            focusedKey: ''
        });

        this.props.onBlur && this.props.onBlur(e);
    };

    Tree.prototype.handleExpand = function handleExpand(expand, key, node) {
        var _this8 = this;

        var _props = this.props,
            onExpand = _props.onExpand,
            loadData = _props.loadData;

        var expandedKeys = this.state.expandedKeys; // 由于setState 是异步操作，所以去掉 [...this.state.expandedKeys]
        this.processKey(expandedKeys, key, expand);
        var setExpandedState = function setExpandedState() {
            if (!('expandedKeys' in _this8.props)) {
                _this8.setState({ expandedKeys: expandedKeys });
            }
            onExpand(expandedKeys, { expanded: expand, node: node });
        };

        if (expand && loadData) {
            return loadData(node).then(setExpandedState);
        } else {
            setExpandedState();
        }
    };

    Tree.prototype.handleSelect = function handleSelect(select, key, node, e) {
        var _props2 = this.props,
            multiple = _props2.multiple,
            onSelect = _props2.onSelect;

        var selectedKeys = [].concat(this.state.selectedKeys);
        if (multiple) {
            this.processKey(selectedKeys, key, select);
        } else {
            selectedKeys = select ? [key] : [];
        }

        if (!('selectedKeys' in this.props)) {
            this.setState({ selectedKeys: selectedKeys });
        }
        onSelect(selectedKeys, {
            selectedNodes: this.getNodes(selectedKeys),
            node: node,
            selected: select,
            event: e
        });
    };

    // eslint-disable-next-line max-statements


    Tree.prototype.handleCheck = function handleCheck(check, key, node) {
        var _this9 = this;

        var _props3 = this.props,
            checkStrictly = _props3.checkStrictly,
            checkedStrategy = _props3.checkedStrategy,
            onCheck = _props3.onCheck;

        var checkedKeys = [].concat(this.state.checkedKeys);

        if (checkStrictly) {
            this.processKey(checkedKeys, key, check);
            var _newCheckedKeys = isPlainObject(this.props.checkedKeys) ? {
                checked: checkedKeys,
                indeterminate: this.indeterminateKeys
            } : checkedKeys;

            onCheck(_newCheckedKeys, {
                checkedNodes: this.getNodes(checkedKeys),
                checkedNodesPositions: checkedKeys.map(function (key) {
                    if (!_this9._k2n[key]) return null;
                    var _k2n$key = _this9._k2n[key],
                        node = _k2n$key.node,
                        pos = _k2n$key.pos;

                    return { node: node, pos: pos };
                }).filter(function (v) {
                    return !!v;
                }),
                node: node,
                indeterminateKeys: this.indeterminateKeys,
                checked: check
            });

            return;
        }

        var pos = this._k2n[key].pos;

        forEachEnableNode(this._k2n[key], function (node) {
            if (node.checkable === false) return;
            _this9.processKey(checkedKeys, node.key, check);
        });

        var ps = Object.keys(this._p2n);
        // ps.forEach(p => {
        //     if (this._p2n[p].checkable !== false && !this._p2n[p].disabled && isDescendantOrSelf(pos, p)) {
        //         this.processKey(checkedKeys, this._p2n[p].key, check);
        //     }
        // });

        var currentPos = pos;
        var nums = pos.split('-');
        for (var i = nums.length; i > 2; i--) {
            var parentCheck = true;

            var parentPos = nums.slice(0, i - 1).join('-');
            if (this._p2n[parentPos].disabled || this._p2n[parentPos].checkboxDisabled || this._p2n[parentPos].checkable === false) {
                currentPos = parentPos;
                continue;
            }
            var parentKey = this._p2n[parentPos].key;
            var parentChecked = checkedKeys.indexOf(parentKey) > -1;
            if (!check && !parentChecked) {
                break;
            }

            for (var j = 0; j < ps.length; j++) {
                var p = ps[j];
                var pnode = this._p2n[p];
                if (isSiblingOrSelf(currentPos, p) && !pnode.disabled && !pnode.checkboxDisabled) {
                    var k = pnode.key;
                    if (pnode.checkable === false) {
                        // eslint-disable-next-line max-depth
                        if (!pnode.children || pnode.children.length === 0) continue;

                        // eslint-disable-next-line max-depth
                        for (var m = 0; m < pnode.children.length; m++) {
                            if (!pnode.children.every(function (child) {
                                return isNodeChecked(child, checkedKeys);
                            })) {
                                parentCheck = false;
                                break;
                            }
                        }
                    } else if (checkedKeys.indexOf(k) === -1) {
                        parentCheck = false;
                    }

                    if (!parentCheck) break;
                }
            }

            this.processKey(checkedKeys, parentKey, parentCheck);

            currentPos = parentPos;
        }

        var indeterminateKeys = this.getIndeterminateKeys(checkedKeys);
        if (!('checkedKeys' in this.props)) {
            this.setState({
                checkedKeys: checkedKeys
            });
            this.indeterminateKeys = indeterminateKeys;
        }

        var newCheckedKeys = void 0;
        switch (checkedStrategy) {
            case 'parent':
                newCheckedKeys = filterChildKey(checkedKeys, this._k2n, this._p2n);
                break;
            case 'child':
                newCheckedKeys = filterParentKey(checkedKeys, this._k2n, this._p2n);
                break;
            default:
                newCheckedKeys = checkedKeys;
                break;
        }

        onCheck(newCheckedKeys, {
            checkedNodes: this.getNodes(newCheckedKeys),
            checkedNodesPositions: newCheckedKeys.map(function (key) {
                if (!_this9._k2n[key]) return null;
                var _k2n$key2 = _this9._k2n[key],
                    node = _k2n$key2.node,
                    pos = _k2n$key2.pos;

                return { node: node, pos: pos };
            }).filter(function (v) {
                return !!v;
            }),
            node: node,
            indeterminateKeys: indeterminateKeys,
            checked: check
        });
    };
    /*eslint-enable*/


    Tree.prototype.getNodeProps = function getNodeProps(key) {
        var prefix = this.props.prefix;
        var _state = this.state,
            expandedKeys = _state.expandedKeys,
            selectedKeys = _state.selectedKeys,
            checkedKeys = _state.checkedKeys,
            dragOverNodeKey = _state.dragOverNodeKey;

        var pos = this._k2n[key].pos;

        return {
            prefix: prefix,
            root: this,
            eventKey: key,
            pos: pos,
            expanded: expandedKeys.indexOf(key) > -1,
            selected: selectedKeys.indexOf(key) > -1,
            checked: checkedKeys.indexOf(key) > -1,
            indeterminate: this.indeterminateKeys.indexOf(key) > -1,
            dragOver: dragOverNodeKey === key && this.dropPosition === 0,
            dragOverGapTop: dragOverNodeKey === key && this.dropPosition === -1,
            dragOverGapBottom: dragOverNodeKey === key && this.dropPosition === 1
        };
    };

    Tree.prototype.getParentNode = function getParentNode(pos) {
        var parentPos = pos.split('-').slice(0, -1).join('-');
        if (parentPos.length === 1) {
            return null;
        }

        return this._p2n[parentPos].node;
    };

    Tree.prototype.getNodes = function getNodes(keys) {
        var _this10 = this;

        return keys.map(function (key) {
            return _this10._k2n[key] && _this10._k2n[key].node;
        }).filter(function (v) {
            return !!v;
        });
    };

    Tree.prototype.getIndeterminateKeys = function getIndeterminateKeys(checkedKeys) {
        var _this11 = this;

        if (this.props.checkStrictly) {
            return [];
        }

        var indeterminateKeys = [];

        var poss = filterChildKey(checkedKeys.filter(function (key) {
            return !!_this11._k2n[key];
        }).filter(function (key) {
            return !_this11._k2n[key].disabled && !_this11._k2n[key].checkboxDisabled && _this11._k2n[key].checkable !== false;
        }), this._k2n, this._p2n).map(function (key) {
            return _this11._k2n[key].pos;
        });
        poss.forEach(function (pos) {
            var nums = pos.split('-');
            for (var i = nums.length; i > 2; i--) {
                var parentPos = nums.slice(0, i - 1).join('-');
                var parent = _this11._p2n[parentPos];
                if (parent.disabled || parent.checkboxDisabled) break;
                var parentKey = parent.key;
                if (indeterminateKeys.indexOf(parentKey) === -1) {
                    indeterminateKeys.push(parentKey);
                }
            }
        });

        return indeterminateKeys;
    };

    Tree.prototype.handleDragStart = function handleDragStart(e, node) {
        var _this12 = this;

        var dragNodeKey = node.props.eventKey;
        this.dragNode = node;
        this.dragNodesKeys = Object.keys(this._k2n).filter(function (k) {
            return isDescendantOrSelf(_this12._k2n[dragNodeKey].pos, _this12._k2n[k].pos);
        });

        var expandedKeys = this.processKey([].concat(this.state.expandedKeys), dragNodeKey, false);
        this.setState({ expandedKeys: expandedKeys });

        this.props.onDragStart({
            event: e,
            node: node,
            expandedKeys: expandedKeys
        });
    };

    Tree.prototype.handleDragEnter = function handleDragEnter(e, node) {
        var dragOverNodeKey = node.props.eventKey;
        this.dropPosition = this.getDropPosition(e, node);
        if (this.dragNode && this.dragNode.props.eventKey === dragOverNodeKey && this.dropPosition === 0) {
            this.setState({
                dragOverNodeKey: null
            });
            return;
        }

        var expandedKeys = this.processKey([].concat(this.state.expandedKeys), dragOverNodeKey, true);
        this.setState({
            dragOverNodeKey: dragOverNodeKey,
            expandedKeys: expandedKeys
        });

        this.props.onDragEnter({
            event: e,
            node: node,
            expandedKeys: expandedKeys
        });
    };

    Tree.prototype.getDropPosition = function getDropPosition(e, node) {
        var labelWrapperNode = node.refs.labelWrapper;
        var offsetTop = getOffset(labelWrapperNode).top;
        var offsetHeight = labelWrapperNode.offsetHeight;
        var pageY = e.pageY;
        var gapHeight = 2;

        if (pageY > offsetTop + offsetHeight - gapHeight) {
            return 1;
        }
        if (pageY < offsetTop + gapHeight) {
            return -1;
        }
        return 0;
    };

    Tree.prototype.handleDragOver = function handleDragOver(e, node) {
        this.props.onDragOver({ event: e, node: node });
    };

    Tree.prototype.handleDragLeave = function handleDragLeave(e, node) {
        this.props.onDragLeave({ event: e, node: node });
    };

    Tree.prototype.handleDragEnd = function handleDragEnd(e, node) {
        this.setState({
            dragOverNodeKey: null
        });

        this.props.onDragEnd({ event: e, node: node });
    };

    Tree.prototype.handleDrop = function handleDrop(e, node) {
        if (this.dragNode && isDescendantOrSelf(this._k2n[this.dragNode.props.eventKey].pos, this._k2n[node.props.eventKey].pos)) {
            return;
        }

        this.setState({
            dragOverNodeKey: null
        });

        var params = this.generateDropParams(node);
        this.props.onDrop(_extends({
            event: e
        }, params));
    };

    Tree.prototype.canDrop = function canDrop(node) {
        var params = this.generateDropParams(node);
        return this.props.canDrop(params);
    };

    Tree.prototype.generateDropParams = function generateDropParams(node) {
        return {
            dragNode: this.dragNode,
            dragNodesKeys: [].concat(this.dragNodesKeys),
            node: node,
            dropPosition: this.dropPosition
        };
    };

    Tree.prototype.filterTreeNode = function filterTreeNode(node) {
        return this.props.filterTreeNode.call(this, node);
    };

    Tree.prototype.renderByDataSource = function renderByDataSource() {
        var _this13 = this;

        var rtl = this.props.rtl;

        var loop = function loop(data) {
            var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '0';

            return data.map(function (item, index) {
                var pos = prefix + '-' + index;

                var _item$key = item.key,
                    key = _item$key === undefined ? pos : _item$key,
                    children = item.children,
                    others = _objectWithoutProperties(item, ['key', 'children']);

                var props = _extends({}, others, _this13.getNodeProps('' + key), {
                    _key: key
                });
                if (children && children.length) {
                    props.children = loop(children, pos);
                }
                var node = React.createElement(TreeNode, _extends({
                    rtl: rtl,
                    key: key,
                    size: data.length
                }, props));
                _this13._k2n[key].node = node;
                return node;
            });
        };

        return loop(this.props.dataSource);
    };

    Tree.prototype.renderByChildren = function renderByChildren() {
        var _this14 = this;

        var rtl = this.props.rtl;

        var loop = function loop(children) {
            var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '0';

            return Children.map(children, function (child, index) {
                if (!React.isValidElement(child)) {
                    return;
                }
                var pos = prefix + '-' + index;
                var key = child.key || pos;
                var props = _this14.getNodeProps('' + key);
                if (child.props.children) {
                    props.children = loop(child.props.children, pos);
                }

                props._key = key;
                props.rtl = rtl;
                props.size = Children.count(children);

                var node = cloneElement(child, props);
                _this14._k2n[key].node = node;
                return node;
            });
        };

        return loop(this.props.children);
    };

    Tree.prototype.render = function render() {
        var _cx;

        var _props4 = this.props,
            prefix = _props4.prefix,
            rtl = _props4.rtl,
            className = _props4.className,
            dataSource = _props4.dataSource,
            showLine = _props4.showLine,
            isNodeBlock = _props4.isNodeBlock,
            isLabelBlock = _props4.isLabelBlock,
            multiple = _props4.multiple;

        var others = pickOthers(Object.keys(Tree.propTypes), this.props);

        if (rtl) {
            others.dir = 'rtl';
        }

        var newClassName = cx((_cx = {}, _cx[prefix + 'tree'] = true, _cx[prefix + 'label-block'] = isLabelBlock, _cx[prefix + 'node-block'] = isNodeBlock, _cx[prefix + 'node-indent'] = !isNodeBlock, _cx[prefix + 'show-line'] = !isNodeBlock && showLine, _cx[className] = !!className, _cx));

        return React.createElement(
            'ul',
            _extends({
                role: 'tree',
                'aria-multiselectable': multiple,
                onBlur: this.handleBlur,
                className: newClassName
            }, others),
            dataSource ? this.renderByDataSource() : this.renderByChildren()
        );
    };

    return Tree;
}(Component), _class.propTypes = {
    prefix: PropTypes.string,
    rtl: PropTypes.bool,
    pure: PropTypes.bool,
    className: PropTypes.string,
    /**
     * 树节点
     */
    children: PropTypes.node,
    /**
     * 数据源，该属性优先级高于 children
     */
    dataSource: PropTypes.array,
    /**
     * 是否显示树的线
     */
    showLine: PropTypes.bool,
    /**
     * 是否支持选中节点
     */
    selectable: PropTypes.bool,
    /**
     * （用于受控）当前选中节点 key 的数组
     */
    selectedKeys: PropTypes.arrayOf(PropTypes.string),
    /**
     * （用于非受控）默认选中节点 key 的数组
     */
    defaultSelectedKeys: PropTypes.arrayOf(PropTypes.string),
    /**
     * 选中或取消选中节点时触发的回调函数
     * @param {Array} selectedKeys 选中节点key的数组
     * @param {Object} extra 额外参数
     * @param {Array} extra.selectedNodes 选中节点的数组
     * @param {Object} extra.node 当前操作的节点
     * @param {Boolean} extra.selected 当前操作是否是选中
     */
    onSelect: PropTypes.func,
    /**
     * 是否支持多选
     */
    multiple: PropTypes.bool,
    /**
     * 是否支持勾选节点的复选框
     */
    checkable: PropTypes.bool,
    /**
     * （用于受控）当前勾选复选框节点 key 的数组或 `{checked: Array, indeterminate: Array}` 的对象
     */
    checkedKeys: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.object]),
    /**
     * （用于非受控）默认勾选复选框节点 key 的数组
     */
    defaultCheckedKeys: PropTypes.arrayOf(PropTypes.string),
    /**
     * 勾选节点复选框是否完全受控（父子节点选中状态不再关联）
     */
    checkStrictly: PropTypes.bool,
    /**
     * 定义选中时回填的方式
     * @enumdesc 返回所有选中的节点, 父子节点都选中时只返回父节点, 父子节点都选中时只返回子节点
     */
    checkedStrategy: PropTypes.oneOf(['all', 'parent', 'child']),
    /**
     * 勾选或取消勾选复选框时触发的回调函数
     * @param {Array} checkedKeys 勾选复选框节点key的数组
     * @param {Object} extra 额外参数
     * @param {Array} extra.checkedNodes 勾选复选框节点的数组
     * @param {Array} extra.checkedNodesPositions 包含有勾选复选框节点和其位置的对象的数组
     * @param {Array} extra.indeterminateKeys 半选复选框节点 key 的数组
     * @param {Object} extra.node 当前操作的节点
     * @param {Boolean} extra.checked 当前操作是否是勾选
     */
    onCheck: PropTypes.func,
    /**
     * （用于受控）当前展开的节点 key 的数组
     */
    expandedKeys: PropTypes.arrayOf(PropTypes.string),
    /**
     * （用于非受控）默认展开的节点 key 的数组
     */
    defaultExpandedKeys: PropTypes.arrayOf(PropTypes.string),
    /**
     * 是否默认展开所有节点
     */
    defaultExpandAll: PropTypes.bool,
    /**
     * 是否自动展开父节点，建议受控时设置为false
     */
    autoExpandParent: PropTypes.bool,
    /**
     * 展开或收起节点时触发的回调函数
     * @param {Array} expandedKeys 展开的节点key的数组
     * @param {Object} extra 额外参数
     * @param {Object} extra.node 当前操作的节点
     * @param {Boolean} extra.expanded 当前操作是否是展开
     */
    onExpand: PropTypes.func,
    /**
     * 是否支持编辑节点内容
     */
    editable: PropTypes.bool,
    /**
     * 编辑节点内容完成时触发的回调函数
     * @param {String} key 编辑节点的 key
     * @param {String} label 编辑节点完成时节点的文本
     * @param {Object} node 当前编辑的节点
     */
    onEditFinish: PropTypes.func,
    /**
     * 是否支持拖拽节点
     */
    draggable: PropTypes.bool,
    /**
     * 开始拖拽节点时触发的回调函数
     * @param {Object} info 拖拽信息
     * @param {Object} info.event 事件对象
     * @param {Object} info.node 拖拽的节点
     */
    onDragStart: PropTypes.func,
    /**
     * 拖拽节点进入目标节点时触发的回调函数
     * @param {Object} info 拖拽信息
     * @param {Object} info.event 事件对象
     * @param {Object} info.node 目标节点
     * @param {Array} info.expandedKeys 当前展开的节点key的数组
     */
    onDragEnter: PropTypes.func,
    /**
     * 拖拽节点在目标节点上移动的时候触发的回调函数
     * @param {Object} info 拖拽信息
     * @param {Object} info.event 事件对象
     * @param {Object} info.node 目标节点
     */
    onDragOver: PropTypes.func,
    /**
     * 拖拽节点离开目标节点时触发的回调函数
     * @param {Object} info 拖拽信息
     * @param {Object} info.event 事件对象
     * @param {Object} info.node 目标节点
     */
    onDragLeave: PropTypes.func,
    /**
     * 拖拽节点拖拽结束时触发的回调函数
     * @param {Object} info 拖拽信息
     * @param {Object} info.event 事件对象
     * @param {Object} info.node 目标节点
     */
    onDragEnd: PropTypes.func,
    /**
     * 拖拽节点放入目标节点内或前后触发的回调函数
     * @param {Object} info 拖拽信息
     * @param {Object} info.event 事件对象
     * @param {Object} info.node 目标节点
     * @param {Object} info.dragNode 拖拽的节点
     * @param {Array} info.dragNodesKeys 拖拽的节点和其子节点 key 的数组
     * @param {Number} info.dropPosition 放置位置，-1代表当前节点前，0代表当前节点里，1代表当前节点后
     */
    onDrop: PropTypes.func,
    /**
     * 节点是否可被作为拖拽的目标节点
     * @param {Object} info 拖拽信息
     * @param {Object} info.node 目标节点
     * @param {Object} info.dragNode 拖拽的节点
     * @param {Array} info.dragNodesKeys 拖拽的节点和其子节点 key 的数组
     * @param {Number} info.dropPosition 放置位置，-1代表当前节点前，0代表当前节点里，1代表当前节点后
     * @return {Boolean} 是否可以被当作目标节点
     */
    canDrop: PropTypes.func,
    /**
     * 异步加载数据的函数
     * @param {Object} node 被点击展开的节点
     */
    loadData: PropTypes.func,
    /**
     * 按需筛选高亮节点
     * @param {Object} node 待筛选的节点
     * @return {Boolean} 是否被筛选中
     */
    filterTreeNode: PropTypes.func,
    /**
     * 右键点击节点时触发的回调函数
     * @param {Object} info 信息对象
     * @param {Object} info.event 事件对象
     * @param {Object} info.node 点击的节点
     */
    onRightClick: PropTypes.func,
    /**
     * 设置节点是否占满剩余空间，一般用于统一在各节点右侧添加元素(借助 flex 实现，暂时只支持 ie10+)
     */
    isLabelBlock: PropTypes.bool,
    /**
     * 设置节点是否占满一行
     */
    isNodeBlock: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    /**
     * 是否开启展开收起动画
     */
    animation: PropTypes.bool,
    /**
     * 当前获得焦点的子菜单或菜单项 key 值
     */
    focusedKey: PropTypes.string,
    /**
     * 渲染子节点
     * @param {Array<ReactNode>} nodes 所有的子节点
     * @return {ReactNode} 返回节点
     */
    renderChildNodes: PropTypes.func,
    focusable: PropTypes.bool,
    autoFocus: PropTypes.bool,
    onItemFocus: PropTypes.func,
    onBlur: PropTypes.func,
    onItemKeyDown: PropTypes.func
}, _class.defaultProps = {
    prefix: 'next-',
    rtl: false,
    pure: false,
    showLine: false,
    selectable: true,
    editable: false,
    multiple: false,
    checkable: false,
    checkStrictly: false,
    checkedStrategy: 'all',
    draggable: false,
    autoExpandParent: true,
    defaultExpandAll: false,
    defaultExpandedKeys: [],
    defaultCheckedKeys: [],
    defaultSelectedKeys: [],
    onExpand: noop,
    onCheck: noop,
    onSelect: noop,
    onDragStart: noop,
    onDragEnter: noop,
    onDragOver: noop,
    onDragLeave: noop,
    onDragEnd: noop,
    onDrop: noop,
    canDrop: function canDrop() {
        return true;
    },
    onEditFinish: noop,
    onRightClick: noop,
    isLabelBlock: false,
    isNodeBlock: false,
    animation: true,
    focusable: true,
    autoFocus: false,
    onItemFocus: noop,
    onItemKeyDown: noop
}, _temp);
Tree.displayName = 'Tree';
export { Tree as default };