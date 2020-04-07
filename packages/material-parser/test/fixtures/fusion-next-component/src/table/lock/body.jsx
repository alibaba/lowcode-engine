import React from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import FixedBody from '../fixed/body';

/* eslint-disable react/prefer-stateless-function */
export default class LockBody extends React.Component {
    static propTypes = {
        ...FixedBody.propTypes,
    };

    static contextTypes = {
        ...FixedBody.contextTypes,
        getLockNode: PropTypes.func,
        onLockBodyScroll: PropTypes.func,
        lockType: PropTypes.oneOf(['left', 'right']),
    };

    componentDidMount() {
        this.context.getLockNode(
            'body',
            findDOMNode(this),
            this.context.lockType
        );
    }

    onBodyScroll = event => {
        this.context.onLockBodyScroll(event);
    };

    render() {
        const event = {
            onLockScroll: this.onBodyScroll,
        };
        return <FixedBody {...this.props} {...event} />;
    }
}
