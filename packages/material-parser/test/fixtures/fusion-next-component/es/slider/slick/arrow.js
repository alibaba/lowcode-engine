import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../../icon';
import { obj, func } from '../../util';

/**
 * slider arrow
 * 左右控制箭头
 */

var noop = func.noop;
var Arrow = (_temp = _class = function (_Component) {
    _inherits(Arrow, _Component);

    function Arrow() {
        _classCallCheck(this, Arrow);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    Arrow.isDisabled = function isDisabled(props) {
        var infinite = props.infinite,
            type = props.type,
            centerMode = props.centerMode,
            currentSlide = props.currentSlide,
            slideCount = props.slideCount,
            slidesToShow = props.slidesToShow;


        if (infinite) {
            return false;
        }

        // 下一个 index 大于总数？？
        // if (slideCount <= slidesToShow) {
        //     return true;
        // }

        // 向前箭头：当前是第 0 个
        if (type === 'prev') {
            return currentSlide <= 0;
        }

        if (centerMode && currentSlide >= slideCount - 1) {
            // 向后箭头：居中模式，当前 index 大于最大 index
            return true;
        } else if (currentSlide >= slideCount - slidesToShow) {
            // 向后箭头：普通模式，当前 index 大于 总数 - 下一个 index ？？？
            return true;
        }

        return false;
    };

    Arrow.prototype.handleClick = function handleClick(options, e) {
        e && e.preventDefault();

        // TODO hack
        if (options.message === 'prev') {
            options.message = 'previous';
        }

        this.props.clickHandler(options, e);
    };

    Arrow.prototype.render = function render() {
        var _props = this.props,
            prefix = _props.prefix,
            type = _props.type,
            arrowSize = _props.arrowSize,
            arrowPosition = _props.arrowPosition,
            arrowDirection = _props.arrowDirection,
            onMouseEnter = _props.onMouseEnter,
            onMouseLeave = _props.onMouseLeave,
            children = _props.children;


        var others = obj.pickOthers(Arrow.propTypes, this.props);
        var iconType = Arrow.ARROW_ICON_TYPES[arrowDirection][type];
        var disabled = Arrow.isDisabled(this.props);

        var arrowClazz = classNames([prefix + 'slick-arrow', prefix + 'slick-' + type, arrowPosition, arrowSize, arrowDirection], { disabled: disabled });

        var arrowProps = _extends({}, others, {
            key: type,
            'data-role': 'none',
            className: arrowClazz,
            style: { display: 'block' },
            onClick: disabled ? null : this.handleClick.bind(this, { message: type }),
            onMouseEnter: disabled ? null : onMouseEnter,
            onMouseLeave: disabled ? null : onMouseLeave
        });

        if (children) {
            return React.cloneElement(React.Children.only(children), arrowProps);
        } else {
            return React.createElement(
                'button',
                _extends({ type: 'button', role: 'button' }, arrowProps),
                React.createElement(Icon, { type: iconType })
            );
        }
    };

    return Arrow;
}(Component), _class.propTypes = {
    prefix: PropTypes.string,
    rtl: PropTypes.bool,
    type: PropTypes.oneOf(['prev', 'next']).isRequired,
    centerMode: PropTypes.bool,
    currentSlide: PropTypes.number,
    infinite: PropTypes.bool,
    clickHandler: PropTypes.func,
    slideCount: PropTypes.number,
    slidesToShow: PropTypes.number,
    arrow: PropTypes.element,
    arrowSize: PropTypes.string,
    arrowPosition: PropTypes.string,
    arrowDirection: PropTypes.oneOf(['hoz', 'ver']),
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    children: PropTypes.node
}, _class.defaultProps = {
    onMouseEnter: noop,
    onMouseLeave: noop
}, _class.ARROW_ICON_TYPES = {
    hoz: { prev: 'arrow-left', next: 'arrow-right' },
    ver: { prev: 'arrow-up', next: 'arrow-down' }
}, _temp);
Arrow.displayName = 'Arrow';
export { Arrow as default };