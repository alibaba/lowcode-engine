import React from 'react';
import PropTypes from 'prop-types';

/* istanbul ignore file */

/**
 * Select.Option
 */
export default class Option extends React.Component {
    static propTypes = {
        /**
         * 选项值
         */
        value: PropTypes.any.isRequired,
        /**
         * 是否禁用
         */
        disabled: PropTypes.bool,
        children: PropTypes.any,
    };

    static _typeMark = 'next_select_option';

    render() {
        return this.props.children;
    }
}
