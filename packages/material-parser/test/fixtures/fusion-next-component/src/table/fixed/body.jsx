import React from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import BodyComponent from '../base/body';

/* eslint-disable react/prefer-stateless-function */
export default class FixedBody extends React.Component {
    static propTypes = {
        children: PropTypes.any,
        prefix: PropTypes.string,
        className: PropTypes.string,
        colGroup: PropTypes.any,
        onLockScroll: PropTypes.func,
    };

    static contextTypes = {
        fixedHeader: PropTypes.bool,
        maxBodyHeight: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
        ]),
        onFixedScrollSync: PropTypes.func,
        getNode: PropTypes.func,
    };

    componentDidMount() {
        const { getNode } = this.context;
        getNode && getNode('body', findDOMNode(this));
    }

    onBodyScroll = event => {
        const { onFixedScrollSync } = this.context;
        // sync scroll left to header
        onFixedScrollSync && onFixedScrollSync(event);

        // sync scroll top/left to lock columns
        if (
            'onLockScroll' in this.props &&
            typeof this.props.onLockScroll === 'function'
        ) {
            this.props.onLockScroll(event);
        }
    };

    render() {
        /*eslint-disable no-unused-vars */
        const { className, colGroup, onLockScroll, ...others } = this.props;
        const { maxBodyHeight, fixedHeader } = this.context;
        const style = {};
        if (fixedHeader) {
            style.maxHeight = maxBodyHeight;
            style.position = 'relative';
        }
        return (
            <div
                style={style}
                className={className}
                onScroll={this.onBodyScroll}
            >
                <table>
                    {colGroup}
                    <BodyComponent {...others} colGroup={colGroup} />
                </table>
            </div>
        );
    }
}
