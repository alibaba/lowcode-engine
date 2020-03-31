import React from 'react';
import PropTypes from 'prop-types';
import { func } from '../../util';
import { uid } from '../util';

const { noop } = func;

/**
 * Upload.Selecter
 * @description [底层能力] 可自定义样式的文件选择器
 */
export default class Selecter extends React.Component {
    static propTypes = {
        id: PropTypes.string,
        style: PropTypes.object,
        className: PropTypes.string,
        /**
         * 是否禁用上传功能
         */
        disabled: PropTypes.bool,
        /**
         * 是否支持多选文件，`ie10+` 支持。开启后按住 ctrl 可选择多个文件
         */
        multiple: PropTypes.bool,
        /**
         * 是否支持拖拽上传，`ie10+` 支持。
         */
        dragable: PropTypes.bool,
        /**
         * 接受上传的文件类型 (image/png, image/jpg, .doc, .ppt) 详见 [input accept attribute](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/Input#attr-accept)
         */
        accept: PropTypes.string,
        /**
         * 文件选择回调
         */
        onSelect: PropTypes.func,
        /**
         * 拖拽经过回调
         */
        onDragOver: PropTypes.func,
        /**
         * 拖拽离开回调
         */
        onDragLeave: PropTypes.func,
        /**
         * 拖拽完成回调
         */
        onDrop: PropTypes.func,
        children: PropTypes.node,
        name: PropTypes.string,
    };

    static defaultProps = {
        name: 'file',
        multiple: false,
        onSelect: noop,
        onDragOver: noop,
        onDragLeave: noop,
        onDrop: noop,
    };

    onSelect = e => {
        const files = e.target.files;
        const filesArr = files.length
            ? Array.prototype.slice.call(files)
            : [files];

        filesArr.forEach(file => {
            file.uid = uid();
        });

        this.props.onSelect(filesArr);
    };

    /**
     * 点击上传按钮
     * @return {void}
     */
    onClick = () => {
        const el = this.fileRef;
        if (!el) {
            return;
        }
        // NOTE: 在 IE 下，el.value = '' 在 el.click() 之后，会触发 input[type=file] 两次 onChange
        el.value = '';
        el.click();
    };

    /**
     * 键盘事件
     * @param  {SyntheticEvent} e
     * @return {void}
     */
    onKeyDown = e => {
        if (e.key === 'Enter') {
            this.onClick();
        }
    };

    /**
     * 拖拽
     * @param  {SyntheticEvent} e
     * @return {void}
     */
    onDrop = e => {
        e.preventDefault();

        const files = e.dataTransfer.files;
        const filesArr = Array.prototype.slice.call(files);

        this.props.onDrop(filesArr);
    };

    onDragOver = e => {
        e.preventDefault();
        this.props.onDragOver(e);
    };

    saveFileRef = ref => {
        this.fileRef = ref;
    };

    render() {
        const {
            accept,
            multiple,
            children,
            id,
            disabled,
            dragable,
            style,
            className,
            name,
        } = this.props;

        let events = {};
        if (!disabled) {
            events = Object.assign(
                {
                    onClick: this.onClick,
                    onKeyDown: this.onKeyDown,
                    tabIndex: '0',
                },
                dragable
                    ? {
                          onDrop: this.onDrop,
                          onDragOver: this.onDragOver,
                          onDragLeave: this.props.onDragLeave,
                      }
                    : {}
            );
        }

        return (
            <div
                role="application"
                style={style}
                className={className}
                {...events}
            >
                <input
                    type="file"
                    name={name}
                    id={id}
                    ref={this.saveFileRef}
                    style={{ display: 'none' }}
                    accept={accept}
                    aria-hidden
                    multiple={multiple}
                    onChange={this.onSelect}
                    disabled={disabled}
                />
                {children}
            </div>
        );
    }
}
