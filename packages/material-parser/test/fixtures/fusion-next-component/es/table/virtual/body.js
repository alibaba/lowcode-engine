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
var VirtualBody = (_temp2 = _class = function (_React$Component) {
    _inherits(VirtualBody, _React$Component);

    function VirtualBody() {
        var _temp, _this, _ret;

        _classCallCheck(this, VirtualBody);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.tableRef = function (table) {
            _this.tableNode = table;
        }, _this.virtualScrollRef = function (virtualScroll) {
            _this.virtualScrollNode = virtualScroll;
        }, _this.onScroll = function (current) {
            // for fixed
            _this.context.onFixedScrollSync(current);
            // for lock
            _this.context.onLockBodyScroll(current);
            // for virtual
            _this.context.onVirtualScroll();
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    VirtualBody.prototype.componentDidMount = function componentDidMount() {
        var bodyNode = findDOMNode(this);
        // // for fixed
        this.context.getNode('body', bodyNode);
        // for virtual
        this.context.getBodyNode(bodyNode, this.context.lockType);
        // for lock
        this.context.getLockNode('body', bodyNode, this.context.lockType);
    };

    VirtualBody.prototype.render = function render() {
        var _props = this.props,
            prefix = _props.prefix,
            className = _props.className,
            colGroup = _props.colGroup,
            others = _objectWithoutProperties(_props, ['prefix', 'className', 'colGroup']);

        var _context = this.context,
            maxBodyHeight = _context.maxBodyHeight,
            bodyHeight = _context.bodyHeight,
            innerTop = _context.innerTop;


        return React.createElement(
            'div',
            {
                style: { maxHeight: maxBodyHeight },
                className: className,
                onScroll: this.onScroll
            },
            React.createElement(
                'div',
                {
                    style: {
                        height: bodyHeight,
                        overflow: 'hidden',
                        position: 'relative'
                    },
                    ref: this.virtualScrollRef
                },
                React.createElement(
                    'div',
                    {
                        style: {
                            height: '100%',
                            position: 'relative',
                            transform: 'translateY(' + innerTop + 'px)'
                        }
                    },
                    React.createElement(
                        'table',
                        { ref: this.tableRef },
                        colGroup,
                        React.createElement(BodyComponent, _extends({}, others, { prefix: prefix }))
                    )
                )
            )
        );
    };

    return VirtualBody;
}(React.Component), _class.propTypes = {
    children: PropTypes.any,
    prefix: PropTypes.string,
    className: PropTypes.string,
    colGroup: PropTypes.any
}, _class.contextTypes = {
    maxBodyHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onBodyScroll: PropTypes.func,
    onFixedScrollSync: PropTypes.func,
    onVirtualScroll: PropTypes.func,
    onLockBodyScroll: PropTypes.func,
    bodyHeight: PropTypes.number,
    innerTop: PropTypes.number,
    getNode: PropTypes.func,
    getBodyNode: PropTypes.func,
    getLockNode: PropTypes.func,
    lockType: PropTypes.oneOf(['left', 'right'])
}, _temp2);
VirtualBody.displayName = 'VirtualBody';
export { VirtualBody as default };