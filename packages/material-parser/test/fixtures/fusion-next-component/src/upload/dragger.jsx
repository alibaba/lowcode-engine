import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../icon';
import { func } from '../util';
import zhCN from '../locale/zh-cn.js';
import Upload from './upload';

/**
 * Upload.Dragger
 * @description IE10+ 支持。继承 Upload 的 API，除非特别说明
 */
class Dragger extends React.Component {
    static propTypes = {
        /**
         * 样式前缀
         */
        prefix: PropTypes.string,
        locale: PropTypes.object,
        shape: PropTypes.string,
        onDragOver: PropTypes.func,
        onDragLeave: PropTypes.func,
        onDrop: PropTypes.func,
        limit: PropTypes.number,
        className: PropTypes.string,
        style: PropTypes.object,
        defaultValue: PropTypes.array,
        children: PropTypes.node,
        listType: PropTypes.string,
        timeout: PropTypes.number,
    };

    static defaultProps = {
        prefix: 'next-',
        onDragOver: func.noop,
        onDragLeave: func.noop,
        onDrop: func.noop,
        locale: zhCN.Upload,
    };

    state = {
        dragOver: false,
    };

    onDragOver = e => {
        if (!this.state.dragOver) {
            this.setState({
                dragOver: true,
            });
        }

        this.props.onDragOver(e);
    };

    onDragLeave = e => {
        this.setState({
            dragOver: false,
        });
        this.props.onDragLeave(e);
    };

    onDrop = e => {
        this.setState({
            dragOver: false,
        });
        this.props.onDrop(e);
    };

    render() {
        const {
            className,
            style,
            shape,
            locale,
            prefix,
            listType,
            ...others
        } = this.props;
        const prefixCls = `${prefix}upload-drag`;
        const cls = classNames({
            [`${prefixCls}`]: true,
            [`${prefixCls}-over`]: this.state.dragOver,
            [className]: !!className,
        });

        const children = this.props.children || (
            <div className={cls}>
                <p className={`${prefixCls}-icon`}>
                    <Icon size="large" className={`${prefixCls}-upload-icon`} />
                </p>
                <p className={`${prefixCls}-text`}>{locale.drag.text}</p>
                <p className={`${prefixCls}-hint`}>{locale.drag.hint}</p>
            </div>
        );

        return (
            <Upload
                {...others}
                prefix={prefix}
                shape={shape}
                listType={listType}
                dragable
                style={style}
                onDragOver={this.onDragOver}
                onDragLeave={this.onDragLeave}
                onDrop={this.onDrop}
                ref={this.saveUploaderRef}
            >
                {children}
            </Upload>
        );
    }
}

export default Dragger;
