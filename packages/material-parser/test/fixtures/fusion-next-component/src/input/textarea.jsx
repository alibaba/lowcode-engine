import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { obj, env } from '../util';
import Base from './base';

function onNextFrame(cb) {
    if (window.requestAnimationFrame) {
        return window.requestAnimationFrame(cb);
    }
    return window.setTimeout(cb, 1);
}

function clearNextFrameAction(nextFrameId) {
    if (window.cancelAnimationFrame) {
        window.cancelAnimationFrame(nextFrameId);
    } else {
        window.clearTimeout(nextFrameId);
    }
}

// safari in mac
const isMacSafari =
    typeof navigator !== 'undefined' && navigator && navigator.userAgent
        ? navigator.userAgent.match(/^((?!chrome|android|windows).)*safari/i)
        : false;

const hiddenStyle = {
    visibility: 'hidden',
    position: 'absolute',
    zIndex: '-1000',
    top: '-1000px',
    overflowY: 'hidden',
    left: 0,
    right: 0,
};

/**
 * Input.TextArea
 * @order 2
 */
export default class TextArea extends Base {
    static propTypes = {
        ...Base.propTypes,
        /**
         * 是否有边框
         */
        hasBorder: PropTypes.bool,
        /**
         * 状态
         * @enumdesc 错误
         */
        state: PropTypes.oneOf(['error', 'warning']),
        /**
         * 自动高度 true / {minRows: 2, maxRows: 4}
         */
        autoHeight: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
        /**
         * 多行文本框高度 <br />(不要直接用height设置多行文本框的高度, ie9 10会有兼容性问题)
         */
        rows: PropTypes.number,
        /**
         * 是否为预览态
         */
        isPreview: PropTypes.bool,
        /**
         * 预览态模式下渲染的内容
         * @param {number} value 评分值
         */
        renderPreview: PropTypes.func,
    };

    static defaultProps = {
        ...Base.defaultProps,
        hasBorder: true,
        isPreview: false,
        rows: 4,
        autoHeight: false,
    };

    constructor(props) {
        super(props);

        let value;
        if ('value' in props) {
            value = props.value;
        } else {
            value = props.defaultValue;
        }

        this.state = {
            value: typeof value === 'undefined' ? '' : value,
        };
    }

    componentDidMount() {
        const autoHeight = this.props.autoHeight;
        if (autoHeight) {
            if (typeof autoHeight === 'object') {
                /* eslint-disable react/no-did-mount-set-state */
                this.setState(
                    this._getMinMaxHeight(autoHeight, this.state.value)
                );
            } else {
                this.setState({
                    height: this._getHeight(this.state.value),
                    overflowY: 'hidden',
                });
            }
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.autoHeight && this.props.value !== prevProps.value) {
            this._resizeTextArea(this.props.value);
        }
    }

    _getMinMaxHeight({ minRows, maxRows }, value) {
        const node = ReactDOM.findDOMNode(this.helpRef);
        node.setAttribute('rows', minRows);
        const minHeight = node.clientHeight;

        node.setAttribute('rows', maxRows);
        const maxHeight = node.clientHeight;

        node.setAttribute('rows', '1');
        const height = this._getHeight(value);

        return {
            minHeight,
            maxHeight,
            height,
            overflowY: height <= maxHeight ? 'hidden' : undefined,
        };
    }

    _getHeight(value) {
        const node = ReactDOM.findDOMNode(this.helpRef);
        node.value = value;

        return node.scrollHeight;
    }

    _resizeTextArea = value => {
        if (this.nextFrameActionId) {
            clearNextFrameAction(this.nextFrameActionId);
        }
        this.nextFrameActionId = onNextFrame(() => {
            const height = this._getHeight(value);
            const maxHeight = this.state.maxHeight
                ? this.state.maxHeight
                : Infinity;

            this.setState({
                height: this._getHeight(value),
                overflowY: height <= maxHeight ? 'hidden' : undefined,
            });
        });
    };

