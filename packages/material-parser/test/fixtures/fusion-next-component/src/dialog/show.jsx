import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ConfigProvider from '../config-provider';
import Message from '../message';
import zhCN from '../locale/zh-cn';
import dialog from './dialog';

const Dialog = ConfigProvider.config(dialog);

const noop = () => {};
const MESSAGE_TYPE = {
    alert: 'warning',
    confirm: 'help',
};

export const ModalInner = function({
    type,
    messageProps = {},
    title,
    rtl,
    prefix = 'next-',
    content,
}) {
    return (
        <Message
            size="large"
            shape="addon"
            type={MESSAGE_TYPE[type]}
            {...messageProps}
            title={title}
            rtl={rtl}
            className={cx(`${prefix}dialog-message`, messageProps.className)}
        >
            {content}
        </Message>
    );
};

class Modal extends Component {
    static propTypes = {
        prefix: PropTypes.string,
        pure: PropTypes.bool,
        rtl: PropTypes.bool,
        type: PropTypes.oneOf(['alert', 'confirm']),
        title: PropTypes.node,
        content: PropTypes.node,
        messageProps: PropTypes.object,
        footerActions: PropTypes.array,
        /**
         * Callback function triggered when Ok button is clicked
         * @param {Object} event click event object
         * @returns {Promise} Optionally handles a Promise return object
         */
        onOk: PropTypes.func,
        /**
         * Callback function triggered when Cancel button is clicked
         * @param {Object} event click event object
         * @returns {Promise} Optionally handles a Promise return object
         */
        onCancel: PropTypes.func,
        /**
         * Callback function triggered when Close button is clicked
         * @param {Object} event click event object
         * @returns {Promise} Optionally handles a Promise return object
         */
        onClose: PropTypes.func,
        okProps: PropTypes.object,
        locale: PropTypes.object,
        needWrapper: PropTypes.bool,
        className: PropTypes.string,
    };

    static defaultProps = {
        prefix: 'next-',
        pure: false,
        messageProps: {},
        onOk: noop,
        onCancel: noop,
        onClose: noop,
        okProps: {},
        locale: zhCN.Dialog,
        needWrapper: true,
    };

    state = {
        visible: true,
        loading: false,
    };

    close = () => {
        this.setState({
            visible: false,
        });
    };

    loading = loading => {
        this.setState({
            loading,
        });
    };

    wrapper(fn, callback) {
        return (...args) => {
            const res = fn(...args);
            if (res && res.then) {
                this.loading(true);

                res.then(result => {
                    this.loading(false);

                    if (result !== false) {
                        return callback();
                    }
                }).catch(e => {
                    this.loading(false);
                    throw e;
                });
            } else if (res !== false) {
                return callback();
            }
        };
    }

    render() {
        const {
            prefix,
            type,
            title,
            content,
            messageProps,
            footerActions,
            onOk,
            onCancel,
            onClose,
            okProps,
            needWrapper,
            rtl,
            className,
            ...others
        } = this.props;
        const newTitle = needWrapper && type ? null : title;

        const newContent =
            needWrapper && type ? (
                <ModalInner
                    type={type}
                    messageProps={messageProps}
                    title={title}
                    rtl={rtl}
                    prefix={prefix}
                    content={content}
                />
            ) : (
                content
            );

        const newFooterActions =
            footerActions ||
            (type === 'alert'
                ? ['ok']
                : type === 'confirm'
                ? ['ok', 'cancel']
                : undefined);
        const newOnOk = this.wrapper(onOk, this.close);
        const newOnCancel = this.wrapper(onCancel, this.close);
        const newOnClose = this.wrapper(onClose, this.close);

        const { visible, loading } = this.state;
        okProps.loading = loading;

        const classNames = cx(`${prefix}dialog-quick`, className);

        return (
            <Dialog
                prefix={prefix}
                role="alertdialog"
                {...others}
                visible={visible}
                title={newTitle}
                rtl={rtl}
                footerActions={newFooterActions}
                onOk={this.state.loading ? noop : newOnOk}
                onCancel={newOnCancel}
                onClose={newOnClose}
                okProps={okProps}
                className={classNames}
            >
                {newContent}
            </Dialog>
        );
    }
}

const ConfigModal = ConfigProvider.config(Modal, { componentName: 'Dialog' });

/**
 * 创建对话框
 * @exportName show
 * @param {Object} config 配置项
 * @returns {Object} 包含有 hide 方法，可用来关闭对话框
 */
export const show = (config = {}) => {
    const container = document.createElement('div');
    const unmount = () => {
        if (config.afterClose) {
            config.afterClose();
        }
        ReactDOM.unmountComponentAtNode(container);
        container.parentNode.removeChild(container);
    };

    document.body.appendChild(container);
    const newContext = ConfigProvider.getContext();

    let instance, myRef;

    ReactDOM.render(
        <ConfigProvider {...newContext}>
            <ConfigModal
                {...config}
                afterClose={unmount}
                ref={ref => {
                    myRef = ref;
                }}
            />
        </ConfigProvider>,
        container,
        function() {
            instance = myRef;
        }
    );
    return {
        hide: () => {
            const inc = instance && instance.getInstance();
            inc && inc.close();
        },
    };
};

const methodFactory = type => (config = {}) => {
    config.type = type;
    return show(config);
};

/**
 * 创建警示对话框
 * @exportName alert
 * @param {Object} config 配置项
 * @returns {Object} 包含有 hide 方法，可用来关闭对话框
 */
export const alert = methodFactory('alert');

/**
 * 创建确认对话框
 * @exportName confirm
 * @param {Object} config 配置项
 * @returns {Object} 包含有 hide 方法，可用来关闭对话框
 */
export const confirm = methodFactory('confirm');
