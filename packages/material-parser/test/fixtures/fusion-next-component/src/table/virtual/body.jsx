import React from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import BodyComponent from '../base/body';

/* eslint-disable react/prefer-stateless-function */
export default class VirtualBody extends React.Component {
    static propTypes = {
        children: PropTypes.any,
        prefix: PropTypes.string,
        className: PropTypes.string,
        colGroup: PropTypes.any,
    };

    static contextTypes = {
        maxBodyHeight: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
        ]),
        onBodyScroll: PropTypes.func,
        onFixedScrollSync: PropTypes.func,
        onVirtualScroll: PropTypes.func,
        onLockBodyScroll: PropTypes.func,
        bodyHeight: PropTypes.number,
        innerTop: PropTypes.number,
        getNode: PropTypes.func,
        getBodyNode: PropTypes.func,
        getLockNode: PropTypes.func,
        lockType: PropTypes.oneOf(['left', 'right']),
    };

    componentDidMount() {
        const bodyNode = findDOMNode(this);
        // // for fixed
        this.context.getNode('body', bodyNode);
        // for virtual
        this.context.getBodyNode(bodyNode, this.context.lockType);
        // for lock
        this.context.getLockNode('body', bodyNode, this.context.lockType);
    }

    tableRef = table => {
        this.tableNode = table;
    };

    virtualScrollRef = virtualScroll => {
        this.virtualScrollNode = virtualScroll;
    };

    onScroll = current => {
        // for fixed
        this.context.onFixedScrollSync(current);
        // for lock
        this.context.onLockBodyScroll(current);
        // for virtual
        this.context.onVirtualScroll();
    };

    render() {
        const { prefix, className, colGroup, ...others } = this.props;
        const { maxBodyHeight, bodyHeight, innerTop } = this.context;

        return (
            <div
                style={{ maxHeight: maxBodyHeight }}
                className={className}
                onScroll={this.onScroll}
            >
                <div
                    style={{
                        height: bodyHeight,
                        overflow: 'hidden',
                        position: 'relative',
                    }}
                    ref={this.virtualScrollRef}
                >
                    <div
                        style={{
                            height: '100%',
                            position: 'relative',
                            transform: `translateY(${innerTop}px)`,
                        }}
                    >
                        <table ref={this.tableRef}>
                            {colGroup}
                            <BodyComponent {...others} prefix={prefix} />
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}
