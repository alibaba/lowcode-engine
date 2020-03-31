import React, { Component } from 'react';
import classnames from 'classnames';
import { func } from '../util';

const { makeChain } = func;
// UIState 为一些特殊元素的状态响应提供了标准的方式，
// 尤其适合CSS无法完全定制的控件，比如checkbox，radio等。
// 若组件 disable 则自行判断是否需要绑定状态管理。
// 注意：disable 不会触发事件，请使用resetUIState还原状态
/* eslint-disable react/prop-types */
class UIState extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        ['_onUIFocus', '_onUIBlur'].forEach(item => {
            this[item] = this[item].bind(this);
        });
    }
    // base 事件绑定的元素
    getStateElement(base) {
        const { onFocus, onBlur } = this.props;
        return React.cloneElement(base, {
            onFocus: makeChain(this._onUIFocus, onFocus),
            onBlur: makeChain(this._onUIBlur, onBlur),
        });
    }
    // 获取状态classname
    getStateClassName() {
        const { focused } = this.state;
        return classnames({
            focused,
        });
    }
    // 复原状态
    resetUIState() {
        this.setState({
            focused: false,
        });
    }
    _onUIFocus() {
        this.setState({
            focused: true,
        });
    }
    _onUIBlur() {
        this.setState({
            focused: false,
        });
    }
}

export default UIState;
