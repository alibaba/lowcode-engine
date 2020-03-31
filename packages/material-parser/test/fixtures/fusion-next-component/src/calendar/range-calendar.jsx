import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import moment from 'moment';
import ConfigProvider from '../config-provider';
import nextLocale from '../locale/zh-cn';
import { obj, func } from '../util';
import RangePanelHeader from './head/range-panel-header';
import MonthPanelHeader from './head/month-panel-header';
import YearPanelHeader from './head/year-panel-header';
import DateTable from './table/date-table';
import MonthTable from './table/month-table';
import YearTable from './table/year-table';
import {
    checkMomentObj,
    formatDateValue,
    getVisibleMonth,
    isSameYearMonth,
    CALENDAR_MODES,
    CALENDAR_MODE_DATE,
    CALENDAR_MODE_MONTH,
    CALENDAR_MODE_YEAR,
    getLocaleData,
} from './utils';

class RangeCalendar extends React.Component {
    static propTypes = {
        ...ConfigProvider.propTypes,
        /**
         * 样式前缀
         */
        prefix: PropTypes.string,
        rtl: PropTypes.bool,
        /**
         * 默认的开始日期
         */
        defaultStartValue: checkMomentObj,
        /**
         * 默认的结束日期
         */
        defaultEndValue: checkMomentObj,
        /**
         * 开始日期（moment 对象）
         */
        startValue: checkMomentObj,
        /**
         * 结束日期（moment 对象）
         */
        endValue: checkMomentObj,
        // 面板模式
        mode: PropTypes.oneOf(CALENDAR_MODES),
        // 禁用更改面板模式，采用 dropdown 的方式切换显示日期 (暂不正式对外透出)
        disableChangeMode: PropTypes.bool,
        // 日期值的格式（用于日期title显示的格式）
        format: PropTypes.string,
        yearRange: PropTypes.arrayOf(PropTypes.number),
        /**
         * 是否显示非本月的日期
         */
        showOtherMonth: PropTypes.bool,
        /**
         * 模板展示的月份（起始月份）
         */
        defaultVisibleMonth: PropTypes.func,
        /**
         * 展现的月份变化时的回调
         * @param {Object} value 显示的月份 (moment 对象)
         * @param {String} reason 触发月份改变原因
         */
        onVisibleMonthChange: PropTypes.func,
        /**
         * 不可选择的日期
         * @param {Object} calendarDate 对应 Calendar 返回的自定义日期对象
         * @param {String} view 当前视图类型，year: 年， month: 月, date: 日
         * @returns {Boolean}
         */
        disabledDate: PropTypes.func,
        /**
         * 选择日期单元格时的回调
         * @param {Object} value 对应的日期值 (moment 对象)
         */
        onSelect: PropTypes.func,
        /**
         * 自定义日期单元格渲染
         */
        dateCellRender: PropTypes.func,
        /**
         * 自定义月份渲染函数
         * @param {Object} calendarDate 对应 Calendar 返回的自定义日期对象
         * @returns {ReactNode}
         */
        monthCellRender: PropTypes.func,
        yearCellRender: PropTypes.func, // 兼容 0.x yearCellRender
        locale: PropTypes.object,
        className: PropTypes.string,
    };

    static defaultProps = {
        prefix: 'next-',
        rtl: false,
        mode: CALENDAR_MODE_DATE,
        disableChangeMode: false,
        format: 'YYYY-MM-DD',
        dateCellRender: value => value.date(),
        onSelect: func.noop,
        onVisibleMonthChange: func.noop,
        locale: nextLocale.Calendar,
        showOtherMonth: false,
    };

    constructor(props, context) {
        super(props, context);

        const startValue = formatDateValue(
            props.startValue || props.defaultStartValue
        );
        const endValue = formatDateValue(
            props.endValue || props.defaultEndValue
        );
        const visibleMonth = getVisibleMonth(
            props.defaultVisibleMonth,
            startValue
        );

        this.state = {
            startValue,
            endValue,
            mode: props.mode,
            startVisibleMonth: visibleMonth,
            activePanel: undefined,
        };
        this.today = moment();
    }

    componentWillReceiveProps(nextProps) {
        if ('startValue' in nextProps) {
            const startValue = formatDateValue(nextProps.startValue);
            this.setState({
                startValue,
            });

            if (
                startValue &&
                !startValue.isSame(this.state.startValue, 'day')
            ) {
                this.setState({
                    startVisibleMonth: startValue,
                });
            }
        }

        if ('endValue' in nextProps) {
            const endValue = formatDateValue(nextProps.endValue);
            this.setState({
                endValue,
            });
        }

        if ('mode' in nextProps) {
            this.setState({
                mode: nextProps.mode,
            });
        }
    }

    onSelectCell = (date, nextMode) => {
        if (this.state.mode === CALENDAR_MODE_DATE) {
            this.props.onSelect(date);
        } else {
            this.changeVisibleMonth(date, 'cellClick');
        }

        this.changeMode(nextMode);
    };

    changeMode = (mode, activePanel) => {
        if (typeof mode === 'string' && mode !== this.state.mode) {
            this.setState({ mode });
        }
        if (activePanel && activePanel !== this.state.activePanel) {
            this.setState({ activePanel });
        }
    };

