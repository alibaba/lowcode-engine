import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Overlay from '../overlay';
import ConfigProvider from '../config-provider';
import { obj, func } from '../util';

/* eslint-disable react/prefer-stateless-function */

/** Loading */
var Loading = (_temp = _class = function (_React$Component) {
    _inherits(Loading, _React$Component);

    function Loading() {
        _classCallCheck(this, Loading);

        return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
    }

    Loading.prototype.render = function render() {
        var _classNames2, _classNames3, _classNames4;

        var _props = this.props,
            tip = _props.tip,
            visible = _props.visible,
            children = _props.children,
            className = _props.className,
            style = _props.style,
            indicator = _props.indicator,
            color = _props.color,
            prefix = _props.prefix,
            fullScreen = _props.fullScreen,
            onVisibleChange = _props.onVisibleChange,
            tipAlign = _props.tipAlign,
            size = _props.size,
            inline = _props.inline,
            rtl = _props.rtl;


        var indicatorDom = null;
        var dotCls = prefix + 'loading-dot';

        if (indicator) {
            indicatorDom = indicator;
        } else {
            var _classNames;

            var backgroundColor = color;
            var fusionReactorCls = classNames((_classNames = {}, _classNames[prefix + 'loading-fusion-reactor'] = true, _classNames[prefix + 'loading-medium-fusion-reactor'] = size === 'medium', _classNames));
            indicatorDom = React.createElement(
                'div',
                { className: fusionReactorCls, dir: rtl ? 'rtl' : undefined },
                React.createElement('span', { className: dotCls, style: { backgroundColor: backgroundColor } }),
                React.createElement('span', { className: dotCls, style: { backgroundColor: backgroundColor } }),
                React.createElement('span', { className: dotCls, style: { backgroundColor: backgroundColor } }),
                React.createElement('span', { className: dotCls, style: { backgroundColor: backgroundColor } })
            );
        }

        var loadingCls = classNames((_classNames2 = {}, _classNames2[prefix + 'loading'] = true, _classNames2[prefix + 'open'] = visible, _classNames2[prefix + 'loading-inline'] = inline, _classNames2[className] = className, _classNames2));

        var tipCls = classNames((_classNames3 = {}, _classNames3[prefix + 'loading-tip'] = true, _classNames3[prefix + 'loading-tip-fullscreen'] = fullScreen, _classNames3[prefix + 'loading-right-tip'] = tipAlign === 'right', _classNames3));

        var others = obj.pickOthers(Loading.propTypes, this.props);

        var contentCls = classNames((_classNames4 = {}, _classNames4[prefix + 'loading-component'] = visible, _classNames4[prefix + 'loading-wrap'] = true, _classNames4));

        return fullScreen ? [children, React.createElement(
            Overlay,
            _extends({
                key: 'overlay',
                hasMask: true,
                align: 'cc cc'
            }, others, {
                className: className,
                style: style,
                visible: visible,
                onRequestClose: onVisibleChange
            }),
            React.createElement(
                'div',
                { className: tipCls },
                React.createElement(
                    'div',
                    { className: prefix + 'loading-indicator' },
                    indicatorDom
                ),
                React.createElement(
                    'div',
                    { className: prefix + 'loading-tip-content' },
                    tip
                ),
                React.createElement(
                    'div',
                    { className: prefix + 'loading-tip-placeholder' },
                    tip
                )
            )
        )] : React.createElement(
            'div',
            _extends({ className: loadingCls, style: style }, others),
            visible ? React.createElement(
                'div',
                { className: tipCls },
                React.createElement(
                    'div',
                    { className: prefix + 'loading-indicator' },
                    indicatorDom
                ),
                React.createElement(
                    'div',
                    { className: prefix + 'loading-tip-content' },
                    tip
                ),
                React.createElement(
                    'div',
                    { className: prefix + 'loading-tip-placeholder' },
                    tip
                )
            ) : null,
            React.createElement(
                'div',
                { className: contentCls },
                visible ? React.createElement('div', { className: prefix + 'loading-masker' }) : null,
                children
            )
        );
    };

    return Loading;
}(React.Component), _class.propTypes = {
    /**
     * 样式前缀
     */
    prefix: PropTypes.string,
    /**
     * 自定义内容
     */
    tip: PropTypes.any,
    /**
     * 自定义内容位置
     * @enumdesc 出现在动画右边, 出现在动画下面
     */
    tipAlign: PropTypes.oneOf(['right', 'bottom']),
    /**
     * loading 状态, 默认 true
     */
    visible: PropTypes.bool,
    onVisibleChange: PropTypes.func,
    /**
     * 自定义class
     */
    className: PropTypes.string,
    /**
     * 自定义内联样式
     */
    style: PropTypes.object,
    /**
     * 设置动画尺寸
     * @description 仅仅对默认动画效果起作用
     * @enumdesc 大号, 中号
     */
    size: PropTypes.oneOf(['large', 'medium']),
    /**
     * 自定义动画
     */
    indicator: PropTypes.any,
    /**
     * 动画颜色
     */
    color: PropTypes.string,
    /**
     * 全屏展示
     */
    fullScreen: PropTypes.bool,
    /**
     * 子元素
     */
    children: PropTypes.any,
    /**
     * should loader be displayed inline
     */
    inline: PropTypes.bool,
    rtl: PropTypes.bool
}, _class.defaultProps = {
    prefix: 'next-',
    visible: true,
    onVisibleChange: func.noop,
    animate: null,
    tipAlign: 'bottom',
    size: 'large',
    inline: true
}, _temp);
Loading.displayName = 'Loading';


export default ConfigProvider.config(Loading);