import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { getPercent } from '../utils';

function _getProps(min, max, value, rtl) {
    return {
        style: {
            left: rtl
                ? `${100 - getPercent(min, max, value)}%`
                : `${getPercent(min, max, value)}%`,
            zIndex: 100,
        },
        'aria-valuenow': value,
        'aria-valuetext': value,
        'aria-valuemin': min,
        'aria-valuemax': max,
    };
}

function Slider({ prefix, hasMovingClass, min, max, value, onKeyDown, rtl }) {
    const classes = classNames({
        [`${prefix}range-slider`]: true,
        [`${prefix}range-slider-moving`]: hasMovingClass,
    });
    return (
        <div
            className={classes}
            onKeyDown={onKeyDown}
            role="slider"
            tabIndex={0}
            {..._getProps(min, max, value, rtl)}
        >
            <div className={`${prefix}range-slider-inner`} />
        </div>
    );
}

Slider.propTypes = {
    min: PropTypes.number,
    max: PropTypes.number,
    value: PropTypes.number,
    prefix: PropTypes.string,
    hasMovingClass: PropTypes.bool,
    rtl: PropTypes.bool,
};

Slider.defaultProps = {
    prefix: 'next-',
    min: 0,
    max: 100,
    value: 0,
    hasMovingClass: false,
    rtl: false,
};

export default Slider;
