import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component, Children, isValidElement, cloneElement } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Select from '../select';
import Tree from '../tree';
import { normalizeToArray, getAllCheckedKeys, filterChildKey, filterParentKey, isDescendantOrSelf } from '../tree/view/util';
import { func, obj, KEYCODE } from '../util';

var noop = function noop() {};
var TreeNode = Tree.Node;
var bindCtx = func.bindCtx;
var pickOthers = obj.pickOthers;

/**
 * TreeSelect
 */

var TreeSelect = (_temp = _class = function (_Component) {
    _inherits(TreeSelect, _Component);

    function TreeSelect(props, context) {
        _classCallCheck(this, TreeSelect);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

        var defaultVisible = props.defaultVisible,
            visible = props.visible,
            defaultValue = props.defaultValue,
            value = props.value;

        _this.state = {
            visible: typeof visible === 'undefined' ? defaultVisible : visible,
            value: normalizeToArray(typeof value === 'undefined' ? defaultValue : value),
            searchedValue: '',
            expandedKeys: [],
            autoExpandParent: false
        };

        bindCtx(_this, ['handleSelect', 'handleCheck', 'handleSearch', 'handleSearchClear', 'handleVisibleChange', 'handleChange', 'handleRemove', 'handleExpand', 'handleKeyDown', 'saveTreeRef', 'saveSelectRef']);

        _this.updateCache(props);
        return _this;
    }

    TreeSelect.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        this.updateCache(nextProps);

        var st = {};
        if ('value' in nextProps) {
            st.value = normalizeToArray(nextProps.value);
        }
        if ('visible' in nextProps) {
            st.visible = nextProps.visible;
        }

        if (Object.keys(st).length) {
            this.setState(st);
        }
    };

    TreeSelect.prototype.updateCache = function updateCache(props) {
        var _this2 = this;

        this._k2n = {};
        this._p2n = {};
        this._v2n = {};

        if ('dataSource' in props) {
            var loop = function loop(data) {
                var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '0';
                return data.map(function (item, index) {
                    var value = item.value,
                        children = item.children;

                    var pos = prefix + '-' + index;
                    var key = item.key || pos;
                    var newItem = _extends({}, item, { key: key, pos: pos });
                    if (children && children.length) {
                        newItem.children = loop(children, pos);
                    }

                    _this2._k2n[key] = _this2._p2n[pos] = _this2._v2n[value] = newItem;
                    return newItem;
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

                    var _node$props = node.props,
                        value = _node$props.value,
                        children = _node$props.children;

                    var pos = prefix + '-' + index;
                    var key = node.key || pos;
                    var newItem = _extends({}, node.props, { key: key, pos: pos });
                    if (children && Children.count(children)) {
                        newItem.children = _loop(children, pos);
                    }

                    _this2._k2n[key] = _this2._p2n[pos] = _this2._v2n[value] = newItem;
                    return newItem;
                });
            };
            _loop(props.children);
        }
    };

    TreeSelect.prototype.getKeysByValue = function getKeysByValue(value) {
        var _this3 = this;

        return value.reduce(function (ret, v) {
            var k = _this3._v2n[v] && _this3._v2n[v].key;
            if (k) {
                ret.push(k);
            }

            return ret;
        }, []);
    };

    TreeSelect.prototype.getValueByKeys = function getValueByKeys(keys) {
        var _this4 = this;

        return keys.map(function (k) {
            return _this4._k2n[k].value;
        });
    };

    TreeSelect.prototype.getValueForSelect = function getValueForSelect(value) {
        var treeCheckedStrategy = this.props.treeCheckedStrategy;


        var keys = this.getKeysByValue(value);
        keys = getAllCheckedKeys(keys, this._k2n, this._p2n);

        switch (treeCheckedStrategy) {
            case 'parent':
                keys = filterChildKey(keys, this._k2n, this._p2n);
                break;
            case 'child':
                keys = filterParentKey(keys, this._k2n, this._p2n);
                break;
            default:
                break;
        }

        return this.getValueByKeys(keys);
    };

    TreeSelect.prototype.getData = function getData(value, forSelect) {
        var _this5 = this;

        return value.reduce(function (ret, v) {
            var k = _this5._v2n[v] && _this5._v2n[v].key;
            if (k) {
                var _k2n$k = _this5._k2n[k],
                    label = _k2n$k.label,
                    pos = _k2n$k.pos,
                    disabled = _k2n$k.disabled,
                    checkboxDisabled = _k2n$k.checkboxDisabled;

                var d = {
                    value: v,
                    label: label,
                    pos: pos
                };
                if (forSelect) {
                    d.disabled = disabled || checkboxDisabled;
                } else {
                    d.key = k;
                }
                ret.push(d);
            }

            return ret;
        }, []);
    };

    TreeSelect.prototype.saveTreeRef = function saveTreeRef(ref) {
        this.tree = ref;
    };

    TreeSelect.prototype.saveSelectRef = function saveSelectRef(ref) {
        this.select = ref;
    };

    TreeSelect.prototype.handleVisibleChange = function handleVisibleChange(visible, type) {
        if (!('visible' in this.props)) {
            this.setState({
                visible: visible
            });
        }

        if (['fromTree', 'keyboard'].indexOf(type) !== -1 && !visible) {
            this.select.focusInput();
        }

        this.props.onVisibleChange(visible, type);
    };

    TreeSelect.prototype.handleSelect = function handleSelect(selectedKeys, extra) {
        var _props = this.props,
            multiple = _props.multiple,
            onChange = _props.onChange;
        var selected = extra.selected;


        if (multiple || selected) {
            var value = this.getValueByKeys(selectedKeys);
            if (!('value' in this.props)) {
                this.setState({
                    value: value
                });
            }
            if (!multiple) {
                this.handleVisibleChange(false, 'fromTree');
            }

            var data = this.getData(value);
            multiple ? onChange(value, data) : onChange(value[0], data[0]);
        } else {
            this.handleVisibleChange(false, 'fromTree');
        }
    };

    TreeSelect.prototype.handleCheck = function handleCheck(checkedKeys) {
        var onChange = this.props.onChange;


        var value = this.getValueByKeys(checkedKeys);
        if (!('value' in this.props)) {
            this.setState({
                value: value
            });
        }

        onChange(value, this.getData(value));
    };

    TreeSelect.prototype.handleRemove = function handleRemove(removedItem) {
        var _this6 = this;

        var removedValue = removedItem.value;
        var _props2 = this.props,
            treeCheckable = _props2.treeCheckable,
            treeCheckStrictly = _props2.treeCheckStrictly,
            treeCheckedStrategy = _props2.treeCheckedStrategy,
            onChange = _props2.onChange;


        var value = void 0;
        if (treeCheckable && !treeCheckStrictly && ['parent', 'all'].indexOf(treeCheckedStrategy) !== -1) {
            var removedPos = this._v2n[removedValue].pos;
            value = this.state.value.filter(function (v) {
                var p = _this6._v2n[v].pos;
                return !isDescendantOrSelf(removedPos, p);
            });

            var nums = removedPos.split('-');
            for (var i = nums.length; i > 2; i--) {
                var parentPos = nums.slice(0, i - 1).join('-');
                var parentValue = this._p2n[parentPos].value;
                var parentIndex = value.indexOf(parentValue);
                if (parentIndex > -1) {
                    value.splice(parentIndex, 1);
                } else {
                    break;
                }
            }
        } else {
            value = this.state.value.filter(function (v) {
                return v !== removedValue;
            });
        }

        if (!('value' in this.props)) {
            this.setState({
                value: value
            });
        }

        var data = this.getData(value);
        onChange(value, data);
    };

    TreeSelect.prototype.handleSearch = function handleSearch(searchedValue) {
        var _this7 = this;

        var searchedKeys = [];
        var retainedKeys = [];
        Object.keys(this._k2n).forEach(function (k) {
            var _k2n$k2 = _this7._k2n[k],
                label = _k2n$k2.label,
                pos = _k2n$k2.pos;

            if (_this7.isSearched(label, searchedValue)) {
                searchedKeys.push(k);
                var posArr = pos.split('-');
                posArr.forEach(function (n, i) {
                    if (i > 0) {
                        var p = posArr.slice(0, i + 1).join('-');
                        var kk = _this7._p2n[p].key;
                        if (retainedKeys.indexOf(kk) === -1) {
                            retainedKeys.push(kk);
                        }
                    }
                });
            }
        });

        this.setState({
            searchedValue: searchedValue,
            expandedKeys: searchedKeys,
            autoExpandParent: true
        });
        this.searchedKeys = searchedKeys;
        this.retainedKeys = retainedKeys;

        this.props.onSearch(searchedValue);
    };

    TreeSelect.prototype.handleSearchClear = function handleSearchClear(triggerType) {
        this.setState({
            searchedValue: '',
            expandedKeys: []
        });
        this.props.onSearchClear(triggerType);
    };

    TreeSelect.prototype.handleExpand = function handleExpand(expandedKeys) {
        this.setState({
            expandedKeys: expandedKeys,
            autoExpandParent: false
        });
    };

    TreeSelect.prototype.handleKeyDown = function handleKeyDown(e) {
        var onKeyDown = this.props.onKeyDown;
        var visible = this.state.visible;


        if (onKeyDown) {
            onKeyDown(e);
        }

        if (!visible) {
            return;
        }

        switch (e.keyCode) {
            case KEYCODE.UP:
            case KEYCODE.DOWN:
                this.tree.setFocusKey();
                e.preventDefault();
                break;
            default:
                break;
        }
    };

    TreeSelect.prototype.handleChange = function handleChange() {
        // 单选时点击清空按钮
        var _props3 = this.props,
            hasClear = _props3.hasClear,
            multiple = _props3.multiple,
            treeCheckable = _props3.treeCheckable;

        if (hasClear && (!multiple || !treeCheckable)) {
            if (!('value' in this.props)) {
                this.setState({
                    value: []
                });
            }

            this.props.onChange(null, null);
        }
    };

    TreeSelect.prototype.isSearched = function isSearched(label, searchedValue) {
        var labelString = '';
        var loop = function loop(arg) {
            if (isValidElement(arg) && arg.props.children) {
                Children.forEach(arg.props.children, loop);
            } else if (typeof arg === 'string') {
                labelString += arg;
            }
        };
        loop(label);

        if (labelString.length >= searchedValue.length && labelString.indexOf(searchedValue) > -1) {
            return true;
        }

        return false;
    };

    TreeSelect.prototype.searchNodes = function searchNodes(children) {
        var _this8 = this;

        var loop = function loop(children) {
            var retainedNodes = [];
            Children.forEach(children, function (child) {
                if (_this8.searchedKeys.indexOf(child.key) > -1) {
                    retainedNodes.push(child);
                } else if (_this8.retainedKeys.indexOf(child.key) > -1) {
                    var retainedNode = child.props.children ? cloneElement(child, {}, loop(child.props.children)) : child;
                    retainedNodes.push(retainedNode);
                } else {
                    var hideNode = cloneElement(child, {
                        style: { display: 'none' }
                    });
                    retainedNodes.push(hideNode);
                }
            });
            return retainedNodes;
        };

        return loop(children);
    };

    TreeSelect.prototype.createNodesByData = function createNodesByData(data, searching) {
        var _this9 = this;

        var loop = function loop(data, isParentMatched) {
            var prefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '0';

            var retainedNodes = [];

            data.forEach(function (item, index) {
                var children = item.children,
                    others = _objectWithoutProperties(item, ['children']);

                var pos = prefix + '-' + index;
                var key = _this9._p2n[pos].key;
                var addNode = function addNode(isParentMatched, hide) {
                    if (hide) {
                        others.style = { display: 'none' };
                    }
                    retainedNodes.push(React.createElement(
                        TreeNode,
                        _extends({}, others, { key: key }),
                        children && children.length ? loop(children, isParentMatched, pos) : null
                    ));
                };

                if (searching) {
                    if (_this9.searchedKeys.indexOf(key) > -1 || isParentMatched) {
                        addNode(true);
                    } else if (_this9.retainedKeys.indexOf(key) > -1) {
                        addNode(false);
                    } else {
                        addNode(false, true);
                    }
                } else {
                    addNode();
                }
            });

            return retainedNodes;
        };

        return loop(data, false);
    };
    /*eslint-disable max-statements*/


    TreeSelect.prototype.renderPopupContent = function renderPopupContent() {
        var _this10 = this;

        var prefix = this.props.prefix;
        var treeSelectPrefix = prefix + 'tree-select-';

        if (!this.state.visible) {
            return React.createElement('div', { className: treeSelectPrefix + 'dropdown' });
        }

        var _props4 = this.props,
            multiple = _props4.multiple,
            treeCheckable = _props4.treeCheckable,
            treeCheckStrictly = _props4.treeCheckStrictly,
            treeCheckedStrategy = _props4.treeCheckedStrategy,
            treeDefaultExpandAll = _props4.treeDefaultExpandAll,
            treeDefaultExpandedKeys = _props4.treeDefaultExpandedKeys,
            treeLoadData = _props4.treeLoadData,
            customTreeProps = _props4.treeProps,
            showSearch = _props4.showSearch,
            dataSource = _props4.dataSource,
            children = _props4.children,
            readOnly = _props4.readOnly,
            notFoundContent = _props4.notFoundContent;
        var _state = this.state,
            value = _state.value,
            searchedValue = _state.searchedValue,
            expandedKeys = _state.expandedKeys,
            autoExpandParent = _state.autoExpandParent;


        var treeProps = {
            multiple: multiple,
            ref: this.saveTreeRef,
            loadData: treeLoadData,
            defaultExpandAll: treeDefaultExpandAll,
            defaultExpandedKeys: treeDefaultExpandedKeys
        };

        var keys = this.getKeysByValue(value);
        if (treeCheckable) {
            treeProps.checkable = treeCheckable;
            treeProps.checkStrictly = treeCheckStrictly;
            treeProps.checkedStrategy = treeCheckStrictly ? 'all' : treeCheckedStrategy;
            treeProps.checkedKeys = keys;
            if (!readOnly) {
                treeProps.onCheck = this.handleCheck;
            }
        } else {
            treeProps.selectedKeys = keys;
            if (!readOnly) {
                treeProps.onSelect = this.handleSelect;
            }
        }

        var notFound = false;
        var newChildren = void 0;
        if (showSearch && searchedValue) {
            treeProps.expandedKeys = expandedKeys;
            treeProps.autoExpandParent = autoExpandParent;
            treeProps.onExpand = this.handleExpand;
            treeProps.filterTreeNode = function (node) {
                return _this10.searchedKeys.indexOf(node.props.eventKey) > -1;
            };

            if (this.searchedKeys.length) {
                newChildren = dataSource ? this.createNodesByData(dataSource, true) : this.searchNodes(children);
            } else {
                notFound = true;
            }
        } else {
            // eslint-disable-next-line
            if (dataSource) {
                if (dataSource.length) {
                    newChildren = this.createNodesByData(dataSource);
                } else {
                    notFound = true;
                }
            } else {
                // eslint-disable-next-line
                if (Children.count(children)) {
                    newChildren = children;
                } else {
                    notFound = true;
                }
            }
        }

        return React.createElement(
            'div',
            { className: treeSelectPrefix + 'dropdown' },
            notFound ? React.createElement(
                'div',
                { className: treeSelectPrefix + 'not-found' },
                notFoundContent
            ) : React.createElement(
                Tree,
                _extends({}, customTreeProps, treeProps),
                newChildren
            )
        );
    };

    TreeSelect.prototype.renderPreview = function renderPreview(data, others) {
        var _props5 = this.props,
            prefix = _props5.prefix,
            className = _props5.className,
            renderPreview = _props5.renderPreview;


        var previewCls = classNames(className, prefix + 'form-preview');
        var items = data;

        if (data && !Array.isArray(data)) {
            items = [data];
        }

        if (typeof renderPreview === 'function') {
            return React.createElement(
                'div',
                _extends({}, others, { className: previewCls }),
                renderPreview(items, this.props)
            );
        }

        return React.createElement(
            'p',
            _extends({}, others, { className: previewCls }),
            items.map(function (_ref) {
                var label = _ref.label;
                return label;
            }).join(', ')
        );
    };
    /*eslint-enable*/


    TreeSelect.prototype.render = function render() {
        var _props6 = this.props,
            prefix = _props6.prefix,
            size = _props6.size,
            placeholder = _props6.placeholder,
            disabled = _props6.disabled,
            hasArrow = _props6.hasArrow,
            hasBorder = _props6.hasBorder,
            hasClear = _props6.hasClear,
            label = _props6.label,
            readOnly = _props6.readOnly,
            autoWidth = _props6.autoWidth,
            popupStyle = _props6.popupStyle,
            popupClassName = _props6.popupClassName,
            showSearch = _props6.showSearch,
            multiple = _props6.multiple,
            treeCheckable = _props6.treeCheckable,
            treeCheckStrictly = _props6.treeCheckStrictly,
            className = _props6.className,
            popupContainer = _props6.popupContainer,
            popupProps = _props6.popupProps,
            followTrigger = _props6.followTrigger,
            isPreview = _props6.isPreview;

        var others = pickOthers(Object.keys(TreeSelect.propTypes), this.props);
        var _state2 = this.state,
            value = _state2.value,
            visible = _state2.visible;


        var valueForSelect = treeCheckable && !treeCheckStrictly ? this.getValueForSelect(value) : value;
        var data = this.getData(valueForSelect, true);
        if (!multiple && !treeCheckable) {
            data = data[0];
        }

        if (isPreview) {
            return this.renderPreview(data, others);
        }

        return React.createElement(Select, _extends({
            prefix: prefix,
            className: className,
            size: size,
            hasBorder: hasBorder,
            hasArrow: hasArrow,
            hasClear: hasClear,
            placeholder: placeholder,
            disabled: disabled,
            autoWidth: autoWidth,
            label: label,
            readOnly: readOnly,
            ref: this.saveSelectRef,
            mode: treeCheckable || multiple ? 'multiple' : 'single',
            value: data,
            onRemove: this.handleRemove,
            onChange: this.handleChange,
            visible: visible,
            onVisibleChange: this.handleVisibleChange,
            showSearch: showSearch,
            onSearch: this.handleSearch,
            onSearchClear: this.handleSearchClear,
            onKeyDown: this.handleKeyDown,
            popupContent: this.renderPopupContent(),
            popupContainer: popupContainer,
            popupStyle: popupStyle,
            popupClassName: popupClassName,
            popupProps: popupProps,
            followTrigger: followTrigger
        }, others));
    };

    return TreeSelect;
}(Component), _class.propTypes = {
    prefix: PropTypes.string,
    pure: PropTypes.bool,
    className: PropTypes.string,
    /**
     * 树节点
     */
    children: PropTypes.node,
    /**
     * 选择框大小
     */
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    /**
     * 选择框占位符
     */
    placeholder: PropTypes.string,
    /**
     * 是否禁用
     */
    disabled: PropTypes.bool,
    /**
     * 是否有下拉箭头
     */
    hasArrow: PropTypes.bool,
    /**
     * 是否有边框
     */
    hasBorder: PropTypes.bool,
    /**
     * 是否有清空按钮
     */
    hasClear: PropTypes.bool,
    /**
     * 自定义内联 label
     */
    label: PropTypes.node,
    /**
     * 是否只读，只读模式下可以展开弹层但不能选择
     */
    readOnly: PropTypes.bool,
    /**
     * 下拉框是否与选择器对齐
     */
    autoWidth: PropTypes.bool,
    /**
     * 数据源，该属性优先级高于 children
     */
    dataSource: PropTypes.arrayOf(PropTypes.object),
    /**
     * （受控）当前值
     */
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    /**
     * （非受控）默认值
     */
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    /**
     * 选中值改变时触发的回调函数
     * @param {String|Array} value 选中的值，单选时返回单个值，多选时返回数组
     * @param {Object|Array} data 选中的数据，包括 value, label, pos, key属性，单选时返回单个值，多选时返回数组，父子节点选中关联时，同时选中，只返回父节点
     */
    onChange: PropTypes.func,
    /**
     * 是否显示搜索框
     */
    showSearch: PropTypes.bool,
    /**
     * 在搜索框中输入时触发的回调函数
     * @param {String} keyword 输入的关键字
     */
    onSearch: PropTypes.func,
    onSearchClear: PropTypes.func,
    /**
     * 无数据时显示内容
     */
    notFoundContent: PropTypes.node,
    /**
     * 是否支持多选
     */
    multiple: PropTypes.bool,
    /**
     * 下拉框中的树是否支持勾选节点的复选框
     */
    treeCheckable: PropTypes.bool,
    /**
     * 下拉框中的树勾选节点复选框是否完全受控（父子节点选中状态不再关联）
     */
    treeCheckStrictly: PropTypes.bool,
    /**
     * 定义选中时回填的方式
     * @enumdesc 返回所有选中的节点, 父子节点都选中时只返回父节点, 父子节点都选中时只返回子节点
     */
    treeCheckedStrategy: PropTypes.oneOf(['all', 'parent', 'child']),
    /**
     * 下拉框中的树是否默认展开所有节点
     */
    treeDefaultExpandAll: PropTypes.bool,
    /**
     * 下拉框中的树默认展开节点key的数组
     */
    treeDefaultExpandedKeys: PropTypes.arrayOf(PropTypes.string),
    /**
     * 下拉框中的树异步加载数据的函数，使用请参考[Tree的异步加载数据Demo](https://fusion.design/component/tree)
     * @param {ReactElement} node 被点击展开的节点
     */
    treeLoadData: PropTypes.func,
    /**
     * 透传到 Tree 的属性对象
     */
    treeProps: PropTypes.object,
    /**
     * 初始下拉框是否显示
     */
    defaultVisible: PropTypes.bool,
    /**
     * 当前下拉框是否显示
     */
    visible: PropTypes.bool,
    /**
     * 下拉框显示或关闭时触发事件的回调函数
     * @param {Boolean} visible 是否显示
     * @param {String} type 触发显示关闭的操作类型
     */
    onVisibleChange: PropTypes.func,
    /**
     * 下拉框自定义样式对象
     */
    popupStyle: PropTypes.object,
    /**
     * 下拉框样式自定义类名
     */
    popupClassName: PropTypes.string,
    /**
     * 下拉框挂载的容器节点
     */
    popupContainer: PropTypes.any,
    /**
     * 透传到 Popup 的属性对象
     */
    popupProps: PropTypes.object,
    /**
     * 是否跟随滚动
     */
    followTrigger: PropTypes.bool,
    /**
     * 是否为预览态
     */
    isPreview: PropTypes.bool,
    /**
     * 预览态模式下渲染的内容
     * @param {Array<data>} value 选择值 { label: , value:}
     */
    renderPreview: PropTypes.func
}, _class.defaultProps = {
    prefix: 'next-',
    pure: false,
    size: 'medium',
    disabled: false,
    hasArrow: true,
    hasBorder: true,
    hasClear: false,
    autoWidth: true,
    defaultValue: null,
    onChange: noop,
    showSearch: false,
    onSearch: noop,
    onSearchClear: noop,
    notFoundContent: 'Not Found',
    multiple: false,
    treeCheckable: false,
    treeCheckStrictly: false,
    treeCheckedStrategy: 'parent',
    treeDefaultExpandAll: false,
    treeDefaultExpandedKeys: [],
    treeProps: {},
    defaultVisible: false,
    onVisibleChange: noop
}, _temp);
TreeSelect.displayName = 'TreeSelect';
export { TreeSelect as default };


TreeSelect.Node = TreeNode;