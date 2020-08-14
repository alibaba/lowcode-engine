import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { func, obj } from '../util';
import Icon from '../icon';
import zhCN from '../locale/zh-cn';
import { normalMap, edgeMap } from './alignMap';

/**
 * Created by xiachi on 17/2/10.
 */

var noop = func.noop;
var BalloonInner = (_temp = _class = function (_React$Component) {
    _inherits(BalloonInner, _React$Component);

    function BalloonInner() {
        _classCallCheck(this, BalloonInner);

        return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
    }

    BalloonInner.prototype.render = function render() {
        var _classNames;

        var _props = this.props,
            prefix = _props.prefix,
            closable = _props.closable,
            className = _props.className,
            style = _props.style,
            isTooltip = _props.isTooltip,
            align = _props.align,
            type = _props.type,
            onClose = _props.onClose,
            alignEdge = _props.alignEdge,
            children = _props.children,
            rtl = _props.rtl,
            locale = _props.locale,
            others = _objectWithoutProperties(_props, ['prefix', 'closable', 'className', 'style', 'isTooltip', 'align', 'type', 'onClose', 'alignEdge', 'children', 'rtl', 'locale']);

        var alignMap = alignEdge ? edgeMap : normalMap;
        var _prefix = prefix;

        if (isTooltip) {
            _prefix = _prefix + 'balloon-tooltip';
        } else {
            _prefix = _prefix + 'balloon';
        }

        var classes = classNames((_classNames = {}, _classNames['' + _prefix] = true, _classNames[_prefix + '-' + type] = type, _classNames[_prefix + '-medium'] = true, _classNames[_prefix + '-' + alignMap[align].arrow] = alignMap[align], _classNames[_prefix + '-closable'] = closable, _classNames[className] = className, _classNames));

        return React.createElement(
            'div',
            _extends({
                role: 'tooltip',
                'aria-live': 'polite',
                dir: rtl ? 'rtl' : undefined,
                className: classes,
                style: style
            }, obj.pickOthers(Object.keys(BalloonInner.propTypes), others)),
            children,
            closable ? React.createElement(
                'a',
                {
                    role: 'button',
                    'aria-label': locale.close,
                    tabIndex: '0',
                    className: _prefix + '-close',
                    onClick: onClose
                },
                React.createElement(Icon, { type: 'close', size: 'small' })
            ) : null
        );
    };

    return BalloonInner;
}(React.Component), _class.contextTypes = {
    prefix: PropTypes.string
}, _class.propTypes = {
    prefix: PropTypes.string,
    rtl: PropTypes.bool,
    closable: PropTypes.bool,
    children: PropTypes.any,
    className: PropTypes.string,
    alignEdge: PropTypes.bool,
    onClose: PropTypes.func,
    style: PropTypes.any,
    align: PropTypes.string,
    type: PropTypes.string,
    isTooltip: PropTypes.bool,
    locale: PropTypes.object,
    pure: PropTypes.bool
}, _class.defaultProps = {
    prefix: 'next-',
    closable: true,
    onClose: noop,
    locale: zhCN.Balloon,
    align: 'b',
    type: 'normal',
    alignEdge: false,
    pure: false
}, _temp);
BalloonInner.displayName = 'BalloonInner';


export default BalloonInner;