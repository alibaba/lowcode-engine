import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React from 'react';
import PropTypes from 'prop-types';

/* eslint-disable react/prefer-stateless-function */
var FixedWrapper = (_temp = _class = function (_React$Component) {
    _inherits(FixedWrapper, _React$Component);

    function FixedWrapper() {
        _classCallCheck(this, FixedWrapper);

        return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
    }

    FixedWrapper.prototype.render = function render() {
        var _props = this.props,
            children = _props.children,
            wrapperContent = _props.wrapperContent,
            prefix = _props.prefix;

        return React.createElement(
            'div',
            { className: prefix + 'table-inner' },
            children,
            wrapperContent
        );
    };

    return FixedWrapper;
}(React.Component), _class.propTypes = {
    children: PropTypes.any,
    prefix: PropTypes.string,
    colGroup: PropTypes.any,
    wrapperContent: PropTypes.any
}, _temp);
FixedWrapper.displayName = 'FixedWrapper';
export { FixedWrapper as default };