import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Select from '../select';
import Cascader from '../cascader';
import Menu from '../menu';
import { func, obj, dom, KEYCODE } from '../util';

var bindCtx = func.bindCtx;
var pickOthers = obj.pickOthers;
var getStyle = dom.getStyle;

/**
 * CascaderSelect
 */

var CascaderSelect = (_temp = _class = function (_Component) {
    _inherits(CascaderSelect, _Component);

    function CascaderSelect(props, context) {
        _classCallCheck(this, CascaderSelect);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

        _this.state = {
            value: _this.normalizeValue('value' in props ? props.value : props.defaultValue),
            searchValue: '',
            visible: typeof props.visible === 'undefined' ? props.defaultVisible : props.visible
        };

        bindCtx(_this, ['handleVisibleChange', 'handleAfterOpen', 'handleSelect', 'handleChange', 'handleClear', 'handleRemove', 'handleSearch', 'getPopup', 'saveSelectRef', 'saveCascaderRef', 'handleKeyDown']);
        return _this;
    }

    CascaderSelect.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        var st = {};

        if ('value' in nextProps) {
            st.value = this.normalizeValue(nextProps.value);
        }
        if ('visible' in nextProps) {
            st.visible = nextProps.visible;
        }

        if (Object.keys(st).length) {
            this.setState(st);
        }
    };

    CascaderSelect.prototype.normalizeValue = function normalizeValue(value) {
        if (value) {
            if (Array.isArray(value)) {
                return value;
            }

            return [value];
        }

        return [];
    };

    CascaderSelect.prototype.updateCache = function updateCache(dataSource) {
        var _this2 = this;

        this._v2n = {};
        this._p2n = {};
        var loop = function loop(data) {
            var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '0';
            return data.forEach(function (item, index) {
                var value = item.value,
                    children = item.children;

                var pos = prefix + '-' + index;
                _this2._v2n[value] = _this2._p2n[pos] = _extends({}, item, { pos: pos });

                if (children && children.length) {
                    loop(children, pos);
                }
            });
        };

        loop(dataSource);
    };

    CascaderSelect.prototype.flatValue = function flatValue(value) {
        var _this3 = this;

        var getDepth = function getDepth(v) {
            var pos = _this3.getPos(v);
            if (!pos) {
                return 0;
            }
            return pos.split('-').length;
        };
        var newValue = value.slice(0).sort(function (prev, next) {
            return getDepth(prev) - getDepth(next);
        });

        for (var i = 0; i < newValue.length; i++) {
            for (var j = 0; j < newValue.length; j++) {
                if (i !== j && this.isDescendantOrSelf(this.getPos(newValue[i]), this.getPos(newValue[j]))) {
                    newValue.splice(j, 1);
                    j--;
                }
            }
        }

        return newValue;
    };

    CascaderSelect.prototype.isDescendantOrSelf = function isDescendantOrSelf(currentPos, targetPos) {
        if (!currentPos || !targetPos) {
            return false;
        }

        var currentNums = currentPos.split('-');
        var targetNums = targetPos.split('-');

        return currentNums.length <= targetNums.length && currentNums.every(function (num, index) {
            return num === targetNums[index];
        });
    };

    CascaderSelect.prototype.getValue = function getValue(pos) {
        return this._p2n[pos] ? this._p2n[pos].value : null;
    };

    CascaderSelect.prototype.getPos = function getPos(value) {
        return this._v2n[value] ? this._v2n[value].pos : null;
    };

    CascaderSelect.prototype.getData = function getData(value) {
        var _this4 = this;

        return value.map(function (v) {
            return _this4._v2n[v];
        });
    };

    CascaderSelect.prototype.getLabelPath = function getLabelPath(data) {
        var _this5 = this;

        var nums = data.pos.split('-');
        return nums.slice(1).reduce(function (ret, num, index) {
            var p = nums.slice(0, index + 2).join('-');
            ret.push(_this5._p2n[p].label);
            return ret;
        }, []);
    };

    CascaderSelect.prototype.getSignleData = function getSignleData(value) {
        if (!value.length) {
            return null;
        }

        if (Array.isArray(value)) value = value[0];

        var data = this._v2n[value];
        if (!data) {
            return {
                value: value
            };
        }

        var labelPath = this.getLabelPath(data);
        var displayRender = this.props.displayRender || function (labels) {
            return labels.join(' / ');
        };

        return _extends({}, data, {
            label: displayRender(labelPath, data)
        });
    };

    CascaderSelect.prototype.getMultipleData = function getMultipleData(value) {
        var _this6 = this;

        if (!value.length) {
            return null;
        }

        var _props = this.props,
            checkStrictly = _props.checkStrictly,
            canOnlyCheckLeaf = _props.canOnlyCheckLeaf,
            displayRender = _props.displayRender;

        var data = (checkStrictly || canOnlyCheckLeaf ? value : this.flatValue(value)).map(function (v) {
            return _this6._v2n[v] || { value: v };
        });

        if (displayRender) {
            data = data.map(function (item) {
                if (!item.pos) {
                    return item;
                }
                var labelPath = _this6.getLabelPath(item);

                return _extends({}, item, {
                    label: displayRender(labelPath, item)
                });
            });
        }

        return data;
    };

    CascaderSelect.prototype.getIndeterminate = function getIndeterminate(value) {
        var _this7 = this;

        var indeterminate = [];

        var positions = value.map(this.getPos.bind(this));
        positions.forEach(function (pos) {
            if (!pos) {
                return false;
            }
            var nums = pos.split('-');
            for (var i = nums.length; i > 2; i--) {
                var parentPos = nums.slice(0, i - 1).join('-');
                var parentValue = _this7.getValue(parentPos);
                if (indeterminate.indexOf(parentValue) === -1) {
                    indeterminate.push(parentValue);
                }
            }
        });

        return indeterminate;
    };

    CascaderSelect.prototype.saveSelectRef = function saveSelectRef(ref) {
        this.select = ref;
    };

    CascaderSelect.prototype.saveCascaderRef = function saveCascaderRef(ref) {
        this.cascader = ref;
    };

    CascaderSelect.prototype.completeValue = function completeValue(value) {
        var newValue = [];

        var flatValue = this.flatValue(value).reverse();
        var ps = Object.keys(this._p2n);
        for (var i = 0; i < ps.length; i++) {
            for (var j = 0; j < flatValue.length; j++) {
                var v = flatValue[j];
                if (this.isDescendantOrSelf(this.getPos(v), ps[i])) {
                    newValue.push(this.getValue(ps[i]));
                    ps.splice(i, 1);
                    i--;
                    break;
                }
            }
        }

        return newValue;
    };

    CascaderSelect.prototype.isLeaf = function isLeaf(data) {
        return !(data.children && data.children.length || !!this.props.loadData && !data.isLeaf);
    };

    CascaderSelect.prototype.handleVisibleChange = function handleVisibleChange(visible, type) {
        var searchValue = this.state.searchValue;

        if (!('visible' in this.props)) {
            this.setState({
                visible: visible
            });
        }

        if (!visible && searchValue) {
            this.setState({
                searchValue: ''
            });
        }

        if (['fromCascader', 'keyboard'].indexOf(type) !== -1 && !visible) {
            this.select.focusInput();
        }

        this.props.onVisibleChange(visible, type);
    };

    CascaderSelect.prototype.handleKeyDown = function handleKeyDown(e) {
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
                this.cascader.setFocusValue();
                e.preventDefault();
                break;
            default:
                break;
        }
    };

    CascaderSelect.prototype.getPopup = function getPopup(ref) {
        this.popup = ref;
        if (typeof this.props.popupProps.ref === 'function') {
            this.props.popupProps.ref(ref);
        }
    };

    CascaderSelect.prototype.handleAfterOpen = function handleAfterOpen() {
        if (!this.popup) {
            return;
        }

        var _props2 = this.props,
            prefix = _props2.prefix,
            popupProps = _props2.popupProps;

        var dropDownNode = this.popup.getInstance().overlay.getInstance().getContentNode();
        var cascaderNode = dropDownNode.querySelector('.' + prefix + 'cascader');
        if (cascaderNode) {
            this.cascaderHeight = getStyle(cascaderNode, 'height');
        }

        if (typeof popupProps.afterOpen === 'function') {
            popupProps.afterOpen();
        }
    };

    CascaderSelect.prototype.handleSelect = function handleSelect(value, data) {
        var _props3 = this.props,
            multiple = _props3.multiple,
            changeOnSelect = _props3.changeOnSelect;
        var _state = this.state,
            visible = _state.visible,
            searchValue = _state.searchValue;


        if (!multiple && (!changeOnSelect || this.isLeaf(data) || !!searchValue)) {
            this.handleVisibleChange(!visible, 'fromCascader');
        }
    };

    CascaderSelect.prototype.handleChange = function handleChange(value, data, extra) {
        var _this8 = this;

        var _props4 = this.props,
            multiple = _props4.multiple,
            onChange = _props4.onChange;
        var _state2 = this.state,
            searchValue = _state2.searchValue,
            stateValue = _state2.value;


        var st = {};

        if (multiple && stateValue && Array.isArray(stateValue)) {
            value = [].concat(stateValue.filter(function (v) {
                return !_this8._v2n[v];
            }), value);
        }

        if (!('value' in this.props)) {
            st.value = value;
        }
        if (!multiple && searchValue) {
            st.searchValue = '';
        }
        if (Object.keys(st).length) {
            this.setState(st);
        }

        if (onChange) {
            onChange(value, data, extra);
        }

        if (searchValue && this.select) {
            this.select.handleSearchClear();
        }
    };

    CascaderSelect.prototype.handleClear = function handleClear() {
        // 单选时点击清空按钮
        var _props5 = this.props,
            hasClear = _props5.hasClear,
            multiple = _props5.multiple,
            treeCheckable = _props5.treeCheckable;

        if (hasClear && (!multiple || !treeCheckable)) {
            if (!('value' in this.props)) {
                this.setState({
                    value: []
                });
            }

            this.props.onChange(null, null);
        }
    };

    CascaderSelect.prototype.handleRemove = function handleRemove(currentData) {
        var currentValue = currentData.value;

        var value = void 0;

        var _props6 = this.props,
            multiple = _props6.multiple,
            checkStrictly = _props6.checkStrictly,
            onChange = _props6.onChange;

        if (multiple) {
            value = [].concat(this.state.value);
            value.splice(value.indexOf(currentValue), 1);

            if (this.props.onChange) {
                var data = this.getData(value);
                var checked = false;

                if (checkStrictly) {
                    this.props.onChange(value, data, {
                        checked: checked,
                        currentData: currentData,
                        checkedData: data
                    });
                } else {
                    var checkedValue = this.completeValue(value);
                    var checkedData = this.getData(checkedValue);
                    var indeterminateValue = this.getIndeterminate(value);
                    var indeterminateData = this.getData(indeterminateValue);
                    this.props.onChange(value, data, {
                        checked: checked,
                        currentData: currentData,
                        checkedData: checkedData,
                        indeterminateData: indeterminateData
                    });
                }
            }
        } else {
            value = [];
            onChange(null, null);
        }

        if (!('value' in this.props)) {
            this.setState({
                value: value
            });
        }
    };

    CascaderSelect.prototype.handleSearch = function handleSearch(searchValue) {
        this.setState({
            searchValue: searchValue
        });
    };

    CascaderSelect.prototype.getPath = function getPath(pos) {
        var items = [];

        var nums = pos.split('-');
        if (nums === 2) {
            items.push(this._p2n[pos]);
        } else {
            for (var i = 1; i < nums.length; i++) {
                var p = nums.slice(0, i + 1).join('-');
                items.push(this._p2n[p]);
            }
        }

        return items;
    };

    CascaderSelect.prototype.filterItems = function filterItems() {
        var _this9 = this;

        var _props7 = this.props,
            multiple = _props7.multiple,
            changeOnSelect = _props7.changeOnSelect,
            canOnlyCheckLeaf = _props7.canOnlyCheckLeaf,
            filter = _props7.filter;
        var searchValue = this.state.searchValue;

        var items = Object.keys(this._p2n).map(function (p) {
            return _this9._p2n[p];
        });
        if (!multiple && !changeOnSelect || multiple && canOnlyCheckLeaf) {
            items = items.filter(function (item) {
                return !item.children || !item.children.length;
            });
        }

        return items.map(function (item) {
            return _this9.getPath(item.pos);
        }).filter(function (path) {
            return filter(searchValue, path);
        });
    };

    CascaderSelect.prototype.renderNotFound = function renderNotFound() {
        var _props8 = this.props,
            prefix = _props8.prefix,
            notFoundContent = _props8.notFoundContent;


        return React.createElement(
            Menu,
            { className: prefix + 'cascader-select-not-found' },
            React.createElement(
                Menu.Item,
                null,
                notFoundContent
            )
        );
    };

    CascaderSelect.prototype.renderCascader = function renderCascader() {
        var dataSource = this.props.dataSource;

        if (dataSource.length === 0) {
            return this.renderNotFound();
        }

        var searchValue = this.state.searchValue;

        var filteredPaths = [];
        if (searchValue) {
            filteredPaths = this.filterItems();
            if (filteredPaths.length === 0) {
                return this.renderNotFound();
            }
        }

        var _props9 = this.props,
            multiple = _props9.multiple,
            useVirtual = _props9.useVirtual,
            changeOnSelect = _props9.changeOnSelect,
            checkStrictly = _props9.checkStrictly,
            canOnlyCheckLeaf = _props9.canOnlyCheckLeaf,
            defaultExpandedValue = _props9.defaultExpandedValue,
            expandTriggerType = _props9.expandTriggerType,
            onExpand = _props9.onExpand,
            listStyle = _props9.listStyle,
            listClassName = _props9.listClassName,
            loadData = _props9.loadData,
            showSearch = _props9.showSearch,
            resultRender = _props9.resultRender,
            readOnly = _props9.readOnly,
            itemRender = _props9.itemRender;
        var value = this.state.value;


        var props = {
            dataSource: dataSource,
            value: value,
            multiple: multiple,
            useVirtual: useVirtual,
            canOnlySelectLeaf: !changeOnSelect,
            checkStrictly: checkStrictly,
            canOnlyCheckLeaf: canOnlyCheckLeaf,
            defaultExpandedValue: defaultExpandedValue,
            expandTriggerType: expandTriggerType,
            ref: this.saveCascaderRef,
            onExpand: onExpand,
            listStyle: listStyle,
            listClassName: listClassName,
            loadData: loadData,
            itemRender: itemRender
        };
        if (!readOnly) {
            props.onChange = this.handleChange;
            props.onSelect = this.handleSelect;
        }
        if (showSearch) {
            props.searchValue = searchValue;
            props.filteredPaths = filteredPaths;
            props.resultRender = resultRender;
            props.filteredListStyle = { height: this.cascaderHeight };
        }

        return React.createElement(Cascader, props);
    };

    CascaderSelect.prototype.renderPopupContent = function renderPopupContent() {
        var _props10 = this.props,
            prefix = _props10.prefix,
            header = _props10.header,
            footer = _props10.footer;

        return React.createElement(
            'div',
            { className: prefix + 'cascader-select-dropdown' },
            header,
            this.renderCascader(),
            footer
        );
    };

    CascaderSelect.prototype.renderPreview = function renderPreview(others) {
        var _props11 = this.props,
            prefix = _props11.prefix,
            multiple = _props11.multiple,
            className = _props11.className,
            renderPreview = _props11.renderPreview;
        var value = this.state.value;

        var previewCls = classNames(className, prefix + 'form-preview');
        var items = (multiple ? this.getMultipleData(value) : this.getSignleData(value)) || [];

        if (!Array.isArray(items)) {
            items = [items];
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

    CascaderSelect.prototype.render = function render() {
        var _props12 = this.props,
            prefix = _props12.prefix,
            size = _props12.size,
            hasArrow = _props12.hasArrow,
            hasBorder = _props12.hasBorder,
            hasClear = _props12.hasClear,
            label = _props12.label,
            readOnly = _props12.readOnly,
            placeholder = _props12.placeholder,
            dataSource = _props12.dataSource,
            disabled = _props12.disabled,
            multiple = _props12.multiple,
            className = _props12.className,
            showSearch = _props12.showSearch,
            popupStyle = _props12.popupStyle,
            popupClassName = _props12.popupClassName,
            popupContainer = _props12.popupContainer,
            popupProps = _props12.popupProps,
            followTrigger = _props12.followTrigger,
            isPreview = _props12.isPreview;
        var _state3 = this.state,
            value = _state3.value,
            searchValue = _state3.searchValue,
            visible = _state3.visible;

        var others = pickOthers(Object.keys(CascaderSelect.propTypes), this.props);

        this.updateCache(dataSource);

        if (isPreview) {
            return this.renderPreview(others);
        }

        var popupContent = this.renderPopupContent();

        var props = {
            prefix: prefix,
            className: className,
            size: size,
            placeholder: placeholder,
            disabled: disabled,
            hasArrow: hasArrow,
            hasBorder: hasBorder,
            hasClear: hasClear,
            label: label,
            readOnly: readOnly,
            ref: this.saveSelectRef,
            autoWidth: false,
            mode: multiple ? 'multiple' : 'single',
            value: multiple ? this.getMultipleData(value) : this.getSignleData(value),
            onChange: this.handleClear,
            onRemove: this.handleRemove,
            visible: visible,
            onVisibleChange: this.handleVisibleChange,
            showSearch: showSearch,
            // searchValue,
            onSearch: this.handleSearch,
            onKeyDown: this.handleKeyDown,
            popupContent: popupContent,
            popupStyle: popupStyle,
            popupClassName: popupClassName,
            popupContainer: popupContainer,
            popupProps: popupProps,
            followTrigger: followTrigger
        };

        if (showSearch) {
            props.popupProps = _extends({}, popupProps, {
                ref: this.getPopup,
                afterOpen: this.handleAfterOpen
            });
            props.autoWidth = showSearch && !!searchValue;
        }

        return React.createElement(Select, _extends({}, props, others));
    };

    return CascaderSelect;
}(Component), _class.propTypes = {
    prefix: PropTypes.string,
    pure: PropTypes.bool,
    className: PropTypes.string,
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
     * 是否有清除按钮
     */
    hasClear: PropTypes.bool,
    /**
     * 自定义内联 label
     */
    label: PropTypes.node,
    /**
     * 是否只读，只读模式下可以展开弹层但不能选
     */
    readOnly: PropTypes.bool,
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
    /**
     * 默认展开值，如果不设置，组件内部会根据 defaultValue/value 进行自动设置
     */
    defaultExpandedValue: PropTypes.arrayOf(PropTypes.string),
    /**
     * 展开触发的方式
     */
    expandTriggerType: PropTypes.oneOf(['click', 'hover']),
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
     * 是否选中即发生改变, 该属性仅在单选模式下有效
     */
    changeOnSelect: PropTypes.bool,
    /**
     * 是否只能勾选叶子项的checkbox，该属性仅在多选模式下有效
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
     * 选择框单选时展示结果的自定义渲染函数
     * @param {Array} label 选中路径的文本数组
     * @return {ReactNode} 渲染在选择框中的内容
     * @default 单选时：labelPath => labelPath.join(' / ')；多选时：labelPath => labelPath[labelPath.length - 1]
     */
    displayRender: PropTypes.func,
    /**
     * 渲染 item 内容的方法
     * @param {Object} item 渲染节点的item
     * @return {ReactNode} item node
     */
    itemRender: PropTypes.func,
    /**
     * 是否显示搜索框
     */
    showSearch: PropTypes.bool,
    /**
     * 自定义搜索函数
     * @param {String} searchValue 搜索的关键字
     * @param {Array} path 节点路径
     * @return {Boolean} 是否匹配
     * @default 根据路径所有节点的文本值模糊匹配
     */
    filter: PropTypes.func,
    /**
     * 搜索结果自定义渲染函数
     * @param {String} searchValue 搜索的关键字
     * @param {Array} path 匹配到的节点路径
     * @return {ReactNode} 渲染的内容
     * @default 按照节点文本 a / b / c 的模式渲染
     */
    resultRender: PropTypes.func,
    /**
     * 搜索结果列表是否和选择框等宽
     */
    resultAutoWidth: PropTypes.bool,
    /**
     * 无数据时显示内容
     */
    notFoundContent: PropTypes.node,
    /**
     * 异步加载数据函数
     * @param {Object} data 当前点击异步加载的数据
     */
    loadData: PropTypes.func,
    /**
     * 自定义下拉框头部
     */
    header: PropTypes.node,
    /**
     * 自定义下拉框底部
     */
    footer: PropTypes.node,
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
     * @param {String} type 触发显示关闭的操作类型, fromTrigger 表示由trigger的点击触发； docClick 表示由document的点击触发
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
    dataSource: [],
    defaultValue: null,
    expandTriggerType: 'click',
    onExpand: function onExpand() {},
    useVirtual: false,
    multiple: false,
    changeOnSelect: false,
    canOnlyCheckLeaf: false,
    checkStrictly: false,
    showSearch: false,
    filter: function filter(searchValue, path) {
        return path.some(function (item) {
            return item.label.indexOf(searchValue) > -1;
        });
    },
    resultRender: function resultRender(searchValue, path) {
        var parts = [];
        path.forEach(function (item, i) {
            var others = item.label.split(searchValue);
            others.forEach(function (other, j) {
                if (other) {
                    parts.push(other);
                }
                if (j < others.length - 1) {
                    parts.push(React.createElement(
                        'em',
                        { key: i + '-' + j },
                        searchValue
                    ));
                }
            });
            if (i < path.length - 1) {
                parts.push(' / ');
            }
        });
        return React.createElement(
            'span',
            null,
            parts
        );
    },
    resultAutoWidth: true,
    notFoundContent: 'Not Found',
    defaultVisible: false,
    onVisibleChange: function onVisibleChange() {},
    popupProps: {}
}, _temp);
CascaderSelect.displayName = 'CascaderSelect';
export { CascaderSelect as default };