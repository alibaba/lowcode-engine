import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { inRange, getPercent } from '../utils';

var Scale = (_temp = _class = function (_React$Component) {
    _inherits(Scale, _React$Component);

    function Scale() {
        _classCallCheck(this, Scale);

        return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
    }

    Scale.prototype._renderItems = function _renderItems() {
        var _props = this.props,
            min = _props.min,
            max = _props.max,
            value = _props.value,
            prefix = _props.prefix,
            scales = _props.scales,
            rtl = _props.rtl;

        var items = [];

        scales.forEach(function (scale, i) {
            var _classNames;

            var classes = classNames((_classNames = {}, _classNames[prefix + 'range-scale-item'] = true, _classNames.activated = inRange(scale, value, min), _classNames));
            var style = void 0;
            if (rtl) {
                style = {
                    right: getPercent(min, max, scale) + '%',
                    left: 'auto'
                };
            } else {
                style = {
                    left: getPercent(min, max, scale) + '%',
                    right: 'auto'
                };
            }

            items.push(
            // "key" is for https://fb.me/react-warning-keys
            React.createElement('span', { className: classes, style: style, key: i }));
        });

        return items;
    };

    Scale.prototype.render = function render() {
        var _classNames2;

        var prefix = this.props.prefix;

        var classes = classNames((_classNames2 = {}, _classNames2[prefix + 'range-scale'] = true, _classNames2));
        var items = this._renderItems();

        return React.createElement(
            'div',
            { className: classes },
            items
        );
    };

    return Scale;
}(React.Component), _class.propTypes = {
    min: PropTypes.number,
    max: PropTypes.number,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
    prefix: PropTypes.string,
    scales: PropTypes.arrayOf(PropTypes.number),
    rtl: PropTypes.bool
}, _class.defaultProps = {
    prefix: 'next-',
    min: 0,
    max: 100,
    value: 0,
    rtl: false
}, _temp);
Scale.displayName = 'Scale';
export { Scale as default };