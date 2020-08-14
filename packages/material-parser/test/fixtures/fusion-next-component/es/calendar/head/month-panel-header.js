import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import Icon from '../../icon';

var MonthPanelHeader = function (_React$PureComponent) {
    _inherits(MonthPanelHeader, _React$PureComponent);

    function MonthPanelHeader() {
        _classCallCheck(this, MonthPanelHeader);

        return _possibleConstructorReturn(this, _React$PureComponent.apply(this, arguments));
    }

    MonthPanelHeader.prototype.render = function render() {
        var _props = this.props,
            prefix = _props.prefix,
            visibleMonth = _props.visibleMonth,
            locale = _props.locale,
            changeMode = _props.changeMode,
            goPrevYear = _props.goPrevYear,
            goNextYear = _props.goNextYear;

        var yearLabel = visibleMonth.year();
        var btnCls = prefix + 'calendar-btn';

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
                'div',
                { className: prefix + 'calendar-panel-header-full' },
                React.createElement(
                    'button',
                    {
                        role: 'button',
                        title: yearLabel,
                        className: '' + btnCls,
                        onClick: function onClick() {
                            return changeMode('year');
                        }
                    },
                    yearLabel
                )
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

    return MonthPanelHeader;
}(React.PureComponent);

export default MonthPanelHeader;