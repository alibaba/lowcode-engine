import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../icon';
import { obj, func } from '../util';
import Base from './base';
import Group from './group';

// preventDefault here can stop onBlur to keep focus state
function preventDefault(e) {
    e.preventDefault();
}

/** Input */
var Input = (_temp = _class = function (_Base) {
    _inherits(Input, _Base);

    function Input(props) {
        _classCallCheck(this, Input);

        var _this = _possibleConstructorReturn(this, _Base.call(this, props));

        _this.handleKeyDown = function (e) {
            if (e.keyCode === 13) {
                _this.props.onPressEnter(e);
            }

            _this.onKeyDown(e);
        };

        _this.handleKeyDownFromClear = function (e) {
            if (e.keyCode === 13) {
                _this.onClear(e);
            }
        };

        var value = void 0;
        if ('value' in props) {
            value = props.value;
        } else {
            value = props.defaultValue;
        }

        _this.state = {
            value: typeof value === 'undefined' ? '' : value
        };
        return _this;
    }

    // `Enter` was considered to be two chars in chrome , but one char in ie.
    // so we make all `Enter` to be two chars


    Input.prototype.getValueLength = function getValueLength(value) {
        var nv = '' + value;
        var strLen = this.props.getValueLength(nv);
        if (typeof strLen !== 'number') {
            strLen = nv.length;
        }

        return strLen;
    };

    Input.prototype.renderControl = function renderControl() {
        var _props = this.props,
            hasClear = _props.hasClear,
            readOnly = _props.readOnly,
            state = _props.state,
            prefix = _props.prefix,
            hint = _props.hint,
            extra = _props.extra,
            locale = _props.locale;


        var lenWrap = this.renderLength();

        var stateWrap = null;
        if (state === 'success') {
            stateWrap = React.createElement(Icon, { type: 'success-filling' });
        } else if (state === 'loading') {
            stateWrap = React.createElement(Icon, { type: 'loading' });
        } else if (state === 'warning') {
            stateWrap = React.createElement(Icon, { type: 'warning' });
        }

        var clearWrap = null;
        var showClear = hasClear && !readOnly && !!('' + this.state.value);

        if (hint || showClear) {
            var hintIcon = null;
            if (hint) {
                hintIcon = React.createElement(Icon, { type: hint, className: prefix + 'input-hint' });
            } else {
                hintIcon = React.createElement(Icon, {
                    type: 'delete-filling',
                    role: 'button',
                    tabIndex: '0',
                    className: prefix + 'input-hint',
                    'aria-label': locale.clear,
                    onClick: this.onClear.bind(this),
                    onMouseDown: preventDefault,
                    onKeyDown: this.handleKeyDownFromClear
                });
            }

            clearWrap = React.createElement(
                'span',
                { className: prefix + 'input-hint-wrap' },
                hasClear && hint ? React.createElement(Icon, {
                    type: 'delete-filling',
                    role: 'button',
                    tabIndex: '0',
                    className: prefix + 'input-clear',
                    'aria-label': locale.clear,
                    onClick: this.onClear.bind(this),
                    onMouseDown: preventDefault,
                    onKeyDown: this.handleKeyDownFromClear
                }) : null,
                hintIcon
            );
        }

        if (state === 'loading') {
            clearWrap = null;
        }

        return clearWrap || lenWrap || stateWrap || extra ? React.createElement(
            'span',
            { className: prefix + 'input-control' },
            clearWrap,
            lenWrap,
            stateWrap,
            extra
        ) : null;
    };

    Input.prototype.renderLabel = function renderLabel() {
        var _props2 = this.props,
            label = _props2.label,
            prefix = _props2.prefix,
            id = _props2.id;

        return label ? React.createElement(
            'label',
            { className: prefix + 'input-label', htmlFor: id },
            label
        ) : null;
    };

    Input.prototype.renderInner = function renderInner(inner, cls) {
        return inner ? React.createElement(
            'span',
            { className: cls },
            inner
        ) : null;
    };

    Input.prototype.onClear = function onClear(e) {
        if (this.props.disabled) {
            return;
        }

        // 非受控模式清空内部数据
        if (!('value' in this.props)) {
            this.setState({
                value: ''
            });
        }
        this.props.onChange('', e, 'clear');
        this.focus();
    };

    Input.prototype.render = function render() {
        var _classNames, _classNames2, _classNames3, _classNames4, _classNames5, _classNames6, _classNames7;

        var _props3 = this.props,
            size = _props3.size,
            htmlType = _props3.htmlType,
            htmlSize = _props3.htmlSize,
            autoComplete = _props3.autoComplete,
            autoFocus = _props3.autoFocus,
            disabled = _props3.disabled,
            style = _props3.style,
            innerBefore = _props3.innerBefore,
            innerAfter = _props3.innerAfter,
            innerBeforeClassName = _props3.innerBeforeClassName,
            innerAfterClassName = _props3.innerAfterClassName,
            className = _props3.className,
            hasBorder = _props3.hasBorder,
            prefix = _props3.prefix,
            isPreview = _props3.isPreview,
            renderPreview = _props3.renderPreview,
            addonBefore = _props3.addonBefore,
            addonAfter = _props3.addonAfter,
            addonTextBefore = _props3.addonTextBefore,
            addonTextAfter = _props3.addonTextAfter,
            inputRender = _props3.inputRender,
            rtl = _props3.rtl;


        var hasAddon = addonBefore || addonAfter || addonTextBefore || addonTextAfter;
        var cls = classNames(this.getClass(), (_classNames = {}, _classNames['' + prefix + size] = true, _classNames[prefix + 'hidden'] = this.props.htmlType === 'hidden', _classNames[prefix + 'noborder'] = !hasBorder || this.props.htmlType === 'file', _classNames[prefix + 'input-group-auto-width'] = hasAddon, _classNames[className] = !!className && !hasAddon, _classNames));

        var innerCls = prefix + 'input-inner';
        var innerBeforeCls = classNames((_classNames2 = {}, _classNames2[innerCls] = true, _classNames2[prefix + 'before'] = true, _classNames2[innerBeforeClassName] = innerBeforeClassName, _classNames2));
        var innerAfterCls = classNames((_classNames3 = {}, _classNames3[innerCls] = true, _classNames3[prefix + 'after'] = true, _classNames3[innerAfterClassName] = innerAfterClassName, _classNames3));
        var previewCls = classNames((_classNames4 = {}, _classNames4[prefix + 'form-preview'] = true, _classNames4[className] = !!className, _classNames4));

        var props = this.getProps();
        // custom data attributes are assigned to the top parent node
        // data-类自定义数据属性分配到顶层node节点
        var dataProps = obj.pickAttrsWith(this.props, 'data-');
        // Custom props are transparently transmitted to the core input node by default
        // 自定义属性默认透传到核心node节点：input
        var others = obj.pickOthers(_extends({}, dataProps, Input.propTypes), this.props);

        if (isPreview) {
            var value = props.value;
            var label = this.props.label;

            if (typeof renderPreview === 'function') {
                return React.createElement(
                    'div',
                    _extends({}, others, { className: previewCls }),
                    renderPreview(value, this.props)
                );
            }
            return React.createElement(
                'div',
                _extends({}, others, { className: previewCls }),
                addonBefore || addonTextBefore,
                label,
                innerBefore,
                value,
                innerAfter,
                addonAfter || addonTextAfter
            );
        }

        var inputEl = React.createElement('input', _extends({}, others, props, {
            height: '100%',
            type: htmlType,
            size: htmlSize,
            autoFocus: autoFocus,
            autoComplete: autoComplete,
            onKeyDown: this.handleKeyDown,
            ref: this.saveRef
        }));

        var inputWrap = React.createElement(
            'span',
            _extends({}, dataProps, {
                dir: rtl ? 'rtl' : undefined,
                className: cls,
                style: hasAddon ? undefined : style
            }),
            this.renderLabel(),
            this.renderInner(innerBefore, innerBeforeCls),
            inputRender(inputEl),
            this.renderInner(innerAfter, innerAfterCls),
            this.renderControl()
        );

        var groupCls = classNames((_classNames5 = {}, _classNames5[prefix + 'input-group-text'] = true, _classNames5['' + prefix + size] = !!size, _classNames5[prefix + 'disabled'] = disabled, _classNames5));

        var addonBeforeCls = classNames((_classNames6 = {}, _classNames6[groupCls] = addonTextBefore, _classNames6));
        var addonAfterCls = classNames((_classNames7 = {}, _classNames7[groupCls] = addonTextAfter, _classNames7));

        if (hasAddon) {
            return React.createElement(
                Group,
                _extends({}, dataProps, {
                    className: className,
                    style: style,
                    addonBefore: addonBefore || addonTextBefore,
                    addonBeforeClassName: addonBeforeCls,
                    addonAfter: addonAfter || addonTextAfter,
                    addonAfterClassName: addonAfterCls
                }),
                inputWrap
            );
        }

        return inputWrap;
    };

    return Input;
}(Base), _class.propTypes = _extends({}, Base.propTypes, {
    /**
     * label
     */
    label: PropTypes.node,
    /**
     * 是否出现clear按钮
     */
    hasClear: PropTypes.bool,
    /**
     * 是否有边框
     */
    hasBorder: PropTypes.bool,
    /**
     * 状态
     * @enumdesc 错误, 校验中, 成功, 警告
     */
    state: PropTypes.oneOf(['error', 'loading', 'success', 'warning']),
    /**
     * 尺寸
     * @enumdesc 小, 中, 大
     */
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    /**
     * 按下回车的回调
     */
    onPressEnter: PropTypes.func,

    onClear: PropTypes.func,
    /**
     * 原生type
     */
    htmlType: PropTypes.string,
    htmlSize: PropTypes.string,
    /**
     * 水印 (Icon的type类型，和hasClear占用一个地方)
     */
    hint: PropTypes.string,
    /**
     * 文字前附加内容
     */
    innerBefore: PropTypes.node,
    /**
     * 文字后附加内容
     */
    innerAfter: PropTypes.node,
    /**
     * 输入框前附加内容
     */
    addonBefore: PropTypes.node,
    /**
     * 输入框后附加内容
     */
    addonAfter: PropTypes.node,
    /**
     * 输入框前附加文字
     */
    addonTextBefore: PropTypes.node,
    /**
     * 输入框后附加文字
     */
    addonTextAfter: PropTypes.node,
    /**
     * (原生input支持)
     */
    autoComplete: PropTypes.string,
    /**
     * 自动聚焦(原生input支持)
     */
    autoFocus: PropTypes.bool,
    inputRender: PropTypes.func,
    extra: PropTypes.node,
    innerBeforeClassName: PropTypes.string,
    innerAfterClassName: PropTypes.string,
    /**
     * 是否为预览态
     */
    isPreview: PropTypes.bool,
    /**
     * 预览态模式下渲染的内容
     * @param {number} value 评分值
     */
    renderPreview: PropTypes.func
}), _class.defaultProps = _extends({}, Base.defaultProps, {
    size: 'medium',
    autoComplete: 'off',
    hasBorder: true,
    isPreview: false,
    onPressEnter: func.noop,
    inputRender: function inputRender(el) {
        return el;
    }
}), _temp);
export { Input as default };