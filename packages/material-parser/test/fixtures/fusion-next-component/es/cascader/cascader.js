import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Menu from '../menu';
import { func, obj, dom } from '../util';
import CascaderMenu from './menu';
import CascaderMenuItem from './item';
import { filterChildValue, getAllCheckedValues, forEachEnableNode, isSiblingOrSelf, isNodeChecked } from './utils';

var bindCtx = func.bindCtx;
var pickOthers = obj.pickOthers;
var addClass = dom.addClass,
    removeClass = dom.removeClass,
    setStyle = dom.setStyle,
    getStyle = dom.getStyle;

/**
 * Cascader
 */

var Cascader = (_temp = _class = function (_Component) {
    _inherits(Cascader, _Component);

    function Cascader(props, context) {
        _classCallCheck(this, Cascader);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

        var defaultValue = props.defaultValue,
            value = props.value,
            defaultExpandedValue = props.defaultExpandedValue,
            expandedValue = props.expandedValue,
            dataSource = props.dataSource,
            multiple = props.multiple,
            checkStrictly = props.checkStrictly,
            canOnlyCheckLeaf = props.canOnlyCheckLeaf,
            loadData = props.loadData;


        _this.updateCache(dataSource);

        var normalizedValue = _this.normalizeValue(typeof value === 'undefined' ? defaultValue : value);
        if (!loadData) {
            normalizedValue = normalizedValue.filter(function (v) {
                return _this._v2n[v];
            });
        }
        // TODO loadData
        var realExpandedValue = typeof expandedValue === 'undefined' ? typeof defaultExpandedValue === 'undefined' ? _this.getExpandedValue(normalizedValue[0]) : _this.normalizeValue(defaultExpandedValue) : _this.normalizeValue(expandedValue);
        var st = {
            value: normalizedValue,
            expandedValue: realExpandedValue
        };
        if (multiple && !checkStrictly && !canOnlyCheckLeaf) {
            st.value = _this.completeValue(props.dataSource, st.value);
        }

        _this.state = st;

        _this.lastExpandedValue = [].concat(_this.state.expandedValue);

        bindCtx(_this, ['handleMouseLeave', 'handleFocus', 'handleFold', 'getCascaderNode', 'onBlur']);
        return _this;
    }

    Cascader.prototype.componentDidMount = function componentDidMount() {
        this.setCascaderInnerWidth();
    };

    Cascader.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        var _this2 = this;

        this.updateCache(nextProps.dataSource);

        var state = {};
        if ('value' in nextProps) {
            state.value = this.normalizeValue(nextProps.value);
            if (!nextProps.loadData) {
                state.value = state.value.filter(function (v) {
                    return _this2._v2n[v];
                });
            }

            var multiple = nextProps.multiple,
                checkStrictly = nextProps.checkStrictly,
                canOnlyCheckLeaf = nextProps.canOnlyCheckLeaf;

            if (multiple && !checkStrictly && !canOnlyCheckLeaf) {
                state.value = this.completeValue(nextProps.dataSource, state.value);
            }
            if (!this.state.expandedValue.length && !('expandedValue' in nextProps)) {
                state.expandedValue = this.getExpandedValue(state.value[0]);
            }
        }
        if ('expandedValue' in nextProps) {
            state.expandedValue = this.normalizeValue(nextProps.expandedValue);
        }
        if (Object.keys(state).length) {
            this.setState(state);
        }
    };

    Cascader.prototype.componentDidUpdate = function componentDidUpdate() {
        this.setCascaderInnerWidth();
    };

    Cascader.prototype.getCascaderNode = function getCascaderNode(ref) {
        this.cascader = ref;
        if (this.cascader) {
            this.cascaderInner = this.cascader.querySelector('.' + this.props.prefix + 'cascader-inner');
        }
    };

    Cascader.prototype.setCascaderInnerWidth = function setCascaderInnerWidth() {
        if (!this.cascaderInner) {
            return;
        }
        var menus = [].slice.call(this.cascaderInner.querySelectorAll('.' + this.props.prefix + 'cascader-menu-wrapper'));
        if (menus.length === 0) {
            return;
        }

        var menusWidth = Math.ceil(menus.reduce(function (ret, menu) {
            return ret + getStyle(menu, 'width');
        }, 0));

        if (getStyle(this.cascaderInner, 'width') !== menusWidth) {
            setStyle(this.cascaderInner, 'width', menusWidth);
        }

        if (getStyle(this.cascader, 'display') === 'inline-block') {
            var hasRightBorderClass = this.props.prefix + 'has-right-border';
            menus.forEach(function (menu) {
                return removeClass(menu, hasRightBorderClass);
            });
            if (this.cascader.clientWidth > menusWidth) {
                addClass(menus[menus.length - 1], hasRightBorderClass);
            }
        }
    };

    Cascader.prototype.setCache = function setCache(data) {
        var _this3 = this;

        var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '0';

        data.forEach(function (item, index) {
            var value = item.value,
                children = item.children;

            var pos = prefix + '-' + index;
            var newValue = String(value);
            item.value = newValue;
            _this3._v2n[newValue] = _this3._p2n[pos] = _extends({}, item, {
                pos: pos,
                _source: item
            });

            if (children && children.length) {
                _this3.setCache(children, pos);
            }
        });
    };

    Cascader.prototype.updateCache = function updateCache(dataSource) {
        this._v2n = {};
        this._p2n = {};
        this.setCache(dataSource);
    };

    Cascader.prototype.normalizeValue = function normalizeValue(value) {
        if (value) {
            if (Array.isArray(value)) {
                return value;
            }

            return [value];
        }

        return [];
    };

    Cascader.prototype.getExpandedValue = function getExpandedValue(v) {
        var _this4 = this;

        if (!v || !this._v2n[v]) {
            return [];
        }

        var pos = this._v2n[v].pos;
        if (pos.split('-').length === 2) {
            return [];
        }

        var expandedMap = {};
        Object.keys(this._p2n).forEach(function (p) {
            if (_this4.isDescendantOrSelf(p, pos) && p !== pos) {
                expandedMap[_this4._p2n[p].value] = p;
            }
        });

        return Object.keys(expandedMap).sort(function (prev, next) {
            return expandedMap[prev].split('-').length - expandedMap[next].split('-').length;
        });
    };
    /*eslint-disable max-statements*/


    Cascader.prototype.completeValue = function completeValue(dataSource, value) {
        return getAllCheckedValues(value, this._v2n, this._p2n);
    };
    /*eslint-enable*/


    Cascader.prototype.flatValue = function flatValue(value) {
        return filterChildValue(value, this._v2n, this._p2n);
    };

    Cascader.prototype.getValue = function getValue(pos) {
        return this._p2n[pos] ? this._p2n[pos].value : null;
    };

    Cascader.prototype.getPos = function getPos(value) {
        return this._v2n[value] ? this._v2n[value].pos : null;
    };

    Cascader.prototype.getData = function getData(value) {
        var _this5 = this;

        return value.map(function (v) {
            return _this5._v2n[v];
        });
    };

    Cascader.prototype.isDescendantOrSelf = function isDescendantOrSelf(currentPos, targetPos) {
        if (!currentPos || !targetPos) {
            return false;
        }

        var currentNums = currentPos.split('-');
        var targetNums = targetPos.split('-');

        return currentNums.length <= targetNums.length && currentNums.every(function (num, index) {
            return num === targetNums[index];
        });
    };

    Cascader.prototype.processValue = function processValue(value, v, checked) {
        var index = value.indexOf(v);
        if (checked && index === -1) {
            value.push(v);
        } else if (!checked && index > -1) {
            value.splice(index, 1);
        }
    };

    Cascader.prototype.handleSelect = function handleSelect(v, canExpand) {
        var _this6 = this;

        if (!(this.props.canOnlySelectLeaf && canExpand)) {
            var data = this._v2n[v];
            var nums = data.pos.split('-');
            var selectedPath = nums.slice(1).reduce(function (ret, num, index) {
                var p = nums.slice(0, index + 2).join('-');
                ret.push(_this6._p2n[p]);
                return ret;
            }, []);

            if (this.state.value[0] !== v) {
                if (!('value' in this.props)) {
                    this.setState({
                        value: [v]
                    });
                }

                if ('onChange' in this.props) {
                    this.props.onChange(v, data, {
                        selectedPath: selectedPath
                    });
                }
            }

            if ('onSelect' in this.props) {
                this.props.onSelect(v, data, {
                    selectedPath: selectedPath
                });
            }
        }

        if (canExpand) {
            if (!this.props.canOnlySelectLeaf) {
                this.lastExpandedValue = this.state.expandedValue.slice(0, -1);
            }
        } else {
            this.lastExpandedValue = [].concat(this.state.expandedValue);
        }
    };
    /*eslint-disable max-statements*/


    Cascader.prototype.handleCheck = function handleCheck(v, checked) {
        var _this7 = this;

        var _props = this.props,
            checkStrictly = _props.checkStrictly,
            canOnlyCheckLeaf = _props.canOnlyCheckLeaf;

        var value = [].concat(this.state.value);

        if (checkStrictly || canOnlyCheckLeaf) {
            this.processValue(value, v, checked);
        } else {
            var pos = this.getPos(v);

            var ps = Object.keys(this._p2n);

            forEachEnableNode(this._v2n[v], function (node) {
                if (node.checkable === false) return;
                _this7.processValue(value, node.value, checked);
            });

            var currentPos = pos;
            var nums = pos.split('-');
            for (var i = nums.length; i > 2; i--) {
                var parentCheck = true;

                var parentPos = nums.slice(0, i - 1).join('-');
                if (this._p2n[parentPos].disabled || this._p2n[parentPos].checkboxDisabled || this._p2n[parentPos].checkable === false) {
                    currentPos = parentPos;
                    continue;
                }

                var parentValue = this._p2n[parentPos].value;
                var parentChecked = value.indexOf(parentValue) > -1;
                if (!checked && !parentChecked) {
                    break;
                }

                for (var j = 0; j < ps.length; j++) {
                    var p = ps[j];
                    var pnode = this._p2n[p];
                    if (isSiblingOrSelf(currentPos, p) && !pnode.disabled && !pnode.checkboxDisabled) {
                        var k = pnode.value;
                        // eslint-disable-next-line max-depth
                        if (pnode.checkable === false) {
                            // eslint-disable-next-line max-depth
                            if (!pnode.children || pnode.children.length === 0) {
                                continue;
                            }
                            // eslint-disable-next-line max-depth
                            for (var m = 0; m < pnode.children.length; m++) {
                                // eslint-disable-next-line max-depth
                                if (!pnode.children.every(function (child) {
                                    return isNodeChecked(child, value);
                                })) {
                                    parentCheck = false;
                                    break;
                                }
                            }
                        } else if (value.indexOf(k) === -1) {
                            parentCheck = false;
                        }

                        if (!parentCheck) break;
                    }
                }

                this.processValue(value, parentValue, parentCheck);

                currentPos = parentPos;
            }
        }

        if (!('value' in this.props)) {
            this.setState({
                value: value
            });
        }

        if ('onChange' in this.props) {
            if (checkStrictly || canOnlyCheckLeaf) {
                var data = this.getData(value);
                this.props.onChange(value, data, {
                    checked: checked,
                    currentData: this._v2n[v],
                    checkedData: data
                });
            } else {
                var flatValue = this.flatValue(value);
                var flatData = this.getData(flatValue);
                var checkedData = this.getData(value);
                var indeterminateValue = this.getIndeterminate(value);
                var indeterminateData = this.getData(indeterminateValue);
                this.props.onChange(flatValue, flatData, {
                    checked: checked,
                    currentData: this._v2n[v],
                    checkedData: checkedData,
                    indeterminateData: indeterminateData
                });
            }
        }

        this.lastExpandedValue = [].concat(this.state.expandedValue);
    };

    Cascader.prototype.handleExpand = function handleExpand(value, level, canExpand, focusedFirstChild) {
        var _this8 = this;

        var expandedValue = this.state.expandedValue;


        if (canExpand || expandedValue.length > level) {
            if (canExpand) {
                expandedValue.splice(level, expandedValue.length - level, value);
            } else {
                expandedValue.splice(level);
            }

            var callback = function callback() {
                _this8.setExpandValue(expandedValue);

                if (focusedFirstChild) {
                    var endExpandedValue = expandedValue[expandedValue.length - 1];
                    _this8.setState({
                        focusedValue: _this8._v2n[endExpandedValue].children[0].value
                    });
                }
            };

            var loadData = this.props.loadData;

            if (canExpand && loadData) {
                var data = this._v2n[value];
                return loadData(data, data._source).then(callback);
            } else {
                return callback();
            }
        }
    };

    Cascader.prototype.handleMouseLeave = function handleMouseLeave() {
        this.setExpandValue([].concat(this.lastExpandedValue));
    };

    Cascader.prototype.setExpandValue = function setExpandValue(expandedValue) {
        if (!('expandedValue' in this.props)) {
            this.setState({
                expandedValue: expandedValue
            });
        }

        if ('onExpand' in this.props) {
            this.props.onExpand(expandedValue);
        }
    };

    Cascader.prototype.getFirstFocusKeyByDataSource = function getFirstFocusKeyByDataSource(dataSource) {
        if (!dataSource || dataSource.length === 0) {
            return '';
        }

        for (var i = 0; i < dataSource.length; i++) {
            if (dataSource[i] && !dataSource[i].disabled) {
                return dataSource[i].value;
            }
        }

        return '';
    };

    Cascader.prototype.getFirstFocusKeyByFilteredPaths = function getFirstFocusKeyByFilteredPaths(filteredPaths) {
        if (!filteredPaths || filteredPaths.length === 0) {
            return '';
        }

        for (var i = 0; i < filteredPaths.length; i++) {
            var path = filteredPaths[i];
            if (!path.some(function (item) {
                return item.disabled;
            })) {
                var lastItem = path[path.length - 1];
                return lastItem.value;
            }
        }

        return '';
    };

    Cascader.prototype.getFirstFocusKey = function getFirstFocusKey() {
        var _props2 = this.props,
            dataSource = _props2.dataSource,
            searchValue = _props2.searchValue,
            filteredPaths = _props2.filteredPaths;


        return !searchValue ? this.getFirstFocusKeyByDataSource(dataSource) : this.getFirstFocusKeyByFilteredPaths(filteredPaths);
    };

    Cascader.prototype.setFocusValue = function setFocusValue() {
        this.setState({
            focusedValue: this.getFirstFocusKey()
        });
    };

    Cascader.prototype.handleFocus = function handleFocus(focusedValue) {
        this.setState({
            focusedValue: focusedValue
        });
    };

    Cascader.prototype.handleFold = function handleFold() {
        var expandedValue = this.state.expandedValue;

        if (expandedValue.length > 0) {
            this.setExpandValue(expandedValue.slice(0, -1));
        }

        this.setState({
            focusedValue: expandedValue[expandedValue.length - 1]
        });
    };

    Cascader.prototype.getIndeterminate = function getIndeterminate(value) {
        var _this9 = this;

        var indeterminateValues = [];

        var poss = filterChildValue(value.filter(function (v) {
            return !!_this9._v2n[v];
        }).filter(function (v) {
            return !_this9._v2n[v].disabled && !_this9._v2n[v].checkboxDisabled && _this9._v2n[v].checkable !== false;
        }), this._v2n, this._p2n).map(function (v) {
            return _this9._v2n[v].pos;
        });
        poss.forEach(function (pos) {
            var nums = pos.split('-');
            for (var i = nums.length; i > 2; i--) {
                var parentPos = nums.slice(0, i - 1).join('-');
                var parent = _this9._p2n[parentPos];
                if (parent.disabled || parent.checkboxDisabled) break;
                var parentValue = parent.value;
                if (indeterminateValues.indexOf(parentValue) === -1) {
                    indeterminateValues.push(parentValue);
                }
            }
        });

        return indeterminateValues;
    };

    Cascader.prototype.onBlur = function onBlur(e) {
        this.setState({
            focusedValue: undefined
        });

        this.props.onBlur && this.props.onBlur(e);
    };

    Cascader.prototype.renderMenu = function renderMenu(data, level) {
        var _this10 = this;

        var _props3 = this.props,
            prefix = _props3.prefix,
            multiple = _props3.multiple,
            useVirtual = _props3.useVirtual,
            checkStrictly = _props3.checkStrictly,
            expandTriggerType = _props3.expandTriggerType,
            loadData = _props3.loadData,
            canOnlyCheckLeaf = _props3.canOnlyCheckLeaf,
            listClassName = _props3.listClassName,
            listStyle = _props3.listStyle,
            itemRender = _props3.itemRender;
        var _state = this.state,
            value = _state.value,
            expandedValue = _state.expandedValue,
            focusedValue = _state.focusedValue;


        return React.createElement(
            CascaderMenu,
            {
                key: level,
                prefix: prefix,
                useVirtual: useVirtual,
                className: listClassName,
                style: listStyle,
                ref: this.saveMenuRef,
                focusedKey: focusedValue,
                onItemFocus: this.handleFocus,
                onBlur: this.onBlur
            },
            data.map(function (item) {
                var disabled = !!item.disabled;
                var canExpand = !!item.children && !!item.children.length || !!loadData && !item.isLeaf;
                var expanded = expandedValue[level] === item.value;
                var props = {
                    prefix: prefix,
                    disabled: disabled,
                    canExpand: canExpand,
                    expanded: expanded,
                    expandTriggerType: expandTriggerType,
                    onExpand: _this10.handleExpand.bind(_this10, item.value, level, canExpand),
                    onFold: _this10.handleFold
                };

                if (multiple) {
                    props.checkable = !(canOnlyCheckLeaf && canExpand);
                    props.checked = value.indexOf(item.value) > -1 || !!item.checked;
                    props.indeterminate = (checkStrictly || canOnlyCheckLeaf ? false : _this10.indeterminate.indexOf(item.value) > -1) || !!item.indeterminate;
                    props.checkboxDisabled = !!item.checkboxDisabled;
                    props.onCheck = _this10.handleCheck.bind(_this10, item.value);
                } else {
                    props.selected = value[0] === item.value;
                    props.onSelect = _this10.handleSelect.bind(_this10, item.value, canExpand);
                }

                return React.createElement(
                    CascaderMenuItem,
                    _extends({ key: item.value }, props),
                    itemRender(item)
                );
            })
        );
    };

    Cascader.prototype.renderMenus = function renderMenus() {
        var dataSource = this.props.dataSource;
        var expandedValue = this.state.expandedValue;


        var menus = [];
        var data = dataSource;

        for (var i = 0; i <= expandedValue.length; i++) {
            if (!data) {
                break;
            }

            menus.push(this.renderMenu(data, i));

            var expandedItem = void 0;
            for (var j = 0; j < data.length; j++) {
                if (data[j].value === expandedValue[i]) {
                    expandedItem = data[j];
                    break;
                }
            }
            data = expandedItem ? expandedItem.children : null;
        }

        return menus;
    };

    Cascader.prototype.renderFilteredItem = function renderFilteredItem(path) {
        var _props4 = this.props,
            prefix = _props4.prefix,
            resultRender = _props4.resultRender,
            searchValue = _props4.searchValue,
            multiple = _props4.multiple;
        var value = this.state.value;

        var lastItem = path[path.length - 1];

        var Item = void 0;
        var props = {
            key: lastItem.value,
            className: prefix + 'cascader-filtered-item',
            disabled: path.some(function (item) {
                return item.disabled;
            }),
            children: resultRender(searchValue, path)
        };

        if (multiple) {
            Item = Menu.CheckboxItem;
            var _props5 = this.props,
                checkStrictly = _props5.checkStrictly,
                canOnlyCheckLeaf = _props5.canOnlyCheckLeaf;

            props.checked = value.indexOf(lastItem.value) > -1;
            props.indeterminate = !checkStrictly && !canOnlyCheckLeaf && this.indeterminate.indexOf(lastItem.value) > -1;
            props.checkboxDisabled = lastItem.checkboxDisabled;
            props.onChange = this.handleCheck.bind(this, lastItem.value);
        } else {
            Item = Menu.Item;
            props.selected = value[0] === lastItem.value;
            props.onSelect = this.handleSelect.bind(this, lastItem.value, false);
        }

        return React.createElement(Item, props);
    };

    Cascader.prototype.renderFilteredList = function renderFilteredList() {
        var _this11 = this;

        var _props6 = this.props,
            prefix = _props6.prefix,
            filteredListStyle = _props6.filteredListStyle,
            filteredPaths = _props6.filteredPaths;
        var focusedValue = this.state.focusedValue;

        return React.createElement(
            Menu,
            {
                focusedKey: focusedValue,
                onItemFocus: this.handleFocus,
                className: prefix + 'cascader-filtered-list',
                style: filteredListStyle
            },
            filteredPaths.map(function (path) {
                return _this11.renderFilteredItem(path);
            })
        );
    };

    Cascader.prototype.render = function render() {
        var _cx;

        var _props7 = this.props,
            prefix = _props7.prefix,
            rtl = _props7.rtl,
            className = _props7.className,
            expandTriggerType = _props7.expandTriggerType,
            multiple = _props7.multiple,
            dataSource = _props7.dataSource,
            checkStrictly = _props7.checkStrictly,
            canOnlyCheckLeaf = _props7.canOnlyCheckLeaf,
            searchValue = _props7.searchValue;

        var others = pickOthers(Object.keys(Cascader.propTypes), this.props);
        var value = this.state.value;


        if (rtl) {
            others.dir = 'rtl';
        }

        var props = _extends({
            className: cx((_cx = {}, _cx[prefix + 'cascader'] = true, _cx.multiple = multiple, _cx[className] = !!className, _cx)),
            ref: 'cascader'
        }, others);
        if (expandTriggerType === 'hover') {
            props.onMouseLeave = this.handleMouseLeave;
        }

        if (multiple && !checkStrictly && !canOnlyCheckLeaf) {
            this.indeterminate = this.getIndeterminate(value);
        }

        return React.createElement(
            'div',
            _extends({}, props, { ref: this.getCascaderNode }),
            !searchValue ? React.createElement(
                'div',
                { className: prefix + 'cascader-inner' },
                dataSource && dataSource.length ? this.renderMenus() : null
            ) : this.renderFilteredList()
        );
    };

    return Cascader;
}(Component), _class.propTypes = {
    prefix: PropTypes.string,
    rtl: PropTypes.bool,
    pure: PropTypes.bool,
    className: PropTypes.string,
    /**
     * 数据源，结构可参考下方说明
     */
    dataSource: PropTypes.arrayOf(PropTypes.object),
    /**
     * （非受控）默认值
     */
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    /**
     * （受控）当前值
     */
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    /**
     * 选中值改变时触发的回调函数
     * @param {String|Array} value 选中的值，单选时返回单个值，多选时返回数组
     * @param {Object|Array} data 选中的数据，包括 value 和 label，单选时返回单个值，多选时返回数组，父子节点选中关联时，同时选中，只返回父节点
     * @param {Object} extra 额外参数
     * @param {Array} extra.selectedPath 单选时选中的数据的路径
     * @param {Boolean} extra.checked 多选时当前的操作是选中还是取消选中
     * @param {Object} extra.currentData 多选时当前操作的数据
     * @param {Array} extra.checkedData 多选时所有被选中的数据
     * @param {Array} extra.indeterminateData 多选时半选的数据
     */
    onChange: PropTypes.func,
    onSelect: PropTypes.func,
    /**
     * （非受控）默认展开值，如果不设置，组件内部会根据 defaultValue/value 进行自动设置
     */
    defaultExpandedValue: PropTypes.arrayOf(PropTypes.string),
    /**
     * （受控）当前展开值
     */
    expandedValue: PropTypes.arrayOf(PropTypes.string),
    /**
     * 展开触发的方式
     */
    expandTriggerType: PropTypes.oneOf(['click', 'hover']),
    /**
     * 展开时触发的回调函数
     * @param {Array} expandedValue 各列展开值的数组
     */
    onExpand: PropTypes.func,
    /**
     * 是否开启虚拟滚动
     */
    useVirtual: PropTypes.bool,
    /**
     * 是否多选
     */
    multiple: PropTypes.bool,
    /**
     * 单选时是否只能选中叶子节点
     */
    canOnlySelectLeaf: PropTypes.bool,
    /**
     * 多选时是否只能选中叶子节点
     */
    canOnlyCheckLeaf: PropTypes.bool,
    /**
     * 父子节点是否选中不关联
     */
    checkStrictly: PropTypes.bool,
    /**
     * 每列列表样式对象
     */
    listStyle: PropTypes.object,
    /**
     * 每列列表类名
     */
    listClassName: PropTypes.string,
    /**
     * 每列列表项渲染函数
     * @param {Object} data 数据
     * @return {ReactNode} 列表项内容
     */
    itemRender: PropTypes.func,
    /**
     * 异步加载数据函数
     * @param {Object} data 当前点击异步加载的数据
     * @param {Object} source 当前点击数据，source是原始对象
     */
    loadData: PropTypes.func,
    searchValue: PropTypes.string,
    onBlur: PropTypes.func,
    filteredPaths: PropTypes.array,
    filteredListStyle: PropTypes.object,
    resultRender: PropTypes.func
}, _class.defaultProps = {
    prefix: 'next-',
    rtl: false,
    pure: false,
    dataSource: [],
    defaultValue: null,
    canOnlySelectLeaf: false,
    canOnlyCheckLeaf: false,
    expandTriggerType: 'click',
    multiple: false,
    useVirtual: false,
    checkStrictly: false,
    itemRender: function itemRender(item) {
        return item.label;
    }
}, _temp);
Cascader.displayName = 'Cascader';
export { Cascader as default };