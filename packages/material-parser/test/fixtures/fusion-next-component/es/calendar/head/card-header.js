import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp2;

import React from 'react';
import PropTypes from 'prop-types';
import Select from '../../select';
import Radio from '../../radio';

var CardHeader = (_temp2 = _class = function (_React$PureComponent) {
    _inherits(CardHeader, _React$PureComponent);

    function CardHeader() {
        var _temp, _this, _ret;

        _classCallCheck(this, CardHeader);

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
        }, _this.onModePanelChange = function (mode) {
            _this.props.changeMode(mode);
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    CardHeader.prototype.getYearSelect = function getYearSelect(year) {
        var _props = this.props,
            prefix = _props.prefix,
            yearRangeOffset = _props.yearRangeOffset,
            _props$yearRange = _props.yearRange,
            yearRange = _props$yearRange === undefined ? [] : _props$yearRange,
            locale = _props.locale;
        var startYear = yearRange[0],
            endYear = yearRange[1];

        if (!startYear || !endYear) {
            startYear = year - yearRangeOffset;
            endYear = year + yearRangeOffset;
        }

        var options = [];
        for (var i = startYear; i <= endYear; i++) {
            options.push(React.createElement(
                Select.Option,
                { key: i, value: i },
                i
            ));
        }

        return React.createElement(
            Select,
            {
                prefix: prefix,
                value: year,
                'aria-label': locale.yearSelectAriaLabel,
                onChange: this.onYearChange,
                popupContainer: this.selectContainerHandler
            },
            options
        );
    };

    CardHeader.prototype.getMonthSelect = function getMonthSelect(month) {
        var _props2 = this.props,
            prefix = _props2.prefix,
            momentLocale = _props2.momentLocale,
            locale = _props2.locale;

        var localeMonths = momentLocale.monthsShort();
        var options = [];
        for (var i = 0; i < 12; i++) {
            options.push(React.createElement(
                Select.Option,
                { key: i, value: i },
                localeMonths[i]
            ));
        }
        return React.createElement(
            Select,
            {
                'aria-label': locale.monthSelectAriaLabel,
                prefix: prefix,
                value: month,
                onChange: this.changeVisibleMonth,
                popupContainer: this.selectContainerHandler
            },
            options
        );
    };

    CardHeader.prototype.render = function render() {
        var _props3 = this.props,
            prefix = _props3.prefix,
            mode = _props3.mode,
            locale = _props3.locale,
            visibleMonth = _props3.visibleMonth;


        var yearSelect = this.getYearSelect(visibleMonth.year());
        var monthSelect = mode === 'month' ? null : this.getMonthSelect(visibleMonth.month());
        var panelSelect = React.createElement(
            Radio.Group,
            {
                shape: 'button',
                size: 'medium',
                value: mode,
                onChange: this.onModePanelChange
            },
            React.createElement(
                Radio,
                { value: 'date' },
                locale.month
            ),
            React.createElement(
                Radio,
                { value: 'month' },
                locale.year
            )
        );

        return React.createElement(
            'div',
            { className: prefix + 'calendar-header' },
            yearSelect,
            monthSelect,
            panelSelect
        );
    };

    return CardHeader;
}(React.PureComponent), _class.propTypes = {
    yearRange: PropTypes.arrayOf(PropTypes.number),
    yearRangeOffset: PropTypes.number,
    locale: PropTypes.object
}, _class.defaultProps = {
    yearRangeOffset: 10
}, _temp2);


export default CardHeader;