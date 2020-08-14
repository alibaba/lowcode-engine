import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React, { PureComponent } from 'react';
import classNames from 'classnames';
import DateTableHead from './date-table-head';
import { isDisabledDate, DAYS_OF_WEEK, CALENDAR_TABLE_COL_COUNT, CALENDAR_TABLE_ROW_COUNT } from '../utils';

function isSameDay(a, b) {
    return a && b && a.isSame(b, 'day');
}

function isRangeDate(date, startDate, endDate) {
    return date.format('L') !== startDate.format('L') && date.format('L') !== endDate.format('L') && date.valueOf() > startDate.valueOf() && date.valueOf() < endDate.valueOf();
}

function isLastMonthDate(date, target) {
    if (date.year() < target.year()) {
        return 1;
    }
    return date.year() === target.year() && date.month() < target.month();
}

function isNextMonthDate(date, target) {
    if (date.year() > target.year()) {
        return 1;
    }
    return date.year() === target.year() && date.month() > target.month();
}

var DateTable = function (_PureComponent) {
    _inherits(DateTable, _PureComponent);

    function DateTable() {
        _classCallCheck(this, DateTable);

        return _possibleConstructorReturn(this, _PureComponent.apply(this, arguments));
    }

    DateTable.prototype.render = function render() {
        var _props = this.props,
            prefix = _props.prefix,
            visibleMonth = _props.visibleMonth,
            showOtherMonth = _props.showOtherMonth,
            endValue = _props.endValue,
            format = _props.format,
            today = _props.today,
            momentLocale = _props.momentLocale,
            dateCellRender = _props.dateCellRender,
            disabledDate = _props.disabledDate,
            onSelectDate = _props.onSelectDate;

        var startValue = this.props.startValue || this.props.value;

        var firstDayOfMonth = visibleMonth.clone().startOf('month'); // 该月的 1 号
        var firstDayOfMonthInWeek = firstDayOfMonth.day(); // 星期几

        var firstDayOfWeek = momentLocale.firstDayOfWeek();

        var datesOfLastMonthCount = (firstDayOfMonthInWeek + DAYS_OF_WEEK - firstDayOfWeek) % DAYS_OF_WEEK;

        var lastMonthDate = firstDayOfMonth.clone();
        lastMonthDate.add(0 - datesOfLastMonthCount, 'days');

        var counter = 0;
        var currentDate = void 0;
        var dateList = [];
        for (var i = 0; i < CALENDAR_TABLE_ROW_COUNT; i++) {
            for (var j = 0; j < CALENDAR_TABLE_COL_COUNT; j++) {
                currentDate = lastMonthDate;
                if (counter) {
                    currentDate = currentDate.clone();
                    currentDate.add(counter, 'days');
                }
                dateList.push(currentDate);
                counter++;
            }
        }

        counter = 0; // reset counter
        var monthElements = [];
        for (var _i = 0; _i < CALENDAR_TABLE_ROW_COUNT; _i++) {
            var weekElements = [];
            for (var _j = 0; _j < CALENDAR_TABLE_COL_COUNT; _j++) {
                var _classNames;

                currentDate = dateList[counter];
                var isLastMonth = isLastMonthDate(currentDate, visibleMonth);
                var isNextMonth = isNextMonthDate(currentDate, visibleMonth);
                var isCurrentMonth = !isLastMonth && !isNextMonth;

                var isDisabled = isDisabledDate(currentDate, disabledDate, 'date');
                var isToday = !isDisabled && isSameDay(currentDate, today) && isCurrentMonth;
                var isSelected = !isDisabled && (isSameDay(currentDate, startValue) || isSameDay(currentDate, endValue)) && isCurrentMonth;
                var isInRange = !isDisabled && startValue && endValue && isRangeDate(currentDate, startValue, endValue) && isCurrentMonth;

                var cellContent = !showOtherMonth && !isCurrentMonth ? null : dateCellRender(currentDate);

                var elementCls = classNames((_classNames = {}, _classNames[prefix + 'calendar-cell'] = true, _classNames[prefix + 'calendar-cell-prev-month'] = isLastMonth, _classNames[prefix + 'calendar-cell-next-month'] = isNextMonth, _classNames[prefix + 'calendar-cell-current'] = isToday, _classNames[prefix + 'inrange'] = isInRange, _classNames[prefix + 'selected'] = isSelected, _classNames[prefix + 'disabled'] = cellContent && isDisabled, _classNames));

                weekElements.push(React.createElement(
                    'td',
                    {
                        key: counter,
                        title: currentDate.format(format),
                        onClick: isDisabled ? undefined : onSelectDate.bind(null, currentDate),
                        className: elementCls,
                        role: 'cell',
                        'aria-disabled': isDisabled ? 'true' : 'false',
                        'aria-selected': isSelected ? 'true' : 'false'
                    },
                    React.createElement(
                        'div',
                        { className: prefix + 'calendar-date' },
                        cellContent
                    )
                ));
                counter++;
            }
            monthElements.push(React.createElement(
                'tr',
                { key: _i, role: 'row' },
                weekElements
            ));
        }

        return React.createElement(
            'table',
            { className: prefix + 'calendar-table', role: 'grid' },
            React.createElement(DateTableHead, _extends({}, this.props, { momentLocale: momentLocale })),
            React.createElement(
                'tbody',
                { className: prefix + 'calendar-tbody', role: 'rowgroup' },
                monthElements
            )
        );
    };

    return DateTable;
}(PureComponent);

export default DateTable;