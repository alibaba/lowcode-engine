import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CheckableItem from './checkable-item';

/**
 * Menu.RadioItem
 * @order 4
 * @description 该子组件选中情况不受 defaultSelectedKeys/selectedKeys 控制，请自行控制选中逻辑
 */
export default class RadioItem extends Component {
    static menuChildType = 'item';

    static propTypes = {
        /**
         * 是否选中
         */
        checked: PropTypes.bool,
        /**
         * 是否禁用
         */
        disabled: PropTypes.bool,
        /**
         * 选中或取消选中触发的回调函数
         * @param {Boolean} checked 是否选中
         * @param {Object} event 选中事件对象
         */
        onChange: PropTypes.func,
        /**
         * 帮助文本
         */
        helper: PropTypes.node,
        /**
         * 标签内容
         */
        children: PropTypes.node,
    };

    static defaultProps = {
        checked: false,
        disabled: false,
        onChange: () => {},
    };

    render() {
        return (
            <CheckableItem
                role="menuitemradio"
                checkType="radio"
                {...this.props}
            />
        );
    }
}
