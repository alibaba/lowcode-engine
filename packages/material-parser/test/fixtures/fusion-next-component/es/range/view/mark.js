import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { inRange, getPercent } from '../utils';

var Mark = (_temp = _class = function (_React$Component) {
    _inherits(Mark, _React$Component);

    function Mark() {
        _classCallCheck(this, Mark);

        return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
    }

    Mark.prototype._renderItems = function _renderItems() {
        var _props = this.props,
            min = _props.min,
            max = _props.max,
            value = _props.value,
            prefix = _props.prefix,
            marks = _props.marks,
            rtl = _props.rtl;

        var items = [];

        Object.keys(marks).forEach(function (mark, i) {
            var _classNames;

            var classes = classNames((_classNames = {}, _classNames[prefix + 'range-mark-text'] = true, _classNames.activated = inRange(mark, value, min), _classNames));
            var style = void 0;
            if (rtl) {
                style = {
                    right: getPercent(min, max, mark) + '%',
                    left: 'auto'
                };
            } else {
                style = {
                    left: getPercent(min, max, mark) + '%',
                    right: 'auto'
                };
            }

            items.push(
            // "key" is for https://fb.me/react-warning-keys
            React.createElement(
                'span',
                { className: classes, style: style, key: i },
                marks[mark]
            ));
        });

        return items;
    };

    Mark.prototype.render = function render() {
        var _classNames2;

        var _props2 = this.props,
            prefix = _props2.prefix,
            marksPosition = _props2.marksPosition;

        var className = marksPosition === 'above' ? prefix + 'range-mark-above' : prefix + 'range-mark-below';
        var classes = classNames(className, (_classNames2 = {}, _classNames2[prefix + 'range-mark'] = true, _classNames2));
        var items = this._renderItems();

        return React.createElement(
            'div',
            { className: classes },
            items
        );
    };

    return Mark;
}(React.Component), _class.propTypes = {
    min: PropTypes.number,
    max: PropTypes.number,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
    prefix: PropTypes.string,
    marks: PropTypes.object,
    marksPosition: PropTypes.string,
    rtl: PropTypes.bool
}, _class.defaultProps = {
    prefix: 'next-',
    min: 0,
    max: 100,
    value: 0,
    marksPosition: '',
    rtl: false
}, _temp);
Mark.displayName = 'Mark';
export { Mark as default };