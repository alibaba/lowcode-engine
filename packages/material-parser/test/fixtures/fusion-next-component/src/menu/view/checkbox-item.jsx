import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CheckableItem from './checkable-item';

/**
 * Menu.CheckboxItem
 * @order 3
 * @description 该子组件选中情况不受 defaultSelectedKeys/selectedKeys 控制，请自行控制选中逻辑
 */
export default class CheckboxItem extends Component {
    static menuChildType = 'item';

    static propTypes = {
        /**
         * 是否选中
         */
        checked: PropTypes.bool,
        /**
         * 是否半选中
         */
        indeterminate: PropTypes.bool,
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
        checkboxDisabled: PropTypes.bool,
    };

    static defaultProps = {
        checked: false,
        indeterminate: false,
        disabled: false,
        onChange: () => {},
        checkboxDisabled: false,
    };

    render() {
        const { checkboxDisabled, ...others } = this.props;
        return (
            <CheckableItem
                role="menuitemcheckbox"
                checkType="checkbox"
                checkDisabled={checkboxDisabled}
                {...others}
            />
        );
    }
}
