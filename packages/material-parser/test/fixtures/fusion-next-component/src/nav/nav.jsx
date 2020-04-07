import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ConfigProvider from '../config-provider';
import Menu from '../menu';

/**
 * Nav
 * @description 继承自 `Menu` 的能力请查看 `Menu` 文档
 */
class Nav extends Component {
    static propTypes = {
        prefix: PropTypes.string,
        pure: PropTypes.bool,
        rtl: PropTypes.bool,
        className: PropTypes.string,
        style: PropTypes.object,
        /**
         * 导航项和子导航
         */
        children: PropTypes.node,
        /**
         * 导航类型
         * @enumdesc 普通, 主要, 次要, 线形
         */
        type: PropTypes.oneOf(['normal', 'primary', 'secondary', 'line']),
        /**
         * 导航布局
         * @enumdesc 水平, 垂直
         */
        direction: PropTypes.oneOf(['hoz', 'ver']),
        /**
         * 横向导航条 items 和 footer 的对齐方向，在 direction 设置为 'hoz' 并且 header 存在时生效
         */
        hozAlign: PropTypes.oneOf(['left', 'right']),
        /**
         * 设置组件选中状态的 active 边方向
         * @enumdesc 无, 上, 下, 左, 右
         * @default 当 direction 为 'hoz' 时，默认值为 'bottom'，当 direction 为 'ver' 时，默认值为 'left'
         */
        activeDirection: PropTypes.oneOf([
            null,
            'top',
            'bottom',
            'left',
            'right',
        ]),
        /**
         * 子导航打开的模式（水平导航只支持弹出）
         * @eumdesc 行内, 弹出
         */
        mode: PropTypes.oneOf(['inline', 'popup']),
        /**
         * 子导航打开的触发方式
         */
        triggerType: PropTypes.oneOf(['click', 'hover']),
        /**
         * 内联子导航缩进距离
         */
        inlineIndent: PropTypes.number,
        /**
         * 初始展开所有的子导航，只在 mode 设置为 'inline' 以及 openMode 设置为 'multiple' 下生效
         */
        defaultOpenAll: PropTypes.bool,
        /**
         * 内联子导航的展开模式，同时可以展开一个同级子导航还是多个同级子导航，该属性仅在 mode 为 inline 时生效
         * @eumdesc 一个, 多个
         */
        openMode: PropTypes.oneOf(['single', 'multiple']),
        /**
         * 当前选中导航项的 key 值
         */
        selectedKeys: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        /**
         * 初始选中导航项的 key 值
         */
        defaultSelectedKeys: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array,
        ]),
        /**
         * 选中或取消选中导航项触发的回调函数
         * @param {Array} selectedKeys 选中的所有导航项的 key
         * @param {Object} item 选中或取消选中的导航项
         * @param {Object} extra 额外参数
         * @param {Boolean} extra.select 是否是选中
         * @param {Array} extra.key 导航项的 key
         * @param {Object} extra.label 导航项的文本
         * @param {Array} extra.keyPath 导航项 key 的路径
         */
        onSelect: PropTypes.func,
        /**
         * 弹出子导航的对齐方式（水平导航只支持 follow ）
         * @eumdesc Item 顶端对齐, Nav 顶端对齐
         */
        popupAlign: PropTypes.oneOf(['follow', 'outside']),
        /**
         * 弹出子导航的自定义类名
         */
        popupClassName: PropTypes.string,
        /**
         * 是否只显示图标
         */
        iconOnly: PropTypes.bool,
        /**
         * 是否显示右侧的箭头（仅在 iconOnly=true 时生效）
         */
        hasArrow: PropTypes.bool,
        /**
         * 是否有 ToolTips （仅在 iconOnly=true 时生效）
         */
        hasTooltip: PropTypes.bool,
        /**
         * 自定义导航头部
         */
        header: PropTypes.node,
        /**
         * 自定义导航尾部
         */
        footer: PropTypes.node,
        /**
         * 是否开启嵌入式模式，一般用于Layout的布局中，开启后没有默认背景、外层border、box-shadow，可以配合`<Nav style={{lineHeight: '100px'}}>` 自定义高度
         */
        embeddable: PropTypes.bool,
        popupProps: PropTypes.object,
    };

    static defaultProps = {
        prefix: 'next-',
        pure: false,
        type: 'normal',
        direction: 'ver',
        hozAlign: 'left',
        mode: 'inline',
        triggerType: 'click',
        inlineIndent: 20,
        defaultOpenAll: false,
        openMode: 'multiple',
        defaultSelectedKeys: [],
        popupAlign: 'follow',
        hasTooltip: false,
        embeddable: false,
        hasArrow: true,
        popupProps: {},
    };

    static childContextTypes = {
        prefix: PropTypes.string,
        mode: PropTypes.string,
        iconOnly: PropTypes.bool,
        hasTooltip: PropTypes.bool,
        hasArrow: PropTypes.bool,
    };

    static contextTypes = {
        isCollapse: PropTypes.bool,
    };

    constructor(props) {
        super(props);

        this.getMenuRef = this.getMenuRef.bind(this);
    }

    getChildContext() {
        const {
            prefix,
            direction,
            mode,
            iconOnly,
            hasTooltip,
            hasArrow,
        } = this.props;

        const { isCollapse } = this.context;

        return {
            prefix,
            mode: direction === 'hoz' ? 'popup' : mode,
            iconOnly: 'iconOnly' in this.props ? iconOnly : isCollapse,
            hasTooltip,
            hasArrow,
        };
    }

    getMenuRef(ref) {
        this.menu = ref;
    }

    render() {
        // eslint-disable-next-line
        const {
            prefix,
            className,
            style,
            children,
            type,
            direction,
            activeDirection,
            mode,
            triggerType,
            inlineIndent,
            openMode,
            popupAlign,
            popupClassName,
            iconOnly,
            hasArrow,
            hasTooltip,
            embeddable,
            popupProps,
            rtl,
            ...others
        } = this.props;

        const { isCollapse } = this.context;

        const newIconOnly = 'iconOnly' in this.props ? iconOnly : isCollapse;

        let realActiveDirection = activeDirection;
        if (
            realActiveDirection &&
            ((direction === 'hoz' &&
                (realActiveDirection === 'left' ||
                    realActiveDirection === 'right')) ||
                (direction === 'ver' &&
                    (realActiveDirection === 'top' ||
                        realActiveDirection === 'bottom')))
        ) {
            realActiveDirection = null;
        }

        if (!newIconOnly && realActiveDirection === undefined) {
            realActiveDirection =
                direction === 'hoz'
                    ? 'bottom'
                    : type === 'line'
                    ? 'right'
                    : 'left';
        }

        const cls = classNames({
            [`${prefix}nav`]: true,
            [`${prefix}${type}`]: type,
            [`${prefix}active`]: realActiveDirection,
            [`${prefix}${realActiveDirection}`]: realActiveDirection,
            [`${prefix}icon-only`]: newIconOnly,
            [`${prefix}no-arrow`]: !hasArrow,
            [`${prefix}nav-embeddable`]: embeddable,
            [className]: !!className,
        });
        const newStyle = newIconOnly ? { ...style, width: '58px' } : style;

        const props = {
            prefix,
            direction,
            openMode,
            triggerType,
            mode: direction === 'hoz' ? 'popup' : mode,
            popupAlign: direction === 'hoz' ? 'follow' : popupAlign,
            inlineIndent: newIconOnly ? 0 : inlineIndent,
            hasSelectedIcon: false,
            popupAutoWidth: true,
            selectMode: 'single',
            itemClassName: `${prefix}nav-item`,
            popupClassName: classNames({
                [cls
                    .replace(`${prefix}icon-only`, '')
                    .replace(`${prefix}nav-embeddable`, '')]: mode === 'popup',
                [`${prefix}icon-only`]: newIconOnly && mode === 'inline',
                [popupClassName]: !!popupClassName,
            }),
            popupProps: popupItemProps => {
                return {
                    offset:
                        direction === 'hoz' && popupItemProps.level === 1
                            ? [0, 2]
                            : [-2, 0],
                    ...popupProps,
                };
            },
        };

        return (
            <Menu
                className={cls}
                style={newStyle}
                {...props}
                {...others}
                ref={this.getMenuRef}
            >
                {children}
            </Menu>
        );
    }
}

export default ConfigProvider.config(Nav);
