import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';
import classNames from 'classnames';
import Animate from '../animate';
import { support, dom } from '../util';

/**
 * badge sup component
 */

// util::getDigitArray
var getDigitArray = function getDigitArray(num) {
    return num.toString().split('').reverse().map(function (i) {
        return parseInt(i, 10);
    });
};

var Sup = (_temp = _class = function (_Component) {
    _inherits(Sup, _Component);

    // 单排可滚动的数字列表
    Sup.renderDigit = function renderDigit(prefix, digit, key) {
        var children = [];
        for (var i = 0; i < 30; i++) {
            children.push(React.createElement(
                'span',
                { key: i },
                i % 10
            ));
        }

        return React.createElement(
            'span',
            { className: prefix + 'badge-scroll-number-only', key: key },
            children
        );
    };

    // 可滚动数字组


    Sup.renderNumber = function renderNumber(prefix, count) {
        return getDigitArray(count).map(function (digit, i) {
            return Sup.renderDigit(prefix, digit, i);
        }).reverse();
    };

    function Sup(props) {
        _classCallCheck(this, Sup);

        // render 时， 上一次的渲染数字 和 当前渲染的数字
        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        _this.state = {
            lastCount: 0,
            currentCount: props.count
        };
        return _this;
    }

    Sup.getDerivedStateFromProps = function getDerivedStateFromProps(nextProps, prevState) {
        if ('count' in nextProps) {
            return {
                lastCount: prevState.currentCount,
                currentCount: nextProps.count
            };
        }

        return null;
    };

    Sup.prototype.componentDidMount = function componentDidMount() {
        this.computeStyle(true);
    };

    Sup.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
        var _this2 = this;

        if (prevProps.count !== this.props.count) {
            this.computeStyle(false);

            // NOTE why called `computeStyle` again after 300ms ?
            setTimeout(function () {
                _this2.computeStyle(true, true);
            }, 300);
        }
    };

    Sup.prototype.computeStyle = function computeStyle(removeTransition, revert) {
        var _this3 = this;

        var _props = this.props,
            prefix = _props.prefix,
            count = _props.count,
            overflowCount = _props.overflowCount;
        var lastCount = this.state.lastCount;


        if (count < 0) {
            return;
        }
        var supNode = this.refs.sup;

        if (supNode && dom.hasClass(supNode, prefix + 'badge-count')) {
            var scrollNums = supNode.querySelectorAll('.' + prefix + 'badge-scroll-number-only');

            if (scrollNums.length) {
                var height = window.getComputedStyle(supNode).height;

                scrollNums = [].slice.call(scrollNums, 0).reverse();

                getDigitArray(count).forEach(function (digit, i) {
                    var position = _this3.getPositionByDigit(digit, i, revert);
                    var transformTo = -position * parseInt(height, 10);

                    removeTransition = removeTransition || typeof getDigitArray(lastCount)[i] === 'undefined' || lastCount > overflowCount || lastCount <= 0;

                    var scrollStyle = support.animation ? {
                        transition: removeTransition ? 'none' : 'transform .3s cubic-bezier(.645, .045, .355, 1), -webkit-transform .3s cubic-bezier(.645, .045, .355, 1)',
                        WebkitTransform: 'translateY(' + transformTo + 'px)',
                        transform: 'translateY(' + transformTo + 'px)',
                        height: height,
                        lineHeight: height
                    } : {
                        top: transformTo + 'px',
                        height: height,
                        lineHeight: height
                    };

                    Object.keys(scrollStyle).forEach(function (key) {
                        scrollNums[i].style[key] = scrollStyle[key];
                    });
                });
            }
        }
    };

    Sup.prototype.getPositionByDigit = function getPositionByDigit(digit, i, revert) {
        var lastCount = this.state.lastCount;

        if (revert) {
            return 10 + digit;
        }
        var lastDigit = getDigitArray(lastCount)[i] || 0;

        if (this.props.count > lastCount) {
            return (digit >= lastDigit ? 10 : 20) + digit;
        }

        if (digit <= lastDigit) {
            return 10 + digit;
        }

        return digit;
    };

    Sup.prototype.render = function render() {
        var _classNames;

        var _props2 = this.props,
            prefix = _props2.prefix,
            count = _props2.count,
            showZero = _props2.showZero,
            overflowCount = _props2.overflowCount,
            dot = _props2.dot,
            style = _props2.style,
            content = _props2.content;


        var supClasses = classNames(prefix + 'badge-scroll-number', (_classNames = {}, _classNames[prefix + 'badge-count'] = !!count || count === 0 && showZero, _classNames[prefix + 'badge-dot'] = dot, _classNames[prefix + 'badge-custom'] = !!content, _classNames));

        var children = null;
        var show = dot || count > 0 || count === 0 && showZero || content;

        if (count > 0 || count === 0 && showZero) {
            var realCount = overflowCount > 0 && count > overflowCount ? overflowCount + '+' : count;

            children = isNaN(realCount) ? realCount : Sup.renderNumber(prefix, count);
        } else if (content) {
            children = content;
        }

        var animation = {
            appear: 'zoomIn',
            enter: 'zoomIn',
            leave: 'zoomOut'
        };

        var wrapper = support.animation ? React.createElement(Animate, { animation: animation }) : React.createElement('span', null);
        var element = show ? React.createElement(
            'sup',
            { ref: 'sup', className: supClasses, style: style },
            children
        ) : null;

        return React.cloneElement(wrapper, {}, element);
    };

    return Sup;
}(Component), _class.propTypes = {
    prefix: PropTypes.string,
    count: PropTypes.number,
    showZero: PropTypes.bool,
    overflowCount: PropTypes.number,
    content: PropTypes.node,
    dot: PropTypes.bool,
    style: PropTypes.object
}, _class.defaultProps = {
    prefix: 'next-',
    count: 0,
    showZero: false,
    overflowCount: 99,
    dot: false
}, _temp);
Sup.displayName = 'Sup';


export default polyfill(Sup);