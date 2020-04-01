import React from 'react';
import classnames from 'classnames';
import Icon from '../../icon';
import {
    isDisabledDate,
    YEAR_TABLE_COL_COUNT,
    YEAR_TABLE_ROW_COUNT,
} from '../utils';

class YearTable extends React.PureComponent {
    onYearCellClick(date) {
        this.props.onSelectYear(date, 'month');
    }

    render() {
        const {
            prefix,
            value,
            today,
            visibleMonth,
            locale,
            disabledDate,
            goPrevDecade,
            goNextDecade,
            yearCellRender,
        } = this.props;
        const currentYear = today.year();
        const selectedYear = value ? value.year() : null;
        const visibleYear = visibleMonth.year();
        const startYear = Math.floor(visibleYear / 10) * 10;

        const yearElements = [];
        let counter = 0;

        const lastRowIndex = YEAR_TABLE_ROW_COUNT - 1;
        const lastColIndex = YEAR_TABLE_COL_COUNT - 1;

        for (let i = 0; i < YEAR_TABLE_ROW_COUNT; i++) {
            const rowElements = [];
            for (let j = 0; j < YEAR_TABLE_COL_COUNT; j++) {
                let content;
                let year;
                let isDisabled = false;
                let onClick;
                let title;

                if (i === 0 && j === 0) {
                    title = locale.prevDecade;
                    onClick = goPrevDecade;
                    content = <Icon type="arrow-left" size="xs" />;
                } else if (i === lastRowIndex && j === lastColIndex) {
                    title = locale.nextDecade;
                    onClick = goNextDecade;
                    content = <Icon type="arrow-right" size="xs" />;
                } else {
                    year = startYear + counter++;
                    title = year;
                    const yearDate = visibleMonth.clone().year(year);
                    isDisabled = isDisabledDate(yearDate, disabledDate, 'year');

                    !isDisabled &&
                        (onClick = this.onYearCellClick.bind(this, yearDate));

                    content = yearCellRender ? yearCellRender(yearDate) : year;
                }

                const isSelected = year === selectedYear;

                const classNames = classnames({
                    [`${prefix}calendar-cell`]: true,
                    [`${prefix}calendar-cell-current`]: year === currentYear,
                    [`${prefix}selected`]: isSelected,
                    [`${prefix}disabled`]: isDisabled,
                });

                rowElements.push(
                    <td key={`${i}-${j}`} className={classNames} role="cell">
                        <div
                            className={`${prefix}calendar-year`}
                            onClick={onClick}
                            title={title}
                            aria-disabled={isDisabled ? 'true' : 'false'}
                            aria-selected={isSelected ? 'true' : 'false'}
                        >
                            {content}
                        </div>
                    </td>
                );
            }
            yearElements.push(
                <tr key={i} role="row">
                    {rowElements}
                </tr>
            );
        }
        return (
            <table className={`${prefix}calendar-table`} role="grid">
                <tbody className={`${prefix}calendar-tbody`} role="rowgroup">
                    {yearElements}
                </tbody>
            </table>
        );
    }
}

export default YearTable;
