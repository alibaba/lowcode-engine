import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import classnames from 'classnames';
import Icon from '../../icon';
import { isDisabledDate, YEAR_TABLE_COL_COUNT, YEAR_TABLE_ROW_COUNT } from '../utils';

var YearTable = function (_React$PureComponent) {
    _inherits(YearTable, _React$PureComponent);

    function YearTable() {
        _classCallCheck(this, YearTable);

        return _possibleConstructorReturn(this, _React$PureComponent.apply(this, arguments));
    }

    YearTable.prototype.onYearCellClick = function onYearCellClick(date) {
        this.props.onSelectYear(date, 'month');
    };

    YearTable.prototype.render = function render() {
        var _props = this.props,
            prefix = _props.prefix,
            value = _props.value,
            today = _props.today,
            visibleMonth = _props.visibleMonth,
            locale = _props.locale,
            disabledDate = _props.disabledDate,
            goPrevDecade = _props.goPrevDecade,
            goNextDecade = _props.goNextDecade,
            yearCellRender = _props.yearCellRender;

        var currentYear = today.year();
        var selectedYear = value ? value.year() : null;
        var visibleYear = visibleMonth.year();
        var startYear = Math.floor(visibleYear / 10) * 10;

        var yearElements = [];
        var counter = 0;

        var lastRowIndex = YEAR_TABLE_ROW_COUNT - 1;
        var lastColIndex = YEAR_TABLE_COL_COUNT - 1;

        for (var i = 0; i < YEAR_TABLE_ROW_COUNT; i++) {
            var rowElements = [];
            for (var j = 0; j < YEAR_TABLE_COL_COUNT; j++) {
                var _classnames;

                var content = void 0;
                var year = void 0;
                var isDisabled = false;
                var onClick = void 0;
                var title = void 0;

                if (i === 0 && j === 0) {
                    title = locale.prevDecade;
                    onClick = goPrevDecade;
                    content = React.createElement(Icon, { type: 'arrow-left', size: 'xs' });
                } else if (i === lastRowIndex && j === lastColIndex) {
                    title = locale.nextDecade;
                    onClick = goNextDecade;
                    content = React.createElement(Icon, { type: 'arrow-right', size: 'xs' });
                } else {
                    year = startYear + counter++;
                    title = year;
                    var yearDate = visibleMonth.clone().year(year);
                    isDisabled = isDisabledDate(yearDate, disabledDate, 'year');

                    !isDisabled && (onClick = this.onYearCellClick.bind(this, yearDate));

                    content = yearCellRender ? yearCellRender(yearDate) : year;
                }

                var isSelected = year === selectedYear;

                var classNames = classnames((_classnames = {}, _classnames[prefix + 'calendar-cell'] = true, _classnames[prefix + 'calendar-cell-current'] = year === currentYear, _classnames[prefix + 'selected'] = isSelected, _classnames[prefix + 'disabled'] = isDisabled, _classnames));

                rowElements.push(React.createElement(
                    'td',
                    { key: i + '-' + j, className: classNames, role: 'cell' },
                    React.createElement(
                        'div',
                        {
                            className: prefix + 'calendar-year',
                            onClick: onClick,
                            title: title,
                            'aria-disabled': isDisabled ? 'true' : 'false',
                            'aria-selected': isSelected ? 'true' : 'false'
                        },
                        content
                    )
                ));
            }
            yearElements.push(React.createElement(
                'tr',
                { key: i, role: 'row' },
                rowElements
            ));
        }
        return React.createElement(
            'table',
            { className: prefix + 'calendar-table', role: 'grid' },
            React.createElement(
                'tbody',
                { className: prefix + 'calendar-tbody', role: 'rowgroup' },
                yearElements
            )
        );
    };

    return YearTable;
}(React.PureComponent);

export default YearTable;