import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { polyfill } from 'react-lifecycles-compat';
import { obj, func } from '../util';
import Tag from './tag';

const { noop, bindCtx } = func;

/**
 * Tag.Selectable
 */
class Selectable extends Component {
    static propTypes = {
        /**
         * 标签是否被选中，受控用法
         * tag checked or not, a controlled way
         */
        checked: PropTypes.bool,
        /**
         * 标签是否默认被选中，非受控用法
         * tag checked or not by default, a uncontrolled way
         */
        defaultChecked: PropTypes.bool,
        /**
         * 选中状态变化时触发的事件
         * @param {Boolean} checked 是否选中
         * @param {Event} e Dom 事件对象
         */
        onChange: PropTypes.func,
        /**
         * 标签是否被禁用
         */
        disabled: PropTypes.bool,
        className: PropTypes.any,
    };

    static defaultProps = {
        onChange: noop,
    };

    constructor(props) {
        super(props);

        this.state = {
            checked:
                'checked' in props
                    ? props.checked
                    : props.defaultChecked || false,
        };

        bindCtx(this, ['handleClick']);
    }

    static getDerivedStateFromProps(props, state) {
        if (props.checked !== undefined && props.checked !== state.checked) {
            return {
                checked: props.checked,
            };
        }

        return null;
    }

    handleClick(e) {
        e && e.preventDefault();
        // IE9 不支持 pointer-events，还是可能会触发 click 事件
        if (this.props.disabled) {
            return false;
        }

        const { checked } = this.state;

        this.setState({
            checked: !checked,
        });

        this.props.onChange(!checked, e);
    }

    render() {
        const attrFilterTarget = [
            'checked',
            'defaultChecked',
            'onChange',
            'className',
            // 防止这些额外的参数影响 tag 的类型
            '_shape',
            'closable',
        ];

        const others = obj.pickOthers(attrFilterTarget, this.props);
        const isChecked =
            'checked' in this.props ? this.props.checked : this.state.checked;
        const clazz = classNames(this.props.className, {
            checked: isChecked,
        });
        return (
            <Tag
                {...others}
                role="checkbox"
                _shape="checkable"
                aria-checked={isChecked}
                className={clazz}
                onClick={this.handleClick}
            />
        );
    }
}

export default polyfill(Selectable);
