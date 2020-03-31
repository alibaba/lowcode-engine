import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import Input from '../../input';

export default class TreeNodeInput extends Component {
    static propTypes = {
        prefix: PropTypes.string,
    };

    componentDidMount() {
        const inputWrapperNode = findDOMNode(this);
        inputWrapperNode.querySelector('input').focus();
    }

    render() {
        const { prefix, ...others } = this.props;

        return (
            <Input
                size="small"
                className={`${prefix}tree-node-input`}
                {...others}
            />
        );
    }
}
