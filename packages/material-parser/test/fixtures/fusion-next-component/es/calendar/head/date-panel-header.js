import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp2;

/* istanbul ignore file */
import React from 'react';
import Icon from '../../icon';
import Dropdown from '../../dropdown';
import SelectMenu from './menu';
import { getMonths, getYears } from '../utils';

/* eslint-disable */
var DatePanelHeader = (_temp2 = _class = function (_React$PureComponent) {
    _inherits(DatePanelHeader, _React$PureComponent);

    function DatePanelHeader() {
        var _temp, _this, _ret;

        _classCallCheck(this, DatePanelHeader);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$PureComponent.call.apply(_React$PureComponent, [this].concat(args))), _this), _this.selectContainerHandler = function (target) {
            return target.parentNode;
        }, _this.onYearChange = function (year) {
            var _this$props = _this.props,
                visibleMonth = _this$props.visibleMonth,
                changeVisibleMonth = _this$props.changeVisibleMonth;

            changeVisibleMonth(visibleMonth.clone().year(year), 'yearSelect');
        }, _this.changeVisibleMonth = function (month) {
            var _this$props2 = _this.props,
                visibleMonth = _this$props2.visibleMonth,
                changeVisibleMonth = _this$props2.changeVisibleMonth;

            changeVisibleMonth(visibleMonth.clone().month(month), 'monthSelect');
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    DatePanelHeader.prototype.render = function render() {
        var _this2 = this;

        var _props = this.props,
            prefix = _props.prefix,
            visibleMonth = _props.visibleMonth,
            momentLocale = _props.momentLocale,
            locale = _props.locale,
            changeMode = _props.changeMode,
            goNextMonth = _props.goNextMonth,
            goNextYear = _props.goNextYear,
            goPrevMonth = _props.goPrevMonth,
            goPrevYear = _props.goPrevYear,
            disableChangeMode = _props.disableChangeMode,
            yearRangeOffset = _props.yearRangeOffset,
            _props$yearRange = _props.yearRange,
            yearRange = _props$yearRange === undefined ? [] : _props$yearRange;


        var localedMonths = momentLocale.months();
        var monthLabel = localedMonths[visibleMonth.month()];
        var yearLabel = visibleMonth.year();
        var btnCls = prefix + 'calendar-btn';

        var monthButton = React.createElement(
            'button',
            {
                role: 'button',
                className: btnCls,
                title: monthLabel,
                onClick: function onClick() {
                    return changeMode('month', 'start');
                }
            },
            monthLabel
        );

        var yearButton = React.createElement(
            'button',
            {
                role: 'button',
                className: btnCls,
                title: yearLabel,
                onClick: function onClick() {
                    return changeMode('year', 'start');
                }
            },
            yearLabel
        );

        if (disableChangeMode) {
            var months = getMonths(momentLocale);
            var years = getYears(yearRange, yearRangeOffset, visibleMonth.year());

            monthButton = React.createElement(
                Dropdown,
                {
                    align: 'tc bc',
                    container: this.selectContainerHandler,
                    trigger: React.createElement(
                        'button',
                        {
                            role: 'button',
                            className: btnCls,
                            title: monthLabel
                        },
                        monthLabel,
                        React.createElement(Icon, { type: 'arrow-down' })
                    ),
                    triggerType: 'click'
                },
                React.createElement(SelectMenu, {
                    prefix: prefix,
                    value: visibleMonth.month(),
                    dataSource: months,
                    onChange: function onChange(value) {
                        return _this2.changeVisibleMonth(value);
                    }
                })
            );

            yearButton = React.createElement(
                Dropdown,
                {
                    align: 'tc bc',
                    container: this.selectContainerHandler,
                    trigger: React.createElement(
                        'button',
                        {
                            role: 'button',
                            className: btnCls,
                            title: yearLabel
                        },
                        yearLabel,
                        React.createElement(Icon, { type: 'arrow-down' })
                    ),
                    triggerType: 'click'
                },
                React.createElement(SelectMenu, {
                    prefix: prefix,
                    value: visibleMonth.year(),
                    dataSource: years,
                    onChange: this.onYearChange
                })
            );
        }

        return React.createElement(
            'div',
            { className: prefix + 'calendar-panel-header' },
            React.createElement(
                'button',
                {
                    role: 'button',
                    title: locale.prevYear,
                    className: btnCls + ' ' + btnCls + '-prev-year',
                    onClick: goPrevYear
                },
                React.createElement(Icon, { type: 'arrow-double-left' })
            ),
            React.createElement(
                'button',
                {
                    role: 'button',
                    title: locale.prevMonth,
                    className: btnCls + ' ' + btnCls + '-prev-month',
                    onClick: goPrevMonth
                },
                React.createElement(Icon, { type: 'arrow-left' })
            ),
            React.createElement(
                'div',
                { className: prefix + 'calendar-panel-header-full' },
                monthButton,
                yearButton
            ),
            React.createElement(
                'button',
                {
                    role: 'button',
                    title: locale.nextMonth,
                    className: btnCls + ' ' + btnCls + '-next-month',
                    onClick: goNextMonth
                },
                React.createElement(Icon, { type: 'arrow-right' })
            ),
            React.createElement(
                'button',
                {
                    role: 'button',
                    title: locale.nextYear,
                    className: btnCls + ' ' + btnCls + '-next-year',
                    onClick: goNextYear
                },
                React.createElement(Icon, { type: 'arrow-double-right' })
            )
        );
    };

    return DatePanelHeader;
}(React.PureComponent), _class.defaultProps = {
    yearRangeOffset: 10
}, _temp2);


export default DatePanelHeader;