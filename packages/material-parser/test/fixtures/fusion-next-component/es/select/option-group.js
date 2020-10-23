import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React from 'react';
import PropTypes from 'prop-types';

/* istanbul ignore file */

/**
 * Select.OptionGroup
 */
var OptionGroup = (_temp = _class = function (_React$Component) {
    _inherits(OptionGroup, _React$Component);

    function OptionGroup() {
        _classCallCheck(this, OptionGroup);

        return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
    }

    OptionGroup.prototype.render = function render() {
        return this.props.children;
    };

    return OptionGroup;
}(React.Component), _class.propTypes = {
    /**
     * 设置分组的文案
     */
    label: PropTypes.node,
    children: PropTypes.any
}, _class._typeMark = 'next_select_option_group', _temp);
OptionGroup.displayName = 'OptionGroup';
export { OptionGroup as default };