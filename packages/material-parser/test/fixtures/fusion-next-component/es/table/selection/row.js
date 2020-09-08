import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Row from '../expanded/row';

/* eslint-disable react/prefer-stateless-function */
var SelectionRow = (_temp = _class = function (_React$Component) {
    _inherits(SelectionRow, _React$Component);

    function SelectionRow() {
        _classCallCheck(this, SelectionRow);

        return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
    }

    SelectionRow.prototype.render = function render() {
        var _classnames;

        /* eslint-disable no-unused-vars*/
        var _props = this.props,
            className = _props.className,
            record = _props.record,
            primaryKey = _props.primaryKey;
        var selectedRowKeys = this.context.selectedRowKeys;

        var cls = classnames((_classnames = {
            selected: selectedRowKeys.indexOf(record[primaryKey]) > -1
        }, _classnames[className] = className, _classnames));
        return React.createElement(Row, _extends({}, this.props, { className: cls }));
    };

    return SelectionRow;
}(React.Component), _class.propTypes = _extends({}, Row.propTypes), _class.defaultProps = _extends({}, Row.defaultProps), _class.contextTypes = {
    selectedRowKeys: PropTypes.array
}, _temp);
SelectionRow.displayName = 'SelectionRow';
export { SelectionRow as default };