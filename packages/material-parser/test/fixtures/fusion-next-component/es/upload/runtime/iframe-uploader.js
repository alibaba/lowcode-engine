import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp, _initialiseProps;

import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { log, func, obj } from '../../util';
import { uid } from '../util';

var INPUT_STYLE = {
    position: 'absolute',
    top: 0,
    right: 0,
    fontSize: 9999,
    zIndex: 9999,
    opacity: 0,
    outline: 'none',
    cursor: 'pointer'
};

var IframeUploader = (_temp = _class = function (_React$Component) {
    _inherits(IframeUploader, _React$Component);

    function IframeUploader(props) {
        _classCallCheck(this, IframeUploader);

        var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

        _initialiseProps.call(_this);

        _this.domain = typeof document !== 'undefined' && document.domain ? document.domain : '';
        _this.uid = uid();
        return _this;
    }

    IframeUploader.prototype.componentDidMount = function componentDidMount() {
        this.updateInputWH();
    };

    IframeUploader.prototype.componentDidUpdate = function componentDidUpdate() {
        this.updateInputWH();
    };

    IframeUploader.prototype.startUpload = function startUpload() {
        this.upload(this.file);
    };

    IframeUploader.prototype.upload = function upload(file) {
        var _this2 = this;

        if (!this.state.uploading) {
            // eslint-disable-next-line
            this.state.uploading = true;
            this.setState({ uploading: true });
        }

        var _props = this.props,
            beforeUpload = _props.beforeUpload,
            action = _props.action,
            name = _props.name,
            data = _props.data;

        if (!beforeUpload) {
            return this.post(file);
        }
        var requestData = {
            action: action,
            name: name,
            data: data
        };
        var before = beforeUpload(file, requestData);
        if (before && before.then) {
            before.then(function (data) {
                _this2.post(file, data);
            }, function () {
                _this2.endUpload();
            });
        } else if (before !== false) {
            this.post(file, obj.isPlainObject(before) ? before : undefined);
        } else {
            this.endUpload();
        }
    };

    IframeUploader.prototype.endUpload = function endUpload() {
        this.file = {};
        if (this.state.uploading) {
            // eslint-disable-next-line
            this.state.uploading = false;
            this.setState({ uploading: false });
        }
    };

    IframeUploader.prototype.updateInputWH = function updateInputWH() {
        var rootNode = ReactDOM.findDOMNode(this);
        var inputNode = this.refs.input;
        inputNode.style.height = rootNode.offsetHeight + 'px';
        inputNode.style.width = rootNode.offsetWidth + 'px';
    };

    IframeUploader.prototype.abort = function abort(file) {
        if (file) {
            var _uid = file;
            if (file && file.uid) {
                _uid = file.uid;
            }
            if (_uid === this.file.uid) {
                this.endUpload();
            }
        } else {
            this.endUpload();
        }
    };

    IframeUploader.prototype.post = function post(file) {
        var requestOption = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var formNode = this.refs.form;
        var dataSpan = this.refs.data;
        var fileInput = this.refs.input;

        var propsData = this.props.data;
        if (typeof propsData === 'function') {
            propsData = propsData(file);
        }

        var action = requestOption.action,
            name = requestOption.name,
            data = requestOption.data;

        if (name) {
            fileInput.setAttribute('name', name);
        }

        if (action) {
            formNode.setAttribute('action', action);
        }

        if (data) {
            propsData = data;
        }

        var inputs = document.createDocumentFragment();
        for (var key in propsData) {
            if (data.hasOwnProperty(key)) {
                var input = document.createElement('input');
                input.setAttribute('name', key);
                input.value = propsData[key];
                inputs.appendChild(input);
            }
        }
        dataSpan.appendChild(inputs);
        formNode.submit();
        dataSpan.innerHTML = '';
        this.props.onStart(file);
    };

    IframeUploader.prototype.render = function render() {
        var _props2 = this.props,
            disabled = _props2.disabled,
            className = _props2.className,
            children = _props2.children,
            accept = _props2.accept,
            name = _props2.name,
            style = _props2.style;
        var uid = this.uid;

        var iframeName = name + '-' + uid + '-iframe';

        return React.createElement(
            'span',
            {
                className: className,
                style: _extends({
                    position: 'relative',
                    zIndex: 0,
                    display: 'inline-block'
                }, style)
            },
            !disabled ? React.createElement('iframe', {
                ref: 'iframe',
                name: iframeName,
                onLoad: this.onLoad,
                style: { display: 'none' }
            }) : null,
            React.createElement(
                'form',
                {
                    ref: 'form',
                    method: 'post',
                    action: this.props.action,
                    encType: 'multipart/form-data',
                    target: iframeName
                },
                React.createElement('input', {
                    name: '_documentDomain',
                    value: this.domain,
                    type: 'hidden'
                }),
                React.createElement('span', { ref: 'data' }),
                React.createElement('input', {
                    ref: 'input',
                    type: 'file',
                    accept: accept,
                    name: name,
                    onChange: this.onSelect,
                    style: INPUT_STYLE
                })
            ),
            children
        );
    };

    return IframeUploader;
}(React.Component), _class.propTypes = {
    style: PropTypes.object,
    action: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    data: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    disabled: PropTypes.bool,
    className: PropTypes.string,
    children: PropTypes.node,
    headers: PropTypes.object,
    autoUpload: PropTypes.bool,
    onSelect: PropTypes.func,
    beforeUpload: PropTypes.func,
    onStart: PropTypes.func,
    onSuccess: PropTypes.func,
    onError: PropTypes.func,
    accept: PropTypes.string
}, _class.defaultProps = {
    name: 'file',
    onSelect: func.noop,
    beforeUpload: func.noop,
    onStart: func.noop,
    onSuccess: func.noop,
    onError: func.noop,
    onAbort: func.noop
}, _initialiseProps = function _initialiseProps() {
    var _this3 = this;

    this.state = {
        uploading: false
    };
    this.file = {};
    this.uid = '';

    this.onLoad = function () {
        if (!_this3.state.uploading) {
            return;
        }
        var props = _this3.props,
            file = _this3.file;

        var response = void 0;
        try {
            var doc = _this3.refs.iframe.contentDocument;
            var script = doc.getElementsByTagName('script')[0];
            if (script && script.parentNode === doc.body) {
                doc.body.removeChild(script);
            }
            response = doc.body.innerHTML;
            props.onSuccess(response, file);
        } catch (err) {
            log.warning('cross domain error for Upload. Maybe server should return document.domain script.');
            response = 'cross-domain';
            props.onError(err, null, file);
        }
        _this3.endUpload();
    };

    this.onSelect = function (e) {
        _this3.file = {
            uid: uid(),
            name: e.target.value
        };
        _this3.props.onSelect([_this3.file]);
    };
}, _temp);
IframeUploader.displayName = 'IframeUploader';


export default IframeUploader;