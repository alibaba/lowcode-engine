import React, { PureComponent } from 'react';
import { DAYS_OF_WEEK } from '../utils';

class DateTableHead extends PureComponent {
    render() {
        const { prefix, momentLocale } = this.props;
        const firstDayOfWeek = momentLocale.firstDayOfWeek();
        const weekdaysShort = momentLocale.weekdaysShort();

        const elements = [];
        for (let i = 0; i < DAYS_OF_WEEK; i++) {
            const index = (firstDayOfWeek + i) % DAYS_OF_WEEK;
            elements.push(
                <th key={i} className={`${prefix}calendar-th`} role="cell">
                    {weekdaysShort[index]}
                </th>
            );
        }

        return (
            <thead className={`${prefix}calendar-thead`} role="rowgroup">
                <tr role="row">{elements}</tr>
            </thead>
        );
    }
}

export default DateTableHead;
