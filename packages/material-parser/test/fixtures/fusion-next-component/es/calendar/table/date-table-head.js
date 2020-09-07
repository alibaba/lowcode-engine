import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React, { PureComponent } from 'react';
import { DAYS_OF_WEEK } from '../utils';

var DateTableHead = function (_PureComponent) {
    _inherits(DateTableHead, _PureComponent);

    function DateTableHead() {
        _classCallCheck(this, DateTableHead);

        return _possibleConstructorReturn(this, _PureComponent.apply(this, arguments));
    }

    DateTableHead.prototype.render = function render() {
        var _props = this.props,
            prefix = _props.prefix,
            momentLocale = _props.momentLocale;

        var firstDayOfWeek = momentLocale.firstDayOfWeek();
        var weekdaysShort = momentLocale.weekdaysShort();

        var elements = [];
        for (var i = 0; i < DAYS_OF_WEEK; i++) {
            var index = (firstDayOfWeek + i) % DAYS_OF_WEEK;
            elements.push(React.createElement(
                'th',
                { key: i, className: prefix + 'calendar-th', role: 'cell' },
                weekdaysShort[index]
            ));
        }

        return React.createElement(
            'thead',
            { className: prefix + 'calendar-thead', role: 'rowgroup' },
            React.createElement(
                'tr',
                { role: 'row' },
                elements
            )
        );
    };

    return DateTableHead;
}(PureComponent);

export default DateTableHead;