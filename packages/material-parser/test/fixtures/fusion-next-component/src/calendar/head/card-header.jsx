import React from 'react';
import PropTypes from 'prop-types';
import Select from '../../select';
import Radio from '../../radio';

class CardHeader extends React.PureComponent {
    static propTypes = {
        yearRange: PropTypes.arrayOf(PropTypes.number),
        yearRangeOffset: PropTypes.number,
        locale: PropTypes.object,
    };

    static defaultProps = {
        yearRangeOffset: 10,
    };

    selectContainerHandler = target => {
        return target.parentNode;
    };

    getYearSelect(year) {
        const { prefix, yearRangeOffset, yearRange = [], locale } = this.props;

        let [startYear, endYear] = yearRange;
        if (!startYear || !endYear) {
            startYear = year - yearRangeOffset;
            endYear = year + yearRangeOffset;
        }

        const options = [];
        for (let i = startYear; i <= endYear; i++) {
            options.push(
                <Select.Option key={i} value={i}>
                    {i}
                </Select.Option>
            );
        }

        return (
            <Select
                prefix={prefix}
                value={year}
                aria-label={locale.yearSelectAriaLabel}
                onChange={this.onYearChange}
                popupContainer={this.selectContainerHandler}
            >
                {options}
            </Select>
        );
    }

    getMonthSelect(month) {
        const { prefix, momentLocale, locale } = this.props;
        const localeMonths = momentLocale.monthsShort();
        const options = [];
        for (let i = 0; i < 12; i++) {
            options.push(
                <Select.Option key={i} value={i}>
                    {localeMonths[i]}
                </Select.Option>
            );
        }
        return (
            <Select
                aria-label={locale.monthSelectAriaLabel}
                prefix={prefix}
                value={month}
                onChange={this.changeVisibleMonth}
                popupContainer={this.selectContainerHandler}
            >
                {options}
            </Select>
        );
    }

    onYearChange = year => {
        const { visibleMonth, changeVisibleMonth } = this.props;
        changeVisibleMonth(visibleMonth.clone().year(year), 'yearSelect');
    };

    changeVisibleMonth = month => {
        const { visibleMonth, changeVisibleMonth } = this.props;
        changeVisibleMonth(visibleMonth.clone().month(month), 'monthSelect');
    };

    onModePanelChange = mode => {
        this.props.changeMode(mode);
    };

    render() {
        const { prefix, mode, locale, visibleMonth } = this.props;

        const yearSelect = this.getYearSelect(visibleMonth.year());
        const monthSelect =
            mode === 'month' ? null : this.getMonthSelect(visibleMonth.month());
        const panelSelect = (
            <Radio.Group
                shape="button"
                size="medium"
                value={mode}
                onChange={this.onModePanelChange}
            >
                <Radio value="date">{locale.month}</Radio>
                <Radio value="month">{locale.year}</Radio>
            </Radio.Group>
        );

        return (
            <div className={`${prefix}calendar-header`}>
                {yearSelect}
                {monthSelect}
                {panelSelect}
            </div>
        );
    }
}

export default CardHeader;
