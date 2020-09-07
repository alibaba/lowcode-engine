import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp, _initialiseProps;

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Dropdown from '../../dropdown';
import Menu from '../../menu';
import Button from '../../button';
import Icon from '../../icon';
import { KEYCODE } from '../../util';

// 共享状态的组件需要变成非受控组件
var Filter = (_temp = _class = function (_React$Component) {
    _inherits(Filter, _React$Component);

    function Filter(props) {
        _classCallCheck(this, Filter);

        var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

        _initialiseProps.call(_this);

        var filterParams = props.filterParams || {};
        var filterConfig = filterParams[props.dataIndex] || {};
        _this.state = {
            visible: filterConfig.visible || false,
            selectedKeys: filterConfig.selectedKeys || []
        };
        _this._selectedKeys = [].concat(_this.state.selectedKeys);
        return _this;
    }

    Filter.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        if (nextProps.hasOwnProperty('filterParams') && typeof nextProps.filterParams !== 'undefined') {
            var dataIndex = nextProps.dataIndex || this.props.dataIndex;
            var filterParams = nextProps.filterParams || {};
            var filterConfig = filterParams[dataIndex] || {};
            var selectedKeys = filterConfig.selectedKeys || [];
            this.setState({
                selectedKeys: selectedKeys
            });
            this._selectedKeys = [].concat(selectedKeys);
        }
    };

    Filter.prototype.render = function render() {
        var _classnames;

        var _props = this.props,
            filters = _props.filters,
            prefix = _props.prefix,
            locale = _props.locale,
            className = _props.className,
            filterMode = _props.filterMode,
            filterMenuProps = _props.filterMenuProps,
            filterProps = _props.filterProps,
            rtl = _props.rtl;
        var _state = this.state,
            visible = _state.visible,
            selectedKeys = _state.selectedKeys;

        var subMenuSelectable = filterMenuProps.subMenuSelectable,
            others = _objectWithoutProperties(filterMenuProps, ['subMenuSelectable']);

        function renderMenuItem(item) {
            return React.createElement(
                Menu.Item,
                { key: item.value },
                item.label
            );
        }

        function renderSubMenu(parent, children) {
            return React.createElement(
                Menu.SubMenu,
                {
                    label: parent.label,
                    key: parent.value,
                    selectable: subMenuSelectable
                },
                renderMenuContent(children)
            );
        }

        function renderMenuContent(list) {
            return list.map(function (item) {
                if (item.children) {
                    return renderSubMenu(item, item.children);
                } else {
                    return renderMenuItem(item);
                }
            });
        }

        var content = renderMenuContent(filters),
            footer = React.createElement(
            'div',
            { className: prefix + 'table-filter-footer' },
            React.createElement(
                Button,
                { type: 'primary', onClick: this.onFilterConfirm },
                locale.ok
            ),
            React.createElement(
                Button,
                { onClick: this.onFilterClear },
                locale.reset
            )
        );

        var cls = classnames((_classnames = {}, _classnames[prefix + 'table-filter'] = true, _classnames[className] = className, _classnames));

        return React.createElement(
            Dropdown,
            _extends({
                trigger: React.createElement(
                    'span',
                    {
                        role: 'button',
                        'aria-label': locale.filter,
                        onKeyDown: this.filterKeydown,
                        tabIndex: '0',
                        className: cls
                    },
                    React.createElement(Icon, { type: 'filter', size: 'small' })
                ),
                triggerType: 'click',
                visible: visible,
                autoFocus: true,
                rtl: rtl,
                needAdjust: false,
                onVisibleChange: this.onFilterVisible
            }, filterProps),
            React.createElement(
                Menu,
                _extends({
                    footer: footer,
                    rtl: rtl,
                    selectedKeys: selectedKeys,
                    selectMode: filterMode,
                    onSelect: this.onFilterSelect
                }, others),
                content
            )
        );
    };

    return Filter;
}(React.Component), _class.propTypes = {
    dataIndex: PropTypes.string,
    filters: PropTypes.array,
    filterMode: PropTypes.string,
    filterParams: PropTypes.object,
    filterMenuProps: PropTypes.object,
    filterProps: PropTypes.object,
    locale: PropTypes.object,
    onFilter: PropTypes.func,
    prefix: PropTypes.string,
    rtl: PropTypes.bool
}, _class.defaultProps = {
    onFilter: function onFilter() {}
}, _initialiseProps = function _initialiseProps() {
    var _this2 = this;

    this.filterKeydown = function (e) {
        e.preventDefault();
        e.stopPropagation();

        if (e.keyCode === KEYCODE.ENTER) {
            _this2.setState({
                visible: !_this2.state.visible
            });
        }
    };

    this.onFilterVisible = function (visible) {
        _this2.setState({
            visible: visible
        });

        if (!visible) {
            var selectedKeys = [].concat(_this2._selectedKeys);

            _this2.setState({
                selectedKeys: selectedKeys
            });
        }
    };

    this.onFilterSelect = function (selectedKeys) {
        _this2.setState({
            visible: true,
            selectedKeys: selectedKeys
        });
    };

    this.onFilterConfirm = function () {
        var selectedKeys = _this2.state.selectedKeys;
        var filterParams = {},
            dataIndex = _this2.props.dataIndex;


        filterParams[dataIndex] = {
            visible: false,
            selectedKeys: selectedKeys
        };
        _this2._selectedKeys = [].concat(selectedKeys);
        _this2.setState({
            visible: false
        });
        // 兼容之前的格式
        _this2.props.onFilter(filterParams);
    };

    this.onFilterClear = function () {
        var filterParams = {},
            dataIndex = _this2.props.dataIndex;


        filterParams[dataIndex] = {
            visible: false,
            selectedKeys: []
        };
        _this2._selectedKeys = [];
        _this2.setState({
            selectedKeys: [],
            visible: false
        });
        // 兼容之前的格式
        _this2.props.onFilter(filterParams);
    };
}, _temp);
Filter.displayName = 'Filter';
export { Filter as default };