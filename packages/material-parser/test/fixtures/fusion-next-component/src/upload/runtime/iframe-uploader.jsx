import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { log, func, obj } from '../../util';
import { uid } from '../util';

const INPUT_STYLE = {
    position: 'absolute',
    top: 0,
    right: 0,
    fontSize: 9999,
    zIndex: 9999,
    opacity: 0,
    outline: 'none',
    cursor: 'pointer',
};

class IframeUploader extends React.Component {
    static propTypes = {
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
        accept: PropTypes.string,
    };

    static defaultProps = {
        name: 'file',
        onSelect: func.noop,
        beforeUpload: func.noop,
        onStart: func.noop,
        onSuccess: func.noop,
        onError: func.noop,
        onAbort: func.noop,
    };

    constructor(props) {
        super(props);
        this.domain =
            typeof document !== 'undefined' && document.domain
                ? document.domain
                : '';
        this.uid = uid();
    }

    state = {
        uploading: false,
    };

    componentDidMount() {
        this.updateInputWH();
    }

    componentDidUpdate() {
        this.updateInputWH();
    }

    file = {};

    uid = '';
    onLoad = () => {
        if (!this.state.uploading) {
            return;
        }
        const { props, file } = this;
        let response;
        try {
            const doc = this.refs.iframe.contentDocument;
            const script = doc.getElementsByTagName('script')[0];
            if (script && script.parentNode === doc.body) {
                doc.body.removeChild(script);
            }
            response = doc.body.innerHTML;
            props.onSuccess(response, file);
        } catch (err) {
            log.warning(
                'cross domain error for Upload. Maybe server should return document.domain script.'
            );
            response = 'cross-domain';
            props.onError(err, null, file);
        }
        this.endUpload();
    };

    onSelect = e => {
        this.file = {
            uid: uid(),
            name: e.target.value,
        };
        this.props.onSelect([this.file]);
    };

    startUpload() {
        this.upload(this.file);
    }

    upload(file) {
        if (!this.state.uploading) {
            // eslint-disable-next-line
            this.state.uploading = true;
            this.setState({ uploading: true });
        }

        const { beforeUpload, action, name, data } = this.props;
        if (!beforeUpload) {
            return this.post(file);
        }
        const requestData = {
            action,
            name,
            data,
        };
        const before = beforeUpload(file, requestData);
        if (before && before.then) {
            before.then(
                data => {
                    this.post(file, data);
                },
                () => {
                    this.endUpload();
                }
            );
        } else if (before !== false) {
            this.post(file, obj.isPlainObject(before) ? before : undefined);
        } else {
            this.endUpload();
        }
    }

    endUpload() {
        this.file = {};
        if (this.state.uploading) {
            // eslint-disable-next-line
            this.state.uploading = false;
            this.setState({ uploading: false });
        }
    }

    updateInputWH() {
        const rootNode = ReactDOM.findDOMNode(this);
        const inputNode = this.refs.input;
        inputNode.style.height = `${rootNode.offsetHeight}px`;
        inputNode.style.width = `${rootNode.offsetWidth}px`;
    }

    abort(file) {
        if (file) {
            let uid = file;
            if (file && file.uid) {
                uid = file.uid;
            }
            if (uid === this.file.uid) {
                this.endUpload();
            }
        } else {
            this.endUpload();
        }
    }

    post(file, requestOption = {}) {
        const formNode = this.refs.form;
        const dataSpan = this.refs.data;
        const fileInput = this.refs.input;

        let propsData = this.props.data;
        if (typeof propsData === 'function') {
            propsData = propsData(file);
        }

        const { action, name, data } = requestOption;
        if (name) {
            fileInput.setAttribute('name', name);
        }

        if (action) {
            formNode.setAttribute('action', action);
        }

        if (data) {
            propsData = data;
        }

        const inputs = document.createDocumentFragment();
        for (const key in propsData) {
            if (data.hasOwnProperty(key)) {
                const input = document.createElement('input');
                input.setAttribute('name', key);
                input.value = propsData[key];
                inputs.appendChild(input);
            }
        }
        dataSpan.appendChild(inputs);
        formNode.submit();
        dataSpan.innerHTML = '';
        this.props.onStart(file);
    }

    render() {
        const {
            disabled,
            className,
            children,
            accept,
            name,
            style,
        } = this.props;
        const { uid } = this;
        const iframeName = `${name}-${uid}-iframe`;

        return (
            <span
                className={className}
                style={{
                    position: 'relative',
                    zIndex: 0,
                    display: 'inline-block',
                    ...style,
                }}
            >
                {!disabled ? (
                    <iframe
                        ref="iframe"
                        name={iframeName}
                        onLoad={this.onLoad}
                        style={{ display: 'none' }}
                    />
                ) : null}
                <form
                    ref="form"
                    method="post"
                    action={this.props.action}
                    encType="multipart/form-data"
                    target={iframeName}
                >
                    <input
                        name="_documentDomain"
                        value={this.domain}
                        type="hidden"
                    />
                    <span ref="data" />
                    <input
                        ref="input"
                        type="file"
                        accept={accept}
                        name={name}
                        onChange={this.onSelect}
                        style={INPUT_STYLE}
                    />
                </form>
                {children}
            </span>
        );
    }
}

export default IframeUploader;
