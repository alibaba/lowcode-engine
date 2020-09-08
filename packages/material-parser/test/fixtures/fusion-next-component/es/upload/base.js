import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import { Component } from 'react';

var Base = function (_Component) {
    _inherits(Base, _Component);

    function Base() {
        var _temp, _this, _ret;

        _classCallCheck(this, Base);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.saveUploaderRef = function (ref) {
            /* istanbul ignore if */
            if (ref && typeof ref.getInstance === 'function') {
                _this.uploaderRef = ref.getInstance();
            } else {
                _this.uploaderRef = ref;
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    /* istanbul ignore next */
    Base.prototype.abort = function abort(file) {
        /* istanbul ignore next */
        this.uploaderRef.abort(file);
    };
    /* istanbul ignore next */


    Base.prototype.startUpload = function startUpload() {
        /* istanbul ignore next */
        this.uploaderRef.startUpload();
    };

    /* istanbul ignore next */
    Base.prototype.isUploading = function isUploading() {
        /* istanbul ignore next */
        return this.uploaderRef.isUploading();
    };

    return Base;
}(Component);

Base.displayName = 'Base';
export { Base as default };