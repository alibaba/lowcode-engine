import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp2;

import React from 'react';
import PropTypes from 'prop-types';
import Row from '../base/row';

var LockRow = (_temp2 = _class = function (_React$Component) {
    _inherits(LockRow, _React$Component);

    function LockRow() {
        var _temp, _this, _ret;

        _classCallCheck(this, LockRow);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.onMouseEnter = function (record, index, e) {
            var onRowMouseEnter = _this.context.onRowMouseEnter;
            var onMouseEnter = _this.props.onMouseEnter;

            onRowMouseEnter && onRowMouseEnter(record, index, e);
            onMouseEnter(record, index, e);
        }, _this.onMouseLeave = function (record, index, e) {
            var onRowMouseLeave = _this.context.onRowMouseLeave;
            var onMouseLeave = _this.props.onMouseLeave;

            onRowMouseLeave && onRowMouseLeave(record, index, e);
            onMouseLeave(record, index, e);
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    LockRow.prototype.render = function render() {
        /* eslint-disable no-unused-vars*/
        return React.createElement(Row, _extends({}, this.props, {
            onMouseEnter: this.onMouseEnter,
            onMouseLeave: this.onMouseLeave
        }));
    };

    return LockRow;
}(React.Component), _class.propTypes = _extends({}, Row.propTypes), _class.contextTypes = {
    onRowMouseEnter: PropTypes.func,
    onRowMouseLeave: PropTypes.func
}, _class.defaultProps = _extends({}, Row.defaultProps), _temp2);
LockRow.displayName = 'LockRow';
export { LockRow as default };