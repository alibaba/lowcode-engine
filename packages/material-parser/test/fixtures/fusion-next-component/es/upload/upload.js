import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp, _initialiseProps;

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { func, obj } from '../util';
import Icon from '../icon';
import Base from './base';
import Uploader from './runtime/index';
import html5Uploader from './runtime/html5-uploader';
import List from './list';
import { fileToObject, getFileItem, errorCode } from './util';

var noop = func.noop;

/**
 * Upload
 */
var Upload = (_temp = _class = function (_Base) {
    _inherits(Upload, _Base);

    function Upload(props) {
        _classCallCheck(this, Upload);

        var _this = _possibleConstructorReturn(this, _Base.call(this, props));

        _initialiseProps.call(_this);

        var value = void 0;
        if ('value' in props) {
            value = props.value;
        } else {
            value = props.defaultValue;
        }

        _this.state = {
            value: typeof value === 'undefined' ? [] : [].concat(value)
        };

        _this.uploading = false;
        return _this;
    }

    Upload.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        if ('value' in nextProps && !this.uploading) {
            this.setState({
                value: typeof nextProps.value === 'undefined' ? [] : [].concat(nextProps.value)
            });
        }
    };

    /**
     * 对外暴露API, 添加文件
     * @param files
     */
    Upload.prototype.selectFiles = function selectFiles(files) {
        var filesArr = files.length ? Array.prototype.slice.call(files) : [files];

        this.onSelect(filesArr);
    };

    Upload.prototype.uploadFiles = function uploadFiles(files) {
        // NOTE: drag上传，当鼠标松开的时候回执行 onDrop，但此时onChange还没出发所以 value=[], 必须提前标识上传中
        this.uploading = true;
        var fileList = files.filter(function (file) {
            if (file.state === 'selected') {
                file.state = 'uploading';
                return true;
            }
            return false;
        }).map(function (file) {
            return file.originFileObj;
        });

        fileList.length && this.uploaderRef.startUpload(fileList);
    };

    /**
     * 对外暴露api，控制文件上传
     */


    Upload.prototype.startUpload = function startUpload() {
        this.uploadFiles(this.state.value);
    };

    Upload.prototype.replaceFiles = function replaceFiles(old, current) {
        var targetItem = getFileItem(old, this.state.value);
        if (!targetItem) {
            return;
        }

        current.uid = old.uid;
        targetItem.originFileObj = current;
    };

    Upload.prototype.isUploading = function isUploading() {
        return this.uploading;
    };

    /**
     * 删除文件
     * @param {File} file
     * @return {void}
     */


    /**
     * 取消上传
     * @param {File} file
     * @return {void}
     */


    Upload.prototype.render = function render() {
        var _classNames, _classNames2;

        var _props = this.props,
            listType = _props.listType,
            prefix = _props.prefix,
            dragable = _props.dragable,
            shape = _props.shape,
            className = _props.className,
            style = _props.style,
            useDataURL = _props.useDataURL,
            disabled = _props.disabled,
            limit = _props.limit,
            closable = _props.closable,
            beforeUpload = _props.beforeUpload,
            readonly = _props.readonly,
            onRemove = _props.onRemove,
            onCancel = _props.onCancel,
            onPreview = _props.onPreview,
            list = _props.list,
            extraRender = _props.extraRender,
            progressProps = _props.progressProps,
            rtl = _props.rtl,
            isPreview = _props.isPreview,
            renderPreview = _props.renderPreview,
            others = _objectWithoutProperties(_props, ['listType', 'prefix', 'dragable', 'shape', 'className', 'style', 'useDataURL', 'disabled', 'limit', 'closable', 'beforeUpload', 'readonly', 'onRemove', 'onCancel', 'onPreview', 'list', 'extraRender', 'progressProps', 'rtl', 'isPreview', 'renderPreview']);

        var cls = classNames((_classNames = {}, _classNames[prefix + 'upload'] = true, _classNames[prefix + 'upload-dragable'] = dragable, _classNames[prefix + 'disabled'] = disabled, _classNames[prefix + 'readonly'] = readonly, _classNames[className] = className, _classNames));

        var isExceedLimit = this.state.value.length >= limit;
        var innerCls = classNames((_classNames2 = {}, _classNames2[prefix + 'upload-inner'] = true, _classNames2[prefix + 'hidden'] = isExceedLimit, _classNames2));

        var children = this.props.children;
        if (shape === 'card') {
            var _classNames3;

            var cardCls = classNames((_classNames3 = {}, _classNames3[prefix + 'upload-card'] = true, _classNames3[prefix + 'disabled'] = disabled, _classNames3));
            children = React.createElement(
                'div',
                { className: cardCls },
                React.createElement(Icon, { type: 'add', size: 'large' }),
                React.createElement(
                    'div',
                    {
                        tabIndex: '0',
                        role: 'button',
                        className: prefix + 'upload-text'
                    },
                    children
                )
            );
        }

        if (isPreview) {
            if (typeof renderPreview === 'function') {
                var _classNames4;

                var previewCls = classNames((_classNames4 = {}, _classNames4[prefix + 'form-preview'] = true, _classNames4[className] = !!className, _classNames4));
                return React.createElement(
                    'div',
                    { style: style, className: previewCls },
                    renderPreview(this.state.value, this.props)
                );
            }

            if (listType) {
                return React.createElement(List, {
                    isPreview: true,
                    listType: listType,
                    style: style,
                    className: className,
                    value: this.state.value
                });
            }

            return null;
        }

        // disabled 状态下把 remove函数替换成禁止 remove的函数
        var onRemoveFunc = disabled ? func.prevent : onRemove;
        var otherAttributes = obj.pickAttrsWith(this.props, 'data-');
        return React.createElement(
            'div',
            _extends({ className: cls, style: style }, otherAttributes),
            React.createElement(
                Uploader,
                _extends({}, others, {
                    beforeUpload: beforeUpload,
                    dragable: dragable,
                    disabled: disabled || isExceedLimit,
                    className: innerCls,
                    onSelect: this.onSelect,
                    onDrop: this.onDrop,
                    onProgress: this.onProgress,
                    onSuccess: this.onSuccess,
                    onError: this.onError,
                    ref: this.saveUploaderRef
                }),
                children
            ),
            listType || list ? React.createElement(List, {
                useDataURL: useDataURL,
                uploader: this,
                listType: listType,
                value: this.state.value,
                closable: closable,
                onRemove: onRemoveFunc,
                progressProps: progressProps,
                onCancel: onCancel,
                onPreview: onPreview,
                extraRender: extraRender,
                rtl: rtl
            }) : null
        );
    };

    return Upload;
}(Base), _class.displayName = 'Upload', _class.propTypes = _extends({}, html5Uploader.propTypes, List.propTypes, {
    /**
     * 样式前缀
     */
    prefix: PropTypes.string.isRequired,
    /**
     * 上传的地址
     */
    action: PropTypes.string,
    /**
     * 文件列表
     */
    value: PropTypes.array,
    /**
     * 默认文件列表
     */
    defaultValue: PropTypes.array,
    /**
     * 上传按钮形状
     */
    shape: PropTypes.oneOf(['card']),
    /**
     * 上传列表的样式
     * @enumdesc 文字, 图文, 卡片
     */
    listType: PropTypes.oneOf(['text', 'image', 'card']),
    list: PropTypes.any,
    /**
     * 文件名字段
     */
    name: PropTypes.string,
    /**
     * 上传额外传参
     */
    data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    /**
     * 数据格式化函数，配合自定义 action 使用，参数为服务器的响应数据，详见 [formatter](#formater)
     * @param {Object} response 返回
     * @param {File} file 文件对象
     */
    formatter: PropTypes.func,
    /**
     * 最大文件上传个数
     */
    limit: PropTypes.number,
    /**
     * 设置上传超时,单位ms
     */
    timeout: PropTypes.number,
    /**
     * 可选参数，是否支持拖拽上传，`ie10+` 支持。
     */
    dragable: PropTypes.bool,
    closable: PropTypes.bool,
    /**
     * 可选参数，是否本地预览
     */
    useDataURL: PropTypes.bool,
    /**
     * 可选参数，是否禁用上传功能
     */
    disabled: PropTypes.bool,
    /**
     * 选择文件回调
     */
    onSelect: PropTypes.func,
    /**
     * 上传中
     */
    onProgress: PropTypes.func,
    /**
     * 上传文件改变时的状态
     * @param {Object} info 文件事件对象
     */
    onChange: PropTypes.func,
    /**
     * 可选参数，上传成功回调函数，参数为请求下响应信息以及文件
     * @param {Object} file 文件
     * @param {Array<Object>} value 值
     */
    onSuccess: PropTypes.func,
    /**
     * 可选参数, 用于校验文件,afterSelect仅在 autoUpload=false 的时候生效,autoUpload=true时,可以使用beforeUpload完全可以替代该功能.
     * @param {Object} file
     * @returns {Boolean} 返回false会阻止上传,其他则表示正常
     */
    afterSelect: PropTypes.func,
    /**
     * 移除文件回调函数
     * @param {Object} file 文件
     * @returns {Boolean|Promise} 返回 false、Promise.resolve(false)、 Promise.reject() 将阻止文件删除
     */
    onRemove: PropTypes.func,
    /**
     * 可选参数，上传失败回调函数，参数为上传失败的信息、响应信息以及文件
     * @param {Object} file 出错的文件
     * @param {Array} value 当前值
     */
    onError: PropTypes.func,
    /**
     * 可选参数, 详见 [beforeUpload](#beforeUpload)
     * @param {Object} file 所有文件
     * @param {Object} options 参数
     * @returns {Boolean|Object|Promise} 返回值作用见demo
     */
    beforeUpload: PropTypes.func,
    /**
     * 放文件
     */
    onDrop: PropTypes.func,
    /**
     * 自定义class
     */
    className: PropTypes.string,
    /**
     * 自定义内联样式
     */
    style: PropTypes.object,
    /**
     * 子元素
     */
    children: PropTypes.node,
    /**
     * 自动上传
     */
    autoUpload: PropTypes.bool,
    /**
     * 自定义上传方法
     * @param {Object} option
     * @return {Object} object with abort method
     */
    request: PropTypes.func,
    /**
     * 透传给Progress props
     */
    progressProps: PropTypes.object,
    rtl: PropTypes.bool,
    /**
     * 是否为预览态
     */
    isPreview: PropTypes.bool,
    /**
     * 预览态模式下渲染的内容
     * @param {number} value 评分值
     */
    renderPreview: PropTypes.func
}), _class.defaultProps = _extends({}, html5Uploader.defaultProps, {
    prefix: 'next-',
    limit: Infinity,
    autoUpload: true,
    closable: true,
    onSelect: noop,
    onProgress: noop,
    onChange: noop,
    onSuccess: noop,
    onRemove: noop,
    onError: noop,
    onDrop: noop,
    beforeUpload: noop,
    afterSelect: noop
}), _initialiseProps = function _initialiseProps() {
    var _this2 = this;

    this.onSelect = function (files) {
        var _props2 = _this2.props,
            autoUpload = _props2.autoUpload,
            afterSelect = _props2.afterSelect,
            onSelect = _props2.onSelect,
            limit = _props2.limit;
        // 总数

        var total = _this2.state.value.length + files.length;
        // 差额
        var less = limit - _this2.state.value.length;
        if (less <= 0) {
            // 差额不足 则不上传
            return;
        }

        var fileList = files.map(function (file) {
            var objFile = fileToObject(file);
            objFile.state = 'selected';
            return objFile;
        });

        // 默认全量上传
        var uploadFiles = fileList;
        var discardFiles = [];
        if (total > limit) {
            // 全量上传总数会超过limit 但是 还有差额
            uploadFiles = fileList.slice(0, less);
            discardFiles = fileList.slice(less);
        }

        var value = _this2.state.value.concat(fileList);

        /* eslint-disable-next */
        _this2.state.value = value;

        if (autoUpload) {
            _this2.uploadFiles(uploadFiles);
        }

        onSelect(uploadFiles, value);
        discardFiles.forEach(function (file) {
            // 丢弃的文件
            var err = new Error(errorCode.EXCEED_LIMIT);
            err.code = errorCode.EXCEED_LIMIT;
            _this2.onError(err, null, file);
        });

        if (!autoUpload) {
            uploadFiles.forEach(function (file) {
                var isPassed = afterSelect(file);
                func.promiseCall(isPassed, func.noop, function (error) {
                    _this2.onError(error, null, file); // TODO: handle error message
                });
            });
            _this2.onChange(value, uploadFiles);
        }
    };

    this.onDrop = function (files) {
        _this2.onSelect(files);
        _this2.props.onDrop(files);
    };

    this.onProgress = function (e, file) {
        _this2.uploading = true;

        var value = _this2.state.value;
        var targetItem = getFileItem(file, value);

        if (!targetItem) {
            return;
        }

        _extends(targetItem, {
            state: 'uploading',
            percent: e.percent
        });

        _this2.setState({
            value: value
        });

        _this2.props.onProgress(value, targetItem);
    };

    this.onSuccess = function (response, file) {
        _this2.uploading = false;

        var formatter = _this2.props.formatter;


        if (formatter) {
            response = formatter(response, file);
        }

        try {
            if (typeof response === 'string') {
                response = JSON.parse(response);
            }
        } catch (e) {
            e.code = errorCode.RESPONSE_FAIL;
            return _this2.onError(e, response, file);
        }

        if (response.success === false) {
            var err = new Error(response.message || errorCode.RESPONSE_FAIL);
            err.code = errorCode.RESPONSE_FAIL;
            return _this2.onError(err, response, file);
        }

        var value = _this2.state.value;
        var targetItem = getFileItem(file, value);

        if (!targetItem) {
            return;
        }

        _extends(targetItem, {
            state: 'done',
            response: response,
            url: response.url,
            downloadURL: response.downloadURL || response.url // 下载地址(可选)
        });

        if (!_this2.props.useDataURL) {
            targetItem.imgURL = response.imgURL || response.url; // 缩略图地址(可选)
        }

        _this2.onChange(value, targetItem);
        _this2.props.onSuccess(targetItem, value);
    };

    this.onError = function (err, response, file) {
        _this2.uploading = false;

        var value = _this2.state.value;
        var targetItem = getFileItem(file, value);

        if (!targetItem) {
            return;
        }

        _extends(targetItem, {
            state: 'error',
            error: err,
            response: response
        });

        _this2.onChange(value, targetItem);
        _this2.props.onError(targetItem, value);
    };

    this.removeFile = function (file) {
        file.state = 'removed';
        _this2.uploaderRef.abort(file); // 删除组件时调用组件的 `abort` 方法中断上传

        var fileList = _this2.state.value;
        var targetItem = getFileItem(file, fileList);
        var index = fileList.indexOf(targetItem);
        if (index !== -1) {
            fileList.splice(index, 1);
            _this2.onChange(fileList, targetItem);
        }
    };

    this.abort = function (file) {
        var fileList = _this2.state.value;
        var targetItem = getFileItem(file, fileList);
        var index = fileList.indexOf(targetItem);
        if (index !== -1) {
            fileList.splice(index, 1);
            _this2.onChange(fileList, targetItem);
        }
        _this2.uploaderRef.abort(file); // 取消上传时调用组件的 `abort` 方法中断上传
    };

    this.onChange = function (value, file) {
        _this2.setState({
            value: value
        });
        _this2.props.onChange(value, file);
    };
}, _temp);


export default Upload;