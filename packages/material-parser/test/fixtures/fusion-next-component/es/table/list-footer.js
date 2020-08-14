import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React from 'react';
import PropTypes from 'prop-types';

/* istanbul ignore file */
/**
 * Table.GroupFooter
 * @order 3
 **/
var ListFooter = (_temp = _class = function (_React$Component) {
    _inherits(ListFooter, _React$Component);

    function ListFooter() {
        _classCallCheck(this, ListFooter);

        return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
    }

    ListFooter.prototype.render = function render() {
        return null;
    };

    return ListFooter;
}(React.Component), _class.propTypes = {
    /**
     * 行渲染的逻辑
     */
    cell: PropTypes.oneOfType([PropTypes.element, PropTypes.node, PropTypes.func])
}, _class.defaultProps = {
    cell: function cell() {
        return '';
    }
}, _class._typeMark = 'listFooter', _temp);
ListFooter.displayName = 'ListFooter';
export { ListFooter as default };