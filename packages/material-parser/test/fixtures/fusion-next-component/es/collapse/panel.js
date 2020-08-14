import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp2;

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ConfigProvider from '../config-provider';
import Icon from '../icon';
import { func, KEYCODE } from '../util';

/** Collapse.Panel */
var Panel = (_temp2 = _class = function (_React$Component) {
    _inherits(Panel, _React$Component);

    function Panel() {
        var _temp, _this, _ret;

        _classCallCheck(this, Panel);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.onKeyDown = function (e) {
            var keyCode = e.keyCode;

            if (keyCode === KEYCODE.SPACE) {
                var onClick = _this.props.onClick;

                e.preventDefault();
                onClick && onClick(e);
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    } //

    Panel.prototype.render = function render() {
        var _classNames, _classNames2;

        var _props = this.props,
            title = _props.title,
            children = _props.children,
            className = _props.className,
            isExpanded = _props.isExpanded,
            disabled = _props.disabled,
            style = _props.style,
            prefix = _props.prefix,
            onClick = _props.onClick,
            id = _props.id,
            others = _objectWithoutProperties(_props, ['title', 'children', 'className', 'isExpanded', 'disabled', 'style', 'prefix', 'onClick', 'id']);

        var cls = classNames((_classNames = {}, _classNames[prefix + 'collapse-panel'] = true, _classNames[prefix + 'collapse-panel-hidden'] = !isExpanded, _classNames[prefix + 'collapse-panel-expanded'] = isExpanded, _classNames[prefix + 'collapse-panel-disabled'] = disabled, _classNames[className] = className, _classNames));

        var iconCls = classNames((_classNames2 = {}, _classNames2[prefix + 'collapse-panel-icon'] = true, _classNames2[prefix + 'collapse-panel-icon-expanded'] = isExpanded, _classNames2));

        // 为了无障碍 需要添加两个id
        var headingId = id ? id + '-heading' : undefined;
        var regionId = id ? id + '-region' : undefined;
        return React.createElement(
            'div',
            _extends({ className: cls, style: style, id: id }, others),
            React.createElement(
                'div',
                {
                    id: headingId,
                    className: prefix + 'collapse-panel-title',
                    onClick: onClick,
                    onKeyDown: this.onKeyDown,
                    tabIndex: '0',
                    'aria-disabled': disabled,
                    'aria-expanded': isExpanded,
                    'aria-controls': regionId,
                    role: 'button'
                },
                React.createElement(Icon, {
                    type: 'arrow-up',
                    className: iconCls,
                    'aria-hidden': 'true'
                }),
                title
            ),
            React.createElement(
                'div',
                {
                    className: prefix + 'collapse-panel-content',
                    role: 'region',
                    id: regionId
                },
                children
            )
        );
    };

    return Panel;
}(React.Component), _class.propTypes = {
    /**
     * 样式类名的品牌前缀
     */
    prefix: PropTypes.string,
    /**
     * 子组件接受行内样式
     */
    style: PropTypes.object,
    children: PropTypes.any,
    isExpanded: PropTypes.bool,
    /**
     * 是否禁止用户操作
     */
    disabled: PropTypes.bool,
    /**
     * 标题
     */
    title: PropTypes.node,
    /**
     * 扩展class
     */
    className: PropTypes.string,
    onClick: PropTypes.func,
    id: PropTypes.string
}, _class.defaultProps = {
    prefix: 'next-',
    isExpanded: false,
    onClick: func.noop
}, _class.isNextPanel = true, _temp2);
Panel.displayName = 'Panel';


export default ConfigProvider.config(Panel);