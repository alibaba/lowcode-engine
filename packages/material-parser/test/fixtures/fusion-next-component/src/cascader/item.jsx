import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Menu from '../menu';
import Icon from '../icon';
import { func, obj, KEYCODE } from '../util';

const { bindCtx } = func;
const { pickOthers } = obj;

export default class CascaderMenuItem extends Component {
    static menuChildType = 'item';

    static propTypes = {
        prefix: PropTypes.string,
        className: PropTypes.string,
        disabled: PropTypes.bool,
        selected: PropTypes.bool,
        onSelect: PropTypes.func,
        expanded: PropTypes.bool,
        canExpand: PropTypes.bool,
        menu: PropTypes.any,
        expandTriggerType: PropTypes.oneOf(['click', 'hover']),
        onExpand: PropTypes.func,
        onFold: PropTypes.func,
        checkable: PropTypes.bool,
        checked: PropTypes.bool,
        indeterminate: PropTypes.bool,
        checkboxDisabled: PropTypes.bool,
        onCheck: PropTypes.func,
        children: PropTypes.node,
    };

    constructor(props) {
        super(props);

        this.state = {
            loading: false,
        };

        bindCtx(this, [
            'handleExpand',
            'handleClick',
            'handleMouseEnter',
            'handleKeyDown',
            'removeLoading',
        ]);
    }

    addLoading() {
        this.setState({
            loading: true,
        });
    }

    removeLoading() {
        this.setState({
            loading: false,
        });
    }

    setLoadingIfNeed(p) {
        if (p && typeof p.then === 'function') {
            this.addLoading();
            p.then(this.removeLoading).catch(this.removeLoading);
        }
    }

    handleExpand(focusedFirstChild) {
        this.setLoadingIfNeed(this.props.onExpand(focusedFirstChild));
    }

    handleClick() {
        this.handleExpand(false);
    }

    handleMouseEnter() {
        this.handleExpand(false);
    }

    handleKeyDown(e) {
        if (!this.props.disabled) {
            if (e.keyCode === KEYCODE.RIGHT || e.keyCode === KEYCODE.ENTER) {
                if (this.props.canExpand) {
                    this.handleExpand(true);
                }
            } else if (
                e.keyCode === KEYCODE.LEFT ||
                e.keyCode === KEYCODE.ESC
            ) {
                this.props.onFold();
            } else if (e.keyCode === KEYCODE.SPACE) {
                this.handleExpand(false);
            }
        }
    }

    render() {
        const {
            prefix,
            className,
            menu,
            disabled,
            selected,
            onSelect,
            expanded,
            canExpand,
            expandTriggerType,
            checkable,
            checked,
            indeterminate,
            checkboxDisabled,
            onCheck,
            children,
        } = this.props;
        const others = pickOthers(
            Object.keys(CascaderMenuItem.propTypes),
            this.props
        );
        const { loading } = this.state;

        const itemProps = {
            className: cx({
                [`${prefix}cascader-menu-item`]: true,
                [`${prefix}expanded`]: expanded,
                [className]: !!className,
            }),
            disabled,
            menu,
            onKeyDown: this.handleKeyDown,
            role: 'option',
            ...others,
        };
        if (!disabled) {
            if (expandTriggerType === 'hover') {
                itemProps.onMouseEnter = this.handleMouseEnter;
            } else {
                itemProps.onClick = this.handleClick;
            }
        }

        let Item;
        if (checkable) {
            Item = Menu.CheckboxItem;
            itemProps.checked = checked;
            itemProps.indeterminate = indeterminate;
            itemProps.checkboxDisabled = checkboxDisabled;
            itemProps.onChange = onCheck;
        } else {
            Item = Menu.Item;
            itemProps.selected = selected;
            itemProps.onSelect = onSelect;
        }

        return (
            <Item {...itemProps}>
                {children}
                {canExpand ? (
                    loading ? (
                        <Icon
                            className={`${prefix}cascader-menu-icon-right ${prefix}cascader-menu-icon-loading`}
                            type="loading"
                        />
                    ) : (
                        <Icon
                            className={`${prefix}cascader-menu-icon-right ${prefix}cascader-menu-icon-expand`}
                            type="arrow-right"
                        />
                    )
                ) : null}
            </Item>
        );
    }
}
