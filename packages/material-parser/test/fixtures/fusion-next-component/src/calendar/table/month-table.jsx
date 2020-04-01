import React, { PureComponent } from 'react';
import classnames from 'classnames';
import {
    isDisabledDate,
    MONTH_TABLE_ROW_COUNT,
    MONTH_TABLE_COL_COUNT,
} from '../utils';

function isSameMonth(currentDate, selectedDate) {
    return (
        selectedDate &&
        currentDate.year() === selectedDate.year() &&
        currentDate.month() === selectedDate.month()
    );
}

class MonthTable extends PureComponent {
    onMonthCellClick(date) {
        this.props.onSelectMonth(date, 'date');
    }

    render() {
        const {
            prefix,
            value,
            visibleMonth,
            disabledDate,
            today,
            momentLocale,
            monthCellRender,
        } = this.props;

        const monthLocale = momentLocale.monthsShort();

        let counter = 0;
        const monthList = [];
        for (let i = 0; i < MONTH_TABLE_ROW_COUNT; i++) {
            const rowList = [];
            for (let j = 0; j < MONTH_TABLE_COL_COUNT; j++) {
                const monthDate = visibleMonth.clone().month(counter);
                const isDisabled = isDisabledDate(
                    monthDate,
                    disabledDate,
                    'month'
                );
                const isSelected = isSameMonth(monthDate, value);
                const isThisMonth = isSameMonth(monthDate, today);
                const elementCls = classnames({
                    [`${prefix}calendar-cell`]: true,
                    [`${prefix}calendar-cell-current`]: isThisMonth,
                    [`${prefix}selected`]: isSelected,
                    [`${prefix}disabled`]: isDisabled,
                });
                const localedMonth = monthLocale[counter];
                const monthCellContent = monthCellRender
                    ? monthCellRender(monthDate)
                    : localedMonth;
                rowList.push(
                    <td
                        key={counter}
                        title={localedMonth}
                        onClick={
                            isDisabled
                                ? undefined
                                : this.onMonthCellClick.bind(this, monthDate)
                        }
                        className={elementCls}
                        role="cell"
                        aria-disabled={isDisabled ? 'true' : 'false'}
                        aria-selected={isSelected ? 'true' : 'false'}
                    >
                        <div className={`${prefix}calendar-month`}>
                            {monthCellContent}
                        </div>
                    </td>
                );
                counter++;
            }
            monthList.push(
                <tr key={i} role="row">
                    {rowList}
                </tr>
            );
        }

        return (
            <table className={`${prefix}calendar-table`} role="grid">
                <tbody className={`${prefix}calendar-tbody`} role="rowgroup">
                    {monthList}
                </tbody>
            </table>
        );
    }
}

export default MonthTable;
