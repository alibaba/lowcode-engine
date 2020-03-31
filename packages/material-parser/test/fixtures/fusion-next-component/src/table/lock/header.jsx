import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import FixedHeader from '../fixed/header';

export default class LockHeader extends FixedHeader {
    static propTypes = {
        ...FixedHeader.propTypes,
    };

    static contextTypes = {
        ...FixedHeader.contextTypes,
        getLockNode: PropTypes.func,
        lockType: PropTypes.oneOf(['left', 'right']),
    };

    componentDidMount() {
        const { getNode, getLockNode } = this.context;
        getNode && getNode('header', findDOMNode(this), this.context.lockType);
        getLockNode &&
            getLockNode('header', findDOMNode(this), this.context.lockType);
    }
}
