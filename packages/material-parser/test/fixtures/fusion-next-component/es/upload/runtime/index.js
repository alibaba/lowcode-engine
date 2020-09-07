import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React from 'react';
import Html5Uploader from './html5-uploader';
import IframeUploader from './iframe-uploader';

var Uploader = function (_React$Component) {
    _inherits(Uploader, _React$Component);

    function Uploader() {
        var _temp, _this, _ret;

        _classCallCheck(this, Uploader);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
            Component: Html5Uploader
        }, _this.saveUploaderRef = function (ref) {
            _this.uploaderRef = ref;
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    Uploader.prototype.componentDidMount = function componentDidMount() {
        if (typeof File === 'undefined') {
            /* eslint react/no-did-mount-set-state:0 */
            this.setState({
                Component: IframeUploader
            });
        }
    };

    Uploader.prototype.abort = function abort(file) {
        this.uploaderRef.abort(file);
    };

    Uploader.prototype.startUpload = function startUpload(files) {
        this.uploaderRef.startUpload(files);
    };

    Uploader.prototype.render = function render() {
        var Uploader = this.state.Component;
        return React.createElement(Uploader, _extends({}, this.props, { ref: this.saveUploaderRef }));
    };

    return Uploader;
}(React.Component);

Uploader.displayName = 'Uploader';
export { Uploader as default };