import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import classnames from 'classnames';
import ConfigProvider from '../config-provider';
import nextLocale from '../locale/zh-cn';
import { func, obj } from '../util';
import CardHeader from './head/card-header';
import DatePanelHeader from './head/date-panel-header';
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

/** Calendar */
class Calendar extends Component {
    static propTypes = {
        ...ConfigProvider.propTypes,
        prefix: PropTypes.string,
        rtl: PropTypes.bool,
        /**
         * 默认选中的日期（moment 对象）
         */
        defaultValue: checkMomentObj,
        /**
         * 选中的日期值 (moment 对象)
         */
        value: checkMomentObj,
        /**
         * 面板模式
         */
        mode: PropTypes.oneOf(CALENDAR_MODES), // 生成 API 文档需要手动改回 ['date', 'month', 'year']
        // 面板可变化的模式列表，仅初始化时接收一次
        modes: PropTypes.array,
        // 禁用更改面板模式，采用 dropdown 的方式切换显示日期 (暂不正式对外透出)
        disableChangeMode: PropTypes.bool,
        // 日期值的格式（用于日期title显示的格式）
        format: PropTypes.string,
        /**
         * 是否展示非本月的日期
         */
        showOtherMonth: PropTypes.bool,
        /**
         * 默认展示的月份
         */
        defaultVisibleMonth: PropTypes.func,
        /**
         * 展现形态
         */
        shape: PropTypes.oneOf(['card', 'fullscreen', 'panel']),
        /**
         * 选择日期单元格时的回调
         * @param {Object} value 对应的日期值 (moment 对象)
         */
        onSelect: PropTypes.func,
        /**
         * 面板模式变化时的回调
         * @param {String} mode 对应面板模式 date month year
         */
        onModeChange: PropTypes.func,
        /**
         * 展现的月份变化时的回调
         * @param {Object} value 显示的月份 (moment 对象)
         * @param {String} reason 触发月份改变原因
         */
        onVisibleMonthChange: PropTypes.func,
        /**
         * 自定义样式类
         */
        className: PropTypes.string,
        /**
         * 自定义日期渲染函数
         * @param {Object} value 日期值（moment对象）
         * @returns {ReactNode}
         */
        dateCellRender: PropTypes.func,
        /**
         * 自定义月份渲染函数
         * @param {Object} calendarDate 对应 Calendar 返回的自定义日期对象
         * @returns {ReactNode}
         */
        monthCellRender: PropTypes.func,
        yearCellRender: PropTypes.func, // 兼容 0.x yearCellRender
        /**
         * 年份范围，[START_YEAR, END_YEAR] (只在shape 为 ‘card’, 'fullscreen' 下生效)
         */
        yearRange: PropTypes.arrayOf(PropTypes.number),
        /**
         * 不可选择的日期
         * @param {Object} calendarDate 对应 Calendar 返回的自定义日期对象
         * @param {String} view 当前视图类型，year: 年， month: 月, date: 日
         * @returns {Boolean}
         */
        disabledDate: PropTypes.func,
        /**
         * 国际化配置
         */
        locale: PropTypes.object,
    };

    static defaultProps = {
        prefix: 'next-',
        rtl: false,
        shape: 'fullscreen',
        modes: CALENDAR_MODES,
        disableChangeMode: false,
        format: 'YYYY-MM-DD',
        onSelect: func.noop,
        onVisibleMonthChange: func.noop,
        onModeChange: func.noop,
        dateCellRender: value => value.date(),
        locale: nextLocale.Calendar,
        showOtherMonth: true,
    };

    constructor(props, context) {
        super(props, context);
        const value = formatDateValue(props.value || props.defaultValue);
        const visibleMonth = getVisibleMonth(props.defaultVisibleMonth, value);

        this.MODES = props.modes;
        this.today = moment();
        this.state = {
            value,
            mode: props.mode || this.MODES[0],
            visibleMonth,
        };
    }

    componentWillReceiveProps(nextProps) {
        if ('value' in nextProps) {
            const value = formatDateValue(nextProps.value);
            this.setState({
                value,
            });

            if (value) {
                this.setState({
                    visibleMonth: value,
                });
            }
        }

        if (nextProps.mode && this.MODES.indexOf(nextProps.mode) > -1) {
            this.setState({
                mode: nextProps.mode,
            });
        }
    }

