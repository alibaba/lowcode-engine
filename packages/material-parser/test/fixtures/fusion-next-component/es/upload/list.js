import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp2;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ConfigProvider from '../config-provider';
import Progress from '../progress';
import Icon from '../icon';
import Button from '../button';
import { func, obj, KEYCODE } from '../util';
import zhCN from '../locale/zh-cn.js';
import { previewFile } from './util';
import transform from './transform';

var List = (_temp2 = _class = function (_Component) {
    _inherits(List, _Component);

    function List() {
        var _temp, _this, _ret;

        _classCallCheck(this, List);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.handleClose = function (file) {
            var _this$props = _this.props,
                onRemove = _this$props.onRemove,
                uploader = _this$props.uploader;


            var remove = onRemove(file);

            func.promiseCall(remove, function () {
                uploader && uploader.removeFile(file);
            });
        }, _this.handleCancel = function (file) {
            var _this$props2 = _this.props,
                onCancel = _this$props2.onCancel,
                uploader = _this$props2.uploader;

            var cancel = onCancel(file);

            func.promiseCall(cancel, function () {
                uploader && uploader.abort(file);
            });
        }, _this.onImageError = function (file, obj) {
            obj.onerror = null;
            _this.props.onImageError(obj, file);
        }, _this.onPreview = function (file, e) {
            _this.props.onPreview(file, e);
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    List.prototype.componentDidUpdate = function componentDidUpdate() {
        var _this2 = this;

        var _props = this.props,
            listType = _props.listType,
            useDataURL = _props.useDataURL,
            value = _props.value;

        if (listType !== 'image' && listType !== 'card') {
            return;
        }

        useDataURL && value.forEach(function (file) {
            if (typeof document === 'undefined' || typeof window === 'undefined' || !window.FileReader || !window.File || !(file.originFileObj instanceof File) || file.imgURL !== undefined) {
                return;
            }
            file.imgURL = '';
            previewFile(file.originFileObj, function (previewDataUrl) {
                file.imgURL = previewDataUrl;
                _this2.forceUpdate();
            });
        });
    };

    List.prototype.getInfo = function getInfo(file) {
        var _classNames;

        var prefixCls = this.props.prefix + 'upload';
        var downloadURL = file.downloadURL || file.url;
        var imgURL = file.imgURL || file.url;
        var size = this.sizeCaculator(file.size);
        var itemCls = classNames((_classNames = {}, _classNames[prefixCls + '-list-item'] = true, _classNames[prefixCls + '-list-item-' + file.state] = file.state, _classNames[prefixCls + '-list-item-error-with-msg'] = file.state === 'error' && file.errorMsg, _classNames));
        var alt = file.name || file.alt;
        return { prefixCls: prefixCls, downloadURL: downloadURL, imgURL: imgURL, size: size, itemCls: itemCls, alt: alt };
    };
    // transfer size from number to xx K/ XxxM / xxG


    List.prototype.sizeCaculator = function sizeCaculator(size) {
        var fileSize = parseFloat(size, 10);
        // fileSize为浮点数 用 < 0.000001 替代 === 0
        if (isNaN(fileSize) || fileSize < 0.0000001) {
            return 0;
        }
        var SIZE_SUFFIX = ['B', 'K', 'M', 'G', 'T', 'P'];
        var suffixIndex = 0;

        // 在Mac上实验发现 取1024造成显示的大小和实际大小不一致
        // 因为单位制不同 见 https://superuser.com/questions/938234/size-of-files-in-windows-os-its-kb-or-kb
        var BIT_NUMBER_SYSTEM = 1024;
        while (fileSize >= BIT_NUMBER_SYSTEM && suffixIndex < SIZE_SUFFIX.length) {
            suffixIndex++;
            fileSize /= BIT_NUMBER_SYSTEM;
        }

        var suffix = SIZE_SUFFIX[suffixIndex];
        fileSize = fileSize.toFixed(2);

        return '' + fileSize + suffix;
    };

    List.prototype.getTextList = function getTextList(file) {
        var _this3 = this;

        var _props2 = this.props,
            locale = _props2.locale,
            extraRender = _props2.extraRender,
            progressProps = _props2.progressProps,
            rtl = _props2.rtl;

        var _getInfo = this.getInfo(file),
            prefixCls = _getInfo.prefixCls,
            downloadURL = _getInfo.downloadURL,
            size = _getInfo.size,
            itemCls = _getInfo.itemCls;

        var onClick = function onClick() {
            return file.state === 'uploading' ? _this3.handleCancel(file) : _this3.handleClose(file);
        };
        var onKeyDown = function onKeyDown(e) {
            if (e.keyCode === KEYCODE.ENTER) {
                onClick();
            }
        };
        return React.createElement(
            'div',
            { className: itemCls, key: file.uid || file.name },
            React.createElement(
                'div',
                { className: prefixCls + '-list-item-name-wrap' },
                React.createElement(
                    'a',
                    {
                        href: downloadURL,
                        target: '_blank',
                        style: { pointerEvents: downloadURL ? '' : 'none' },
                        className: prefixCls + '-list-item-name'
                    },
                    React.createElement(
                        'span',
                        null,
                        file.name
                    ),
                    !!size && React.createElement(
                        'span',
                        {
                            className: prefixCls + '-list-item-size',
                            dir: rtl ? 'rtl' : undefined
                        },
                        '(',
                        size,
                        ')'
                    ),
                    React.createElement(
                        'span',
                        { className: prefixCls + '-extra' },
                        extraRender(file)
                    )
                )
            ),
            file.state === 'uploading' ? React.createElement(
                'div',
                { className: prefixCls + '-list-item-progress' },
                React.createElement(Progress, _extends({
                    size: 'medium',
                    percent: file.percent,
                    textRender: func.noop,
                    rtl: rtl
                }, progressProps))
            ) : null,
            file.state === 'error' && file.errorMsg ? React.createElement(
                'div',
                { className: prefixCls + '-list-item-error-msg' },
                file.errorMsg
            ) : null,
            this.props.closable ? React.createElement(Icon, {
                type: 'close',
                size: 'large',
                role: 'button',
                'aria-label': locale.upload.delete,
                tabIndex: '0',
                onClick: onClick,
                onKeyDown: onKeyDown
            }) : null
        );
    };

    List.prototype.getImageList = function getImageList(file) {
        var _this4 = this;

        var _props3 = this.props,
            extraRender = _props3.extraRender,
            progressProps = _props3.progressProps,
            rtl = _props3.rtl;

        var _getInfo2 = this.getInfo(file),
            prefixCls = _getInfo2.prefixCls,
            downloadURL = _getInfo2.downloadURL,
            imgURL = _getInfo2.imgURL,
            size = _getInfo2.size,
            itemCls = _getInfo2.itemCls,
            alt = _getInfo2.alt;

        var img = null;

        var onClick = function onClick() {
            return file.state === 'uploading' ? _this4.handleCancel(file) : _this4.handleClose(file);
        };
        var onKeyDown = function onKeyDown(e) {
            if (e.keyCode === KEYCODE.ENTER) {
                onClick();
            }
        };

        if (file.state === 'uploading' || file.state === 'selected' && !imgURL) {
            img = React.createElement(Icon, { type: 'picture' });
        } else if (file.state === 'error') {
            img = React.createElement(Icon, { type: 'cry' });
        } else {
            img = React.createElement('img', {
                src: imgURL,
                onError: this.onImageError.bind(this, file),
                tabIndex: '0',
                alt: alt,
                onClick: this.onPreview.bind(this, file)
            });
        }

        return React.createElement(
            'div',
            { className: itemCls, key: file.uid || file.name },
            React.createElement(
                'div',
                { className: prefixCls + '-list-item-thumbnail' },
                img
            ),
            this.props.closable ? React.createElement(Icon, {
                type: 'close',
                size: 'large',
                tabIndex: '0',
                role: 'button',
                onClick: onClick,
                onKeyDown: onKeyDown
            }) : null,
            React.createElement(
                'a',
                {
                    href: downloadURL,
                    target: '_blank',
                    style: { pointerEvents: downloadURL ? '' : 'none' },
                    className: prefixCls + '-list-item-name'
                },
                React.createElement(
                    'span',
                    null,
                    file.name
                ),
                !!size && React.createElement(
                    'span',
                    {
                        className: prefixCls + '-list-item-size',
                        dir: rtl ? 'rtl' : undefined
                    },
                    '(',
                    size,
                    ')'
                ),
                React.createElement(
                    'span',
                    { className: prefixCls + '-extra' },
                    extraRender(file)
                )
            ),
            file.state === 'uploading' ? React.createElement(
                'div',
                { className: prefixCls + '-list-item-progress' },
                React.createElement(Progress, _extends({
                    size: 'medium',
                    percent: file.percent,
                    textRender: func.noop
                }, progressProps))
            ) : null,
            file.state === 'error' && file.errorMsg ? React.createElement(
                'div',
                { className: prefixCls + '-list-item-error-msg' },
                file.errorMsg
            ) : null
        );
    };

    List.prototype.getPictureCardList = function getPictureCardList(file, isPreview) {
        var _this5 = this;

        var _props4 = this.props,
            locale = _props4.locale,
            progressProps = _props4.progressProps;

        var _getInfo3 = this.getInfo(file),
            prefixCls = _getInfo3.prefixCls,
            downloadURL = _getInfo3.downloadURL,
            imgURL = _getInfo3.imgURL,
            itemCls = _getInfo3.itemCls,
            alt = _getInfo3.alt;

        var state = isPreview ? '' : file.state;

        var img = null;

        if (state === 'uploading' || state === 'selected' && !imgURL) {
            img = React.createElement(
                'div',
                { className: prefixCls + '-list-item-handler' },
                React.createElement(Icon, { type: 'picture' }),
                React.createElement(
                    Button,
                    { text: true, onClick: function onClick() {
                            return _this5.handleCancel(file);
                        } },
                    locale.card.cancel
                )
            );
        } else if (state === 'error') {
            img = React.createElement(
                'div',
                { className: prefixCls + '-list-item-handler' },
                React.createElement(Icon, { type: 'cry' })
            );
        } else {
            img = React.createElement('img', {
                src: imgURL,
                tabIndex: '0',
                alt: alt,
                onError: this.onImageError.bind(this, file),
                onClick: this.onPreview.bind(this, file)
            });
        }

        var onClose = function onClose() {
            return _this5.handleClose(file);
        };
        var onKeyDownClose = function onKeyDownClose(e) {
            if (e.keyCode === KEYCODE.ENTER) {
                onClose();
            }
        };
        return React.createElement(
            'div',
            { className: itemCls, key: file.uid || file.name },
            React.createElement(
                'div',
                { className: prefixCls + '-list-item-wrapper' },
                React.createElement(
                    'div',
                    { className: prefixCls + '-list-item-thumbnail' },
                    img
                ),
                state === 'uploading' ? React.createElement(
                    'div',
                    { className: prefixCls + '-list-item-progress' },
                    React.createElement(Progress, _extends({
                        size: 'medium',
                        percent: file.percent,
                        textRender: func.noop
                    }, progressProps))
                ) : null,
                state !== 'uploading' ? React.createElement(
                    'span',
                    {
                        className: prefixCls + '-tool ' + (!this.props.closable ? prefixCls + '-noclose' : '')
                    },
                    React.createElement(
                        'a',
                        {
                            href: downloadURL,
                            target: '_blank',
                            tabIndex: downloadURL ? '0' : '-1',
                            className: prefixCls + '-tool-download-link',
                            style: {
                                pointerEvents: downloadURL ? '' : 'none'
                            }
                        },
                        React.createElement(Icon, {
                            type: downloadURL ? 'download' : '',
                            'aria-label': locale.card.download,
                            className: prefixCls + '-tool-download-icon'
                        })
                    ),
                    this.props.closable && !isPreview ? React.createElement(
                        'span',
                        { className: prefixCls + '-tool-close' },
                        React.createElement(Icon, {
                            type: 'ashbin',
                            'aria-label': locale.card.delete,
                            tabIndex: '0',
                            role: 'button',
                            onClick: onClose,
                            onKeyDown: onKeyDownClose
                        })
                    ) : null
                ) : ''
            ),
            React.createElement(
                'span',
                { className: prefixCls + '-list-item-name' },
                file.name
            )
        );
    };

    List.prototype.render = function render() {
        var _this6 = this,
            _classNames3;

        var _props5 = this.props,
            listType = _props5.listType,
            children = _props5.children,
            prefix = _props5.prefix,
            rtl = _props5.rtl,
            className = _props5.className,
            isPreview = _props5.isPreview;

        var prefixCls = prefix + 'upload';

        var list = [];
        if (isPreview) {
            var _classNames2;

            var previewCls = classNames((_classNames2 = {}, _classNames2[prefix + 'form-preview'] = true, _classNames2[className] = !!className, _classNames2));
            list = this.props.value.map(function (file) {
                var downloadURL = file.downloadURL,
                    imgURL = file.imgURL,
                    name = file.name;

                if (listType === 'text') {
                    return React.createElement(
                        'div',
                        { className: previewCls },
                        React.createElement(
                            'a',
                            { href: downloadURL, target: '_blank' },
                            name
                        )
                    );
                } else if (listType === 'image' || listType === 'card') {
                    return _this6.getPictureCardList(file, true);
                }
                return null;
            });
        } else {
            list = this.props.value.map(function (file) {
                if (listType === 'text') {
                    return _this6.getTextList(file);
                } else if (listType === 'image') {
                    return _this6.getImageList(file);
                } else if (listType === 'card') {
                    return _this6.getPictureCardList(file);
                }
                return null;
            });
        }

        if (rtl && listType === 'card' && Array.isArray(list)) {
            list = list.reverse();
        }
        var _listType = isPreview && listType === 'image' ? 'card' : this.props.listType;
        var listclassNames = classNames((_classNames3 = {}, _classNames3[prefixCls + '-list'] = true, _classNames3[prefixCls + '-list-' + _listType] = true, _classNames3), className);

        var others = obj.pickAttrsWith(this.props, 'data-');
        return React.createElement(
            'div',
            _extends({}, others, {
                className: listclassNames,
                dir: rtl ? 'rtl' : undefined
            }),
            rtl ? children : list,
            rtl ? list : children
        );
    };

    return List;
}(Component), _class.propTypes = {
    prefix: PropTypes.string,
    /**
     * 多语言
     */
    locale: PropTypes.object,
    /**
     * 文件列表，数据格式请参考 文件对象
     */
    listType: PropTypes.oneOf(['text', 'image', 'card']),
    /**
     * 文件列表
     */
    value: PropTypes.array,
    closable: PropTypes.bool,
    /**
     * 删除文件回调(支持Promise)
     */
    onRemove: PropTypes.func,
    /**
     * 取消上传回调(支持Promise)
     */
    onCancel: PropTypes.func,
    /**
     * 头像加载出错回调
     */
    onImageError: PropTypes.func,
    /**
     * listType=card时点击图片回调
     */
    onPreview: PropTypes.func,
    /**
     * 自定义额外渲染
     */
    extraRender: PropTypes.func,
    /**
     * 透传给Progress props
     */
    progressProps: PropTypes.object,
    children: PropTypes.node,
    uploader: PropTypes.any,
    /**
     * 可选参数，是否本地预览
     */
    useDataURL: PropTypes.bool,
    rtl: PropTypes.bool,
    isPreview: PropTypes.bool
}, _class.defaultProps = {
    prefix: 'next-',
    listType: 'text',
    value: [],
    locale: zhCN.Upload,
    closable: false,
    onRemove: func.noop,
    onCancel: func.noop,
    extraRender: func.noop,
    onImageError: func.noop,
    onPreview: func.noop,
    progressProps: {}
}, _temp2);

// Wrap <List> with <ConfigProvider> to avoid context missing if it is
// referenced by other internal modules.
// https://github.com/alibaba-fusion/next/blob/build/1.13.9/src/upload/upload.jsx#L521

List.displayName = 'List';
export default ConfigProvider.config(List, {
    componentName: 'Upload',
    transform: transform
});