import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { obj, func } from '../util';
import Field from '../field';
import RGrid from '../responsive-grid';

function pickerDefined(obj) {
    var newObj = {};
    Object.keys(obj).forEach(function (i) {
        if (typeof obj[i] !== 'undefined') {
            newObj[i] = obj[i];
        }
    });
    return newObj;
}

function preventDefault(e) {
    e.preventDefault();
}

/** Form */
var Form = (_temp = _class = function (_React$Component) {
    _inherits(Form, _React$Component);

    function Form(props) {
        _classCallCheck(this, Form);

        var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

        _this.onChange = function (name, value) {
            _this.props.onChange(_this._formField.getValues(), {
                name: name,
                value: value,
                field: _this._formField
            });
        };

        _this._formField = null;
        if (props.field !== false) {
            var options = _extends({}, props.fieldOptions, {
                onChange: _this.onChange
            });

            if (props.field) {
                _this._formField = props.field;
                var onChange = _this._formField.options.onChange;
                options.onChange = func.makeChain(onChange, _this.onChange);
                _this._formField.setOptions && _this._formField.setOptions(options);
            } else {
                if ('value' in props) {
                    options.values = props.value;
                }
                _this._formField = new Field(_this, options);
            }

            props.saveField(_this._formField);
        }
        return _this;
    }

    Form.prototype.getChildContext = function getChildContext() {
        return {
            _formField: this.props.field ? this.props.field : this._formField,
            _formSize: this.props.size,
            _formPreview: this.props.isPreview,
            _formFullWidth: this.props.fullWidth
        };
    };

    Form.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        if (this._formField) {
            if ('value' in nextProps && nextProps.value !== this.props.value) {
                this._formField.setValues(nextProps.value);
            }
            if ('error' in nextProps && nextProps.error !== this.props.error) {
                this._formField.setErrors(nextProps.error);
            }
        }
    };

    Form.prototype.render = function render() {
        var _classNames;

        var _props = this.props,
            className = _props.className,
            inline = _props.inline,
            size = _props.size,
            device = _props.device,
            labelAlign = _props.labelAlign,
            labelTextAlign = _props.labelTextAlign,
            onSubmit = _props.onSubmit,
            children = _props.children,
            labelCol = _props.labelCol,
            wrapperCol = _props.wrapperCol,
            style = _props.style,
            prefix = _props.prefix,
            rtl = _props.rtl,
            Tag = _props.component,
            responsive = _props.responsive;


        var formClassName = classNames((_classNames = {}, _classNames[prefix + 'form'] = true, _classNames[prefix + 'inline'] = inline, _classNames['' + prefix + size] = size, _classNames[prefix + 'form-responsive-grid'] = responsive, _classNames[className] = !!className, _classNames));

        var newChildren = React.Children.map(children, function (child) {
            if (child && typeof child.type === 'function' && child.type._typeMark === 'form_item') {
                var childrenProps = {
                    labelCol: child.props.labelCol ? child.props.labelCol : labelCol,
                    wrapperCol: child.props.wrapperCol ? child.props.wrapperCol : wrapperCol,
                    labelAlign: child.props.labelAlign ? child.props.labelAlign : device === 'phone' ? 'top' : labelAlign,
                    labelTextAlign: child.props.labelTextAlign ? child.props.labelTextAlign : labelTextAlign,
                    size: child.props.size ? child.props.size : size,
                    responsive: responsive
                };
                return React.cloneElement(child, pickerDefined(childrenProps));
            }
            return child;
        });

        return React.createElement(
            Tag,
            _extends({
                role: 'grid'
            }, obj.pickOthers(Form.propTypes, this.props), {
                className: formClassName,
                style: style,
                dir: rtl ? 'rtl' : undefined,
                onSubmit: onSubmit
            }),
            responsive ? React.createElement(
                RGrid,
                null,
                newChildren
            ) : newChildren
        );
    };

    return Form;
}(React.Component), _class.propTypes = {
    /**
     * 样式前缀
     */
    prefix: PropTypes.string,
    /**
     * 内联表单
     */
    inline: PropTypes.bool,
    /**
     * 单个 Item 的 size 自定义，优先级高于 Form 的 size, 并且当组件与 Item 一起使用时，组件自身设置 size 属性无效。
     * @enumdesc 大, 中, 小
     */
    size: PropTypes.oneOf(['large', 'medium', 'small']),
    /**
     * 单个 Item 中表单类组件宽度是否是100%
     */
    fullWidth: PropTypes.bool,
    /**
     * 标签的位置
     * @enumdesc 上, 左, 内
     */
    labelAlign: PropTypes.oneOf(['top', 'left', 'inset']),
    /**
     * 标签的左右对齐方式
     * @enumdesc 左, 右
     */
    labelTextAlign: PropTypes.oneOf(['left', 'right']),
    /**
     * field 实例, 传 false 会禁用 field
     */
    field: PropTypes.any,
    /**
     * 保存 Form 自动生成的 field 对象
     */
    saveField: PropTypes.func,
    /**
     * 控制第一级 Item 的 labelCol
     */
    labelCol: PropTypes.object,
    /**
     * 控制第一级 Item 的 wrapperCol
     */
    wrapperCol: PropTypes.object,
    /**
     * form内有 `htmlType="submit"` 的元素的时候会触发
     */
    onSubmit: PropTypes.func,
    /**
     * 子元素
     */
    children: PropTypes.any,
    /**
     * 扩展class
     */
    className: PropTypes.string,
    /**
     * 自定义内联样式
     */
    style: PropTypes.object,
    /**
     * 表单数值
     */
    value: PropTypes.object,
    /**
     * 表单变化回调
     * @param {Object} values 表单数据
     * @param {Object} item 详细
     * @param {String} item.name 变化的组件名
     * @param {String} item.value 变化的数据
     * @param {Object} item.field field 实例
     */
    onChange: PropTypes.func,
    /**
     * 设置标签类型
     */
    component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    fieldOptions: PropTypes.object,
    rtl: PropTypes.bool,
    /**
     * 预设屏幕宽度
     */
    device: PropTypes.oneOf(['phone', 'tablet', 'desktop']),
    /**
     * 是否开启内置的响应式布局 （使用ResponsiveGrid）
     */
    responsive: PropTypes.bool,
    /**
     * 是否开启预览态
     */
    isPreview: PropTypes.bool
}, _class.defaultProps = {
    prefix: 'next-',
    onSubmit: preventDefault,
    size: 'medium',
    labelAlign: 'left',
    onChange: func.noop,
    component: 'form',
    saveField: func.noop,
    device: 'desktop'
}, _class.childContextTypes = {
    _formField: PropTypes.object,
    _formSize: PropTypes.string,
    _formPreview: PropTypes.bool,
    _formFullWidth: PropTypes.bool
}, _temp);
Form.displayName = 'Form';
export { Form as default };