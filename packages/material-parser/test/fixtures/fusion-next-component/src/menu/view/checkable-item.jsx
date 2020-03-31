import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Checkbox from '../../checkbox';
import Radio from '../../radio';
import { func, obj, KEYCODE, htmlId } from '../../util';
import Item from './item';

const noop = {};
const { bindCtx } = func;
const { pickOthers } = obj;

export default class CheckableItem extends Component {
    static propTypes = {
        _key: PropTypes.string,
        root: PropTypes.object,
        disabled: PropTypes.bool,
        inlineIndent: PropTypes.number,
        checked: PropTypes.bool,
        indeterminate: PropTypes.bool,
        onChange: PropTypes.func,
        checkType: PropTypes.oneOf(['checkbox', 'radio']),
        checkDisabled: PropTypes.bool,
        helper: PropTypes.node,
        children: PropTypes.node,
        onKeyDown: PropTypes.func,
        onClick: PropTypes.func,
        id: PropTypes.string,
    };

    static defaultProps = {
        disabled: false,
        checked: false,
        indeterminate: false,
        checkType: 'checkbox',
        checkDisabled: false,
        onChange: noop,
    };

    constructor(props) {
        super(props);

        bindCtx(this, ['stopPropagation', 'handleKeyDown', 'handleClick']);
        this.id = htmlId.escapeForId(
            `checkable-item-${props.id || props._key}`
        );
    }

    stopPropagation(e) {
        e.stopPropagation();
    }

    handleCheck(e) {
        const { checkType, checked, onChange } = this.props;
        if (!(checkType === 'radio' && checked)) {
            onChange(!checked, e);
        }
    }

    handleKeyDown(e) {
        if (e.keyCode === KEYCODE.SPACE && !this.props.checkDisabled) {
            this.handleCheck(e);
        }

        this.props.onKeyDown && this.props.onKeyDown(e);
    }

    handleClick(e) {
        this.handleCheck(e);

        this.props.onClick && this.props.onClick(e);
    }

    renderCheck() {
        const {
            root,
            checked,
            indeterminate,
            disabled,
            checkType,
            checkDisabled,
            onChange,
        } = this.props;
        const { labelToggleChecked } = root.props;
        const Check = checkType === 'radio' ? Radio : Checkbox;

        const checkProps = {
            tabIndex: '-1',
            checked,
            disabled: disabled || checkDisabled,
        };
        if (checkType === 'checkbox') {
            checkProps.indeterminate = indeterminate;
        }
        if (!labelToggleChecked) {
            checkProps.onChange = onChange;
            checkProps.onClick = this.stopPropagation;
        }

        return <Check aria-labelledby={this.id} {...checkProps} />;
    }

    render() {
        const {
            _key,
            root,
            checked,
            disabled,
            onClick,
            helper,
            children,
        } = this.props;
        const { prefix, labelToggleChecked } = root.props;
        const others = pickOthers(
            Object.keys(CheckableItem.propTypes),
            this.props
        );

        const newProps = {
            _key,
            root,
            disabled,
            type: 'item',
            onClick,
            onKeyDown: this.handleKeyDown,
            ...others,
        };
        if (labelToggleChecked && !disabled) {
            newProps.onClick = this.handleClick;
        }

        return (
            <Item aria-checked={checked} {...newProps}>
                {this.renderCheck()}
                <span className={`${prefix}menu-item-text`} id={this.id}>
                    {children}
                </span>
                {helper ? (
                    <div className={`${prefix}menu-item-helper`}>{helper}</div>
                ) : null}
            </Item>
        );
    }
}
