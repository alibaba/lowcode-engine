import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import FixedHeader from '../fixed/header';

var LockHeader = (_temp = _class = function (_FixedHeader) {
    _inherits(LockHeader, _FixedHeader);

    function LockHeader() {
        _classCallCheck(this, LockHeader);

        return _possibleConstructorReturn(this, _FixedHeader.apply(this, arguments));
    }

    LockHeader.prototype.componentDidMount = function componentDidMount() {
        var _context = this.context,
            getNode = _context.getNode,
            getLockNode = _context.getLockNode;

        getNode && getNode('header', findDOMNode(this), this.context.lockType);
        getLockNode && getLockNode('header', findDOMNode(this), this.context.lockType);
    };

    return LockHeader;
}(FixedHeader), _class.propTypes = _extends({}, FixedHeader.propTypes), _class.contextTypes = _extends({}, FixedHeader.contextTypes, {
    getLockNode: PropTypes.func,
    lockType: PropTypes.oneOf(['left', 'right'])
}), _temp);
export { LockHeader as default };