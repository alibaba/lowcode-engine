import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Icon from '../../icon';
import { func, obj, KEYCODE } from '../../util';
import Item from './item';

const { bindCtx } = func;
const { pickOthers } = obj;

/**
 * Menu.Item
 * @order 0
 */
export default class SelectableItem extends Component {
    static menuChildType = 'item';

    static propTypes = {
        _key: PropTypes.string,
        root: PropTypes.object,
        selected: PropTypes.bool,
        onSelect: PropTypes.func,
        inlineIndent: PropTypes.number,
        /**
         * 是否禁用
         */
        disabled: PropTypes.bool,
        /**
         * 帮助文本
         */
        helper: PropTypes.node,
        /**
         * 菜单项标签内容
         */
        children: PropTypes.node,
        className: PropTypes.string,
        onKeyDown: PropTypes.func,
        onClick: PropTypes.func,
        needIndent: PropTypes.bool,
        hasSelectedIcon: PropTypes.bool,
        isSelectIconRight: PropTypes.bool,
    };

    static defaultProps = {
        disabled: false,
        needIndent: true,
    };

    constructor(props) {
        super(props);

        bindCtx(this, ['handleKeyDown', 'handleClick']);
    }

    getSelected() {
        const { _key, root, selected } = this.props;
        const { selectMode } = root.props;
        const { selectedKeys } = root.state;
        return selected || (!!selectMode && selectedKeys.indexOf(_key) > -1);
    }

    handleSelect(e) {
        const { _key, root, onSelect } = this.props;
        if (onSelect) {
            onSelect(!this.getSelected(), this, e);
        } else {
            root.handleSelect(_key, !this.getSelected(), this);
        }
    }

    handleKeyDown(e) {
        if (e.keyCode === KEYCODE.SPACE && !this.props.disabled) {
            this.handleSelect(e);
        }

        this.props.onKeyDown && this.props.onKeyDown(e);
    }

    handleClick(e) {
        this.handleSelect(e);

        this.props.onClick && this.props.onClick(e);
    }

    renderSelectedIcon(selected) {
        const {
            root,
            inlineIndent,
            needIndent,
            hasSelectedIcon,
            isSelectIconRight,
            type,
        } = this.props;
        const {
            prefix,
            hasSelectedIcon: rootSelectedIcon,
            isSelectIconRight: rootSelectIconRight,
        } = root.props;

        const cls = cx({
            [`${prefix}menu-icon-selected`]: true,
            [`${prefix}menu-icon-right`]:
                ('isSelectIconRight' in this.props
                    ? isSelectIconRight
                    : rootSelectIconRight) && type !== 'submenu',
        });

        return ('hasSelectedIcon' in this.props
            ? hasSelectedIcon
            : rootSelectedIcon) && selected ? (
            <Icon
                style={
                    needIndent && inlineIndent > 0
                        ? { left: `${inlineIndent}px` }
                        : null
                }
                className={cls}
                type="select"
            />
        ) : null;
    }

    render() {
        const {
            _key,
            root,
            className,
            disabled,
            helper,
            children,
            needIndent,
        } = this.props;
        const { prefix } = root.props;
        const others = pickOthers(
            Object.keys(SelectableItem.propTypes),
            this.props
        );
        const selected = this.getSelected();

        const newProps = {
            _key,
            root,
            disabled,
            type: 'item',
            className: cx({
                [`${prefix}selected`]: selected,
                [className]: !!className,
            }),
            onKeyDown: this.handleKeyDown,
            onClick: !disabled ? this.handleClick : this.props.onClick,
            needIndent,
            ...others,
        };

        const textProps = {};

        if ('selectMode' in root.props) {
            textProps['aria-selected'] = selected;
        }

        return (
            <Item {...newProps}>
                {this.renderSelectedIcon(selected)}
                <span className={`${prefix}menu-item-text`} {...textProps}>
                    {children}
                </span>
                {helper ? (
                    <div className={`${prefix}menu-item-helper`}>{helper}</div>
                ) : null}
            </Item>
        );
    }
}
