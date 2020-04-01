import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ConfigProvider from '../config-provider';
/**
 * Typography.Text
 * @order 3
 */
class Text extends Component {
    static propTypes = {
        prefix: PropTypes.string,
        /**
         * 添加删除线样式
         */
        delete: PropTypes.bool,
        /**
         * 添加标记样式
         */
        mark: PropTypes.bool,
        /**
         * 添加下划线样式
         */
        underline: PropTypes.bool,
        /**
         * 是否加粗
         */
        strong: PropTypes.bool,
        /**
         * 添加代码样式
         */
        code: PropTypes.bool,
        /**
         * 设置标签类型
         */
        component: PropTypes.elementType,
        children: PropTypes.node,
        rtl: PropTypes.bool,
    };

    static defaultProps = {
        prefix: 'next-',
        delete: false,
        mark: false,
        underline: false,
        strong: false,
        code: false,
        component: 'span',
        rtl: false,
    };

    render() {
        const {
            prefix,
            className,
            component,
            strong,
            underline,
            delete: deleteProp,
            code,
            mark,
            rtl,
            ...others
        } = this.props;

        const Tag = component;
        let children = this.props.children;

        if (strong) {
            children = <strong>{children}</strong>;
        }

        if (underline) {
            children = <u>{children}</u>;
        }

        if (deleteProp) {
            children = <del>{children}</del>;
        }

        if (code) {
            children = <code>{children}</code>;
        }

        if (mark) {
            children = <mark>{children}</mark>;
        }

        if (rtl) {
            others.dir = 'rtl';
        }

        return (
            <Tag
                {...others}
                className={`${className || ''} ${prefix}typography`}
            >
                {children}
            </Tag>
        );
    }
}

export default ConfigProvider.config(Text);
