import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp2;

import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../../icon';
import { KEYCODE } from '../../util';
import CellComponent from '../base/cell';

var TreeCell = (_temp2 = _class = function (_React$Component) {
    _inherits(TreeCell, _React$Component);

    function TreeCell() {
        var _temp, _this, _ret;

        _classCallCheck(this, TreeCell);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.onTreeNodeClick = function (record, e) {
            e.stopPropagation();
            _this.context.onTreeNodeClick(record);
        }, _this.expandedKeydown = function (record, e) {
            e.preventDefault();
            e.stopPropagation();

            if (e.keyCode === KEYCODE.ENTER) {
                _this.onTreeNodeClick(record, e);
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    TreeCell.prototype.render = function render() {
        var _this2 = this;

        var _props = this.props,
            colIndex = _props.colIndex,
            record = _props.record,
            prefix = _props.prefix,
            primaryKey = _props.primaryKey,
            locale = _props.locale,
            rtl = _props.rtl,
            children = _props.children;
        var _context = this.context,
            openRowKeys = _context.openTreeRowKeys,
            indent = _context.indent,
            isTree = _context.isTree,
            rowSelection = _context.rowSelection;

        var treeArrowNodeIndex = rowSelection ? 1 : 0;
        var firstCellStyle = void 0,
            treeArrowNode = void 0;
        if (colIndex === treeArrowNodeIndex) {
            var treeArrowType = void 0;
            if (isTree) {
                var _firstCellStyle;

                var paddingType = rtl ? 'paddingRight' : 'paddingLeft';
                firstCellStyle = (_firstCellStyle = {}, _firstCellStyle[paddingType] = indent * (record.__level + 1), _firstCellStyle);
                treeArrowNode = React.createElement(Icon, {
                    size: 'xs',
                    rtl: rtl,
                    className: prefix + 'table-tree-placeholder'
                });
                if (record.children && record.children.length) {
                    var hasExpanded = openRowKeys.indexOf(record[primaryKey]) > -1;

                    treeArrowType = hasExpanded ? 'arrow-down' : 'arrow-right';

                    treeArrowNode = React.createElement(Icon, {
                        className: prefix + 'table-tree-arrow',
                        type: treeArrowType,
                        size: 'xs',
                        rtl: rtl,
                        onClick: function onClick(e) {
                            return _this2.onTreeNodeClick(record, e);
                        },
                        onKeyDown: function onKeyDown(e) {
                            return _this2.expandedKeydown(record, e);
                        },
                        role: 'button',
                        tabIndex: '0',
                        'aria-expanded': hasExpanded,
                        'aria-label': hasExpanded ? locale.expanded : locale.folded
                    });
                }
            }
        }
        return React.createElement(
            CellComponent,
            _extends({}, this.props, {
                innerStyle: firstCellStyle,
                isIconLeft: true
            }),
            children,
            treeArrowNode
        );
    };

    return TreeCell;
}(React.Component), _class.propTypes = _extends({
    indent: PropTypes.number,
    locale: PropTypes.object
}, CellComponent.propTypes), _class.defaultProps = _extends({}, CellComponent.defaultProps, {
    component: 'td',
    indent: 20
}), _class.contextTypes = {
    openTreeRowKeys: PropTypes.array,
    indent: PropTypes.number,
    onTreeNodeClick: PropTypes.func,
    isTree: PropTypes.bool,
    rowSelection: PropTypes.object
}, _temp2);
TreeCell.displayName = 'TreeCell';
export { TreeCell as default };