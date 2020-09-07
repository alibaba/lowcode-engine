import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import UIState from '../mixin-ui-state';
import ConfigProvider from '../config-provider';
import { obj, func } from '../util';

var makeChain = func.makeChain,
    noop = func.noop;
/**
 * Radio
 * @order 1
 */

var Radio = (_temp = _class = function (_UIState) {
    _inherits(Radio, _UIState);

    function Radio(props, context) {
        _classCallCheck(this, Radio);

        var _this = _possibleConstructorReturn(this, _UIState.call(this, props));

        var checked = void 0;
        if (context.__group__) {
            checked = context.selectedValue === props.value;
        } else if ('checked' in props) {
            checked = props.checked;
        } else {
            checked = props.defaultChecked;
        }

        _this.state = { checked: checked };

        _this.onChange = _this.onChange.bind(_this);
        _this.disabled = props.disabled || context.__group__ && 'disabled' in context && context.disabled;
        return _this;
    }

    Radio.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps, nextContext) {
        if (nextContext.__group__) {
            var selectedValue = nextContext.selectedValue;

            if ('selectedValue' in nextContext) {
                this.setState({
                    checked: selectedValue === nextProps.value
                });
            }
        } else if ('checked' in nextProps) {
            this.setState({
                checked: nextProps.checked
            });
        }

        this.disabled = nextProps.disabled || nextContext.__group__ && 'disabled' in nextContext && nextContext.disabled;

        // when disabled, reset UIState
        if (this.disabled) {
            // only class has an impact, no effect on visual
            this.resetUIState();
        }
    };

    Radio.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState, nextContext) {
        var shallowEqual = obj.shallowEqual;

        return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState) || !shallowEqual(this.nextContext, nextContext);
    };

    Radio.prototype.onChange = function onChange(e) {
        var checked = e.target.checked;
        var value = this.props.value;

        if (this.context.__group__) {
            this.context.onChange(value, e);
        } else if (this.state.checked !== checked) {
            if (!('checked' in this.props)) {
                this.setState({
                    checked: checked
                });
            }
            this.props.onChange(checked, e);
        }
    };

    Radio.prototype.render = function render() {
        var _classnames, _classnames2, _classnames3;

        /* eslint-disable no-unused-vars */
        var _props = this.props,
            id = _props.id,
            className = _props.className,
            children = _props.children,
            style = _props.style,
            label = _props.label,
            onMouseEnter = _props.onMouseEnter,
            onMouseLeave = _props.onMouseLeave,
            tabIndex = _props.tabIndex,
            rtl = _props.rtl,
            name = _props.name,
            isPreview = _props.isPreview,
            renderPreview = _props.renderPreview,
            value = _props.value,
            otherProps = _objectWithoutProperties(_props, ['id', 'className', 'children', 'style', 'label', 'onMouseEnter', 'onMouseLeave', 'tabIndex', 'rtl', 'name', 'isPreview', 'renderPreview', 'value']);

        var checked = !!this.state.checked;
        var disabled = this.disabled;
        var isButton = this.context.isButton;
        var prefix = this.context.prefix || this.props.prefix;

        var others = obj.pickOthers(Radio.propTypes, otherProps);
        var othersData = obj.pickAttrsWith(others, 'data-');

        if (isPreview) {
            var previewCls = classnames(className, prefix + 'form-preview');

            if ('renderPreview' in this.props) {
                return React.createElement(
                    'div',
                    _extends({
                        id: id,
                        dir: rtl ? 'rtl' : 'ltr'
                    }, others, {
                        className: previewCls
                    }),
                    renderPreview(checked, this.props)
                );
            }

            return React.createElement(
                'p',
                _extends({
                    id: id,
                    dir: rtl ? 'rtl' : 'ltr'
                }, others, {
                    className: previewCls
                }),
                checked && (children || label || value)
            );
        }

        var input = React.createElement('input', _extends({}, obj.pickOthers(othersData, others), {
            name: name,
            id: id,
            tabIndex: tabIndex,
            disabled: disabled,
            checked: checked,
            type: 'radio',
            onChange: this.onChange,
            'aria-checked': checked,
            className: prefix + 'radio-input'
        }));

        // disabled do not hove focus state
        if (!disabled) {
            input = this.getStateElement(input);
        }

        var cls = classnames((_classnames = {}, _classnames[prefix + 'radio'] = true, _classnames.checked = checked, _classnames.disabled = disabled, _classnames[this.getStateClassName()] = true, _classnames));
        var clsInner = classnames((_classnames2 = {}, _classnames2[prefix + 'radio-inner'] = true, _classnames2.press = checked, _classnames2.unpress = !checked, _classnames2));
        var clsWrapper = classnames((_classnames3 = {}, _classnames3[prefix + 'radio-wrapper'] = true, _classnames3[className] = !!className, _classnames3.checked = checked, _classnames3.disabled = disabled, _classnames3[this.getStateClassName()] = true, _classnames3));
        var childrenCls = prefix + 'radio-label';

        var radioComp = !isButton ? React.createElement(
            'span',
            { className: cls },
            React.createElement('span', { className: clsInner }),
            input
        ) : React.createElement(
            'span',
            { className: prefix + 'radio-single-input' },
            input
        );

        return React.createElement(
            'label',
            _extends({}, othersData, {
                dir: rtl ? 'rtl' : 'ltr',
                style: style,
                'aria-checked': checked,
                'aria-disabled': disabled,
                className: clsWrapper,
                onMouseEnter: disabled ? onMouseEnter : makeChain(this._onUIMouseEnter, onMouseEnter),
                onMouseLeave: disabled ? onMouseLeave : makeChain(this._onUIMouseLeave, onMouseLeave)
            }),
            radioComp,
            [children, label].map(function (d, i) {
                return d !== undefined ? React.createElement(
                    'span',
                    { key: i, className: childrenCls },
                    d
                ) : null;
            })
        );
    };

    return Radio;
}(UIState), _class.displayName = 'Radio', _class.propTypes = _extends({}, ConfigProvider.propTypes, {
    /**
     * 自定义类名
     */
    className: PropTypes.string,
    /**
     * 组件input的id
     */
    id: PropTypes.string,
    /**
     * 自定义内敛样式
     */
    style: PropTypes.object,
    /**
     * 设置radio是否选中
     */
    checked: PropTypes.bool,
    /**
     * 设置radio是否默认选中
     */
    defaultChecked: PropTypes.bool,
    /**
     * 通过属性配置label
     */
    label: PropTypes.node,
    /**
     * 状态变化时触发的事件
     * @param {Boolean} checked 是否选中
     * @param {Event} e Dom 事件对象
     */
    onChange: PropTypes.func,
    /**
     * 鼠标进入enter事件
     * @param {Event} e Dom 事件对象
     */
    onMouseEnter: PropTypes.func,
    /**
     * 鼠标离开事件
     * @param {Event} e Dom 事件对象
     */
    onMouseLeave: PropTypes.func,
    /**
     * radio是否被禁用
     */
    disabled: PropTypes.bool,
    /**
     * radio 的value
     */
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
    /**
     * name
     */
    name: PropTypes.string,
    /**
     * 是否为预览态
     */
    isPreview: PropTypes.bool,
    /**
     * 预览态模式下渲染的内容
     * @param {number} value 评分值
     */
    renderPreview: PropTypes.func
}), _class.defaultProps = {
    onChange: noop,
    onMouseLeave: noop,
    onMouseEnter: noop,
    tabIndex: 0,
    prefix: 'next-',
    isPreview: false
}, _class.contextTypes = {
    onChange: PropTypes.func,
    __group__: PropTypes.bool,
    isButton: PropTypes.bool,
    selectedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
    disabled: PropTypes.bool
}, _temp);


export default ConfigProvider.config(Radio);