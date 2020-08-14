import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Checkbox from '../../checkbox';
import Search from '../../search';
import Menu from '../../menu';
import { func, htmlId } from '../../util';
import TransferItem from './transfer-item';

var bindCtx = func.bindCtx;
var TransferPanel = (_temp = _class = function (_Component) {
    _inherits(TransferPanel, _Component);

    function TransferPanel(props, context) {
        _classCallCheck(this, TransferPanel);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

        _this.state = {
            searchedValue: '',
            dragValue: null,
            dragOverValue: null
        };
        _this.footerId = props.baseId ? htmlId.escapeForId(props.baseId + '-panel-footer-' + props.position) : '';
        _this.headerId = props.baseId ? htmlId.escapeForId(props.baseId + '-panel-header-' + props.position) : '';

        bindCtx(_this, ['handleCheck', 'handleAllCheck', 'handleSearch', 'handleItemDragStart', 'handleItemDragOver', 'handleItemDragEnd', 'handleItemDrop', 'getListDOM']);
        _this.firstRender = true;
        return _this;
    }

    TransferPanel.prototype.componentDidMount = function componentDidMount() {
        this.firstRender = false;
    };

    TransferPanel.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
        if (prevProps.dataSource.length !== this.props.dataSource.length && this.list) {
            if (this.list.scrollTop > 0) {
                this.list.scrollTop = 0;
            }
        }

        this.searched = false;
    };

    TransferPanel.prototype.getListDOM = function getListDOM(ref) {
        this.list = ref;
    };

    TransferPanel.prototype.handleAllCheck = function handleAllCheck(allChecked) {
        var _props = this.props,
            position = _props.position,
            onChange = _props.onChange;


        var newValue = void 0;
        if (allChecked) {
            newValue = this.enabledDatasource.map(function (item) {
                return item.value;
            });
        } else {
            newValue = [];
        }

        onChange && onChange(position, newValue);
    };

    TransferPanel.prototype.handleCheck = function handleCheck(itemValue, checked) {
        var _props2 = this.props,
            position = _props2.position,
            value = _props2.value,
            onChange = _props2.onChange;


        var newValue = [].concat(value);
        var index = value.indexOf(itemValue);
        if (checked && index === -1) {
            newValue.push(itemValue);
        } else if (!checked && index > -1) {
            newValue.splice(index, 1);
        }

        onChange && onChange(position, newValue);
    };

    TransferPanel.prototype.handleSearch = function handleSearch(searchedValue) {
        this.setState({
            searchedValue: searchedValue
        });
        this.searched = true;

        var _props3 = this.props,
            onSearch = _props3.onSearch,
            position = _props3.position;

        onSearch(searchedValue, position);
    };

    TransferPanel.prototype.handleItemDragStart = function handleItemDragStart(position, value) {
        this.setState({
            dragPosition: position,
            dragValue: value
        });
    };

    TransferPanel.prototype.handleItemDragOver = function handleItemDragOver(value) {
        this.setState({
            dragOverValue: value
        });
    };

    TransferPanel.prototype.handleItemDragEnd = function handleItemDragEnd() {
        this.setState({
            dragOverValue: null
        });
    };

    TransferPanel.prototype.handleItemDrop = function handleItemDrop() {
        var _props4;

        this.setState({
            dragOverValue: null
        });

        (_props4 = this.props).onSort.apply(_props4, arguments);
    };

    TransferPanel.prototype.renderHeader = function renderHeader() {
        var _props5 = this.props,
            title = _props5.title,
            prefix = _props5.prefix;


        return React.createElement(
            'div',
            {
                id: this.headerId,
                className: prefix + 'transfer-panel-header'
            },
            title
        );
    };

    TransferPanel.prototype.renderSearch = function renderSearch() {
        var _props6 = this.props,
            prefix = _props6.prefix,
            searchPlaceholder = _props6.searchPlaceholder,
            locale = _props6.locale;

        return React.createElement(Search, {
            'aria-labelledby': this.headerId,
            shape: 'simple',
            className: prefix + 'transfer-panel-search',
            placeholder: searchPlaceholder || locale.searchPlaceholder,
            onChange: this.handleSearch
        });
    };

    TransferPanel.prototype.renderList = function renderList(dataSource) {
        var _cx,
            _this2 = this;

        var _props7 = this.props,
            prefix = _props7.prefix,
            position = _props7.position,
            mode = _props7.mode,
            value = _props7.value,
            onMove = _props7.onMove,
            disabled = _props7.disabled,
            listClassName = _props7.listClassName,
            listStyle = _props7.listStyle,
            itemRender = _props7.itemRender,
            sortable = _props7.sortable,
            customerList = _props7.customerList;
        var _state = this.state,
            dragPosition = _state.dragPosition,
            dragValue = _state.dragValue,
            dragOverValue = _state.dragOverValue;

        var newClassName = cx((_cx = {}, _cx[prefix + 'transfer-panel-list'] = true, _cx[listClassName] = !!listClassName, _cx));

        var customerPanel = customerList && customerList(this.props);
        if (customerPanel) {
            return React.createElement(
                'div',
                {
                    className: newClassName,
                    style: listStyle,
                    ref: this.getListDOM
                },
                customerPanel
            );
        }

        return dataSource.length ? React.createElement(
            Menu,
            {
                className: newClassName,
                style: listStyle,
                ref: this.getListDOM
            },
            dataSource.map(function (item) {
                return React.createElement(TransferItem, {
                    key: item.value,
                    prefix: prefix,
                    mode: mode,
                    checked: value.indexOf(item.value) > -1,
                    disabled: disabled || item.disabled,
                    item: item,
                    onCheck: _this2.handleCheck,
                    onClick: onMove,
                    needHighlight: !_this2.firstRender && !_this2.searched,
                    itemRender: itemRender,
                    draggable: sortable,
                    onDragStart: _this2.handleItemDragStart,
                    onDragOver: _this2.handleItemDragOver,
                    onDragEnd: _this2.handleItemDragEnd,
                    onDrop: _this2.handleItemDrop,
                    dragPosition: dragPosition,
                    dragValue: dragValue,
                    dragOverValue: dragOverValue,
                    panelPosition: position
                });
            })
        ) : React.createElement(
            'div',
            { className: newClassName, style: listStyle },
            this.renderNotFoundContent()
        );
    };

    TransferPanel.prototype.renderNotFoundContent = function renderNotFoundContent() {
        var _props8 = this.props,
            prefix = _props8.prefix,
            notFoundContent = _props8.notFoundContent;


        return React.createElement(
            'div',
            { className: prefix + 'transfer-panel-not-found-container' },
            React.createElement(
                'div',
                { className: prefix + 'transfer-panel-not-found' },
                notFoundContent
            )
        );
    };

    TransferPanel.prototype.renderFooter = function renderFooter() {
        var _props9 = this.props,
            prefix = _props9.prefix,
            position = _props9.position,
            mode = _props9.mode,
            disabled = _props9.disabled,
            locale = _props9.locale;

        if (mode === 'simple') {
            var _cx2;

            var onMoveAll = this.props.onMoveAll;

            var classNames = cx((_cx2 = {}, _cx2[prefix + 'transfer-panel-move-all'] = true, _cx2[prefix + 'disabled'] = disabled, _cx2));
            return React.createElement(
                'div',
                { className: prefix + 'transfer-panel-footer' },
                React.createElement(
                    'a',
                    {
                        className: classNames,
                        onClick: onMoveAll.bind(this, position === 'left' ? 'right' : 'left')
                    },
                    locale.moveAll
                )
            );
        }

        var _props10 = this.props,
            value = _props10.value,
            dataSource = _props10.dataSource;

        var checkedCount = value.length;
        var totalCount = dataSource.length;
        var totalEnabledCount = this.enabledDatasource.length;
        var checked = checkedCount > 0 && checkedCount >= totalEnabledCount;
        var indeterminate = checkedCount > 0 && checkedCount < totalEnabledCount;
        var items = totalCount > 1 ? locale.items : locale.item;
        var countLabel = checkedCount === 0 ? totalCount + ' ' + items : checkedCount + '/' + totalCount + ' ' + items;

        return React.createElement(
            'div',
            { className: prefix + 'transfer-panel-footer' },
            React.createElement(Checkbox, {
                disabled: disabled,
                checked: checked,
                indeterminate: indeterminate,
                onChange: this.handleAllCheck,
                'aria-labelledby': this.footerId
            }),
            React.createElement(
                'span',
                {
                    className: prefix + 'transfer-panel-count',
                    id: this.footerId
                },
                countLabel
            )
        );
    };

    TransferPanel.prototype.render = function render() {
        var _props11 = this.props,
            prefix = _props11.prefix,
            title = _props11.title,
            showSearch = _props11.showSearch,
            filter = _props11.filter;
        var searchedValue = this.state.searchedValue;

        var dataSource = this.props.dataSource;
        this.enabledDatasource = dataSource.filter(function (item) {
            return !item.disabled;
        });
        if (showSearch && searchedValue) {
            dataSource = dataSource.filter(function (item) {
                return filter(searchedValue, item);
            });
        }

        return React.createElement(
            'div',
            { className: prefix + 'transfer-panel' },
            title ? this.renderHeader() : null,
            showSearch ? this.renderSearch() : null,
            this.renderList(dataSource),
            this.renderFooter()
        );
    };

    return TransferPanel;
}(Component), _class.propTypes = {
    prefix: PropTypes.string,
    position: PropTypes.oneOf(['left', 'right']),
    mode: PropTypes.oneOf(['normal', 'simple']),
    dataSource: PropTypes.array,
    value: PropTypes.array,
    onChange: PropTypes.func,
    onMove: PropTypes.func,
    onMoveAll: PropTypes.func,
    disabled: PropTypes.bool,
    locale: PropTypes.object,
    title: PropTypes.node,
    showSearch: PropTypes.bool,
    filter: PropTypes.func,
    onSearch: PropTypes.func,
    searchPlaceholder: PropTypes.string,
    notFoundContent: PropTypes.node,
    listClassName: PropTypes.string,
    listStyle: PropTypes.object,
    itemRender: PropTypes.func,
    sortable: PropTypes.bool,
    onSort: PropTypes.func,
    baseId: PropTypes.string,
    customerList: PropTypes.func
}, _temp);
TransferPanel.displayName = 'TransferPanel';
export { TransferPanel as default };