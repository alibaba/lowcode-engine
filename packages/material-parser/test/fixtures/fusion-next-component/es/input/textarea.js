import _extends from 'babel-runtime/helpers/extends';
import _typeof from 'babel-runtime/helpers/typeof';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp, _initialiseProps;

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
var isMacSafari = typeof navigator !== 'undefined' && navigator && navigator.userAgent ? navigator.userAgent.match(/^((?!chrome|android|windows).)*safari/i) : false;

var hiddenStyle = {
    visibility: 'hidden',
    position: 'absolute',
    zIndex: '-1000',
    top: '-1000px',
    overflowY: 'hidden',
    left: 0,
    right: 0
};

/**
 * Input.TextArea
 * @order 2
 */
var TextArea = (_temp = _class = function (_Base) {
    _inherits(TextArea, _Base);

    function TextArea(props) {
        _classCallCheck(this, TextArea);

        var _this = _possibleConstructorReturn(this, _Base.call(this, props));

        _initialiseProps.call(_this);

        var value = void 0;
        if ('value' in props) {
            value = props.value;
        } else {
            value = props.defaultValue;
        }

        _this.state = {
            value: typeof value === 'undefined' ? '' : value
        };
        return _this;
    }

    TextArea.prototype.componentDidMount = function componentDidMount() {
        var autoHeight = this.props.autoHeight;
        if (autoHeight) {
            if ((typeof autoHeight === 'undefined' ? 'undefined' : _typeof(autoHeight)) === 'object') {
                /* eslint-disable react/no-did-mount-set-state */
                this.setState(this._getMinMaxHeight(autoHeight, this.state.value));
            } else {
                this.setState({
                    height: this._getHeight(this.state.value),
                    overflowY: 'hidden'
                });
            }
        }
    };

    TextArea.prototype.componentDidUpdate = function componentDidUpdate(prevProps) {
        if (this.props.autoHeight && this.props.value !== prevProps.value) {
            this._resizeTextArea(this.props.value);
        }
    };

    TextArea.prototype._getMinMaxHeight = function _getMinMaxHeight(_ref, value) {
        var minRows = _ref.minRows,
            maxRows = _ref.maxRows;

        var node = ReactDOM.findDOMNode(this.helpRef);
        node.setAttribute('rows', minRows);
        var minHeight = node.clientHeight;

        node.setAttribute('rows', maxRows);
        var maxHeight = node.clientHeight;

        node.setAttribute('rows', '1');
        var height = this._getHeight(value);

        return {
            minHeight: minHeight,
            maxHeight: maxHeight,
            height: height,
            overflowY: height <= maxHeight ? 'hidden' : undefined
        };
    };

    TextArea.prototype._getHeight = function _getHeight(value) {
        var node = ReactDOM.findDOMNode(this.helpRef);
        node.value = value;

        return node.scrollHeight;
    };

    TextArea.prototype.ieHack = function ieHack(value) {
        // Fix: textarea dit not support maxLength in ie9
        /* istanbul ignore if */
        if (env.ieVersion === 9 && this.props.maxLength) {
            var maxLength = parseInt(this.props.maxLength);
            var len = this.getValueLength(value, true);
            if (len > maxLength && this.props.cutString) {
                value = value.replace(/\n/g, '\n\n');
                value = value.substr(0, maxLength);
                value = value.replace(/\n\n/g, '\n');
            }
        }

        this.props.autoHeight && this._resizeTextArea(value);

        return value;
    };

    /**
     * value.length !== maxLength  in ie/safari(mac) while value has `Enter`
     * about maxLength compute: `Enter` was considered to be one char(\n) in chrome , but two chars(\r\n) in ie/safari(mac).
     * so while value has `Enter`, we should let display length + 1
     */


    TextArea.prototype.getValueLength = function getValueLength(value) {
        var _props = this.props,
            maxLength = _props.maxLength,
            cutString = _props.cutString;


        var nv = '' + value;
        var strLen = this.props.getValueLength(nv);
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
    };

    TextArea.prototype.saveTextAreaRef = function saveTextAreaRef(textArea) {
        this.inputRef = textArea;
    };

    TextArea.prototype.saveHelpRef = function saveHelpRef(ref) {
        this.helpRef = ref;
    };

    TextArea.prototype.render = function render() {
        var _classNames, _classNames2;

        var _props2 = this.props,
            rows = _props2.rows,
            style = _props2.style,
            className = _props2.className,
            autoHeight = _props2.autoHeight,
            isPreview = _props2.isPreview,
            renderPreview = _props2.renderPreview,
            prefix = _props2.prefix,
            rtl = _props2.rtl,
            hasBorder = _props2.hasBorder;


        var cls = classNames(this.getClass(), (_classNames = {}, _classNames[prefix + 'input-textarea'] = true, _classNames[prefix + 'noborder'] = !hasBorder, _classNames[className] = !!className, _classNames));

        var props = this.getProps();
        // custom data attributes are assigned to the top parent node
        // data-类自定义数据属性分配到顶层node节点
        var dataProps = obj.pickAttrsWith(this.props, 'data-');
        // Custom props are transparently transmitted to the core input node by default
        // 自定义属性默认透传到核心node节点：input
        var others = obj.pickOthers(_extends({}, dataProps, TextArea.propTypes), this.props);

        var textareStyle = _extends({}, props.style, {
            height: this.state.height,
            minHeight: this.state.minHeight,
            maxHeight: this.state.maxHeight,
            overflowY: this.state.overflowY
        });

        var previewCls = classNames((_classNames2 = {}, _classNames2[prefix + 'input-textarea'] = true, _classNames2[prefix + 'form-preview'] = true, _classNames2[className] = !!className, _classNames2));

        var wrapStyle = autoHeight ? _extends({}, style, { position: 'relative' }) : style;

        if (isPreview) {
            var value = props.value;

            if ('renderPreview' in this.props) {
                return React.createElement(
                    'div',
                    _extends({}, others, { className: previewCls }),
                    renderPreview(value, this.props)
                );
            }
            return React.createElement(
                'div',
                _extends({}, others, { className: previewCls }),
                value.split('\n').map(function (data, i) {
                    return React.createElement(
                        'p',
                        { key: 'p-' + i },
                        data
                    );
                })
            );
        }

        return React.createElement(
            'span',
            _extends({
                className: cls,
                style: wrapStyle,
                dir: rtl ? 'rtl' : undefined
            }, dataProps),
            React.createElement('textarea', _extends({}, others, props, {
                'data-real': true,
                rows: rows,
                style: textareStyle,
                ref: this.saveRef.bind(this),
                onKeyDown: this.onKeyDown.bind(this)
            })),
            autoHeight ? React.createElement('textarea', {
                'data-fake': true,
                ref: this.saveHelpRef.bind(this),
                style: _extends({}, props.style, hiddenStyle),
                rows: '1'
            }) : null,
            this.renderControl()
        );
    };

    return TextArea;
}(Base), _class.propTypes = _extends({}, Base.propTypes, {
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
    renderPreview: PropTypes.func
}), _class.defaultProps = _extends({}, Base.defaultProps, {
    hasBorder: true,
    isPreview: false,
    rows: 4,
    autoHeight: false
}), _initialiseProps = function _initialiseProps() {
    var _this2 = this;

    this._resizeTextArea = function (value) {
        if (_this2.nextFrameActionId) {
            clearNextFrameAction(_this2.nextFrameActionId);
        }
        _this2.nextFrameActionId = onNextFrame(function () {
            var height = _this2._getHeight(value);
            var maxHeight = _this2.state.maxHeight ? _this2.state.maxHeight : Infinity;

            _this2.setState({
                height: _this2._getHeight(value),
                overflowY: height <= maxHeight ? 'hidden' : undefined
            });
        });
    };
}, _temp);
export { TextArea as default };