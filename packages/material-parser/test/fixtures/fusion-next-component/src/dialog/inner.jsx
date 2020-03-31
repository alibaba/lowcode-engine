import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Button from '../button';
import Icon from '../icon';
import zhCN from '../locale/zh-cn';
import { func, obj, guid } from '../util';

const { makeChain } = func;
const { pickOthers } = obj;
const noop = () => {};

export default class Inner extends Component {
    static propTypes = {
        prefix: PropTypes.string,
        className: PropTypes.string,
        title: PropTypes.node,
        children: PropTypes.node,
        footer: PropTypes.oneOfType([PropTypes.bool, PropTypes.node]),
        footerAlign: PropTypes.oneOf(['left', 'center', 'right']),
        footerActions: PropTypes.array,
        onOk: PropTypes.func,
        onCancel: PropTypes.func,
        okProps: PropTypes.object,
        cancelProps: PropTypes.object,
        closeable: PropTypes.bool,
        onClose: PropTypes.func,
        locale: PropTypes.object,
        role: PropTypes.string,
        rtl: PropTypes.bool,
        // set value for a fixed height dialog. Passing a value will absolutely position the footer to the bottom.
        height: PropTypes.string,
    };

    static defaultProps = {
        prefix: 'next-',
        footerAlign: 'right',
        footerActions: ['ok', 'cancel'],
        onOk: noop,
        onCancel: noop,
        okProps: {},
        cancelProps: {},
        closeable: true,
        onClose: noop,
        locale: zhCN.Dialog,
        role: 'dialog',
    };

    getNode(name, ref) {
        this[name] = ref;
    }

    renderHeader() {
        const { prefix, title } = this.props;
        if (title) {
            this.titleId = guid('dialog-title-');
            return (
                <div
                    className={`${prefix}dialog-header`}
                    id={this.titleId}
                    ref={this.getNode.bind(this, 'headerNode')}
                    role="heading"
                    aria-level="1"
                >
                    {title}
                </div>
            );
        }
        return null;
    }

    renderBody() {
        const { prefix, children } = this.props;
        if (children) {
            return (
                <div
                    className={`${prefix}dialog-body`}
                    ref={this.getNode.bind(this, 'bodyNode')}
                >
                    {children}
                </div>
            );
        }
        return null;
    }

    renderFooter() {
        const {
            prefix,
            footer,
            footerAlign,
            footerActions,
            locale,
            height,
        } = this.props;

        if (footer === false) {
            return null;
        }

        const newClassName = cx({
            [`${prefix}dialog-footer`]: true,
            [`${prefix}align-${footerAlign}`]: true,
            [`${prefix}dialog-footer-fixed-height`]: !!height,
        });
        const footerContent =
            footer === true || !footer
                ? footerActions.map(action => {
                      const btnProps = this.props[`${action}Props`];
                      const newBtnProps = {
                          ...btnProps,
                          prefix,
                          className: cx(
                              `${prefix}dialog-btn`,
                              btnProps.className
                          ),
                          onClick: makeChain(
                              this.props[
                                  `on${action[0].toUpperCase() +
                                      action.slice(1)}`
                              ],
                              btnProps.onClick
                          ),
                          children: btnProps.children || locale[action],
                      };
                      if (action === 'ok') {
                          newBtnProps.type = 'primary';
                      }

                      return <Button key={action} {...newBtnProps} />;
                  })
                : footer;

        return (
            <div
                className={newClassName}
                ref={this.getNode.bind(this, 'footerNode')}
            >
                {footerContent}
            </div>
        );
    }

    renderCloseLink() {
        const { prefix, closeable, onClose, locale } = this.props;

        if (closeable) {
            return (
                <a
                    role="button"
                    aria-label={locale.close}
                    className={`${prefix}dialog-close`}
                    onClick={onClose}
                >
                    <Icon
                        className={`${prefix}dialog-close-icon`}
                        type="close"
                    />
                </a>
            );
        }

        return null;
    }

    render() {
        const {
            prefix,
            className,
            closeable,
            title,
            role,
            rtl,
            height,
        } = this.props;
        const others = pickOthers(Object.keys(Inner.propTypes), this.props);
        const newClassName = cx({
            [`${prefix}dialog`]: true,
            [`${prefix}closeable`]: closeable,
            [className]: !!className,
        });

        const header = this.renderHeader();
        const body = this.renderBody();
        const footer = this.renderFooter();
        const closeLink = this.renderCloseLink();

        const ariaProps = {
            role,
            'aria-modal': 'true',
        };
        if (title) {
            ariaProps['aria-labelledby'] = this.titleId;
        }

        others.style = Object.assign({}, others.style, { height });

        return (
            <div
                {...ariaProps}
                className={newClassName}
                {...others}
                dir={rtl ? 'rtl' : undefined}
            >
                {header}
                {body}
                {footer}
                {closeLink}
            </div>
        );
    }
}