    onSelectCell = (date, nextMode) => {
        const { shape } = this.props;

        this.changeVisibleMonth(date, 'cellClick');

        // 当用户所在的面板为初始化面板时，则选择动作为触发 onSelect 回调
        if (this.state.mode === this.MODES[0]) {
            this.props.onSelect(date);
        }

        if (shape === 'panel') {
            this.changeMode(nextMode);
        }
    };

    changeMode = nextMode => {
        if (
            nextMode &&
            this.MODES.indexOf(nextMode) > -1 &&
            nextMode !== this.state.mode
        ) {
            this.setState({ mode: nextMode });
            this.props.onModeChange(nextMode);
        }
    };

    changeVisibleMonth = (date, reason) => {
        if (!isSameYearMonth(date, this.state.visibleMonth)) {
            this.setState({ visibleMonth: date });
            this.props.onVisibleMonthChange(date, reason);
        }
    };

    /**
     * 根据日期偏移量设置当前展示的月份
     * @param {Number} offset 日期偏移的数量
     * @param {String} type 日期偏移的类型 days, months, years
     */
    changeVisibleMonthByOffset(offset, type) {
        const cloneValue = this.state.visibleMonth.clone();
        cloneValue.add(offset, type);
        this.changeVisibleMonth(cloneValue, 'buttonClick');
    }

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
            className,
            shape,
            showOtherMonth,
            format,
            locale,
            dateCellRender,
            monthCellRender,
            yearCellRender,
            disabledDate,
            yearRange,
            disableChangeMode,
            ...others
        } = this.props;
        const state = this.state;

        const classNames = classnames(
            {
                [`${prefix}calendar`]: true,
                [`${prefix}calendar-${shape}`]: shape,
            },
            className
        );

        if (rtl) {
            others.dir = 'rtl';
        }

        const visibleMonth = state.visibleMonth;

        // reset moment locale
        if (locale.momentLocale) {
            state.value && state.value.locale(locale.momentLocale);
            visibleMonth.locale(locale.momentLocale);
        }

        const localeData = getLocaleData(
            locale.format || {},
            visibleMonth.localeData()
        );

        const headerProps = {
            prefix,
            value: state.value,
            mode: state.mode,
            disableChangeMode,
            yearRange,
            locale,
            rtl,
            visibleMonth,
            momentLocale: localeData,
            changeMode: this.changeMode,
            changeVisibleMonth: this.changeVisibleMonth,
            goNextDecade: this.goNextDecade,
            goNextYear: this.goNextYear,
            goNextMonth: this.goNextMonth,
            goPrevDecade: this.goPrevDecade,
            goPrevYear: this.goPrevYear,
            goPrevMonth: this.goPrevMonth,
        };

        const tableProps = {
            prefix,
            visibleMonth,
            showOtherMonth,
            value: state.value,
            mode: state.mode,
            locale,
            dateCellRender,
            monthCellRender,
            yearCellRender,
            disabledDate,
            momentLocale: localeData,
            today: this.today,
            goPrevDecade: this.goPrevDecade,
            goNextDecade: this.goNextDecade,
        };

        const tables = {
            [CALENDAR_MODE_DATE]: (
                <DateTable
                    format={format}
                    {...tableProps}
                    onSelectDate={this.onSelectCell}
                />
            ),
            [CALENDAR_MODE_MONTH]: (
                <MonthTable {...tableProps} onSelectMonth={this.onSelectCell} />
            ),
            [CALENDAR_MODE_YEAR]: (
                <YearTable
                    {...tableProps}
                    rtl={rtl}
                    onSelectYear={this.onSelectCell}
                />
            ),
        };

        const panelHeaders = {
            [CALENDAR_MODE_DATE]: <DatePanelHeader {...headerProps} />,
            [CALENDAR_MODE_MONTH]: <MonthPanelHeader {...headerProps} />,
            [CALENDAR_MODE_YEAR]: <YearPanelHeader {...headerProps} />,
        };

        return (
            <div
                {...obj.pickOthers(Calendar.propTypes, others)}
                className={classNames}
            >
                {shape === 'panel' ? (
                    panelHeaders[state.mode]
                ) : (
                    <CardHeader {...headerProps} />
                )}
                {tables[state.mode]}
            </div>
        );
    }
}

export default Calendar;
