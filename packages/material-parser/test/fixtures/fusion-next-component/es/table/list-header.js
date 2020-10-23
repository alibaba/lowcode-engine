import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Table.GroupHeader
 * @order 2
 **/
var ListHeader = (_temp = _class = function (_React$Component) {
  _inherits(ListHeader, _React$Component);

  function ListHeader() {
    _classCallCheck(this, ListHeader);

    return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
  }

  ListHeader.prototype.render = function render() {
    return null;
  };

  return ListHeader;
}(React.Component), _class.propTypes = {
  /**
   * 行渲染的逻辑
   */
  cell: PropTypes.oneOfType([PropTypes.element, PropTypes.node, PropTypes.func]),
  /**
   * 是否在Children上面渲染selection
   */
  hasChildrenSelection: PropTypes.bool,
  /**
   * 是否在GroupHeader上面渲染selection
   */
  hasSelection: PropTypes.bool,
  /**
   * 当 dataSouce 里没有 children 时，是否使用内容作为数据
   */
  useFirstLevelDataWhenNoChildren: PropTypes.bool
}, _class.defaultProps = {
  cell: function cell() {
    return '';
  },
  hasSelection: true,
  hasChildrenSelection: false,
  useFirstLevelDataWhenNoChildren: false
}, _class._typeMark = 'listHeader', _temp);
ListHeader.displayName = 'ListHeader';
export { ListHeader as default };