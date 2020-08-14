import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { func, obj, KEYCODE } from '../util';
import Input from '../input';
import Base from './base';

var bindCtx = func.bindCtx,
    noop = func.noop;

/**
 * Select.AutoComplete
 */

var AutoComplete = (_temp = _class = function (_Base) {
    _inherits(AutoComplete, _Base);

    function AutoComplete(props) {
        _classCallCheck(this, AutoComplete);

        var _this = _possibleConstructorReturn(this, _Base.call(this, props));

        _this.handleChange = function (value, proxy, item) {
            var _this$props = _this.props,
                disabled = _this$props.disabled,
                readOnly = _this$props.readOnly,
                filterLocal = _this$props.filterLocal;


            if (disabled || readOnly) {
                return false;
            }

            var actionType = typeof proxy === 'string' ? proxy : 'change';

            _this.isInputing = actionType === 'change';

            if (filterLocal) {
                _this.setState({
                    dataSource: _this.dataStore.updateByKey(value)
                });

                _this.shouldControlPopup(_this.props, actionType);
                _this.setFirstHightLightKeyForMenu();
            }

            // 非受控模式清空内部数据
            if (!('value' in _this.props)) {
                _this.setState({
                    value: value
                });
            }

            _this.props.onChange(value, actionType, item);

            if (actionType === 'itemClick' || actionType === 'enter') {
                // 点击 item 的时候不会触发关闭，需要手动关闭，其它类型比如 keyDown 等都会有其它事件句柄处理
                _this.setVisible(false, actionType);
            }
        };

        _this.isAutoComplete = true;
        _this.isInputing = false;

        bindCtx(_this, ['handleTriggerKeyDown', 'handleMenuSelect', 'handleItemClick']);
        return _this;
    }

    AutoComplete.prototype.componentWillMount = function componentWillMount() {
        this.dataStore.setOptions({ key: this.state.value });

        _Base.prototype.componentWillMount.call(this);
    };

    AutoComplete.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        if ('value' in nextProps) {
            this.dataStore.setOptions({ key: nextProps.value });
            this.setState({
                value: nextProps.value
            });
        }

        if ('visible' in nextProps) {
            this.setState({
                visible: nextProps.visible
            });
        }

        this.dataStore.setOptions({
            filter: nextProps.filter,
            filterLocal: nextProps.filterLocal
        });

        if (nextProps.children !== this.props.children || nextProps.dataSource !== this.props.dataSource) {
            var dataSource = this.setDataSource(nextProps);
            this.setState({
                dataSource: dataSource
            });
        }

        // remote dataSource and focused
        // 因为autoComplete没有下拉数据不展示，搜索并且有数据了需要自动展示下拉
        if (!nextProps.filterLocal && this.isInputing) {
            this.shouldControlPopup(nextProps, 'update');
        }

        if (!nextProps.filterLocal && !nextProps.popupContent) {
            this.setFirstHightLightKeyForMenu();
        }
    };

    AutoComplete.prototype.componentWillUpdate = function componentWillUpdate() {
        if (this.hasClear()) {
            var inputNode = ReactDOM.findDOMNode(this.inputRef);
            if (inputNode) {
                this.clearNode = inputNode.querySelector('.' + this.props.prefix + 'input-control');
            }
        }
    };

    AutoComplete.prototype.shouldControlPopup = function shouldControlPopup() {
        var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;
        var type = arguments[1];

        var hasPopup = props.popupContent || this.dataStore.getMenuDS().length;
        if (hasPopup) {
            this.setVisible(true, type);
        } else {
            this.setVisible(false, type);
        }
    };

    AutoComplete.prototype.handleMenuSelect = function handleMenuSelect(keys) {
        var key = keys[0];

        var mapDS = this.dataStore.getMapDS();

        if (key in mapDS) {
            var item = mapDS[key];
            this.handleSelectEvent(key, item, 'itemClick');
        }
    };

    AutoComplete.prototype.handleItemClick = function handleItemClick() {
        this.setVisible(false, 'itemClick');
    };

    AutoComplete.prototype.handleSelectEvent = function handleSelectEvent(key, item, triggerType) {
        var value = item && item[this.props.fillProps] || key;

        if (triggerType === 'itemClick' || triggerType === 'enter') {
            // 点击 item 的时候不会触发关闭，需要手动关闭，其它类型比如 keyDown 等都会有其它事件句柄处理
            this.setVisible(false, triggerType);
        }

        this.handleChange(value, triggerType, item);
    };

    AutoComplete.prototype.handleVisibleChange = function handleVisibleChange(visible, type) {
        if (!('visible' in this.props) && visible && !this.props.popupContent && !this.dataStore.getMenuDS().length) {
            return;
        }

        this.setVisible(visible, type);
    };

    AutoComplete.prototype.beforeClose = function beforeClose() {
        this.isInputing = false;
    };

    /**
     * Handle trigger keydown event
     * @param {Event} e
     */


    AutoComplete.prototype.handleTriggerKeyDown = function handleTriggerKeyDown(e) {
        var _props = this.props,
            popupContent = _props.popupContent,
            onToggleHighlightItem = _props.onToggleHighlightItem,
            onKeyDown = _props.onKeyDown;

        if (popupContent) {
            e.stopPropagation(); //stopPropagation can make use onChange triggerd while typing space('') in Input
            return onKeyDown(e);
        }

        switch (e.keyCode) {
            case KEYCODE.UP:
                e.preventDefault();
                onToggleHighlightItem(this.toggleHighlightItem(-1, e), 'up');
                break;
            case KEYCODE.DOWN:
                e.preventDefault();
                onToggleHighlightItem(this.toggleHighlightItem(1, e), 'down');
                break;
            case KEYCODE.ENTER:
                e.preventDefault();
                this.chooseHighlightItem(e);
                break;
            case KEYCODE.SPACE:
                // stopPropagation can make use onChange triggerd while typing space('') in Input
                e.stopPropagation();
                break;
            case KEYCODE.ESC:
                e.preventDefault();
                this.state.visible && this.setVisible(false, 'esc');
                break;
            default:
                break;
        }

        onKeyDown(e);
    };

    // 回车 选择高亮的 item


    AutoComplete.prototype.chooseHighlightItem = function chooseHighlightItem() {
        if (!this.state.visible) {
            return false;
        }

        var highlightKey = this.state.highlightKey;

        var highlightItem = this.dataStore.getEnableDS().find(function (item) {
            return highlightKey === '' + item.value;
        });

        if (highlightItem) {
            this.handleSelectEvent(highlightKey, highlightItem, 'enter');
        }
    };

    AutoComplete.prototype.hasClear = function hasClear() {
        var _props2 = this.props,
            hasClear = _props2.hasClear,
            readOnly = _props2.readOnly,
            disabled = _props2.disabled;
        var value = this.state.value;


        return value && hasClear && !readOnly && !disabled;
    };

    /**
     * 选择器
     * @override
     * @param {object} props
     */


    AutoComplete.prototype.renderSelect = function renderSelect() {
        var _classNames;

        var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;
        var placeholder = props.placeholder,
            size = props.size,
            prefix = props.prefix,
            className = props.className,
            style = props.style,
            label = props.label,
            readOnly = props.readOnly,
            disabled = props.disabled,
            highlightHolder = props.highlightHolder,
            locale = props.locale,
            hasClear = props.hasClear,
            state = props.state,
            rtl = props.rtl;

        var others = obj.pickOthers(AutoComplete.propTypes, props);
        var othersData = obj.pickAttrsWith(others, 'data-');

        var value = this.state.value;
        var visible = this.state.visible;

        // // 下拉箭头
        // const arrowNode = this.renderArrowNode(props, () => {
        //     this.focusInput();
        //     this.setVisible(!this.state.visible);
        // });

        // trigger className
        var triggerClazz = classNames([prefix + 'select', prefix + 'select-auto-complete', prefix + 'size-' + size, className], (_classNames = {}, _classNames[prefix + 'active'] = visible, _classNames[prefix + 'disabled'] = disabled, _classNames));

        // highlightKey into placeholder
        // compatible with selectPlaceHolder. TODO: removed in 2.0 version
        var _placeholder = placeholder || locale.autoCompletePlaceholder || locale.autoCompletePlaceHolder;
        if (highlightHolder && visible) {
            _placeholder = this.state.highlightKey || _placeholder;
        }

        // Input props
        var _inputProps = _extends({}, obj.pickOthers(othersData, others), {
            state: state,
            ref: this.saveInputRef,
            hasClear: hasClear,
            value: value,
            size: size,
            disabled: disabled,
            readOnly: readOnly,
            placeholder: _placeholder,
            label: label,
            // extra: arrowNode,
            onChange: this.handleChange,
            onKeyDown: this.handleTriggerKeyDown
        });

        return React.createElement(
            'span',
            _extends({}, othersData, {
                className: triggerClazz,
                style: style,
                dir: rtl ? 'rtl' : undefined,
                ref: this.saveSelectRef,
                onClick: this.focusInput
            }),
            React.createElement(Input, _extends({
                role: 'combobox',
                'aria-autocomplete': 'list',
                'aria-disabled': disabled,
                'aria-expanded': this.state.visible
            }, _inputProps)),
            React.createElement(
                'span',
                { className: prefix + 'sr-only', 'aria-live': 'polite' },
                this.state.srReader
            )
        );
    };

    AutoComplete.prototype.render = function render() {
        var _this2 = this;

        if (this.hasClear()) {
            // clear 按钮点击后，会在 dom 结构中被删除掉，需要将其额外设置为安全节点，防止触发弹层的显示或隐藏
            var safeNode = this.props.popupProps.safeNode || [];
            var safeNodes = Array.isArray(safeNode) ? safeNode : [safeNode];
            safeNodes.push(function () {
                return _this2.clearNode;
            });
            this.props.popupProps.safeNode = safeNodes;
        }

        return _Base.prototype.render.call(this, _extends({}, this.props, { canCloseByTrigger: false }));
    };

    return AutoComplete;
}(Base), _class.propTypes = _extends({}, Base.propTypes, {
    /**
     * 当前值，用于受控模式
     */
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * 初始化的默认值
     */
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    /**
     * Select发生改变时触发的回调
     * @param {*} value 选中的值
     * @param {String} actionType 触发的方式, 'itemClick', 'enter', 'change'
     * @param {*} item 选中的值的对象数据
     */
    onChange: PropTypes.func,
    /**
     * 传入的数据源，可以动态渲染子项
     */
    dataSource: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.any,
        disabled: PropTypes.bool,
        children: PropTypes.array
    }), PropTypes.string])),
    /**
     * 填充到选择框里的值的 key，默认是 value
     */
    fillProps: PropTypes.string,
    /**
     * 渲染 MenuItem 内容的方法
     * @param {Object} item 渲染节点的 item
     * @return {ReactNode} item node
     */
    itemRender: PropTypes.func,
    // input keydown
    onKeyDown: PropTypes.func,
    // 是否将当前高亮的选项作为 placeholder
    highlightHolder: PropTypes.bool,
    style: PropTypes.object
}), _class.defaultProps = _extends({}, Base.defaultProps, {
    onKeyDown: noop,
    fillProps: 'value'
}), _temp);


export default AutoComplete;