import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React from 'react';
import PropTypes from 'prop-types';
import { events, func } from '../../util';
import Balloon from '../../balloon';
import { getPercent } from '../utils';

var Tooltip = Balloon.Tooltip;
var noop = func.noop;


function _getStyle(min, max, value, rtl) {
    if (rtl) {
        return {
            left: getPercent(min, max, max + min - value[1]) + '%',
            right: getPercent(min, max, value[0]) + '%'
        };
    }
    return {
        left: getPercent(min, max, value[0]) + '%',
        right: 100 - getPercent(min, max, value[1]) + '%'
    };
}

function sliderFrag(props) {
    var prefix = props.prefix,
        min = props.min,
        max = props.max,
        value = props.value,
        disabled = props.disabled,
        onMouseEnter = props.onMouseEnter,
        onMouseLeave = props.onMouseLeave,
        onMouseDown = props.onMouseDown,
        rtl = props.rtl;


    var activeClass = !disabled && props.hasMovingClass ? prefix + 'range-active' : '';

    return React.createElement(
        'div',
        {
            className: prefix + 'range-frag ' + activeClass,
            style: _getStyle(min, max, value, rtl),
            onMouseEnter: onMouseEnter,
            onMouseLeave: onMouseLeave,
            onMouseDown: onMouseDown
        },
        React.createElement('div', { className: prefix + 'range-selected' }),
        React.createElement(
            'div',
            { className: prefix + 'range-slider' },
            React.createElement('div', { className: prefix + 'range-slider-inner' })
        ),
        React.createElement(
            'div',
            { className: prefix + 'range-slider' },
            React.createElement('div', { className: prefix + 'range-slider-inner' })
        )
    );
}

sliderFrag.propTypes = {
    prefix: PropTypes.string,
    min: PropTypes.number,
    max: PropTypes.number,
    hasMovingClass: PropTypes.bool,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onMouseDown: PropTypes.func,
    value: PropTypes.arrayOf(PropTypes.number),
    disabled: PropTypes.bool,
    rtl: PropTypes.bool
};

var FixedSlider = (_temp = _class = function (_React$Component) {
    _inherits(FixedSlider, _React$Component);

    function FixedSlider(props) {
        _classCallCheck(this, FixedSlider);

        var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

        _this.state = {
            hasMovingClass: false,
            onTooltipVisibleChange: false,
            tooltipAnimation: true
        };
        return _this;
    }

    FixedSlider.prototype._onMouseEnter = function _onMouseEnter() {
        if (!(this.keyState === 'down')) {
            this.keyState = 'enter';
        }
        this.setState({
            hasMovingClass: true
        });
    };

    FixedSlider.prototype._onMouseLeave = function _onMouseLeave() {
        if (this.keyState === 'enter') {
            this.setState({
                hasMovingClass: false
            });
        }
    };

    FixedSlider.prototype._onMouseDown = function _onMouseDown() {
        this.keyState = 'down';
        this.setState({
            hasMovingClass: true
        });
        this._addDocumentEvents();
    };

    FixedSlider.prototype._onMouseUp = function _onMouseUp() {
        if (this.keyState === 'down') {
            this.keyState = '';
            this._removeDocumentEvents();
            this.setState({
                hasMovingClass: false
            });
        }
    };

    FixedSlider.prototype._addDocumentEvents = function _addDocumentEvents() {
        this._onMouseUpListener = events.on(document, 'mouseup', this._onMouseUp.bind(this));
    };

    FixedSlider.prototype._removeDocumentEvents = function _removeDocumentEvents() {
        if (this._onMouseUpListener) {
            this._onMouseUpListener.off();
            this._onMouseUpListener = null;
        }
    };

    FixedSlider.prototype.render = function render() {
        var _props = this.props,
            hasTip = _props.hasTip,
            value = _props.value,
            tipRender = _props.tipRender,
            tooltipVisible = _props.tooltipVisible,
            hasMovingClass = _props.hasMovingClass;


        var addedProps = {
            hasMovingClass: hasMovingClass || this.state.hasMovingClass,
            onMouseEnter: this._onMouseEnter.bind(this),
            onMouseLeave: this._onMouseLeave.bind(this),
            onMouseDown: this._onMouseDown.bind(this)
        };

        return hasTip ? React.createElement(
            Tooltip,
            {
                popupContainer: function popupContainer(target) {
                    return target.parentNode;
                },
                popupProps: {
                    visible: tooltipVisible || hasMovingClass,
                    animation: this.state.tooltipAnimation ? { in: 'expandInUp', out: 'expandOutDown' } : false
                },
                trigger: sliderFrag(_extends({}, this.props, addedProps)),
                align: 't'
            },
            tipRender(value[0] + '-' + value[1])
        ) : sliderFrag(_extends({}, this.props, addedProps));
    };

    return FixedSlider;
}(React.Component), _class.propTypes = {
    hasTip: PropTypes.bool,
    tooltipVisible: PropTypes.bool,
    onTooltipVisibleChange: PropTypes.func,
    tooltipAnimation: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
    tipRender: PropTypes.func,
    disabled: PropTypes.bool,
    hasMovingClass: PropTypes.bool,
    rtl: PropTypes.bool
}, _class.defaultProps = {
    disabled: false,
    hasTip: true,
    onChange: noop,
    onProcess: noop,
    tipRender: function tipRender(value) {
        return value;
    },
    reverse: false,
    rtl: false
}, _temp);
FixedSlider.displayName = 'FixedSlider';
export { FixedSlider as default };