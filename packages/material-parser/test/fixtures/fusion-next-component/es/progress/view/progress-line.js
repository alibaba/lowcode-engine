import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

var Line = (_temp = _class = function (_React$PureComponent) {
    _inherits(Line, _React$PureComponent);

    function Line() {
        _classCallCheck(this, Line);

        return _possibleConstructorReturn(this, _React$PureComponent.apply(this, arguments));
    }

    Line.prototype.render = function render() {
        var _classNames, _classNames2;

        var _props = this.props,
            prefix = _props.prefix,
            size = _props.size,
            state = _props.state,
            color = _props.color,
            percent = _props.percent,
            progressive = _props.progressive,
            hasBorder = _props.hasBorder,
            textRender = _props.textRender,
            className = _props.className,
            rtl = _props.rtl,
            backgroundColor = _props.backgroundColor,
            others = _objectWithoutProperties(_props, ['prefix', 'size', 'state', 'color', 'percent', 'progressive', 'hasBorder', 'textRender', 'className', 'rtl', 'backgroundColor']);

        var suffixText = textRender(percent, { rtl: rtl });

        var wrapCls = classNames((_classNames = {}, _classNames[prefix + 'progress-line'] = true, _classNames[prefix + 'progress-line-show-info'] = suffixText, _classNames[prefix + 'progress-line-show-border'] = hasBorder, _classNames['' + (prefix + size)] = size, _classNames[className] = className, _classNames));
        var lineCls = classNames((_classNames2 = {}, _classNames2[prefix + 'progress-line-overlay'] = true, _classNames2[prefix + 'progress-line-overlay-' + state] = !color && !progressive && state, _classNames2[prefix + 'progress-line-overlay-started'] = !color && progressive && percent <= 30, _classNames2[prefix + 'progress-line-overlay-middle'] = !color && progressive && percent > 30 && percent < 80, _classNames2[prefix + 'progress-line-overlay-finishing'] = !color && progressive && percent >= 80, _classNames2));

        var lineStyle = {
            width: (percent > 100 ? 100 : percent < 0 ? 0 : percent) + '%',
            backgroundColor: color
        };
        var underlayStyle = { backgroundColor: backgroundColor };

        return React.createElement(
            'div',
            _extends({
                dir: rtl ? 'rtl' : undefined,
                role: 'progressbar',
                'aria-valuenow': percent,
                'aria-valuemin': '0',
                'aria-valuemax': '100',
                className: wrapCls
            }, others),
            React.createElement(
                'div',
                { className: prefix + 'progress-line-container' },
                React.createElement(
                    'div',
                    {
                        className: prefix + 'progress-line-underlay',
                        style: underlayStyle
                    },
                    React.createElement('div', { className: lineCls, style: lineStyle })
                )
            ),
            suffixText ? React.createElement(
                'div',
                { className: prefix + 'progress-line-text' },
                suffixText
            ) : null
        );
    };

    return Line;
}(React.PureComponent), _class.propTypes = {
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    percent: PropTypes.number,
    state: PropTypes.oneOf(['normal', 'success', 'error']),
    progressive: PropTypes.bool,
    hasBorder: PropTypes.bool,
    textRender: PropTypes.func,
    color: PropTypes.string,
    backgroundColor: PropTypes.string,
    rtl: PropTypes.bool,
    prefix: PropTypes.string,
    className: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
}, _temp);
export { Line as default };