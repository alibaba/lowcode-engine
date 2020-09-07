import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ConfigProvider from '../config-provider';

/**
 * Input.Group
 */
var Group = (_temp = _class = function (_React$Component) {
    _inherits(Group, _React$Component);

    function Group() {
        _classCallCheck(this, Group);

        return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
    }

    Group.prototype.render = function render() {
        var _classNames, _classNames2, _classNames3;

        var _props = this.props,
            className = _props.className,
            style = _props.style,
            children = _props.children,
            prefix = _props.prefix,
            addonBefore = _props.addonBefore,
            addonAfter = _props.addonAfter,
            addonBeforeClassName = _props.addonBeforeClassName,
            addonAfterClassName = _props.addonAfterClassName,
            rtl = _props.rtl,
            others = _objectWithoutProperties(_props, ['className', 'style', 'children', 'prefix', 'addonBefore', 'addonAfter', 'addonBeforeClassName', 'addonAfterClassName', 'rtl']);

        var cls = classNames((_classNames = {}, _classNames[prefix + 'input-group'] = true, _classNames[className] = !!className, _classNames));

        var addonCls = prefix + 'input-group-addon';
        var beforeCls = classNames(addonCls, (_classNames2 = {}, _classNames2[prefix + 'before'] = true, _classNames2[addonBeforeClassName] = addonBeforeClassName, _classNames2));
        var afterCls = classNames(addonCls, (_classNames3 = {}, _classNames3[prefix + 'after'] = true, _classNames3[addonAfterClassName] = addonAfterClassName, _classNames3));

        var before = addonBefore ? React.createElement(
            'span',
            { className: beforeCls },
            addonBefore
        ) : null;

        var after = addonAfter ? React.createElement(
            'span',
            { className: afterCls },
            addonAfter
        ) : null;

        return React.createElement(
            'span',
            _extends({}, others, {
                dir: rtl ? 'rtl' : undefined,
                className: cls,
                style: style
            }),
            before,
            children,
            after
        );
    };

    return Group;
}(React.Component), _class.propTypes = {
    /**
     * 样式前缀
     */
    prefix: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node,
    /**
     * 输入框前附加内容
     */
    addonBefore: PropTypes.node,
    /**
     * 输入框前附加内容css
     */
    addonBeforeClassName: PropTypes.string,
    /**
     * 输入框后附加内容
     */
    addonAfter: PropTypes.node,
    /**
     * 输入框后额外css
     */
    addonAfterClassName: PropTypes.string,
    /**
     * rtl
     */
    rtl: PropTypes.bool
}, _class.defaultProps = {
    prefix: 'next-'
}, _temp);
Group.displayName = 'Group';


export default ConfigProvider.config(Group);