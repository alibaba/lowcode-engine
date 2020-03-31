import React from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon from '../icon';
import Button from '../button';
import Overlay from '../overlay';
import Menu from '../menu';
import ConfigProvider from '../config-provider';
import { dom, obj, func } from '../util';

const { Popup } = Overlay;

/**
 * SplitButton
 */
class SplitButton extends React.Component {
    static propTypes = {
        prefix: PropTypes.string,
        style: PropTypes.object,
        /**
         * 按钮的类型
         */
        type: PropTypes.oneOf(['normal', 'primary', 'secondary']),
        /**
         * 按钮组的尺寸
         */
        size: PropTypes.oneOf(['small', 'medium', 'large']),
        /**
         * 主按钮的文案
         */
        label: PropTypes.node,
        /**
         * 设置标签类型
         */
        component: PropTypes.oneOf(['button', 'a']),
        /**
         * 是否为幽灵按钮
         */
        ghost: PropTypes.oneOf(['light', 'dark', false, true]),
        /**
         * 默认激活的菜单项（用法同 Menu 非受控）
         */
        defaultSelectedKeys: PropTypes.array,
        /**
         * 激活的菜单项（用法同 Menu 受控）
         */
        selectedKeys: PropTypes.array,
        /**
         * 菜单的选择模式
         */
        selectMode: PropTypes.oneOf(['single', 'multiple']),
        /**
         * 选择菜单项时的回调，参考 Menu
         */
        onSelect: PropTypes.func,
        /**
         * 点击菜单项时的回调，参考 Menu
         */
        onItemClick: PropTypes.func,
        /**
         * 触发按钮的属性（支持 Button 的所有属性透传）
         */
        triggerProps: PropTypes.object,
        /**
         * 弹层菜单的宽度是否与按钮组一致
         */
        autoWidth: PropTypes.bool,
        /**
         * 弹层是否显示
         */
        visible: PropTypes.bool,
        /**
         * 弹层默认是否显示
         */
        defaultVisible: PropTypes.bool,
        /**
         * 弹层显示状态变化时的回调函数
         * @param {Boolean} visible 弹层显示状态
         * @param {String} type 触发弹层显示或隐藏的来源 menuSelect 表示由menu触发； fromTrigger 表示由trigger的点击触发； docClick 表示由document的点击触发
         */
        onVisibleChange: PropTypes.func,
        /**
         * 弹层的触发方式
         */
        popupTriggerType: PropTypes.oneOf(['click', 'hover']),
        /**
         * 弹层对齐方式, 详情见Overlay align
         */
        popupAlign: PropTypes.string,
        /**
         * 弹层自定义样式
         */
        popupStyle: PropTypes.object,
        /**
         * 弹层自定义样式类
         */
        popupClassName: PropTypes.string,
        /**
         * 透传给弹层的属性
         */
        popupProps: PropTypes.object,
        /**
         * 是否跟随滚动
         */
        followTrigger: PropTypes.bool,
        /**
         * 透传给 Menu 的属性
         */
        menuProps: PropTypes.object,
        /**
         * 透传给 左侧按钮 的属性
         */
        leftButtonProps: PropTypes.object,
        className: PropTypes.string,
        children: PropTypes.any,
    };

    static defaultProps = {
        prefix: 'next-',
        type: 'normal',
        size: 'medium',
        autoWidth: true,
        popupTriggerType: 'click',
        onVisibleChange: func.noop,
        onItemClick: func.noop,
        onSelect: func.noop,
        defaultSelectedKeys: [],
        menuProps: {},
        leftButtonProps: {},
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            selectedKeys: props.selectedKeys || props.defaultSelectedKeys,
            visible: props.visible || props.defaultVisible,
        };
    }

    componentDidMount() {
        // 由于定位目标是 wrapper，如果弹层默认展开，wrapper 还未渲染，didMount 后强制再渲染一次，弹层重新定位
        if (this.state.visible) {
            this.forceUpdate();
        }
    }

    componentWillReceiveProps(nextProps) {
        if ('visible' in nextProps) {
            this.setState({
                visible: nextProps.visible,
            });
        }

        if ('selectedKeys' in nextProps) {
            this.setState({
                selectedKeys: nextProps.selectedKeys,
            });
        }
    }

    selectMenuItem = (keys, ...others) => {
        if (!('selectedKeys' in this.props)) {
            this.setState({
                selectedKeys: keys,
            });
        }
        this.props.onSelect(keys, ...others);
    };

    clickMenuItem = (key, ...others) => {
        this.props.onItemClick(key, ...others);
        this.onVisibleChange(false, 'menuSelect');
    };

    onPopupOpen = () => {
        if (this.props.autoWidth && this.wrapper && this.menu) {
            dom.setStyle(this.menu, {
                width: this.wrapper.offsetWidth,
            });
        }
    };

    onVisibleChange = (visible, reason) => {
        if (!('visible' in this.props)) {
            this.setState({
                visible,
            });
        }
        this.props.onVisibleChange(visible, reason);
    };

    _menuRefHandler = ref => {
        this.menu = findDOMNode(ref);

        const refFn = this.props.menuProps.ref;
        if (typeof refFn === 'function') {
            refFn(ref);
        }
    };

    _wrapperRefHandler = ref => {
        this.wrapper = findDOMNode(ref);
    };

    render() {
        const {
            prefix,
            label,
            size,
            type,
            component,
            ghost,
            className,
            style,
            children,
            triggerProps,
            popupAlign,
            popupTriggerType,
            popupStyle,
            popupClassName,
            popupProps,
            followTrigger,
            selectMode,
            menuProps,
            leftButtonProps,
            disabled,
            ...others
        } = this.props;

        const state = this.state;

        const classNames = classnames(
            {
                [`${prefix}split-btn`]: true,
            },
            className
        );

        const sharedBtnProps = {
            type,
            size,
            component,
            ghost,
            disabled,
        };

        const triggerClassNames = classnames({
            [`${prefix}split-btn-trigger`]: true,
            [`${prefix}expand`]: state.visible,
            opened: state.visible,
        });

        const trigger = (
            <Button
                {...triggerProps}
                {...sharedBtnProps}
                className={triggerClassNames}
            >
                <Icon type="arrow-down" />
            </Button>
        );

        return (
            <Button.Group
                {...obj.pickOthers(SplitButton.propTypes, others)}
                className={classNames}
                style={style}
                size={size}
                ref={this._wrapperRefHandler}
            >
                <Button {...sharedBtnProps} {...leftButtonProps}>
                    {label}
                </Button>
                <Popup
                    {...popupProps}
                    followTrigger={followTrigger}
                    visible={state.visible}
                    onVisibleChange={this.onVisibleChange}
                    trigger={trigger}
                    triggerType={popupTriggerType}
                    align={popupAlign}
                    target={() => this.wrapper}
                    style={popupStyle}
                    shouldUpdatePosition
                    className={popupClassName}
                    onOpen={this.onPopupOpen}
                >
                    <Menu
                        {...menuProps}
                        selectMode={selectMode}
                        selectedKeys={state.selectedKeys}
                        onSelect={this.selectMenuItem}
                        onItemClick={this.clickMenuItem}
                        ref={this._menuRefHandler}
                    >
                        {children}
                    </Menu>
                </Popup>
            </Button.Group>
        );
    }
}

SplitButton.Item = Menu.Item;
SplitButton.Divider = Menu.Divider;
SplitButton.Group = Menu.Group;

export default ConfigProvider.config(SplitButton);
