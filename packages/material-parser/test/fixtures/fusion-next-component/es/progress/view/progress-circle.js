import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

var VIEWBOX_WIDTH = 100; // width of viewBox
var HALF_VIEWBOX_WIDTH = VIEWBOX_WIDTH / 2;
var DEFAULT_STROKE_WIDTH = 8;

var viewBox = '0 0 ' + VIEWBOX_WIDTH + ' ' + VIEWBOX_WIDTH;

var Circle = (_temp = _class = function (_Component) {
    _inherits(Circle, _Component);

    function Circle(props) {
        _classCallCheck(this, Circle);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        _this._underlayRefHandler = function (ref) {
            _this.underlay = ref;
        };

        _this._overlayRefHandler = function (ref) {
            _this.overlay = ref;
        };

        _this.state = {
            underlayStrokeWidth: DEFAULT_STROKE_WIDTH,
            overlayStrokeWidth: DEFAULT_STROKE_WIDTH
        };
        return _this;
    }

    Circle.prototype.componentDidMount = function componentDidMount() {
        if (this.underlay && this.overlay) {
            // eslint-disable-next-line
            this.setState({
                underlayStrokeWidth: this._getCssValue(this.underlay, 'stroke-width') || DEFAULT_STROKE_WIDTH,
                overlayStrokeWidth: this._getCssValue(this.overlay, 'stroke-width') || DEFAULT_STROKE_WIDTH
            });
        }
    };

    Circle.prototype._getCssValue = function _getCssValue(dom, name) {
        var css = window.getComputedStyle(dom).getPropertyValue(name);
        var regExp = /(\d*)px/g;
        var result = regExp.exec(css);

        return Array.isArray(result) ? Number(result[1]) : 0;
    };

    Circle.prototype._computeOverlayStrokeDashOffset = function _computeOverlayStrokeDashOffset() {
        var _state = this.state,
            underlayStrokeWidth = _state.underlayStrokeWidth,
            overlayStrokeWidth = _state.overlayStrokeWidth;

        var overlayRadius = HALF_VIEWBOX_WIDTH - overlayStrokeWidth / 2 - (underlayStrokeWidth - overlayStrokeWidth) / 2;
        var overlayLen = Math.PI * 2 * overlayRadius;
        return (VIEWBOX_WIDTH - this.props.percent) / VIEWBOX_WIDTH * overlayLen;
    };

    Circle.prototype._getPath = function _getPath(radius) {
        return 'M ' + HALF_VIEWBOX_WIDTH + ',' + HALF_VIEWBOX_WIDTH + ' m 0,-' + radius + ' a ' + radius + ',' + radius + ' 0 1 1 0,' + 2 * radius + ' a ' + radius + ',' + radius + ' 0 1 1 0,-' + 2 * radius;
    };

    Circle.prototype.render = function render() {
        var _classNames, _classNames2;

        var _props = this.props,
            prefix = _props.prefix,
            size = _props.size,
            state = _props.state,
            percent = _props.percent,
            className = _props.className,
            textRender = _props.textRender,
            progressive = _props.progressive,
            color = _props.color,
            backgroundColor = _props.backgroundColor,
            rtl = _props.rtl,
            others = _objectWithoutProperties(_props, ['prefix', 'size', 'state', 'percent', 'className', 'textRender', 'progressive', 'color', 'backgroundColor', 'rtl']);

        var _state2 = this.state,
            underlayStrokeWidth = _state2.underlayStrokeWidth,
            overlayStrokeWidth = _state2.overlayStrokeWidth;

        // underlay path

        var underlayRadius = HALF_VIEWBOX_WIDTH - underlayStrokeWidth / 2;
        var underlayPath = this._getPath(underlayRadius);

        // overlay path (为居中，减去相对于underlay的宽度)
        var overlayRadius = HALF_VIEWBOX_WIDTH - overlayStrokeWidth / 2 - (underlayStrokeWidth - overlayStrokeWidth) / 2;
        var overlayPath = this._getPath(overlayRadius);
        var overlayLen = Math.PI * 2 * overlayRadius;
        var overlayStrokeDasharray = overlayLen + 'px ' + overlayLen + 'px';
        var overlayStrokeDashoffset = this._computeOverlayStrokeDashOffset() + 'px';

        var suffixText = textRender(percent, { rtl: rtl });

        var wrapCls = classNames((_classNames = {}, _classNames[prefix + 'progress-circle'] = true, _classNames[prefix + 'progress-circle-show-info'] = suffixText, _classNames['' + (prefix + size)] = size, _classNames[className] = className, _classNames));

        var pathCls = classNames((_classNames2 = {}, _classNames2[prefix + 'progress-circle-overlay'] = true, _classNames2[prefix + 'progress-circle-overlay-' + state] = !color && !progressive && state, _classNames2[prefix + 'progress-circle-overlay-started'] = !color && progressive && percent <= 30, _classNames2[prefix + 'progress-circle-overlay-middle'] = !color && progressive && percent > 30 && percent < 80, _classNames2[prefix + 'progress-circle-overlay-finishing'] = !color && progressive && percent >= 80, _classNames2));

        var underlayStyle = { stroke: backgroundColor };

        return React.createElement(
            'div',
            _extends({
                className: wrapCls,
                dir: rtl ? 'rtl' : undefined,
                role: 'progressbar',
                'aria-valuenow': percent,
                'aria-valuemin': '0',
                'aria-valuemax': '100'
            }, others),
            React.createElement(
                'svg',
                {
                    className: prefix + 'progress-circle-container',
                    viewBox: viewBox
                },
                React.createElement('path', {
                    className: prefix + 'progress-circle-underlay',
                    d: underlayPath,
                    fillOpacity: '0',
                    ref: this._underlayRefHandler,
                    style: underlayStyle
                }),
                React.createElement('path', {
                    className: pathCls,
                    d: overlayPath,
                    fillOpacity: '0',
                    strokeDasharray: overlayStrokeDasharray,
                    strokeDashoffset: overlayStrokeDashoffset,
                    ref: this._overlayRefHandler,
                    stroke: color
                })
            ),
            suffixText ? React.createElement(
                'div',
                { className: prefix + 'progress-circle-text' },
                suffixText
            ) : null
        );
    };

    return Circle;
}(Component), _class.propTypes = {
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    percent: PropTypes.number,
    state: PropTypes.oneOf(['normal', 'success', 'error']),
    progressive: PropTypes.bool,
    textRender: PropTypes.func,
    prefix: PropTypes.string,
    className: PropTypes.string,
    color: PropTypes.string,
    backgroundColor: PropTypes.string,
    rtl: PropTypes.bool
}, _temp);
Circle.displayName = 'Circle';
export { Circle as default };