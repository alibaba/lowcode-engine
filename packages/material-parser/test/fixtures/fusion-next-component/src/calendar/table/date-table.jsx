import React, { PureComponent } from 'react';
import classNames from 'classnames';
import DateTableHead from './date-table-head';
import {
    isDisabledDate,
    DAYS_OF_WEEK,
    CALENDAR_TABLE_COL_COUNT,
    CALENDAR_TABLE_ROW_COUNT,
} from '../utils';

function isSameDay(a, b) {
    return a && b && a.isSame(b, 'day');
}

function isRangeDate(date, startDate, endDate) {
    return (
        date.format('L') !== startDate.format('L') &&
        date.format('L') !== endDate.format('L') &&
        date.valueOf() > startDate.valueOf() &&
        date.valueOf() < endDate.valueOf()
    );
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

class DateTable extends PureComponent {
    render() {
        const {
            prefix,
            visibleMonth,
            showOtherMonth,
            endValue,
            format,
            today,
            momentLocale,
            dateCellRender,
            disabledDate,
            onSelectDate,
        } = this.props;
        const startValue = this.props.startValue || this.props.value;

        const firstDayOfMonth = visibleMonth.clone().startOf('month'); // 该月的 1 号
        const firstDayOfMonthInWeek = firstDayOfMonth.day(); // 星期几

        const firstDayOfWeek = momentLocale.firstDayOfWeek();

        const datesOfLastMonthCount =
            (firstDayOfMonthInWeek + DAYS_OF_WEEK - firstDayOfWeek) %
            DAYS_OF_WEEK;

        const lastMonthDate = firstDayOfMonth.clone();
        lastMonthDate.add(0 - datesOfLastMonthCount, 'days');

        let counter = 0;
        let currentDate;
        const dateList = [];
        for (let i = 0; i < CALENDAR_TABLE_ROW_COUNT; i++) {
            for (let j = 0; j < CALENDAR_TABLE_COL_COUNT; j++) {
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
        const monthElements = [];
        for (let i = 0; i < CALENDAR_TABLE_ROW_COUNT; i++) {
            const weekElements = [];
            for (let j = 0; j < CALENDAR_TABLE_COL_COUNT; j++) {
                currentDate = dateList[counter];
                const isLastMonth = isLastMonthDate(currentDate, visibleMonth);
                const isNextMonth = isNextMonthDate(currentDate, visibleMonth);
                const isCurrentMonth = !isLastMonth && !isNextMonth;

                const isDisabled = isDisabledDate(
                    currentDate,
                    disabledDate,
                    'date'
                );
                const isToday =
                    !isDisabled &&
                    isSameDay(currentDate, today) &&
                    isCurrentMonth;
                const isSelected =
                    !isDisabled &&
                    (isSameDay(currentDate, startValue) ||
                        isSameDay(currentDate, endValue)) &&
                    isCurrentMonth;
                const isInRange =
                    !isDisabled &&
                    startValue &&
                    endValue &&
                    isRangeDate(currentDate, startValue, endValue) &&
                    isCurrentMonth;

                const cellContent =
                    !showOtherMonth && !isCurrentMonth
                        ? null
                        : dateCellRender(currentDate);

                const elementCls = classNames({
                    [`${prefix}calendar-cell`]: true,
                    [`${prefix}calendar-cell-prev-month`]: isLastMonth,
                    [`${prefix}calendar-cell-next-month`]: isNextMonth,
                    [`${prefix}calendar-cell-current`]: isToday,
                    [`${prefix}inrange`]: isInRange,
                    [`${prefix}selected`]: isSelected,
                    [`${prefix}disabled`]: cellContent && isDisabled,
                });

                weekElements.push(
                    <td
                        key={counter}
                        title={currentDate.format(format)}
                        onClick={
                            isDisabled
                                ? undefined
                                : onSelectDate.bind(null, currentDate)
                        }
                        className={elementCls}
                        role="cell"
                        aria-disabled={isDisabled ? 'true' : 'false'}
                        aria-selected={isSelected ? 'true' : 'false'}
                    >
                        <div className={`${prefix}calendar-date`}>
                            {cellContent}
                        </div>
                    </td>
                );
                counter++;
            }
            monthElements.push(
                <tr key={i} role="row">
                    {weekElements}
                </tr>
            );
        }

        return (
            <table className={`${prefix}calendar-table`} role="grid">
                <DateTableHead {...this.props} momentLocale={momentLocale} />
                <tbody className={`${prefix}calendar-tbody`} role="rowgroup">
                    {monthElements}
                </tbody>
            </table>
        );
    }
}

export default DateTable;
