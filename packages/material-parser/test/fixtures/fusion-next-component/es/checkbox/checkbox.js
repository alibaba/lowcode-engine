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
import Icon from '../icon';
import { obj, func } from '../util';

var noop = func.noop;
function isChecked(selectedValue, value) {
    return selectedValue.indexOf(value) > -1;
}
/**
 * Checkbox
 * @order 1
 */
var Checkbox = (_temp = _class = function (_UIState) {
    _inherits(Checkbox, _UIState);

    function Checkbox(props, context) {
        _classCallCheck(this, Checkbox);

        var _this = _possibleConstructorReturn(this, _UIState.call(this, props));

        var checked = void 0,
            indeterminate = void 0;

        if ('checked' in props) {
            checked = props.checked;
        } else {
            checked = props.defaultChecked;
        }

        if ('indeterminate' in props) {
            indeterminate = props.indeterminate;
        } else {
            indeterminate = props.defaultIndeterminate;
        }
        if (context.__group__) {
            checked = isChecked(context.selectedValue, props.value);
        }
        _this.state = {
            checked: checked,
            indeterminate: indeterminate
        };

        _this.disabled = props.disabled || context.__group__ && 'disabled' in context && context.disabled;
        _this.onChange = _this.onChange.bind(_this);
        return _this;
    }

    Checkbox.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps, nextContext) {
        if (nextContext.__group__) {
            if ('selectedValue' in nextContext) {
                this.setState({
                    checked: isChecked(nextContext.selectedValue, nextProps.value)
                });
            }

            this.disabled = nextProps.disabled || 'disabled' in nextContext && nextContext.disabled;
        } else {
            if ('checked' in nextProps) {
                this.setState({
                    checked: nextProps.checked
                });
            }
            this.disabled = nextProps.disabled;
        }

        if ('indeterminate' in nextProps) {
            this.setState({
                indeterminate: nextProps.indeterminate
            });
        }
    };

    Checkbox.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState, nextContext) {
        var shallowEqual = obj.shallowEqual;

        return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState) || !shallowEqual(this.context, nextContext);
    };

    Checkbox.prototype.onChange = function onChange(e) {
        var checked = e.target.checked;
        var value = this.props.value;

        if (this.disabled) {
            return;
        }
        if (this.context.__group__) {
            this.context.onChange(value, e);
        } else {
            if (!('checked' in this.props)) {
                this.setState({
                    checked: checked
                });
            }

            if (!('indeterminate' in this.props)) {
                this.setState({
                    indeterminate: false
                });
            }
            this.props.onChange(checked, e);
        }
    };

    Checkbox.prototype.render = function render() {
        var _classnames;

        /* eslint-disable no-unused-vars */
        var _props = this.props,
            id = _props.id,
            className = _props.className,
            children = _props.children,
            style = _props.style,
            label = _props.label,
            onMouseEnter = _props.onMouseEnter,
            onMouseLeave = _props.onMouseLeave,
            rtl = _props.rtl,
            isPreview = _props.isPreview,
            renderPreview = _props.renderPreview,
            value = _props.value,
            name = _props.name,
            otherProps = _objectWithoutProperties(_props, ['id', 'className', 'children', 'style', 'label', 'onMouseEnter', 'onMouseLeave', 'rtl', 'isPreview', 'renderPreview', 'value', 'name']);

        var checked = !!this.state.checked;
        var disabled = this.disabled;
        var indeterminate = !!this.state.indeterminate;
        var prefix = this.context.prefix || this.props.prefix;

        var others = obj.pickOthers(Checkbox.propTypes, otherProps);
        var othersData = obj.pickAttrsWith(others, 'data-');
        if (otherProps.title) {
            othersData.title = otherProps.title;
        }

        var childInput = React.createElement('input', _extends({}, obj.pickOthers(Checkbox.propTypes, otherProps), {
            id: id,
            value: value,
            name: name,
            disabled: disabled,
            checked: checked,
            type: 'checkbox',
            onChange: this.onChange,
            'aria-checked': indeterminate ? 'mixed' : checked,
            className: prefix + 'checkbox-input'
        }));

        // disable 无状态操作
        if (!disabled) {
            childInput = this.getStateElement(childInput);
        }
        var cls = classnames((_classnames = {}, _classnames[prefix + 'checkbox-wrapper'] = true, _classnames[className] = !!className, _classnames.checked = checked, _classnames.disabled = disabled, _classnames.indeterminate = indeterminate, _classnames[this.getStateClassName()] = true, _classnames));
        var labelCls = prefix + 'checkbox-label';
        var type = indeterminate ? 'semi-select' : 'select';

        if (isPreview) {
            var previewCls = classnames(className, prefix + 'form-preview');
            if ('renderPreview' in this.props) {
                return React.createElement(
                    'div',
                    _extends({
                        id: id,
                        dir: rtl ? 'rtl' : undefined
                    }, othersData, {
                        className: previewCls
                    }),
                    renderPreview(checked, this.props)
                );
            }

            return React.createElement(
                'p',
                _extends({
                    id: id,
                    dir: rtl ? 'rtl' : undefined
                }, othersData, {
                    className: previewCls
                }),
                checked && (children || label || this.state.value)
            );
        }

        return React.createElement(
            'label',
            _extends({}, othersData, {
                className: cls,
                style: style,
                dir: rtl ? 'rtl' : undefined,
                onMouseEnter: onMouseEnter,
                onMouseLeave: onMouseLeave
            }),
            React.createElement(
                'span',
                { className: prefix + 'checkbox' },
                React.createElement(
                    'span',
                    { className: prefix + 'checkbox-inner' },
                    React.createElement(Icon, {
                        type: type,
                        size: 'xs',
                        className: indeterminate ? 'zoomIn' : ''
                    })
                ),
                childInput
            ),
            [label, children].map(function (item, i) {
                return [undefined, null].indexOf(item) === -1 ? React.createElement(
                    'span',
                    { key: i, className: labelCls },
                    item
                ) : null;
            })
        );
    };

    return Checkbox;
}(UIState), _class.displayName = 'Checkbox', _class.propTypes = _extends({}, ConfigProvider.propTypes, {
    prefix: PropTypes.string,
    rtl: PropTypes.bool,
    /**
     * 自定义类名
     */
    className: PropTypes.string,
    /**
     * checkbox id, 挂载在input上
     */
    id: PropTypes.string,
    /**
     * 自定义内敛样式
     */
    style: PropTypes.object,
    /**
     * 选中状态
     */
    checked: PropTypes.bool,
    /**
     * 默认选中状态
     */
    defaultChecked: PropTypes.bool,
    /**
     * 禁用
     */
    disabled: PropTypes.bool,
    /**
     * 通过属性配置label，
     */
    label: PropTypes.node,
    /**
     * Checkbox 的中间状态，只会影响到 Checkbox 的样式，并不影响其 checked 属性
     */
    indeterminate: PropTypes.bool,
    /**
     *  Checkbox 的默认中间态，只会影响到 Checkbox 的样式，并不影响其 checked 属性
     */
    defaultIndeterminate: PropTypes.bool,
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
     * 鼠标离开Leave事件
     * @param {Event} e Dom 事件对象
     */
    onMouseLeave: PropTypes.func,
    /**
     * checkbox 的value
     */
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
    defaultChecked: false,
    defaultIndeterminate: false,
    onChange: noop,
    onMouseEnter: noop,
    onMouseLeave: noop,
    prefix: 'next-',
    isPreview: false
}, _class.contextTypes = {
    onChange: PropTypes.func,
    __group__: PropTypes.bool,
    selectedValue: PropTypes.array,
    disabled: PropTypes.bool,
    prefix: PropTypes.string
}, _temp);


export default ConfigProvider.config(Checkbox);