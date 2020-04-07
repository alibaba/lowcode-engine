import React from 'react';
import PropTypes from 'prop-types';
import Row from '../base/row';

export default class LockRow extends React.Component {
    static propTypes = {
        ...Row.propTypes,
    };

    static contextTypes = {
        onRowMouseEnter: PropTypes.func,
        onRowMouseLeave: PropTypes.func,
    };

    static defaultProps = {
        ...Row.defaultProps,
    };

    onMouseEnter = (record, index, e) => {
        const { onRowMouseEnter } = this.context;
        const { onMouseEnter } = this.props;
        onRowMouseEnter && onRowMouseEnter(record, index, e);
        onMouseEnter(record, index, e);
    };

    onMouseLeave = (record, index, e) => {
        const { onRowMouseLeave } = this.context;
        const { onMouseLeave } = this.props;
        onRowMouseLeave && onRowMouseLeave(record, index, e);
        onMouseLeave(record, index, e);
    };

    render() {
        /* eslint-disable no-unused-vars*/
        return (
            <Row
                {...this.props}
                onMouseEnter={this.onMouseEnter}
                onMouseLeave={this.onMouseLeave}
            />
        );
    }
}
