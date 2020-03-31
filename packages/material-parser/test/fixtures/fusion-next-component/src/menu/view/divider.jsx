import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

/**
 * Menu.Divider
 * @order 6
 */
export default class Divider extends Component {
    static menuChildType = 'divider';

    static propTypes = {
        root: PropTypes.object,
        className: PropTypes.string,
    };

    render() {
        const { root, className, ...others } = this.props;
        const { prefix } = root.props;

        const newClassName = cx({
            [`${prefix}menu-divider`]: true,
            [className]: !!className,
        });

        return <li role="separator" className={newClassName} {...others} />;
    }
}
