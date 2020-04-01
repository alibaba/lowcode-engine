import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import zhCN from '../locale/zh-cn.js';
import { func, obj } from '../util';
import Base from './base';
import List from './list';
import Upload from './upload';

/**
 * Upload.Card
 * @description 继承 Upload 的 API，除非特别说明
 */
class Card extends Base {
    static displayName = 'Card';

    static propTypes = {
        prefix: PropTypes.string,
        locale: PropTypes.object,
        children: PropTypes.object,
        value: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
        defaultValue: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
        /**
         * 点击图片回调
         */
        onPreview: PropTypes.func,
        /**
         * 改变时候的回调
         */
        onChange: PropTypes.func,
        /**
         * 点击移除的回调
         */
        onRemove: PropTypes.func,
        /**
         * 取消上传的回调
         */
        onCancel: PropTypes.func,
    };

    static defaultProps = {
        prefix: 'next-',
        locale: zhCN.Upload,
        onChange: func.noop,
        onPreview: func.noop,
    };

    constructor(props) {
        super(props);

        let value;
        /* istanbul ignore else */
        if ('value' in props) {
            value = props.value;
        } else {
            value = props.defaultValue;
        }

        this.state = {
            value:
                typeof value === 'undefined'
                    ? /* istanbul ignore next */ []
                    : value,
            uploaderRef: this.uploaderRef,
        };
    }
    /* eslint react/no-did-mount-set-state: [0] */
    componentDidMount() {
        this.setState({ uploaderRef: this.uploaderRef });
    }

    componentWillReceiveProps(nextProps) {
        /* istanbul ignore if */
        if ('value' in nextProps) {
            this.setState({
                value:
                    typeof nextProps.value === 'undefined'
                        ? []
                        : nextProps.value,
            });
        }
    }

    onProgress = value => {
        this.setState({
            value,
        });
    };

    onChange = (value, file) => {
        if (!('value' in this.props)) {
            this.setState({
                value,
            });
        }
        this.props.onChange(value, file);
    };

    isUploading() {
        return this.state.uploaderRef.isUploading();
    }

    saveRef(ref) {
        this.saveUploaderRef(ref);
    }

    render() {
        const {
            action,
            disabled,
            prefix,
            locale,
            className,
            style,
            limit,
            onPreview,
            onRemove,
            onCancel,
            timeout,
        } = this.props;

        const isExceedLimit = this.state.value.length >= limit;
        const uploadButtonCls = classNames({
            [`${prefix}upload-list-item`]: true,
            [`${prefix}hidden`]: isExceedLimit,
        });

        const children = this.props.children || locale.card.addPhoto;

        const onRemoveFunc = disabled ? func.prevent : onRemove;
        const othersForList = obj.pickOthers(Card.propTypes, this.props);
        const othersForUpload = obj.pickOthers(List.propTypes, othersForList);
        return (
            <List
                className={className}
                style={style}
                listType="card"
                closable
                locale={locale}
                value={this.state.value}
                onRemove={onRemoveFunc}
                onCancel={onCancel}
                onPreview={onPreview}
                uploader={this.state.uploaderRef}
                {...othersForList}
            >
                <Upload
                    {...othersForUpload}
                    shape="card"
                    disabled={disabled}
                    action={action}
                    timeout={timeout}
                    value={this.state.value}
                    onProgress={this.onProgress}
                    onChange={this.onChange}
                    ref={ref => this.saveRef(ref)}
                    className={uploadButtonCls}
                >
                    {children}
                </Upload>
            </List>
        );
    }
}

export default Card;
