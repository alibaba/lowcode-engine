import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp2;

import React from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import BodyComponent from '../base/body';

/* eslint-disable react/prefer-stateless-function */
var FixedBody = (_temp2 = _class = function (_React$Component) {
    _inherits(FixedBody, _React$Component);

    function FixedBody() {
        var _temp, _this, _ret;

        _classCallCheck(this, FixedBody);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.onBodyScroll = function (event) {
            var onFixedScrollSync = _this.context.onFixedScrollSync;
            // sync scroll left to header

            onFixedScrollSync && onFixedScrollSync(event);

            // sync scroll top/left to lock columns
            if ('onLockScroll' in _this.props && typeof _this.props.onLockScroll === 'function') {
                _this.props.onLockScroll(event);
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    FixedBody.prototype.componentDidMount = function componentDidMount() {
        var getNode = this.context.getNode;

        getNode && getNode('body', findDOMNode(this));
    };

    FixedBody.prototype.render = function render() {
        /*eslint-disable no-unused-vars */
        var _props = this.props,
            className = _props.className,
            colGroup = _props.colGroup,
            onLockScroll = _props.onLockScroll,
            others = _objectWithoutProperties(_props, ['className', 'colGroup', 'onLockScroll']);

        var _context = this.context,
            maxBodyHeight = _context.maxBodyHeight,
            fixedHeader = _context.fixedHeader;

        var style = {};
        if (fixedHeader) {
            style.maxHeight = maxBodyHeight;
            style.position = 'relative';
        }
        return React.createElement(
            'div',
            {
                style: style,
                className: className,
                onScroll: this.onBodyScroll
            },
            React.createElement(
                'table',
                null,
                colGroup,
                React.createElement(BodyComponent, _extends({}, others, { colGroup: colGroup }))
            )
        );
    };

    return FixedBody;
}(React.Component), _class.propTypes = {
    children: PropTypes.any,
    prefix: PropTypes.string,
    className: PropTypes.string,
    colGroup: PropTypes.any,
    onLockScroll: PropTypes.func
}, _class.contextTypes = {
    fixedHeader: PropTypes.bool,
    maxBodyHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onFixedScrollSync: PropTypes.func,
    getNode: PropTypes.func
}, _temp2);
FixedBody.displayName = 'FixedBody';
export { FixedBody as default };