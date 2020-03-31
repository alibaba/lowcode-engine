import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { func, obj, KEYCODE } from '../util';
import Input from '../input';
import Base from './base';

const { bindCtx, noop } = func;

/**
 * Select.AutoComplete
 */
class AutoComplete extends Base {
    static propTypes = {
        ...Base.propTypes,
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
        dataSource: PropTypes.arrayOf(
            PropTypes.oneOfType([
                PropTypes.shape({
                    value: PropTypes.string,
                    label: PropTypes.any,
                    disabled: PropTypes.bool,
                    children: PropTypes.array,
                }),
                PropTypes.string,
            ])
        ),
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
        style: PropTypes.object,
    };

    static defaultProps = {
        ...Base.defaultProps,
        onKeyDown: noop,
        fillProps: 'value',
    };

    constructor(props) {
        super(props);

        this.isAutoComplete = true;
        this.isInputing = false;

        bindCtx(this, [
            'handleTriggerKeyDown',
            'handleMenuSelect',
            'handleItemClick',
        ]);
    }

    componentWillMount() {
        this.dataStore.setOptions({ key: this.state.value });

        super.componentWillMount();
    }

    componentWillReceiveProps(nextProps) {
        if ('value' in nextProps) {
            this.dataStore.setOptions({ key: nextProps.value });
            this.setState({
                value: nextProps.value,
            });
        }

        if ('visible' in nextProps) {
            this.setState({
                visible: nextProps.visible,
            });
        }

        this.dataStore.setOptions({
            filter: nextProps.filter,
            filterLocal: nextProps.filterLocal,
        });

        if (
            nextProps.children !== this.props.children ||
            nextProps.dataSource !== this.props.dataSource
        ) {
            const dataSource = this.setDataSource(nextProps);
            this.setState({
                dataSource,
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
    }

    componentWillUpdate() {
        if (this.hasClear()) {
            const inputNode = ReactDOM.findDOMNode(this.inputRef);
            if (inputNode) {
                this.clearNode = inputNode.querySelector(
                    `.${this.props.prefix}input-control`
                );
            }
        }
    }

    shouldControlPopup(props = this.props, type) {
        const hasPopup =
            props.popupContent || this.dataStore.getMenuDS().length;
        if (hasPopup) {
            this.setVisible(true, type);
        } else {
            this.setVisible(false, type);
        }
    }

    handleMenuSelect(keys) {
        const key = keys[0];

        const mapDS = this.dataStore.getMapDS();

        if (key in mapDS) {
            const item = mapDS[key];
            this.handleSelectEvent(key, item, 'itemClick');
        }
    }

    handleItemClick() {
        this.setVisible(false, 'itemClick');
    }

    handleSelectEvent(key, item, triggerType) {
        const value = (item && item[this.props.fillProps]) || key;

        if (triggerType === 'itemClick' || triggerType === 'enter') {
            // 点击 item 的时候不会触发关闭，需要手动关闭，其它类型比如 keyDown 等都会有其它事件句柄处理
            this.setVisible(false, triggerType);
        }

        this.handleChange(value, triggerType, item);
    }

    handleChange = (value, proxy, item) => {
        const { disabled, readOnly, filterLocal } = this.props;

        if (disabled || readOnly) {
            return false;
        }

        const actionType = typeof proxy === 'string' ? proxy : 'change';

        this.isInputing = actionType === 'change';

        if (filterLocal) {
            this.setState({
                dataSource: this.dataStore.updateByKey(value),
            });

            this.shouldControlPopup(this.props, actionType);
            this.setFirstHightLightKeyForMenu();
        }

        // 非受控模式清空内部数据
        if (!('value' in this.props)) {
            this.setState({
                value: value,
            });
        }

        this.props.onChange(value, actionType, item);

        if (actionType === 'itemClick' || actionType === 'enter') {
            // 点击 item 的时候不会触发关闭，需要手动关闭，其它类型比如 keyDown 等都会有其它事件句柄处理
            this.setVisible(false, actionType);
        }
    };

    handleVisibleChange(visible, type) {
        if (
            !('visible' in this.props) &&
            visible &&
            !this.props.popupContent &&
            !this.dataStore.getMenuDS().length
        ) {
            return;
        }

        this.setVisible(visible, type);
    }

    beforeClose() {
        this.isInputing = false;
    }

    /**
     * Handle trigger keydown event
     * @param {Event} e
     */
    handleTriggerKeyDown(e) {
        const { popupContent, onToggleHighlightItem, onKeyDown } = this.props;
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
    }

    // 回车 选择高亮的 item
    chooseHighlightItem() {
        if (!this.state.visible) {
            return false;
        }

        const { highlightKey } = this.state;
        const highlightItem = this.dataStore.getEnableDS().find(item => {
            return highlightKey === `${item.value}`;
        });

        if (highlightItem) {
            this.handleSelectEvent(highlightKey, highlightItem, 'enter');
        }
    }

    hasClear() {
        const { hasClear, readOnly, disabled } = this.props;
        const { value } = this.state;

        return value && hasClear && !readOnly && !disabled;
    }

    /**
     * 选择器
     * @override
     * @param {object} props
     */
    renderSelect(props = this.props) {
        const {
            placeholder,
            size,
            prefix,
            className,
            style,
            label,
            readOnly,
            disabled,
            highlightHolder,
            locale,
            hasClear,
            state,
            rtl,
        } = props;
        const others = obj.pickOthers(AutoComplete.propTypes, props);
        const othersData = obj.pickAttrsWith(others, 'data-');

        const value = this.state.value;
        const visible = this.state.visible;

        // // 下拉箭头
        // const arrowNode = this.renderArrowNode(props, () => {
        //     this.focusInput();
        //     this.setVisible(!this.state.visible);
        // });

        // trigger className
        const triggerClazz = classNames(
            [
                `${prefix}select`,
                `${prefix}select-auto-complete`,
                `${prefix}size-${size}`,
                className,
            ],
            {
                [`${prefix}active`]: visible,
                [`${prefix}disabled`]: disabled,
            }
        );

        // highlightKey into placeholder
        // compatible with selectPlaceHolder. TODO: removed in 2.0 version
        let _placeholder =
            placeholder ||
            locale.autoCompletePlaceholder ||
            locale.autoCompletePlaceHolder;
        if (highlightHolder && visible) {
            _placeholder = this.state.highlightKey || _placeholder;
        }

        // Input props
        const _inputProps = {
            ...obj.pickOthers(othersData, others),
            state: state,
            ref: this.saveInputRef,
            hasClear: hasClear,
            value,
            size,
            disabled,
            readOnly,
            placeholder: _placeholder,
            label,
            // extra: arrowNode,
            onChange: this.handleChange,
            onKeyDown: this.handleTriggerKeyDown,
        };

        return (
            <span
                {...othersData}
                className={triggerClazz}
                style={style}
                dir={rtl ? 'rtl' : undefined}
                ref={this.saveSelectRef}
                onClick={this.focusInput}
            >
                <Input
                    role="combobox"
                    aria-autocomplete="list"
                    aria-disabled={disabled}
                    aria-expanded={this.state.visible}
                    {..._inputProps}
                />
                <span className={`${prefix}sr-only`} aria-live="polite">
                    {this.state.srReader}
                </span>
            </span>
        );
    }

    render() {
        if (this.hasClear()) {
            // clear 按钮点击后，会在 dom 结构中被删除掉，需要将其额外设置为安全节点，防止触发弹层的显示或隐藏
            const safeNode = this.props.popupProps.safeNode || [];
            const safeNodes = Array.isArray(safeNode) ? safeNode : [safeNode];
            safeNodes.push(() => this.clearNode);
            this.props.popupProps.safeNode = safeNodes;
        }

        return super.render(
            Object.assign({}, this.props, { canCloseByTrigger: false })
        );
    }
}

export default AutoComplete;
