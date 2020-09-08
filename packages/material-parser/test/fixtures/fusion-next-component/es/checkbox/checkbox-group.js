import _extends from 'babel-runtime/helpers/extends';
import _typeof from 'babel-runtime/helpers/typeof';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ConfigProvider from '../config-provider';
import { obj } from '../util';
import Checkbox from './checkbox';

var pickOthers = obj.pickOthers;

/** Checkbox.Group */

var CheckboxGroup = (_temp = _class = function (_Component) {
    _inherits(CheckboxGroup, _Component);

    function CheckboxGroup(props) {
        _classCallCheck(this, CheckboxGroup);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        var value = [];
        if ('value' in props) {
            value = props.value;
        } else if ('defaultValue' in props) {
            value = props.defaultValue;
        }
        if (!Array.isArray(value)) {
            if (value === null || value === undefined) {
                value = [];
            } else {
                value = [value];
            }
        }
        _this.state = {
            value: [].concat(value)
        };

        _this.onChange = _this.onChange.bind(_this);
        return _this;
    }

    CheckboxGroup.prototype.getChildContext = function getChildContext() {
        return {
            __group__: true,
            onChange: this.onChange,
            selectedValue: this.state.value,
            disabled: this.props.disabled
        };
    };

    CheckboxGroup.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        if ('value' in nextProps) {
            var value = nextProps.value;

            if (!Array.isArray(value)) {
                if (value === null || value === undefined) {
                    value = [];
                } else {
                    value = [value];
                }
            }
            this.setState({
                value: value
            });
        }
    };

    CheckboxGroup.prototype.onChange = function onChange(currentValue, e) {
        var value = this.state.value;

        var index = value.indexOf(currentValue);
        var valTemp = [].concat(value);

        if (index === -1) {
            valTemp.push(currentValue);
        } else {
            valTemp.splice(index, 1);
        }

        if (!('value' in this.props)) {
            this.setState({ value: valTemp });
        }
        this.props.onChange(valTemp, e);
    };

    CheckboxGroup.prototype.render = function render() {
        var _this2 = this,
            _classnames;

        var _props = this.props,
            className = _props.className,
            style = _props.style,
            prefix = _props.prefix,
            disabled = _props.disabled,
            itemDirection = _props.itemDirection,
            rtl = _props.rtl,
            isPreview = _props.isPreview,
            renderPreview = _props.renderPreview;

        var others = pickOthers(CheckboxGroup.propTypes, this.props);

        // 如果内嵌标签跟dataSource同时存在，以内嵌标签为主
        var children = void 0;
        var previewed = [];
        if (this.props.children) {
            children = React.Children.map(this.props.children, function (child) {
                if (!React.isValidElement(child)) {
                    return child;
                }
                var checked = _this2.state.value && _this2.state.value.indexOf(child.props.value) > -1;

                if (checked) {
                    previewed.push({
                        label: child.props.children,
                        value: child.props.value
                    });
                }

                return React.cloneElement(child, child.props.rtl === undefined ? { rtl: rtl } : null);
            });
        } else {
            children = this.props.dataSource.map(function (item, index) {
                var option = item;
                if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) !== 'object') {
                    option = {
                        label: item,
                        value: item,
                        disabled: disabled
                    };
                }
                var checked = _this2.state.value && _this2.state.value.indexOf(option.value) > -1;

                if (checked) {
                    previewed.push({
                        label: option.label,
                        value: option.value
                    });
                }

                return React.createElement(Checkbox, {
                    key: index,
                    value: option.value,
                    checked: checked,
                    rtl: rtl,
                    disabled: disabled || option.disabled,
                    label: option.label
                });
            });
        }

        if (isPreview) {
            var previewCls = classnames(className, prefix + 'form-preview');

            if ('renderPreview' in this.props) {
                return React.createElement(
                    'div',
                    _extends({}, others, {
                        dir: rtl ? 'rtl' : undefined,
                        className: previewCls
                    }),
                    renderPreview(previewed, this.props)
                );
            }

            return React.createElement(
                'p',
                _extends({}, others, {
                    dir: rtl ? 'rtl' : undefined,
                    className: previewCls
                }),
                previewed.map(function (item) {
                    return item.label;
                }).join(', ')
            );
        }

        var cls = classnames((_classnames = {}, _classnames[prefix + 'checkbox-group'] = true, _classnames[prefix + 'checkbox-group-' + itemDirection] = true, _classnames[className] = !!className, _classnames.disabled = disabled, _classnames));

        return React.createElement(
            'span',
            _extends({
                dir: rtl ? 'rtl' : undefined
            }, others, {
                className: cls,
                style: style
            }),
            children
        );
    };

    return CheckboxGroup;
}(Component), _class.propTypes = {
    prefix: PropTypes.string,
    rtl: PropTypes.bool,
    /**
     * 自定义类名
     */
    className: PropTypes.string,
    /**
     * 自定义内敛样式
     */
    style: PropTypes.object,
    /**
     * 整体禁用
     */
    disabled: PropTypes.bool,
    /**
     * 可选项列表, 数据项可为 String 或者 Object, 如 `['apple', 'pear', 'orange']` 或者 `[{value: 'apple', label: '苹果',}, {value: 'pear', label: '梨'}, {value: 'orange', label: '橙子'}]`
     */
    dataSource: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.arrayOf(PropTypes.object)]),
    /**
     * 被选中的值列表
     */
    value: PropTypes.oneOfType([PropTypes.array, PropTypes.string, PropTypes.number]),
    /**
     * 默认被选中的值列表
     */
    defaultValue: PropTypes.oneOfType([PropTypes.array, PropTypes.string, PropTypes.number]),
    /**
     * 通过子元素方式设置内部 checkbox
     */
    children: PropTypes.arrayOf(PropTypes.element),
    /**
     * 选中值改变时的事件
     * @param {Array} value 选中项列表
     * @param {Event} e Dom 事件对象
     */
    onChange: PropTypes.func,

    /**
     * 子项目的排列方式
     * - hoz: 水平排列 (default)
     * - ver: 垂直排列
     */
    itemDirection: PropTypes.oneOf(['hoz', 'ver']),
    /**
     * 是否为预览态
     */
    isPreview: PropTypes.bool,
    /**
     * 预览态模式下渲染的内容
     * @param {number} value 评分值
     */
    renderPreview: PropTypes.func
}, _class.defaultProps = {
    dataSource: [],
    onChange: function onChange() {},
    prefix: 'next-',
    itemDirection: 'hoz',
    isPreview: false
}, _class.childContextTypes = {
    onChange: PropTypes.func,
    __group__: PropTypes.bool,
    selectedValue: PropTypes.array,
    disabled: PropTypes.bool
}, _temp);
CheckboxGroup.displayName = 'CheckboxGroup';


export default ConfigProvider.config(CheckboxGroup);