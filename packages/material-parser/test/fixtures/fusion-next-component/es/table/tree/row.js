import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Row from '../selection/row';

/* eslint-disable react/prefer-stateless-function */
var TreeRow = (_temp = _class = function (_React$Component) {
    _inherits(TreeRow, _React$Component);

    function TreeRow() {
        _classCallCheck(this, TreeRow);

        return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
    }

    TreeRow.prototype.render = function render() {
        var _classnames;

        /* eslint-disable no-unused-vars*/
        var _props = this.props,
            className = _props.className,
            record = _props.record,
            primaryKey = _props.primaryKey,
            prefix = _props.prefix,
            others = _objectWithoutProperties(_props, ['className', 'record', 'primaryKey', 'prefix']);

        var _context = this.context,
            treeStatus = _context.treeStatus,
            openRowKeys = _context.openRowKeys;

        var cls = classnames((_classnames = {
            hidden: !(treeStatus.indexOf(record[primaryKey]) > -1) && record.__level !== 0
        }, _classnames[prefix + 'table-row-level-' + record.__level] = true, _classnames.opened = openRowKeys.indexOf(record[primaryKey]) > -1, _classnames[className] = className, _classnames));
        return React.createElement(Row, _extends({}, others, {
            record: record,
            className: cls,
            primaryKey: primaryKey,
            prefix: prefix
        }));
    };

    return TreeRow;
}(React.Component), _class.propTypes = _extends({}, Row.propTypes), _class.defaultProps = _extends({}, Row.defaultProps), _class.contextTypes = {
    treeStatus: PropTypes.array,
    openRowKeys: PropTypes.array
}, _temp);
TreeRow.displayName = 'TreeRow';
export { TreeRow as default };