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
var RangePanelHeader = (_temp2 = _class = function (_React$PureComponent) {
    _inherits(RangePanelHeader, _React$PureComponent);

    function RangePanelHeader() {
        var _temp, _this, _ret;

        _classCallCheck(this, RangePanelHeader);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$PureComponent.call.apply(_React$PureComponent, [this].concat(args))), _this), _this.selectContainerHandler = function (target) {
            return target.parentNode;
        }, _this.onYearChange = function (visibleMonth, year) {
            var changeVisibleMonth = _this.props.changeVisibleMonth;

            changeVisibleMonth(visibleMonth.clone().year(year), 'yearSelect');
        }, _this.changeVisibleMonth = function (visibleMonth, month) {
            var changeVisibleMonth = _this.props.changeVisibleMonth;

            changeVisibleMonth(visibleMonth.clone().month(month), 'monthSelect');
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    RangePanelHeader.prototype.render = function render() {
        var _this2 = this;

        var _props = this.props,
            prefix = _props.prefix,
            startVisibleMonth = _props.startVisibleMonth,
            endVisibleMonth = _props.endVisibleMonth,
            _props$yearRange = _props.yearRange,
            yearRange = _props$yearRange === undefined ? [] : _props$yearRange,
            yearRangeOffset = _props.yearRangeOffset,
            momentLocale = _props.momentLocale,
            locale = _props.locale,
            changeMode = _props.changeMode,
            goNextMonth = _props.goNextMonth,
            goNextYear = _props.goNextYear,
            goPrevMonth = _props.goPrevMonth,
            goPrevYear = _props.goPrevYear,
            disableChangeMode = _props.disableChangeMode;


        var localedMonths = momentLocale.months();
        var startMonthLabel = localedMonths[startVisibleMonth.month()];
        var endMonthLabel = localedMonths[endVisibleMonth.month()];
        var startYearLabel = startVisibleMonth.year();
        var endYearLabel = endVisibleMonth.year();
        var btnCls = prefix + 'calendar-btn';

        var months = getMonths(momentLocale);
        var startYears = getYears(yearRange, yearRangeOffset, startVisibleMonth.year());
        var endYears = getYears(yearRange, yearRangeOffset, endVisibleMonth.year());

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
                { className: prefix + 'calendar-panel-header-left' },
                disableChangeMode ? React.createElement(
                    Dropdown,
                    {
                        align: 'tc bc',
                        container: this.selectContainerHandler,
                        trigger: React.createElement(
                            'button',
                            {
                                role: 'button',
                                className: btnCls,
                                title: startMonthLabel
                            },
                            startMonthLabel,
                            React.createElement(Icon, { type: 'arrow-down' })
                        ),
                        triggerType: 'click'
                    },
                    React.createElement(SelectMenu, {
                        prefix: prefix,
                        value: startVisibleMonth.month(),
                        dataSource: months,
                        onChange: function onChange(value) {
                            return _this2.changeVisibleMonth(startVisibleMonth, value);
                        }
                    })
                ) : React.createElement(
                    'button',
                    {
                        role: 'button',
                        title: startMonthLabel,
                        className: btnCls,
                        onClick: function onClick() {
                            return changeMode('month', 'start');
                        }
                    },
                    startMonthLabel
                ),
                disableChangeMode ? React.createElement(
                    Dropdown,
                    {
                        align: 'tc bc',
                        container: this.selectContainerHandler,
                        trigger: React.createElement(
                            'button',
                            {
                                role: 'button',
                                className: btnCls,
                                title: startYearLabel
                            },
                            startYearLabel,
                            React.createElement(Icon, { type: 'arrow-down' })
                        ),
                        triggerType: 'click'
                    },
                    React.createElement(SelectMenu, {
                        prefix: prefix,
                        value: startVisibleMonth.year(),
                        dataSource: startYears,
                        onChange: function onChange(v) {
                            return _this2.onYearChange(startVisibleMonth, v);
                        }
                    })
                ) : React.createElement(
                    'button',
                    {
                        role: 'button',
                        title: startYearLabel,
                        className: btnCls,
                        onClick: function onClick() {
                            return changeMode('year', 'start');
                        }
                    },
                    startYearLabel
                )
            ),
            React.createElement(
                'div',
                { className: prefix + 'calendar-panel-header-right' },
                disableChangeMode ? React.createElement(
                    Dropdown,
                    {
                        align: 'tc bc',
                        container: this.selectContainerHandler,
                        trigger: React.createElement(
                            'button',
                            {
                                role: 'button',
                                className: btnCls,
                                title: endMonthLabel
                            },
                            endMonthLabel,
                            React.createElement(Icon, { type: 'arrow-down' })
                        ),
                        triggerType: 'click'
                    },
                    React.createElement(SelectMenu, {
                        prefix: prefix,
                        value: endVisibleMonth.month(),
                        dataSource: months,
                        onChange: function onChange(value) {
                            return _this2.changeVisibleMonth(endVisibleMonth, value);
                        }
                    })
                ) : React.createElement(
                    'button',
                    {
                        role: 'button',
                        title: endMonthLabel,
                        className: btnCls,
                        onClick: function onClick() {
                            return changeMode('month', 'end');
                        }
                    },
                    endMonthLabel
                ),
                disableChangeMode ? React.createElement(
                    Dropdown,
                    {
                        align: 'tc bc',
                        container: this.selectContainerHandler,
                        trigger: React.createElement(
                            'button',
                            {
                                role: 'button',
                                className: btnCls,
                                title: endYearLabel
                            },
                            endYearLabel,
                            React.createElement(Icon, { type: 'arrow-down' })
                        ),
                        triggerType: 'click'
                    },
                    React.createElement(SelectMenu, {
                        prefix: prefix,
                        value: endVisibleMonth.year(),
                        dataSource: endYears,
                        onChange: function onChange(v) {
                            return _this2.onYearChange(endVisibleMonth, v);
                        }
                    })
                ) : React.createElement(
                    'button',
                    {
                        role: 'button',
                        title: endYearLabel,
                        className: btnCls,
                        onClick: function onClick() {
                            return changeMode('year', 'end');
                        }
                    },
                    endYearLabel
                )
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

    return RangePanelHeader;
}(React.PureComponent), _class.defaultProps = {
    yearRangeOffset: 10
}, _temp2);


export default RangePanelHeader;