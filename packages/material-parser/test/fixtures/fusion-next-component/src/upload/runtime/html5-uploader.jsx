import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { func } from '../../util';
import Uploader from './uploader';
import Selecter from './selecter';

export default class Html5Uploader extends Component {
    static propTypes = {
        ...Selecter.propTypes,
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
        request: PropTypes.func,
    };

    static defaultProps = {
        ...Selecter.defaultProps,
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
        method: 'post',
    };

    componentDidMount() {
        const { props } = this;
        const options = this.getUploadOptions(props);
        this.uploader = new Uploader(options);
    }
    componentWillReceiveProps(nextProps) {
        const options = this.getUploadOptions(nextProps);
        this.uploader.setOptions(options);
    }

    componentWillUnmount() {
        this.abort();
    }

    abort(file) {
        this.uploader.abort(file);
    }

    startUpload(fileList) {
        this.uploader.startUpload(fileList);
    }

    getUploadOptions = props => ({
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
        request: props.request,
    });

    render() {
        const {
            accept,
            multiple,
            children,
            id,
            disabled,
            dragable,
            style,
            className,
            onSelect,
            onDragOver,
            onDragLeave,
            onDrop,
            name,
        } = this.props;

        return (
            <Selecter
                id={id}
                accept={accept}
                multiple={multiple}
                dragable={dragable}
                disabled={disabled}
                className={className}
                style={style}
                onSelect={onSelect}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                name={name}
            >
                {children}
            </Selecter>
        );
    }
}
