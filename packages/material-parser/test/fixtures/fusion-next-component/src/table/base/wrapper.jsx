import React, { Component } from 'react';
import PropTypes from 'prop-types';

/* eslint-disable react/prefer-stateless-function */
export default class Wrapper extends Component {
    render() {
        const { colGroup, children, component: Tag } = this.props;
        return (
            <Tag role="table">
                {colGroup}
                {children}
            </Tag>
        );
    }
}

Wrapper.defaultProps = {
    component: 'table',
};

Wrapper.propTypes = {
    children: PropTypes.any,
    prefix: PropTypes.string,
    colGroup: PropTypes.any,
    component: PropTypes.string,
};
