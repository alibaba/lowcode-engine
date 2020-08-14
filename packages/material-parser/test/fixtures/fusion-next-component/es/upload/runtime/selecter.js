import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp2;

import React from 'react';
import PropTypes from 'prop-types';
import { func } from '../../util';
import { uid } from '../util';

var noop = func.noop;

/**
 * Upload.Selecter
 * @description [底层能力] 可自定义样式的文件选择器
 */

var Selecter = (_temp2 = _class = function (_React$Component) {
    _inherits(Selecter, _React$Component);

    function Selecter() {
        var _temp, _this, _ret;

        _classCallCheck(this, Selecter);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.onSelect = function (e) {
            var files = e.target.files;
            var filesArr = files.length ? Array.prototype.slice.call(files) : [files];

            filesArr.forEach(function (file) {
                file.uid = uid();
            });

            _this.props.onSelect(filesArr);
        }, _this.onClick = function () {
            var el = _this.fileRef;
            if (!el) {
                return;
            }
            // NOTE: 在 IE 下，el.value = '' 在 el.click() 之后，会触发 input[type=file] 两次 onChange
            el.value = '';
            el.click();
        }, _this.onKeyDown = function (e) {
            if (e.key === 'Enter') {
                _this.onClick();
            }
        }, _this.onDrop = function (e) {
            e.preventDefault();

            var files = e.dataTransfer.files;
            var filesArr = Array.prototype.slice.call(files);

            _this.props.onDrop(filesArr);
        }, _this.onDragOver = function (e) {
            e.preventDefault();
            _this.props.onDragOver(e);
        }, _this.saveFileRef = function (ref) {
            _this.fileRef = ref;
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    /**
     * 点击上传按钮
     * @return {void}
     */


    /**
     * 键盘事件
     * @param  {SyntheticEvent} e
     * @return {void}
     */


    /**
     * 拖拽
     * @param  {SyntheticEvent} e
     * @return {void}
     */


    Selecter.prototype.render = function render() {
        var _props = this.props,
            accept = _props.accept,
            multiple = _props.multiple,
            children = _props.children,
            id = _props.id,
            disabled = _props.disabled,
            dragable = _props.dragable,
            style = _props.style,
            className = _props.className,
            name = _props.name;


        var events = {};
        if (!disabled) {
            events = _extends({
                onClick: this.onClick,
                onKeyDown: this.onKeyDown,
                tabIndex: '0'
            }, dragable ? {
                onDrop: this.onDrop,
                onDragOver: this.onDragOver,
                onDragLeave: this.props.onDragLeave
            } : {});
        }

        return React.createElement(
            'div',
            _extends({
                role: 'application',
                style: style,
                className: className
            }, events),
            React.createElement('input', {
                type: 'file',
                name: name,
                id: id,
                ref: this.saveFileRef,
                style: { display: 'none' },
                accept: accept,
                'aria-hidden': true,
                multiple: multiple,
                onChange: this.onSelect,
                disabled: disabled
            }),
            children
        );
    };

    return Selecter;
}(React.Component), _class.propTypes = {
    id: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string,
    /**
     * 是否禁用上传功能
     */
    disabled: PropTypes.bool,
    /**
     * 是否支持多选文件，`ie10+` 支持。开启后按住 ctrl 可选择多个文件
     */
    multiple: PropTypes.bool,
    /**
     * 是否支持拖拽上传，`ie10+` 支持。
     */
    dragable: PropTypes.bool,
    /**
     * 接受上传的文件类型 (image/png, image/jpg, .doc, .ppt) 详见 [input accept attribute](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/Input#attr-accept)
     */
    accept: PropTypes.string,
    /**
     * 文件选择回调
     */
    onSelect: PropTypes.func,
    /**
     * 拖拽经过回调
     */
    onDragOver: PropTypes.func,
    /**
     * 拖拽离开回调
     */
    onDragLeave: PropTypes.func,
    /**
     * 拖拽完成回调
     */
    onDrop: PropTypes.func,
    children: PropTypes.node,
    name: PropTypes.string
}, _class.defaultProps = {
    name: 'file',
    multiple: false,
    onSelect: noop,
    onDragOver: noop,
    onDragLeave: noop,
    onDrop: noop
}, _temp2);
Selecter.displayName = 'Selecter';
export { Selecter as default };