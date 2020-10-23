import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import { func, obj } from '../../util';
import { uid, errorCode } from '../util';
import defaultRequest from './request';

var noop = func.noop;

var Uploader = function () {
    function Uploader(options) {
        _classCallCheck(this, Uploader);

        this.options = _extends({
            beforeUpload: noop,
            onProgress: noop,
            onSuccess: noop,
            onError: noop,
            data: {},
            name: 'file',
            method: 'post'
        }, options);
        this.reqs = {};
    }

    Uploader.prototype.setOptions = function setOptions(options) {
        _extends(this.options, options);
    };

    Uploader.prototype.startUpload = function startUpload(files) {
        var _this = this;

        var filesArr = files.length ? Array.prototype.slice.call(files) : [files];
        filesArr.forEach(function (file) {
            file.uid = file.uid || uid();
            _this.upload(file);
        });
    };

    Uploader.prototype.abort = function abort(file) {
        var reqs = this.reqs;

        if (file) {
            var _uid = file;
            if (file && file.uid) {
                _uid = file.uid;
            }
            if (reqs[_uid]) {
                reqs[_uid].abort();
                delete reqs[_uid];
            }
        } else {
            Object.keys(reqs).forEach(function (uid) {
                if (reqs[uid]) {
                    reqs[uid].abort();
                }
                delete reqs[uid];
            });
        }
    };

    Uploader.prototype.upload = function upload(file) {
        var _this2 = this;

        var _options = this.options,
            beforeUpload = _options.beforeUpload,
            action = _options.action,
            name = _options.name,
            headers = _options.headers,
            timeout = _options.timeout,
            withCredentials = _options.withCredentials,
            method = _options.method,
            data = _options.data;

        var before = beforeUpload(file, {
            action: action,
            name: name,
            headers: headers,
            timeout: timeout,
            withCredentials: withCredentials,
            method: method,
            data: data
        });

        func.promiseCall(before, function (options) {
            if (options === false) {
                var err = new Error(errorCode.BEFOREUPLOAD_REJECT);
                err.code = errorCode.BEFOREUPLOAD_REJECT;
                return _this2.options.onError(err, null, file);
            }
            _this2.post(file, obj.isPlainObject(options) ? options : undefined);
        }, function (error) {
            var err = void 0;
            if (error) {
                err = error;
            } else {
                err = new Error(errorCode.BEFOREUPLOAD_REJECT);
                err.code = errorCode.BEFOREUPLOAD_REJECT;
            }
            _this2.options.onError(err, null, file);
        });
    };

    Uploader.prototype.post = function post(file) {
        var _this3 = this;

        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var requestOptions = _extends({}, this.options, options);
        var action = requestOptions.action,
            name = requestOptions.name,
            headers = requestOptions.headers,
            timeout = requestOptions.timeout,
            withCredentials = requestOptions.withCredentials,
            _onProgress = requestOptions.onProgress,
            _onSuccess = requestOptions.onSuccess,
            _onError = requestOptions.onError,
            method = requestOptions.method;


        var data = requestOptions.data;
        if (typeof data === 'function') {
            data = data(file);
        }

        var uid = file.uid;


        var request = typeof requestOptions.request === 'function' ? requestOptions.request : defaultRequest;
        this.reqs[uid] = request({
            action: action,
            filename: name,
            file: file,
            data: data,
            timeout: timeout,
            headers: headers,
            withCredentials: withCredentials,
            method: method,
            onProgress: function onProgress(e) {
                _onProgress(e, file);
            },
            onSuccess: function onSuccess(ret) {
                delete _this3.reqs[uid];
                _onSuccess(ret, file);
            },
            onError: function onError(err, ret) {
                delete _this3.reqs[uid];
                _onError(err, ret, file);
            }
        });
    };

    return Uploader;
}();

export { Uploader as default };