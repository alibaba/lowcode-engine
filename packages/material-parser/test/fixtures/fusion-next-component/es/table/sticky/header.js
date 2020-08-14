import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp2;

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Affix from '../../affix';

/* eslint-disable react/prefer-stateless-function*/
var StickHeader = (_temp2 = _class = function (_React$Component) {
    _inherits(StickHeader, _React$Component);

    function StickHeader() {
        var _temp, _this, _ret;

        _classCallCheck(this, StickHeader);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.getAffixRef = function (ref) {
            _this.props.affixRef && _this.props.affixRef(ref);
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    StickHeader.prototype.render = function render() {
        var _classnames;

        var prefix = this.props.prefix;
        var _context = this.context,
            Header = _context.Header,
            offsetTop = _context.offsetTop,
            affixProps = _context.affixProps;


        var newAffixProps = affixProps || {};

        var className = newAffixProps.className,
            others = _objectWithoutProperties(newAffixProps, ['className']);

        var cls = classnames((_classnames = {}, _classnames[prefix + 'table-affix'] = true, _classnames.className = className, _classnames));

        return React.createElement(
            Affix,
            _extends({
                ref: this.getAffixRef
            }, others, {
                className: cls,
                offsetTop: offsetTop
            }),
            React.createElement(Header, this.props)
        );
    };

    return StickHeader;
}(React.Component), _class.propTypes = {
    prefix: PropTypes.string
}, _class.contextTypes = {
    Header: PropTypes.any,
    offsetTop: PropTypes.number,
    affixProps: PropTypes.object
}, _temp2);
StickHeader.displayName = 'StickHeader';
export { StickHeader as default };