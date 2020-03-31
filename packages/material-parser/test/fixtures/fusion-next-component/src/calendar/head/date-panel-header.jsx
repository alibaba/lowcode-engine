/* istanbul ignore file */
import React from 'react';
import Icon from '../../icon';
import Dropdown from '../../dropdown';
import SelectMenu from './menu';
import { getMonths, getYears } from '../utils';

/* eslint-disable */
class DatePanelHeader extends React.PureComponent {
    static defaultProps = {
        yearRangeOffset: 10,
    };

    selectContainerHandler = target => {
        return target.parentNode;
    };

    onYearChange = year => {
        const { visibleMonth, changeVisibleMonth } = this.props;
        changeVisibleMonth(visibleMonth.clone().year(year), 'yearSelect');
    };

    changeVisibleMonth = month => {
        const { visibleMonth, changeVisibleMonth } = this.props;
        changeVisibleMonth(visibleMonth.clone().month(month), 'monthSelect');
    };

    render() {
        const {
            prefix,
            visibleMonth,
            momentLocale,
            locale,
            changeMode,
            goNextMonth,
            goNextYear,
            goPrevMonth,
            goPrevYear,
            disableChangeMode,
            yearRangeOffset,
            yearRange = [],
        } = this.props;

        const localedMonths = momentLocale.months();
        const monthLabel = localedMonths[visibleMonth.month()];
        const yearLabel = visibleMonth.year();
        const btnCls = `${prefix}calendar-btn`;

        let monthButton = (
            <button
                role="button"
                className={btnCls}
                title={monthLabel}
                onClick={() => changeMode('month', 'start')}
            >
                {monthLabel}
            </button>
        );

        let yearButton = (
            <button
                role="button"
                className={btnCls}
                title={yearLabel}
                onClick={() => changeMode('year', 'start')}
            >
                {yearLabel}
            </button>
        );

        if (disableChangeMode) {
            const months = getMonths(momentLocale);
            const years = getYears(
                yearRange,
                yearRangeOffset,
                visibleMonth.year()
            );

            monthButton = (
                <Dropdown
                    align="tc bc"
                    container={this.selectContainerHandler}
                    trigger={
                        <button
                            role="button"
                            className={btnCls}
                            title={monthLabel}
                        >
                            {monthLabel}
                            <Icon type="arrow-down" />
                        </button>
                    }
                    triggerType="click"
                >
                    <SelectMenu
                        prefix={prefix}
                        value={visibleMonth.month()}
                        dataSource={months}
                        onChange={value => this.changeVisibleMonth(value)}
                    />
                </Dropdown>
            );

            yearButton = (
                <Dropdown
                    align="tc bc"
                    container={this.selectContainerHandler}
                    trigger={
                        <button
                            role="button"
                            className={btnCls}
                            title={yearLabel}
                        >
                            {yearLabel}
                            <Icon type="arrow-down" />
                        </button>
                    }
                    triggerType="click"
                >
                    <SelectMenu
                        prefix={prefix}
                        value={visibleMonth.year()}
                        dataSource={years}
                        onChange={this.onYearChange}
                    />
                </Dropdown>
            );
        }

        return (
            <div className={`${prefix}calendar-panel-header`}>
                <button
                    role="button"
                    title={locale.prevYear}
                    className={`${btnCls} ${btnCls}-prev-year`}
                    onClick={goPrevYear}
                >
                    <Icon type="arrow-double-left" />
                </button>
                <button
                    role="button"
                    title={locale.prevMonth}
                    className={`${btnCls} ${btnCls}-prev-month`}
                    onClick={goPrevMonth}
                >
                    <Icon type="arrow-left" />
                </button>
                <div className={`${prefix}calendar-panel-header-full`}>
                    {monthButton}
                    {yearButton}
                </div>
                <button
                    role="button"
                    title={locale.nextMonth}
                    className={`${btnCls} ${btnCls}-next-month`}
                    onClick={goNextMonth}
                >
                    <Icon type="arrow-right" />
                </button>
                <button
                    role="button"
                    title={locale.nextYear}
                    className={`${btnCls} ${btnCls}-next-year`}
                    onClick={goNextYear}
                >
                    <Icon type="arrow-double-right" />
                </button>
            </div>
        );
    }
}

export default DatePanelHeader;