    changeVisibleMonth = (date, reason) => {
        if (!isSameYearMonth(date, this.state.startVisibleMonth)) {
            this.setState({ startVisibleMonth: date });
            this.props.onVisibleMonthChange(date, reason);
        }
    };

    /**
     * 根据日期偏移量设置当前展示的月份
     * @param {Number} offset 日期偏移量
     * @param {String} type 日期偏移类型 days, months, years
     */
    changeVisibleMonthByOffset = (offset, type) => {
        const offsetDate = this.state.startVisibleMonth
            .clone()
            .add(offset, type);
        this.changeVisibleMonth(offsetDate, 'buttonClick');
    };

    goPrevDecade = () => {
        this.changeVisibleMonthByOffset(-10, 'years');
    };

    goNextDecade = () => {
        this.changeVisibleMonthByOffset(10, 'years');
    };

    goPrevYear = () => {
        this.changeVisibleMonthByOffset(-1, 'years');
    };

    goNextYear = () => {
        this.changeVisibleMonthByOffset(1, 'years');
    };

    goPrevMonth = () => {
        this.changeVisibleMonthByOffset(-1, 'months');
    };

    goNextMonth = () => {
        this.changeVisibleMonthByOffset(1, 'months');
    };

    render() {
        const {
            prefix,
            rtl,
            dateCellRender,
            monthCellRender,
            yearCellRender,
            className,
            format,
            locale,
            showOtherMonth,
            disabledDate,
            disableChangeMode,
            yearRange,
            ...others
        } = this.props;
        const {
            startValue,
            endValue,
            mode,
            startVisibleMonth,
            activePanel,
        } = this.state;

        // reset moment locale
        if (locale.momentLocale) {
            startValue && startValue.locale(locale.momentLocale);
            endValue && endValue.locale(locale.momentLocale);
            startVisibleMonth.locale(locale.momentLocale);
        }

        if (rtl) {
            others.dir = 'rtl';
        }
        const localeData = getLocaleData(
            locale.format || {},
            startVisibleMonth.localeData()
        );

        const endVisibleMonth = startVisibleMonth.clone().add(1, 'months');

        const headerProps = {
            prefix,
            rtl,
            mode,
            locale,
            momentLocale: localeData,
            startVisibleMonth,
            endVisibleMonth,
            changeVisibleMonth: this.changeVisibleMonth,
            changeMode: this.changeMode,
            yearRange,
            disableChangeMode,
        };

        const tableProps = {
            prefix,
            value: startValue,
            startValue,
            endValue,
            mode,
            locale,
            momentLocale: localeData,
            showOtherMonth,
            today: this.today,
            disabledDate,
            dateCellRender,
            monthCellRender,
            yearCellRender,
            changeMode: this.changeMode,
            changeVisibleMonth: this.changeVisibleMonth,
        };

        const visibleMonths = {
            start: startVisibleMonth,
            end: endVisibleMonth,
        };

        const visibleMonth = visibleMonths[activePanel];

        let header;
        let table;

        switch (mode) {
            case CALENDAR_MODE_DATE: {
                table = [
                    <div
                        className={`${prefix}calendar-body-left`}
                        key="left-panel"
                    >
                        <DateTable
                            format={format}
                            {...tableProps}
                            visibleMonth={startVisibleMonth}
                            onSelectDate={this.onSelectCell}
                        />
                    </div>,
                    <div
                        className={`${prefix}calendar-body-right`}
                        key="right-panel"
                    >
                        <DateTable
                            format={format}
                            {...tableProps}
                            visibleMonth={endVisibleMonth}
                            onSelectDate={this.onSelectCell}
                        />
                    </div>,
                ];
                header = (
                    <RangePanelHeader
                        {...headerProps}
                        goPrevYear={this.goPrevYear}
                        goPrevMonth={this.goPrevMonth}
                        goNextYear={this.goNextYear}
                        goNextMonth={this.goNextMonth}
                    />
                );
                break;
            }
            case CALENDAR_MODE_MONTH: {
                table = (
                    <MonthTable
                        {...tableProps}
                        visibleMonth={visibleMonth}
                        onSelectMonth={this.onSelectCell}
                    />
                );
                header = (
                    <MonthPanelHeader
                        {...headerProps}
                        visibleMonth={visibleMonth}
                        goPrevYear={this.goPrevYear}
                        goNextYear={this.goNextYear}
                    />
                );
                break;
            }
            case CALENDAR_MODE_YEAR: {
                table = (
                    <YearTable
                        {...tableProps}
                        rtl={rtl}
                        visibleMonth={visibleMonth}
                        onSelectYear={this.onSelectCell}
                        goPrevDecade={this.goPrevDecade}
                        goNextDecade={this.goNextDecade}
                    />
                );
                header = (
                    <YearPanelHeader
                        {...headerProps}
                        visibleMonth={visibleMonth}
                        goPrevDecade={this.goPrevDecade}
                        goNextDecade={this.goNextDecade}
                    />
                );
                break;
            }
        }

        const classNames = classnames(
            {
                [`${prefix}calendar`]: true,
                [`${prefix}calendar-range`]: true,
            },
            className
        );

        return (
            <div
                {...obj.pickOthers(RangeCalendar.propTypes, others)}
                className={classNames}
            >
                {header}
                <div className={`${prefix}calendar-body`}>{table}</div>
            </div>
        );
    }
}

export default ConfigProvider.config(RangeCalendar, {
    componentName: 'Calendar',
});
