import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

const breakPoints = ['xxs', 'xs', 's', 'm', 'l', 'xl'];

/**
 * Grid.Col
 * @order 2
 */
export default class Col extends Component {
    static isNextCol = true;

    static propTypes = {
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
        align: PropTypes.oneOf([
            'top',
            'center',
            'bottom',
            'baseline',
            'stretch',
        ]),
        /**
         * 列在不同断点下的显示与隐藏<br><br>**可选值**:<br>true(在所有断点下隐藏)<br>false(在所有断点下显示)<br>'xs'(在 xs 断点下隐藏）<br>['xxs', 'xs', 's', 'm', 'l', 'xl'](在 xxs, xs, s, m, l, xl 断点下隐藏）
         */
        hidden: PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.string,
            PropTypes.array,
        ]),
        /**
         * >=320px，响应式栅格，可为栅格数（span）或一个包含栅格数（span）和偏移栅格数（offset）对象
         */
        xxs: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.object,
        ]),
        /**
         * >=480px，响应式栅格，可为栅格数（span）或一个包含栅格数（span）和偏移栅格数（offset）对象
         */
        xs: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.object,
        ]),
        /**
         * >=720px，响应式栅格，可为栅格数（span）或一个包含栅格数（span）和偏移栅格数（offset）对象
         */
        s: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.object,
        ]),
        /**
         * >=990px，响应式栅格，可为栅格数（span）或一个包含栅格数（span）和偏移栅格数（offset）对象
         */
        m: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.object,
        ]),
        /**
         * >=1200px，响应式栅格，可为栅格数（span）或一个包含栅格数（span）和偏移栅格数（offset）对象
         */
        l: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.object,
        ]),
        /**
         * >=1500px，响应式栅格，可为栅格数（span）或一个包含栅格数（span）和偏移栅格数（offset）对象
         */
        xl: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.object,
        ]),
        /**
         * 指定以何种元素渲染该节点，默认为 'div'
         */
        component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    };

    static defaultProps = {
        prefix: 'next-',
        pure: false,
        component: 'div',
    };

    render() {
        /* eslint-disable no-unused-vars */
        const {
            prefix,
            pure,
            span,
            offset,
            fixedSpan,
            fixedOffset,
            hidden,
            align,
            xxs,
            xs,
            s,
            m,
            l,
            xl,
            component: Tag,
            className,
            children,
            rtl,
            ...others
        } = this.props;
        /* eslint-enable no-unused-vars */

        const pointClassObj = breakPoints.reduce((ret, point) => {
            let pointProps = {};
            if (typeof this.props[point] === 'object') {
                pointProps = this.props[point];
            } else {
                pointProps.span = this.props[point];
            }

            ret[`${prefix}col-${point}-${pointProps.span}`] = !!pointProps.span;
            ret[
                `${prefix}col-${point}-offset-${pointProps.offset}`
            ] = !!pointProps.offset;

            return ret;
        }, {});

        let hiddenClassObj;
        if (hidden === true) {
            hiddenClassObj = { [`${prefix}col-hidden`]: true };
        } else if (typeof hidden === 'string') {
            hiddenClassObj = { [`${prefix}col-${hidden}-hidden`]: !!hidden };
        } else if (Array.isArray(hidden)) {
            hiddenClassObj = hidden.reduce((ret, point) => {
                ret[`${prefix}col-${point}-hidden`] = !!point;
                return ret;
            }, {});
        }

        const classes = cx({
            [`${prefix}col`]: true,
            [`${prefix}col-${span}`]: !!span,
            [`${prefix}col-fixed-${fixedSpan}`]: !!fixedSpan,
            [`${prefix}col-offset-${offset}`]: !!offset,
            [`${prefix}col-offset-fixed-${fixedOffset}`]: !!fixedOffset,
            [`${prefix}col-${align}`]: !!align,
            ...pointClassObj,
            ...hiddenClassObj,
            [className]: className,
        });

        return (
            <Tag
                dir={rtl ? 'rtl' : 'ltr'}
                role="gridcell"
                className={classes}
                {...others}
            >
                {children}
            </Tag>
        );
    }
}
