import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp2;

import React from 'react';
import moment from 'moment';
import Button from '../../button';
import { func } from '../../util';
import { PANEL } from '../util';

var PanelFooter = (_temp2 = _class = function (_React$PureComponent) {
    _inherits(PanelFooter, _React$PureComponent);

    function PanelFooter() {
        var _temp, _this, _ret;

        _classCallCheck(this, PanelFooter);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$PureComponent.call.apply(_React$PureComponent, [this].concat(args))), _this), _this.changePanel = function () {
            var _PANEL$DATE$PANEL$TIM;

            var targetPanel = (_PANEL$DATE$PANEL$TIM = {}, _PANEL$DATE$PANEL$TIM[PANEL.DATE] = PANEL.TIME, _PANEL$DATE$PANEL$TIM[PANEL.TIME] = PANEL.DATE, _PANEL$DATE$PANEL$TIM)[_this.props.panel];
            _this.props.onPanelChange(targetPanel);
        }, _this.createRanges = function (ranges) {
            if (!ranges || ranges.length === 0) return null;
            var _this$props = _this.props,
                onOk = _this$props.onOk,
                prefix = _this$props.prefix;


            return React.createElement(
                'div',
                { className: prefix + 'date-picker-panel-tools' },
                ranges.map(function (_ref) {
                    var label = _ref.label,
                        _ref$value = _ref.value,
                        value = _ref$value === undefined ? [] : _ref$value,
                        onChange = _ref.onChange;

                    var handleClick = function handleClick() {
                        onChange(value.map(function (v) {
                            return moment(v);
                        }));
                        onOk();
                    };
                    return React.createElement(
                        Button,
                        {
                            key: label,
                            text: true,
                            size: 'small',
                            type: 'primary',
                            onClick: handleClick
                        },
                        label
                    );
                })
            );
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    PanelFooter.prototype.render = function render() {
        var _PANEL$DATE$PANEL$TIM2;

        var _props = this.props,
            prefix = _props.prefix,
            locale = _props.locale,
            panel = _props.panel,
            value = _props.value,
            ranges = _props.ranges,
            disabledOk = _props.disabledOk,
            onPanelChange = _props.onPanelChange,
            onOk = _props.onOk;

        var panelBtnLabel = (_PANEL$DATE$PANEL$TIM2 = {}, _PANEL$DATE$PANEL$TIM2[PANEL.DATE] = locale.selectTime, _PANEL$DATE$PANEL$TIM2[PANEL.TIME] = locale.selectDate, _PANEL$DATE$PANEL$TIM2)[panel];

        var sharedBtnProps = {
            size: 'small',
            type: 'primary',
            disabled: !value
        };

        return React.createElement(
            'div',
            { className: prefix + 'date-picker-panel-footer' },
            this.createRanges(ranges),
            onPanelChange ? React.createElement(
                Button,
                _extends({}, sharedBtnProps, { text: true, onClick: this.changePanel }),
                panelBtnLabel
            ) : null,
            React.createElement(
                Button,
                _extends({}, sharedBtnProps, {
                    disabled: disabledOk || !value,
                    onClick: onOk
                }),
                locale.ok
            )
        );
    };

    return PanelFooter;
}(React.PureComponent), _class.defaultProps = {
    // onPanelChange: func.noop,
    onOk: func.noop
}, _temp2);


export default PanelFooter;