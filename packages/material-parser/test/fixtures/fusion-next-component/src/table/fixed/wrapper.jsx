import React from 'react';
import PropTypes from 'prop-types';

/* eslint-disable react/prefer-stateless-function */
export default class FixedWrapper extends React.Component {
    static propTypes = {
        children: PropTypes.any,
        prefix: PropTypes.string,
        colGroup: PropTypes.any,
        wrapperContent: PropTypes.any,
    };
    render() {
        const { children, wrapperContent, prefix } = this.props;
        return (
            <div className={`${prefix}table-inner`}>
                {children}
                {wrapperContent}
            </div>
        );
    }
}
