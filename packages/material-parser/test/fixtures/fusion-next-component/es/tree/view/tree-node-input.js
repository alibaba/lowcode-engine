import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import Input from '../../input';

var TreeNodeInput = (_temp = _class = function (_Component) {
    _inherits(TreeNodeInput, _Component);

    function TreeNodeInput() {
        _classCallCheck(this, TreeNodeInput);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    TreeNodeInput.prototype.componentDidMount = function componentDidMount() {
        var inputWrapperNode = findDOMNode(this);
        inputWrapperNode.querySelector('input').focus();
    };

    TreeNodeInput.prototype.render = function render() {
        var _props = this.props,
            prefix = _props.prefix,
            others = _objectWithoutProperties(_props, ['prefix']);

        return React.createElement(Input, _extends({
            size: 'small',
            className: prefix + 'tree-node-input'
        }, others));
    };

    return TreeNodeInput;
}(Component), _class.propTypes = {
    prefix: PropTypes.string
}, _temp);
TreeNodeInput.displayName = 'TreeNodeInput';
export { TreeNodeInput as default };