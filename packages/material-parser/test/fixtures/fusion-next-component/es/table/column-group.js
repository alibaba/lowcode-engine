import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Table.ColumnGroup
 * @order 1
 **/
var ColumnGroup = (_temp = _class = function (_React$Component) {
    _inherits(ColumnGroup, _React$Component);

    function ColumnGroup() {
        _classCallCheck(this, ColumnGroup);

        return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
    }

    ColumnGroup.prototype.getChildContext = function getChildContext() {
        return {
            parent: this
        };
    };

    ColumnGroup.prototype.render = function render() {
        return null;
    };

    return ColumnGroup;
}(React.Component), _class.propTypes = {
    /**
     * 表头显示的内容
     */
    title: PropTypes.oneOfType([PropTypes.element, PropTypes.node, PropTypes.func])
}, _class.childContextTypes = {
    parent: PropTypes.any
}, _class.defaultProps = {
    title: 'column-group'
}, _class._typeMark = 'columnGroup', _temp);
ColumnGroup.displayName = 'ColumnGroup';
export { ColumnGroup as default };