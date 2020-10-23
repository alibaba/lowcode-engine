import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp2;

import React from 'react';
import PropTypes from 'prop-types';

import ConfigProvider from '../config-provider';
import Input from './input';
import Icon from '../icon/index';

function preventDefault(e) {
    e.preventDefault();
}
var Password = (_temp2 = _class = function (_Input) {
    _inherits(Password, _Input);

    function Password() {
        var _temp, _this, _ret;

        _classCallCheck(this, Password);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Input.call.apply(_Input, [this].concat(args))), _this), _this.state = {
            hint: 'eye',
            htmlType: 'password'
        }, _this.toggleEye = function (e) {
            e.preventDefault();

            var eyeClose = _this.state.hint === 'eye-close';

            _this.setState({
                hint: eyeClose ? 'eye' : 'eye-close',
                htmlType: eyeClose || !_this.props.showToggle ? 'password' : 'text'
            });
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    Password.prototype.render = function render() {
        var _props = this.props,
            showToggle = _props.showToggle,
            others = _objectWithoutProperties(_props, ['showToggle']);

        var _state = this.state,
            hint = _state.hint,
            htmlType = _state.htmlType;


        var extra = showToggle ? React.createElement(Icon, {
            type: hint,
            onClick: this.toggleEye,
            onMouseDown: preventDefault
        }) : null;

        return React.createElement(Input, _extends({}, others, { extra: extra, htmlType: htmlType }));
    };

    return Password;
}(Input), _class.propTypes = _extends({}, Input.propTypes, {
    /**
     * 是否展示切换按钮
     */
    showToggle: PropTypes.bool
}), _class.defaultProps = _extends({}, Input.defaultProps, {
    showToggle: true
}), _temp2);
export { Password as default };