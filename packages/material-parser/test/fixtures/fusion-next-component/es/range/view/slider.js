import _extends from 'babel-runtime/helpers/extends';
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { getPercent } from '../utils';

function _getProps(min, max, value, rtl) {
    return {
        style: {
            left: rtl ? 100 - getPercent(min, max, value) + '%' : getPercent(min, max, value) + '%',
            zIndex: 100
        },
        'aria-valuenow': value,
        'aria-valuetext': value,
        'aria-valuemin': min,
        'aria-valuemax': max
    };
}

function Slider(_ref) {
    var _classNames;

    var prefix = _ref.prefix,
        hasMovingClass = _ref.hasMovingClass,
        min = _ref.min,
        max = _ref.max,
        value = _ref.value,
        onKeyDown = _ref.onKeyDown,
        rtl = _ref.rtl;

    var classes = classNames((_classNames = {}, _classNames[prefix + 'range-slider'] = true, _classNames[prefix + 'range-slider-moving'] = hasMovingClass, _classNames));
    return React.createElement(
        'div',
        _extends({
            className: classes,
            onKeyDown: onKeyDown,
            role: 'slider',
            tabIndex: 0
        }, _getProps(min, max, value, rtl)),
        React.createElement('div', { className: prefix + 'range-slider-inner' })
    );
}

Slider.propTypes = {
    min: PropTypes.number,
    max: PropTypes.number,
    value: PropTypes.number,
    prefix: PropTypes.string,
    hasMovingClass: PropTypes.bool,
    rtl: PropTypes.bool
};

Slider.defaultProps = {
    prefix: 'next-',
    min: 0,
    max: 100,
    value: 0,
    hasMovingClass: false,
    rtl: false
};

export default Slider;