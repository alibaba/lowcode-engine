import _extends from 'babel-runtime/helpers/extends';
import _typeof from 'babel-runtime/helpers/typeof';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

var breakPoints = ['xxs', 'xs', 's', 'm', 'l', 'xl'];

/**
 * Grid.Col
 * @order 2
 */
var Col = (_temp = _class = function (_Component) {
    _inherits(Col, _Component);

    function Col() {
        _classCallCheck(this, Col);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    Col.prototype.render = function render() {
        var _this2 = this,
            _extends2,
            _extends3;

        /* eslint-disable no-unused-vars */
        var _props = this.props,
            prefix = _props.prefix,
            pure = _props.pure,
            span = _props.span,
            offset = _props.offset,
            fixedSpan = _props.fixedSpan,
            fixedOffset = _props.fixedOffset,
            hidden = _props.hidden,
            align = _props.align,
            xxs = _props.xxs,
            xs = _props.xs,
            s = _props.s,
            m = _props.m,
            l = _props.l,
            xl = _props.xl,
            Tag = _props.component,
            className = _props.className,
            children = _props.children,
            rtl = _props.rtl,
            others = _objectWithoutProperties(_props, ['prefix', 'pure', 'span', 'offset', 'fixedSpan', 'fixedOffset', 'hidden', 'align', 'xxs', 'xs', 's', 'm', 'l', 'xl', 'component', 'className', 'children', 'rtl']);
        /* eslint-enable no-unused-vars */

        var pointClassObj = breakPoints.reduce(function (ret, point) {
            var pointProps = {};
            if (_typeof(_this2.props[point]) === 'object') {
                pointProps = _this2.props[point];
            } else {
                pointProps.span = _this2.props[point];
            }

            ret[prefix + 'col-' + point + '-' + pointProps.span] = !!pointProps.span;
            ret[prefix + 'col-' + point + '-offset-' + pointProps.offset] = !!pointProps.offset;

            return ret;
        }, {});

        var hiddenClassObj = void 0;
        if (hidden === true) {
            var _hiddenClassObj;

            hiddenClassObj = (_hiddenClassObj = {}, _hiddenClassObj[prefix + 'col-hidden'] = true, _hiddenClassObj);
        } else if (typeof hidden === 'string') {
            var _hiddenClassObj2;

            hiddenClassObj = (_hiddenClassObj2 = {}, _hiddenClassObj2[prefix + 'col-' + hidden + '-hidden'] = !!hidden, _hiddenClassObj2);
        } else if (Array.isArray(hidden)) {
            hiddenClassObj = hidden.reduce(function (ret, point) {
                ret[prefix + 'col-' + point + '-hidden'] = !!point;
                return ret;
            }, {});
        }

        var classes = cx(_extends((_extends2 = {}, _extends2[prefix + 'col'] = true, _extends2[prefix + 'col-' + span] = !!span, _extends2[prefix + 'col-fixed-' + fixedSpan] = !!fixedSpan, _extends2[prefix + 'col-offset-' + offset] = !!offset, _extends2[prefix + 'col-offset-fixed-' + fixedOffset] = !!fixedOffset, _extends2[prefix + 'col-' + align] = !!align, _extends2), pointClassObj, hiddenClassObj, (_extends3 = {}, _extends3[className] = className, _extends3)));

        return React.createElement(
            Tag,
            _extends({
                dir: rtl ? 'rtl' : 'ltr',
                role: 'gridcell',
                className: classes
            }, others),
            children
        );
    };

    return Col;
}(Component), _class.isNextCol = true, _class.propTypes = {
    prefix: PropTypes.string,
    pure: PropTypes.bool,
    rtl: PropTypes.bool,
    className: PropTypes.string,
    /**
     * 列内容
     */
    children: PropTypes.node,
    /**
     * 列宽度<br><br>**可选值**:<br>1, 2, 3, ..., 22, 23, 24
     */
    span: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * 固定列宽度，宽度值为20 * 栅格数<br><br>**可选值**:<br>1, 2, 3, ..., 28, 29, 30
     */
    fixedSpan: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * （不支持IE9浏览器）列偏移<br><br>**可选值**:<br>1, 2, 3, ..., 22, 23, 24
     */
    offset: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * （不支持IE9浏览器）固定列偏移，宽度值为20 * 栅格数<br><br>**可选值**:<br>1, 2, 3, ..., 28, 29, 30
     */
    fixedOffset: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * （不支持IE9浏览器）多列垂直方向对齐方式，可覆盖Row的align属性
     */
    align: PropTypes.oneOf(['top', 'center', 'bottom', 'baseline', 'stretch']),
    /**
     * 列在不同断点下的显示与隐藏<br><br>**可选值**:<br>true(在所有断点下隐藏)<br>false(在所有断点下显示)<br>'xs'(在 xs 断点下隐藏）<br>['xxs', 'xs', 's', 'm', 'l', 'xl'](在 xxs, xs, s, m, l, xl 断点下隐藏）
     */
    hidden: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.array]),
    /**
     * >=320px，响应式栅格，可为栅格数（span）或一个包含栅格数（span）和偏移栅格数（offset）对象
     */
    xxs: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
    /**
     * >=480px，响应式栅格，可为栅格数（span）或一个包含栅格数（span）和偏移栅格数（offset）对象
     */
    xs: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
    /**
     * >=720px，响应式栅格，可为栅格数（span）或一个包含栅格数（span）和偏移栅格数（offset）对象
     */
    s: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
    /**
     * >=990px，响应式栅格，可为栅格数（span）或一个包含栅格数（span）和偏移栅格数（offset）对象
     */
    m: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
    /**
     * >=1200px，响应式栅格，可为栅格数（span）或一个包含栅格数（span）和偏移栅格数（offset）对象
     */
    l: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
    /**
     * >=1500px，响应式栅格，可为栅格数（span）或一个包含栅格数（span）和偏移栅格数（offset）对象
     */
    xl: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
    /**
     * 指定以何种元素渲染该节点，默认为 'div'
     */
    component: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
}, _class.defaultProps = {
    prefix: 'next-',
    pure: false,
    component: 'div'
}, _temp);
Col.displayName = 'Col';
export { Col as default };