    ieHack(value) {
        // Fix: textarea dit not support maxLength in ie9
        /* istanbul ignore if */
        if (env.ieVersion === 9 && this.props.maxLength) {
            const maxLength = parseInt(this.props.maxLength);
            const len = this.getValueLength(value, true);
            if (len > maxLength && this.props.cutString) {
                value = value.replace(/\n/g, '\n\n');
                value = value.substr(0, maxLength);
                value = value.replace(/\n\n/g, '\n');
            }
        }

        this.props.autoHeight && this._resizeTextArea(value);

        return value;
    }

    /**
     * value.length !== maxLength  in ie/safari(mac) while value has `Enter`
     * about maxLength compute: `Enter` was considered to be one char(\n) in chrome , but two chars(\r\n) in ie/safari(mac).
     * so while value has `Enter`, we should let display length + 1
     */
    getValueLength(value) {
        const { maxLength, cutString } = this.props;

        const nv = `${value}`;
        let strLen = this.props.getValueLength(nv);
        if (typeof strLen !== 'number') {
            strLen = nv.length;
        }

        /* istanbul ignore if */
        if (env.ieVersion || isMacSafari) {
            strLen = strLen + nv.split('\n').length - 1;
            if (strLen > maxLength && cutString) {
                strLen = maxLength;
            }
        }

        return strLen;
    }

    saveTextAreaRef(textArea) {
        this.inputRef = textArea;
    }

    saveHelpRef(ref) {
        this.helpRef = ref;
    }

    render() {
        const {
            rows,
            style,
            className,
            autoHeight,
            isPreview,
            renderPreview,
            prefix,
            rtl,
            hasBorder,
        } = this.props;

        const cls = classNames(this.getClass(), {
            [`${prefix}input-textarea`]: true,
            [`${prefix}noborder`]: !hasBorder,
            [className]: !!className,
        });

        const props = this.getProps();
        // custom data attributes are assigned to the top parent node
        // data-类自定义数据属性分配到顶层node节点
        const dataProps = obj.pickAttrsWith(this.props, 'data-');
        // Custom props are transparently transmitted to the core input node by default
        // 自定义属性默认透传到核心node节点：input
        const others = obj.pickOthers(
            Object.assign({}, dataProps, TextArea.propTypes),
            this.props
        );

        const textareStyle = {
            ...props.style,
            height: this.state.height,
            minHeight: this.state.minHeight,
            maxHeight: this.state.maxHeight,
            overflowY: this.state.overflowY,
        };

        const previewCls = classNames({
            [`${prefix}input-textarea`]: true,
            [`${prefix}form-preview`]: true,
            [className]: !!className,
        });

        const wrapStyle = autoHeight
            ? { ...style, position: 'relative' }
            : style;

        if (isPreview) {
            const { value } = props;
            if ('renderPreview' in this.props) {
                return (
                    <div {...others} className={previewCls}>
                        {renderPreview(value, this.props)}
                    </div>
                );
            }
            return (
                <div {...others} className={previewCls}>
                    {value.split('\n').map((data, i) => (
                        <p key={`p-${i}`}>{data}</p>
                    ))}
                </div>
            );
        }

        return (
            <span
                className={cls}
                style={wrapStyle}
                dir={rtl ? 'rtl' : undefined}
                {...dataProps}
            >
                <textarea
                    {...others}
                    {...props}
                    data-real
                    rows={rows}
                    style={textareStyle}
                    ref={this.saveRef.bind(this)}
                    onKeyDown={this.onKeyDown.bind(this)}
                />
                {autoHeight ? (
                    <textarea
                        data-fake
                        ref={this.saveHelpRef.bind(this)}
                        style={{ ...props.style, ...hiddenStyle }}
                        rows="1"
                    />
                ) : null}
                {this.renderControl()}
            </span>
        );
    }
}
