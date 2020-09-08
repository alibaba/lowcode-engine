import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import ConfigProvider from '../config-provider';
import { log } from '../util';
import { errorCode } from './util';
import _transform from './transform';
import Upload from './upload';
import List from './list';
import Card from './card';
import Dragger from './dragger';
import Selecter from './runtime/selecter';
import Uploader from './runtime/uploader';

Upload.Card = ConfigProvider.config(Card, { componentName: 'Upload' });
Upload.Dragger = ConfigProvider.config(Dragger, { componentName: 'Upload' });
Upload.Selecter = Selecter;
Upload.Uploader = Uploader;
Upload.ErrorCode = errorCode;

// compatible with 0.x version
Upload.ImageUpload = ConfigProvider.config(Card, {
    componentName: 'Upload',
    transform: /* istanbul ignore next */function transform(props, deprecated) {
        deprecated('Upload.ImageUpload', 'Upload.Card', 'Upload');
        var newprops = _transform(props, function () {});
        if (newprops.locale && newprops.locale.image) {
            newprops.locale.card = newprops.locale.image;
        }

        return newprops;
    }
});

// compatible with 0.x version
Upload.DragUpload = ConfigProvider.config(Dragger, {
    componentName: 'Upload',
    transform: /* istanbul ignore next */function transform(props, deprecated) {
        deprecated('Upload.DragUpload', 'Upload.Dragger', 'Upload');
        var newprops = _transform(props, function () {});
        if (!newprops.listType) {
            newprops.listType = 'card';
        }

        return newprops;
    }
});

// compatible with 0.x version
/* istanbul ignore next */
Upload.Core = function (_React$Component) {
    _inherits(Core, _React$Component);

    function Core(props) {
        _classCallCheck(this, Core);

        // eslint-disable-next-line
        var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

        _this.handleSelect = function (files) {
            _this.uploader.startUpload(files);
        };

        var _this$props = _this.props,
            action = _this$props.action,
            name = _this$props.name,
            method = _this$props.method,
            beforeUpload = _this$props.beforeUpload,
            onProgress = _this$props.onProgress,
            onError = _this$props.onError,
            withCredentials = _this$props.withCredentials,
            headers = _this$props.headers,
            data = _this$props.data,
            onSuccess = _this$props.onSuccess;


        _this.uploader = new Uploader({
            action: action,
            name: name,
            method: method,
            beforeUpload: beforeUpload,
            onProgress: onProgress,
            onError: onError,
            withCredentials: withCredentials,
            headers: headers,
            data: data,
            onSuccess: onSuccess
        });
        return _this;
    }

    Core.prototype.abort = function abort() {
        this.uploader.abort();
    };

    Core.prototype.render = function render() {
        log.deprecated('Upload.Core', 'Upload.Selecter and Upload.Uploader', 'Upload');

        // eslint-disable-next-line

        var _props = this.props,
            action = _props.action,
            name = _props.name,
            method = _props.method,
            beforeUpload = _props.beforeUpload,
            onProgress = _props.onProgress,
            onError = _props.onError,
            withCredentials = _props.withCredentials,
            headers = _props.headers,
            data = _props.data,
            onSuccess = _props.onSuccess,
            others = _objectWithoutProperties(_props, ['action', 'name', 'method', 'beforeUpload', 'onProgress', 'onError', 'withCredentials', 'headers', 'data', 'onSuccess']);

        var props = others;

        return React.createElement(Selecter, _extends({}, _transform(props, function () {}), {
            onSelect: this.handleSelect
        }));
    };

    return Core;
}(React.Component);

Upload.List = List;

// compatible with 0.x version
/* istanbul ignore next */
Upload.CropUpload = function () {
    log.deprecated('Upload.CropUpload', '@alife/bc-next-crop-upload', 'Upload');
    return null;
};

export default ConfigProvider.config(Upload, {
    transform: _transform
});