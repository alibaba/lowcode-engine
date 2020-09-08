import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

/* istanbul ignore file */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import Menu from '../../menu';

var SelectMenu = (_temp = _class = function (_Component) {
    _inherits(SelectMenu, _Component);

    function SelectMenu() {
        _classCallCheck(this, SelectMenu);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    SelectMenu.prototype.componentDidMount = function componentDidMount() {
        this.scrollToSelectedItem();
    };

    SelectMenu.prototype.scrollToSelectedItem = function scrollToSelectedItem() {
        var _props = this.props,
            prefix = _props.prefix,
            dataSource = _props.dataSource,
            value = _props.value;


        var selectedIndex = dataSource.findIndex(function (item) {
            return item.value === value;
        });

        if (selectedIndex === -1) {
            return;
        }

        var itemSelector = '.' + prefix + 'menu-item';
        var menu = findDOMNode(this.refs.menu);
        var targetItem = menu.querySelectorAll(itemSelector)[selectedIndex];
        if (targetItem) {
            menu.scrollTop = targetItem.offsetTop - Math.floor((menu.clientHeight / targetItem.clientHeight - 1) / 2) * targetItem.clientHeight;
        }
    };

    SelectMenu.prototype.render = function render() {
        var _props2 = this.props,
            prefix = _props2.prefix,
            dataSource = _props2.dataSource,
            onChange = _props2.onChange,
            value = _props2.value,
            className = _props2.className,
            others = _objectWithoutProperties(_props2, ['prefix', 'dataSource', 'onChange', 'value', 'className']);

        return React.createElement(
            Menu,
            _extends({}, others, {
                ref: 'menu',
                selectMode: 'single',
                selectedKeys: [String(value)],
                onSelect: function onSelect(selectKeys) {
                    return onChange(Number(selectKeys[0]));
                },
                role: 'listbox',
                className: prefix + 'calendar-panel-menu ' + className
            }),
            dataSource.map(function (_ref) {
                var label = _ref.label,
                    value = _ref.value;
                return React.createElement(
                    Menu.Item,
                    { key: value },
                    label
                );
            })
        );
    };

    return SelectMenu;
}(Component), _class.isNextMenu = true, _class.propTypes = {
    dataSource: PropTypes.arrayOf(PropTypes.object),
    value: PropTypes.number,
    prefix: PropTypes.string,
    onChange: PropTypes.func,
    children: PropTypes.node
}, _temp);
SelectMenu.displayName = 'SelectMenu';
export { SelectMenu as default };