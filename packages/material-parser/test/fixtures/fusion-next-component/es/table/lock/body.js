import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp2;

import React from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import FixedBody from '../fixed/body';

/* eslint-disable react/prefer-stateless-function */
var LockBody = (_temp2 = _class = function (_React$Component) {
    _inherits(LockBody, _React$Component);

    function LockBody() {
        var _temp, _this, _ret;

        _classCallCheck(this, LockBody);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.onBodyScroll = function (event) {
            _this.context.onLockBodyScroll(event);
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    LockBody.prototype.componentDidMount = function componentDidMount() {
        this.context.getLockNode('body', findDOMNode(this), this.context.lockType);
    };

    LockBody.prototype.render = function render() {
        var event = {
            onLockScroll: this.onBodyScroll
        };
        return React.createElement(FixedBody, _extends({}, this.props, event));
    };

    return LockBody;
}(React.Component), _class.propTypes = _extends({}, FixedBody.propTypes), _class.contextTypes = _extends({}, FixedBody.contextTypes, {
    getLockNode: PropTypes.func,
    onLockBodyScroll: PropTypes.func,
    lockType: PropTypes.oneOf(['left', 'right'])
}), _temp2);
LockBody.displayName = 'LockBody';
export { LockBody as default };