import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import Icon from '../../icon';

var YearPanelHeader = function (_React$PureComponent) {
    _inherits(YearPanelHeader, _React$PureComponent);

    function YearPanelHeader() {
        var _temp, _this, _ret;

        _classCallCheck(this, YearPanelHeader);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$PureComponent.call.apply(_React$PureComponent, [this].concat(args))), _this), _this.getDecadeLabel = function (date) {
            var year = date.year();
            var start = parseInt(year / 10, 10) * 10;
            var end = start + 9;
            return start + '-' + end;
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    YearPanelHeader.prototype.render = function render() {
        var _props = this.props,
            prefix = _props.prefix,
            visibleMonth = _props.visibleMonth,
            locale = _props.locale,
            goPrevDecade = _props.goPrevDecade,
            goNextDecade = _props.goNextDecade;

        var decadeLable = this.getDecadeLabel(visibleMonth);
        var btnCls = prefix + 'calendar-btn';

        return React.createElement(
            'div',
            { className: prefix + 'calendar-panel-header' },
            React.createElement(
                'button',
                {
                    role: 'button',
                    title: locale.prevDecade,
                    className: btnCls + ' ' + btnCls + '-prev-decade',
                    onClick: goPrevDecade
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
                        title: decadeLable,
                        className: btnCls
                    },
                    decadeLable
                )
            ),
            React.createElement(
                'button',
                {
                    role: 'button',
                    title: locale.nextDecade,
                    className: btnCls + ' ' + btnCls + '-next-decade',
                    onClick: goNextDecade
                },
                React.createElement(Icon, { type: 'arrow-double-right' })
            )
        );
    };

    return YearPanelHeader;
}(React.PureComponent);

export default YearPanelHeader;