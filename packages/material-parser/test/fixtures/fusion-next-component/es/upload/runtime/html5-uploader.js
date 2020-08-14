import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp2;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { func } from '../../util';
import Uploader from './uploader';
import Selecter from './selecter';

var Html5Uploader = (_temp2 = _class = function (_Component) {
    _inherits(Html5Uploader, _Component);

    function Html5Uploader() {
        var _temp, _this, _ret;

        _classCallCheck(this, Html5Uploader);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.getUploadOptions = function (props) {
            return {
                action: props.action,
                name: props.name,
                timeout: props.timeout,
                method: props.method,
                beforeUpload: props.beforeUpload,
                onProgress: props.onProgress,
                onSuccess: props.onSuccess,
                onError: props.onError,
                withCredentials: props.withCredentials,
                headers: props.headers,
                data: props.data,
                request: props.request
            };
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    Html5Uploader.prototype.componentDidMount = function componentDidMount() {
        var props = this.props;

        var options = this.getUploadOptions(props);
        this.uploader = new Uploader(options);
    };

    Html5Uploader.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        var options = this.getUploadOptions(nextProps);
        this.uploader.setOptions(options);
    };

    Html5Uploader.prototype.componentWillUnmount = function componentWillUnmount() {
        this.abort();
    };

    Html5Uploader.prototype.abort = function abort(file) {
        this.uploader.abort(file);
    };

    Html5Uploader.prototype.startUpload = function startUpload(fileList) {
        this.uploader.startUpload(fileList);
    };

    Html5Uploader.prototype.render = function render() {
        var _props = this.props,
            accept = _props.accept,
            multiple = _props.multiple,
            children = _props.children,
            id = _props.id,
            disabled = _props.disabled,
            dragable = _props.dragable,
            style = _props.style,
            className = _props.className,
            onSelect = _props.onSelect,
            onDragOver = _props.onDragOver,
            onDragLeave = _props.onDragLeave,
            onDrop = _props.onDrop,
            name = _props.name;


        return React.createElement(
            Selecter,
            {
                id: id,
                accept: accept,
                multiple: multiple,
                dragable: dragable,
                disabled: disabled,
                className: className,
                style: style,
                onSelect: onSelect,
                onDragOver: onDragOver,
                onDragLeave: onDragLeave,
                onDrop: onDrop,
                name: name
            },
            children
        );
    };

    return Html5Uploader;
}(Component), _class.propTypes = _extends({}, Selecter.propTypes, {
    /**
     * 上传的地址
     */
    action: PropTypes.string,
    /**
     * 接受上传的文件类型 (image/png, image/jpg, .doc, .ppt) 详见 [input accept attribute](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/Input#attr-accept)
     */
    accept: PropTypes.string,
    /**
     * 上传额外传参
     */
    data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    /**
     * 设置上传的请求头部
     */
    headers: PropTypes.object,
    /**
     * 是否允许请求携带 cookie
     */
    withCredentials: PropTypes.bool,
    /**
     * 上传文件之前
     * @param {Object} file 文件对象
     * @return {Boolean} `false` 停止上传
     */
    beforeUpload: PropTypes.func,
    /**
     * 正在上传文件的钩子，参数为上传的事件以及文件
     */
    onProgress: PropTypes.func,
    /**
     * 上传成功回调函数，参数为请求下响应信息以及文件
     */
    onSuccess: PropTypes.func,
    /**
     * 上传失败回调函数，参数为上传失败的信息、响应信息以及文件
     */
    onError: PropTypes.func,
    children: PropTypes.node,
    /**
     * 上传超时,单位ms
     */
    timeout: PropTypes.number,
    /**
     * 上传方法
     */
    method: PropTypes.oneOf(['post', 'put']),
    request: PropTypes.func
}), _class.defaultProps = _extends({}, Selecter.defaultProps, {
    name: 'file',
    multiple: false,
    withCredentials: true,
    beforeUpload: func.noop,
    onSelect: func.noop,
    onDragOver: func.noop,
    onDragLeave: func.noop,
    onDrop: func.noop,
    onProgress: func.noop,
    onSuccess: func.noop,
    onError: func.noop,
    onAbort: func.noop,
    method: 'post'
}), _temp2);
Html5Uploader.displayName = 'Html5Uploader';
export { Html5Uploader as default };