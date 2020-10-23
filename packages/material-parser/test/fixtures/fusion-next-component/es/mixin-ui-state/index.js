import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React, { Component } from 'react';
import classnames from 'classnames';
import { func } from '../util';

var makeChain = func.makeChain;
// UIState 为一些特殊元素的状态响应提供了标准的方式，
// 尤其适合CSS无法完全定制的控件，比如checkbox，radio等。
// 若组件 disable 则自行判断是否需要绑定状态管理。
// 注意：disable 不会触发事件，请使用resetUIState还原状态
/* eslint-disable react/prop-types */

var UIState = function (_Component) {
    _inherits(UIState, _Component);

    function UIState(props) {
        _classCallCheck(this, UIState);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        _this.state = {};
        ['_onUIFocus', '_onUIBlur'].forEach(function (item) {
            _this[item] = _this[item].bind(_this);
        });
        return _this;
    }
    // base 事件绑定的元素


    UIState.prototype.getStateElement = function getStateElement(base) {
        var _props = this.props,
            onFocus = _props.onFocus,
            onBlur = _props.onBlur;

        return React.cloneElement(base, {
            onFocus: makeChain(this._onUIFocus, onFocus),
            onBlur: makeChain(this._onUIBlur, onBlur)
        });
    };
    // 获取状态classname


    UIState.prototype.getStateClassName = function getStateClassName() {
        var focused = this.state.focused;

        return classnames({
            focused: focused
        });
    };
    // 复原状态


    UIState.prototype.resetUIState = function resetUIState() {
        this.setState({
            focused: false
        });
    };

    UIState.prototype._onUIFocus = function _onUIFocus() {
        this.setState({
            focused: true
        });
    };

    UIState.prototype._onUIBlur = function _onUIBlur() {
        this.setState({
            focused: false
        });
    };

    return UIState;
}(Component);

UIState.displayName = 'UIState';


export default UIState;