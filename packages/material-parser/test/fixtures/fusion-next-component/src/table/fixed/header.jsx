import React from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import HeaderComponent from '../base/header';

/* eslint-disable react/prefer-stateless-function */
export default class FixedHeader extends React.Component {
    static propTypes = {
        children: PropTypes.any,
        prefix: PropTypes.string,
        className: PropTypes.string,
        colGroup: PropTypes.any,
    };

    static contextTypes = {
        getNode: PropTypes.func,
        onFixedScrollSync: PropTypes.func,
        lockType: PropTypes.oneOf(['left', 'right']),
    };

    componentDidMount() {
        this.context.getNode('header', findDOMNode(this));
    }

    //  这里的 style={{overflow: 'unset'}} 可以删掉，只是为了解决用户js升级但是样式没升级的情况
    render() {
        const { prefix, className, colGroup, ...others } = this.props;
        const { onFixedScrollSync } = this.context;

        return (
            <div className={className} onScroll={onFixedScrollSync}>
                <div
                    className={`${prefix}table-header-inner`}
                    style={{ overflow: 'unset' }}
                >
                    <table>
                        {colGroup}
                        <HeaderComponent {...others} prefix={prefix} />
                    </table>
                </div>
            </div>
        );
    }
}
