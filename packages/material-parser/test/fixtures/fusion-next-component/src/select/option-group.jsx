import React from 'react';
import PropTypes from 'prop-types';

/* istanbul ignore file */

/**
 * Select.OptionGroup
 */
export default class OptionGroup extends React.Component {
    static propTypes = {
        /**
         * 设置分组的文案
         */
        label: PropTypes.node,
        children: PropTypes.any,
    };

    static _typeMark = 'next_select_option_group';

    render() {
        return this.props.children;
    }
}
