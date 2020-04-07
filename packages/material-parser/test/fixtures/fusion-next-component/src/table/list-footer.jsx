import React from 'react';
import PropTypes from 'prop-types';

/* istanbul ignore file */
/**
 * Table.GroupFooter
 * @order 3
 **/
export default class ListFooter extends React.Component {
    static propTypes = {
        /**
         * 行渲染的逻辑
         */
        cell: PropTypes.oneOfType([
            PropTypes.element,
            PropTypes.node,
            PropTypes.func,
        ]),
    };

    static defaultProps = {
        cell: () => '',
    };

    static _typeMark = 'listFooter';

    render() {
        return null;
    }
}
