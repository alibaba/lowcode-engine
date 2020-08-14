import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React, { PureComponent } from 'react';
import classnames from 'classnames';
import { isDisabledDate, MONTH_TABLE_ROW_COUNT, MONTH_TABLE_COL_COUNT } from '../utils';

function isSameMonth(currentDate, selectedDate) {
    return selectedDate && currentDate.year() === selectedDate.year() && currentDate.month() === selectedDate.month();
}

var MonthTable = function (_PureComponent) {
    _inherits(MonthTable, _PureComponent);

    function MonthTable() {
        _classCallCheck(this, MonthTable);

        return _possibleConstructorReturn(this, _PureComponent.apply(this, arguments));
    }

    MonthTable.prototype.onMonthCellClick = function onMonthCellClick(date) {
        this.props.onSelectMonth(date, 'date');
    };

    MonthTable.prototype.render = function render() {
        var _props = this.props,
            prefix = _props.prefix,
            value = _props.value,
            visibleMonth = _props.visibleMonth,
            disabledDate = _props.disabledDate,
            today = _props.today,
            momentLocale = _props.momentLocale,
            monthCellRender = _props.monthCellRender;


        var monthLocale = momentLocale.monthsShort();

        var counter = 0;
        var monthList = [];
        for (var i = 0; i < MONTH_TABLE_ROW_COUNT; i++) {
            var rowList = [];
            for (var j = 0; j < MONTH_TABLE_COL_COUNT; j++) {
                var _classnames;

                var monthDate = visibleMonth.clone().month(counter);
                var isDisabled = isDisabledDate(monthDate, disabledDate, 'month');
                var isSelected = isSameMonth(monthDate, value);
                var isThisMonth = isSameMonth(monthDate, today);
                var elementCls = classnames((_classnames = {}, _classnames[prefix + 'calendar-cell'] = true, _classnames[prefix + 'calendar-cell-current'] = isThisMonth, _classnames[prefix + 'selected'] = isSelected, _classnames[prefix + 'disabled'] = isDisabled, _classnames));
                var localedMonth = monthLocale[counter];
                var monthCellContent = monthCellRender ? monthCellRender(monthDate) : localedMonth;
                rowList.push(React.createElement(
                    'td',
                    {
                        key: counter,
                        title: localedMonth,
                        onClick: isDisabled ? undefined : this.onMonthCellClick.bind(this, monthDate),
                        className: elementCls,
                        role: 'cell',
                        'aria-disabled': isDisabled ? 'true' : 'false',
                        'aria-selected': isSelected ? 'true' : 'false'
                    },
                    React.createElement(
                        'div',
                        { className: prefix + 'calendar-month' },
                        monthCellContent
                    )
                ));
                counter++;
            }
            monthList.push(React.createElement(
                'tr',
                { key: i, role: 'row' },
                rowList
            ));
        }

        return React.createElement(
            'table',
            { className: prefix + 'calendar-table', role: 'grid' },
            React.createElement(
                'tbody',
                { className: prefix + 'calendar-tbody', role: 'rowgroup' },
                monthList
            )
        );
    };

    return MonthTable;
}(PureComponent);

export default MonthTable;