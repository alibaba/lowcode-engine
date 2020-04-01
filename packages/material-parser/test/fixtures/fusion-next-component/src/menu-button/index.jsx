import React from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Button from '../button';
import Icon from '../icon';
import Menu from '../menu';
import Overlay from '../overlay';
import { obj, func } from '../util';

const { Popup } = Overlay;

/**
 * MenuButton
 */
class MenuButton extends React.Component {
    static propTypes = {
        prefix: PropTypes.string,
        /**
         * 按钮上的文本内容
         */
        label: PropTypes.node,
        /**
         * 弹层是否与按钮宽度相同
         */
        autoWidth: PropTypes.bool,
        /**
         * 弹层触发方式
         */
        popupTriggerType: PropTypes.oneOf(['click', 'hover']),
        /**
         * 弹层容器
         */
        popupContainer: PropTypes.any,
        /**
         * 弹层展开状态
         */
        visible: PropTypes.bool,
        /**
         * 弹层默认是否展开
         */
        defaultVisible: PropTypes.bool,
        /**
         * 弹层在显示和隐藏触发的事件
         */
        onVisibleChange: PropTypes.func,
        /**
         * 弹层自定义样式
         */
        popupStyle: PropTypes.object,
        /**
         * 弹层自定义样式类
         */
        popupClassName: PropTypes.string,
        /**
         * 弹层属性透传
         */
        popupProps: PropTypes.object,
        /**
         * 是否跟随滚动
         */
        followTrigger: PropTypes.bool,
        /**
         * 默认激活的菜单项（用法同 Menu 非受控）
         */
        defaultSelectedKeys: PropTypes.array,
        /**
         * 激活的菜单项（用法同 Menu 受控）
         */
        selectedKeys: PropTypes.array,
        /**
         * 菜单的选择模式，同 Menu
         */
        selectMode: PropTypes.oneOf(['single', 'multiple']),
        /**
         * 点击菜单项后的回调，同 Menu
         */
        onItemClick: PropTypes.func,
        /**
         * 选择菜单后的回调，同 Menu
         */
        onSelect: PropTypes.func,
        /**
         * 菜单属性透传
         */
        menuProps: PropTypes.object,
        style: PropTypes.object,
        className: PropTypes.string,
        children: PropTypes.any,
    };

    static defaultProps = {
        prefix: 'next-',
        autoWidth: true,
        popupTriggerType: 'click',
        onVisibleChange: func.noop,
        onItemClick: func.noop,
        onSelect: func.noop,
        defaultSelectedKeys: [],
        menuProps: {},
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            selectedKeys: props.selectedKeys || props.defaultSelectedKeys,
            visible: props.visible || props.defaultVisible,
        };
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

    clickMenuItem = (key, ...others) => {
        const { selectMode } = this.props;

        this.props.onItemClick(key, ...others);

        if (selectMode === 'multiple') {
            return;
        }

        this.onPopupVisibleChange(false, 'menuSelect');
    };

    selectMenu = (keys, ...others) => {
        if (!('selectedKeys' in this.props)) {
            this.setState({
                selectedKeys: keys,
            });
        }
        this.props.onSelect(keys, ...others);
    };

    onPopupOpen = () => {
        const button = findDOMNode(this);
        if (this.props.autoWidth && button && this.menu) {
            this.menu.style.width = `${button.offsetWidth}px`;
        }
    };

    onPopupVisibleChange = (visible, type) => {
        if (!('visible' in this.props)) {
            this.setState({
                visible,
            });
        }
        this.props.onVisibleChange(visible, type);
    };

    _menuRefHandler = ref => {
        this.menu = findDOMNode(ref);

        const refFn = this.props.menuProps.ref;
        if (typeof refFn === 'function') {
            refFn(ref);
        }
    };

    render() {
        const {
            prefix,
            style,
            className,
            label,
            popupTriggerType,
            popupContainer,
            popupStyle,
            popupClassName,
            popupProps,
            followTrigger,
            selectMode,
            menuProps,
            children,
            ...others
        } = this.props;

        const state = this.state;

        const classNames = classnames(
            {
                [`${prefix}menu-btn`]: true,
                [`${prefix}expand`]: state.visible,
                opened: state.visible,
            },
            className
        );

        const popupClassNames = classnames(
            {
                [`${prefix}menu-btn-popup`]: true,
            },
            popupClassName
        );

        const trigger = (
            <Button
                style={style}
                className={classNames}
                {...obj.pickOthers(MenuButton.propTypes, others)}
            >
                {label}{' '}
                <Icon type="arrow-down" className={`${prefix}menu-btn-arrow`} />
            </Button>
        );

        return (
            <Popup
                {...popupProps}
                followTrigger={followTrigger}
                visible={state.visible}
                onVisibleChange={this.onPopupVisibleChange}
                trigger={trigger}
                triggerType={popupTriggerType}
                container={popupContainer}
                onOpen={this.onPopupOpen}
                style={popupStyle}
                className={popupClassNames}
            >
                <Menu
                    {...menuProps}
                    ref={this._menuRefHandler}
                    selectedKeys={state.selectedKeys}
                    selectMode={selectMode}
                    onSelect={this.selectMenu}
                    onItemClick={this.clickMenuItem}
                >
                    {children}
                </Menu>
            </Popup>
        );
    }
}

MenuButton.Item = Menu.Item;
MenuButton.Group = Menu.Group;
MenuButton.Divider = Menu.Divider;

export default MenuButton;
