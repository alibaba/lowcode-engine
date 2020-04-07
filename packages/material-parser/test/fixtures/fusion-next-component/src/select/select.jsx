/* eslint-disable valid-jsdoc */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { func, obj, KEYCODE, env, str } from '../util';
import Tag from '../tag';
import Input from '../input';
import Icon from '../icon';
import zhCN from '../locale/zh-cn';
import Base from './base';
import { isNull, getValueDataSource, valueToSelectKey } from './util';

const { bindCtx, noop } = func;
const isIE9 = env.ieVersion === 9;

/**
 * 无障碍化注意事项:
 * 1. Select 无搜索情况下，不应该让 Input 可focus，此时外层wrap必须可focus，并且需要相应focus事件让外边框发生变化
 *
 * TODO: hightLight 后续改造注意点
 * 1. hightLight 跟随点击变化(fixed) 2. 弹窗打开时根据 是否高亮第一个选项的 api开关设置是否hightLight 第一项
 */

// 自定义弹层：1. 不需要关心Menu的点击事件 2. 不需要关心dataSource变化

/**
 * Select
 */
class Select extends Base {
    static propTypes = {
        ...Base.propTypes,
        /**
         * 选择器模式
         */
        mode: PropTypes.oneOf(['single', 'multiple', 'tag']),
        /**
         * 当前值，用于受控模式
         */
        value: PropTypes.any,
        /**
         * 初始的默认值
         */
        defaultValue: PropTypes.any,
        /**
         * Select发生改变时触发的回调
         * @param {*} value 选中的值
         * @param {String} actionType 触发的方式, 'itemClick', 'enter', 'tag'
         * @param {*} item 选中的值的对象数据 (useDetailValue=false有效)
         */
        onChange: PropTypes.func,
        /**
         * 传入的数据源，可以动态渲染子项，详见 [dataSource的使用](#dataSource的使用)
         */
        dataSource: PropTypes.arrayOf(
            PropTypes.oneOfType([
                PropTypes.shape({
                    value: PropTypes.any,
                    label: PropTypes.any,
                    disabled: PropTypes.bool,
                    children: PropTypes.array,
                }),
                PropTypes.bool,
                PropTypes.number,
                PropTypes.string,
            ])
        ),
        /**
         * 是否有边框
         */
        hasBorder: PropTypes.bool,
        /**
         * 是否有下拉箭头
         */
        hasArrow: PropTypes.bool,
        /**
         * 展开后是否能搜索（tag 模式下固定为true）
         */
        showSearch: PropTypes.bool,
        /**
         * 当搜索框值变化时回调
         * @param {String} value 数据
         */
        onSearch: PropTypes.func,
        /**
         * 当搜索框值被清空时候的回调
         * @param {String} actionType 触发的方式, 'select'(选择清空), 'popupClose'(弹窗关闭清空)
         */
        onSearchClear: PropTypes.func,
        /**
         * 多选模式下是否有全选功能
         */
        hasSelectAll: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
        /**
         * 填充到选择框里的值的 key
         */
        fillProps: PropTypes.string,
        /**
         * onChange 返回的 value 使用 dataSource 的对象
         */
        useDetailValue: PropTypes.bool,
        /**
         * dataSource 变化的时是否保留已选的内容
         */
        cacheValue: PropTypes.bool,
        /**
         * 渲染 Select 展现内容的方法
         * @param {Object} item 渲染节点的item
         * @return {ReactNode} 展现内容
         * @default item => item.label \|\| item.value
         */
        valueRender: PropTypes.func,
        /**
         * 渲染 MenuItem 内容的方法
         * @param {Object} item 渲染节点的item
         * @param {String} searchValue 搜索关键字（如果开启搜索）
         * @return {ReactNode} item node
         */
        itemRender: PropTypes.func,
        /**
         * 弹层内容为空的文案
         */
        notFoundContent: PropTypes.node,
        style: PropTypes.object,
        /**
         * 受控搜索值，一般不需要设置
         * @type {[type]}
         */
        searchValue: PropTypes.string,
        /**
         * 是否一行显示，仅在 mode 为 multiple 的时候生效
         */
        tagInline: PropTypes.bool,
        /**
         * 最多显示多少个 tag
         */
        maxTagCount: PropTypes.number,
        /**
         * 隐藏多余 tag 时显示的内容，在 maxTagCount 生效时起作用
         * @param {number} selectedValues 当前已选中的元素
         * @param {number} totalValues 总待选元素
         */
        maxTagPlaceholder: PropTypes.func,
        /**
         * 选择后是否立即隐藏菜单 (mode=multiple/tag 模式生效)
         */
        hiddenSelected: PropTypes.bool,
        /**
         * tag 删除回调
         * @param {object} item 渲染节点的item
         */
        onRemove: PropTypes.func,
        /**
         * 焦点事件
         */
        onFocus: PropTypes.func,
        /**
         * 是否自动高亮第一个选项
         */
        // highlightFirstItem: PropTypes.bool,
        /**
         * 失去焦点事件
         */
        onBlur: PropTypes.func,
        onMouseEnter: PropTypes.func,
        onMouseLeave: PropTypes.func,
        onKeyDown: PropTypes.func,
        locale: PropTypes.object,
    };

    static defaultProps = {
        ...Base.defaultProps,
        locale: zhCN.Select,
        mode: 'single',
        showSearch: false,
        cacheValue: true,
        tagInline: false,
        onSearch: noop,
        onSearchClear: noop,
        hasArrow: true,
        onRemove: noop,
        // highlightFirstItem: true,
        valueRender: item => {
            return item.label || item.value;
        },
        onKeyDown: noop,
        onFocus: noop,
        onBlur: noop,
        onMouseEnter: noop,
        onMouseLeave: noop,
    };

    static displayName = 'Select';

    constructor(props) {
        super(props);

        // @extend Base state
        Object.assign(this.state, {
            // search keyword
            searchValue: 'searchValue' in props ? props.searchValue : '',
        });

        // because dataSource maybe updated while select a item, so we should cache choosen value's item
        this.valueDataSource = {
            valueDS: [], // [{value,label}]
            mapValueDS: {}, // {value: {value,label}}
        };

        bindCtx(this, [
            'handleMenuSelect',
            'handleItemClick',
            'handleSearch',
            'handleSearchKeyDown',
            'handleSelectAll',
            'maxTagPlaceholder',
        ]);
    }

    componentWillMount() {
        this.dataStore.setOptions({
            key: this.state.searchValue,
            addonKey: this.props.mode === 'tag', // tag 模式手动输入的数据
        });

        super.componentWillMount();

        // 根据value和计算后的dataSource，更新value对应的详细数据valueDataSource
        if (typeof this.state.value !== 'undefined') {
            this.valueDataSource = getValueDataSource(
                this.state.value,
                this.valueDataSource.mapValueDS,
                this.dataStore.getMapDS()
            );
        }

        if (isIE9) {
            this.ie9Hack();
        }
    }

    componentWillReceiveProps(nextProps) {
        if ('searchValue' in nextProps) {
            this.dataStore.setOptions({ key: nextProps.searchValue });
            this.setState({
                searchValue:
                    typeof nextProps.searchValue === 'undefined'
                        ? ''
                        : nextProps.searchValue,
            });
        }
        if (this.props.mode !== nextProps.mode) {
            this.dataStore.setOptions({
                addonKey: nextProps.mode === 'tag',
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

            // 远程数据有更新，并且还有搜索框
            if (
                nextProps.showSearch &&
                !nextProps.filterLocal &&
                !nextProps.popupContent
            ) {
                this.setFirstHightLightKeyForMenu();
            }
        }

        if ('value' in nextProps) {
            this.setState({
                value: nextProps.value,
            });

            this.valueDataSource = getValueDataSource(
                nextProps.value,
                this.valueDataSource.mapValueDS,
                this.dataStore.getMapDS()
            );
            this.updateSelectAllYet(this.valueDataSource.value);
        } else if (
            'defaultValue' in nextProps &&
            nextProps.defaultValue === this.valueDataSource.value &&
            (nextProps.children !== this.props.children ||
                nextProps.dataSource !== this.props.dataSource)
        ) {
            //has defaultValue and value not changed and dataSource changed
            this.valueDataSource = getValueDataSource(
                nextProps.defaultValue,
                this.valueDataSource.mapValueDS,
                this.dataStore.getMapDS()
            );
        }

        if ('visible' in nextProps) {
            this.setState({
                visible: nextProps.visible,
            });
        }
    }

    componentDidMount() {
        if (isIE9) {
            this.ie9Hack();
        }
        super.componentDidMount();
    }

    // ie9 下 table-cell 布局不支持宽度超出隐藏
    ie9Hack() {
        try {
            const width = this.selectDOM.currentStyle.width;
            this.setState({
                fixWidth: width !== 'auto',
            });
        } catch (e) {
            //
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const props = this.props;
        // 随着输入自动伸展
        if (
            /tag|multiple/.test(props.mode) &&
            prevState.searchValue !== this.state.searchValue
        ) {
            this.syncWidth();
        } else {
            return super.componentDidUpdate(prevProps, prevState);
        }
    }

    useDetailValue() {
        const { popupContent, useDetailValue, dataSource } = this.props;
        return useDetailValue || (popupContent && !dataSource);
    }

    hasSearch() {
        const { showSearch, mode } = this.props;
        return showSearch || mode === 'tag';
    }

    /**
     * Menu.Item onSelect
     * @private
     * @param  {Array<string>} keys
     * @
     */
    handleMenuSelect(keys, item) {
        const { mode, readOnly, disabled } = this.props;

        if (readOnly || disabled) {
            return false;
        }

        const isSingle = mode === 'single';

        if (isSingle) {
            // 单选
            return this.handleSingleSelect(keys[0], 'itemClick');
        } else {
            // 正常多选
            return this.handleMultipleSelect(
                keys,
                'itemClick',
                item.props && item.props._key
            );
        }
    }

    handleItemClick() {
        this.focusInput();
    }

    /**
     * 单选模式
     */
    handleSingleSelect(key, triggerType) {
        const { cacheValue } = this.props;
        // get data only from dataStore while cacheValue=false
        const itemObj = getValueDataSource(
            key,
            cacheValue ? this.valueDataSource.mapValueDS : {},
            this.dataStore.getMapDS()
        );
        this.valueDataSource = itemObj;

        this.setVisible(false, triggerType);

        if (this.useDetailValue()) {
            return this.handleChange(itemObj.valueDS, triggerType);
        } else {
            this.handleChange(itemObj.value, triggerType, itemObj.valueDS);
        }

        this.setState({
            highlightKey: key,
        });

        // 清空搜索
        if (!('searchValue' in this.props) && this.state.searchValue) {
            this.handleSearchClear(triggerType);
        }
    }

    /**
     * 多选模式 multiple/tag
     */
    handleMultipleSelect(keys, triggerType, key, keepSearchValue) {
        const itemObj = getValueDataSource(
            keys,
            this.valueDataSource.mapValueDS,
            this.dataStore.getMapDS()
        );

        const { cacheValue, mode, hiddenSelected } = this.props;

        // cache those value maybe not exists in dataSource
        if (cacheValue || mode === 'tag') {
            this.valueDataSource = itemObj;
        }

        if (hiddenSelected) {
            this.setVisible(false, triggerType);
        }

        // 因为搜索后会设置 hightLight 为第一个item，menu渲染会自动滚动到 hightLight 的元素上面。
        // 所以设置 hightLight 为当前选中项避免滚动
        key &&
            this.state.visible &&
            this.setState({
                highlightKey: key,
            });

        if (this.useDetailValue()) {
            this.handleChange(itemObj.valueDS, triggerType);
        } else {
            this.handleChange(itemObj.value, triggerType, itemObj.valueDS);
        }

        this.updateSelectAllYet(itemObj.value);

        // 清空搜索
        if (
            !('searchValue' in this.props) &&
            this.state.searchValue &&
            !keepSearchValue
        ) {
            // 因为 SearchValue 被 clear 后会重新渲染 Menu，所以在 Overlay 检测 safeNode 的时候 e.target 可能会找不到导致弹窗关闭
            setTimeout(() => {
                this.handleSearchClear(triggerType);
            });
        }
    }

    updateSelectAllYet(value) {
        // multiple mode
        // is current state select all or not
        this.selectAllYet = false;
        if (this.props.hasSelectAll && Array.isArray(value)) {
            const selectAllValues = this.dataStore
                .getEnableDS()
                .map(item => item.value);

            if (selectAllValues.length <= value.length) {
                this.selectAllYet = true;

                selectAllValues.forEach(val => {
                    if (value.indexOf(val) === -1) {
                        this.selectAllYet = false;
                        return;
                    }
                });
            }
        }
    }

    handleSearchValue(value) {
        if (this.state.searchValue === value) {
            return;
        }

        const { filterLocal } = this.props;

        if (filterLocal) {
            if (!('searchValue' in this.props)) {
                this.setState({
                    searchValue: value,
                    dataSource: this.dataStore.updateByKey(value),
                });
                this.setFirstHightLightKeyForMenu();
            }
        } else if (!('searchValue' in this.props)) {
            this.setState({
                searchValue: value,
            });
        }
    }

    /**
     * Handle search input change event
     * @param {Event} e change Event
     */
    handleSearch(value) {
        this.handleSearchValue(value);

        // inputing should trigger popup open
        if (!this.state.visible && value) {
            this.setVisible(true);
        }

        this.props.onSearch(value);
    }

    handleSearchClear(triggerType) {
        this.handleSearchValue('');
        this.props.onSearchClear(triggerType);
    }

    // 搜索框 keyDown 事件
    handleSearchKeyDown(e) {
        const {
            popupContent,
            onKeyDown,
            showSearch,
            mode,
            hasClear,
            onToggleHighlightItem,
            readOnly,
            disabled,
        } = this.props;

        if (popupContent) {
            return onKeyDown(e);
        }

        const proxy = 'search';
        const hasSearch = this.hasSearch();

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
                if (readOnly || disabled) {
                    break;
                }
                this.chooseHighlightItem(proxy, e);
                break;
            case KEYCODE.ESC:
                e.preventDefault();
                this.state.visible && this.setVisible(false, 'keyDown');
                break;
            case KEYCODE.SPACE:
                e.stopPropagation();
                !hasSearch && e.preventDefault();
                break;
            case KEYCODE.BACKSPACE:
                if (readOnly || disabled) {
                    break;
                }
                if ((mode === 'multiple' && showSearch) || mode === 'tag') {
                    // 在多选并且有搜索的情况下，删除最后一个 tag
                    const valueDS = this.valueDataSource.valueDS;
                    if (
                        valueDS &&
                        valueDS.length &&
                        !valueDS[valueDS.length - 1].disabled
                    ) {
                        this.handleDeleteTag(e);
                    }
                } else if (
                    mode === 'single' &&
                    hasClear &&
                    !this.state.visible
                ) {
                    // 单选、非展开、并且可清除的情况，允许按删除键清除
                    this.handleClear(e);
                }
                break;
            default:
                break;
        }

        onKeyDown(e);
    }

    chooseMultipleItem(key) {
        const value = this.state.value || [];
        const keys = value.map(v => {
            return valueToSelectKey(v);
        });

        let keepSearchValue = false;

        const index = keys.map(v => `${v}`).indexOf(key);

        if (index > -1) {
            // unselect
            keys.splice(index, 1);
            keepSearchValue = true; // 回车反选保留搜索值
        } else {
            // select
            keys.push(key);
        }

        this.handleMultipleSelect(keys, 'enter', null, keepSearchValue);
    }

    // 回车 选择高亮的 item
    chooseHighlightItem(proxy, e) {
        const { mode } = this.props;

        if (!this.state.visible) {
            // input tag by itself
            if (mode === 'tag' && this.state.searchValue) {
                this.chooseMultipleItem(this.state.searchValue);
            }
            return false;
        }

        const { highlightKey } = this.state;

        // 没有高亮选项 或者 没有可选菜单
        if (highlightKey === null || !this.dataStore.getMenuDS().length) {
            return;
        }

        if (mode === 'single') {
            this.handleSingleSelect(highlightKey, 'enter');
        } else {
            this.chooseMultipleItem(highlightKey);
            // 阻止事件冒泡到最外层，让Popup 监听到触发弹层关闭
            e && e.stopPropagation();
        }
    }

    /**
     * Handle Tag close event
     * @param  {Object} item
     * @return {Boolean} false  return false to prevent auto close
     * ----
     * It MUST be multiple mode, needn't additional judgement
     */
    handleTagClose(item) {
        const { readOnly } = this.props;
        if (readOnly) return false;
        if (this.useDetailValue()) {
            const value = this.state.value.filter(v => {
                return item.value !== v.value;
            });

            this.handleChange(value, 'tag');
        } else {
            // filter out current item, and then call handleMenuSelect
            const value = this.state.value.filter(v => {
                return item.value !== v;
            });

            this.handleMultipleSelect(value, 'tag');
        }

        this.props.onRemove(item);

        // prevent tag close
        return false;
    }

    // eslint-disable-next-line valid-jsdoc
    /**
     * Handle BACKSPACE key event
     * @param {Event} e keyDown event
     * ---
     * It MUST be multiple mode
     */
    handleDeleteTag(e) {
        const value = this.state.value;
        const searchValue = this.state.searchValue;

        if (searchValue || !value || !value.length) {
            return false;
        }

        e.preventDefault();

        const nextValues = value.slice(0, value.length - 1);
        // 手动调用 handleMenuSelect 时直接传入原生的 value，可以减少 toString 的操作

        if (this.useDetailValue()) {
            this.handleChange(nextValues, 'tag');
        } else {
            this.handleMultipleSelect(nextValues, 'tag');
        }
    }

    /**
     * Handle SelectAll span click event
     * @param {Event} e click event
     */
    handleSelectAll(e) {
        e && e.preventDefault();
        let nextValues;

        if (this.selectAllYet) {
            nextValues = [];
        } else {
            nextValues = this.dataStore.getEnableDS().map(item => item.value);
        }

        // 直接传 values，减少 toString 操作
        this.handleMultipleSelect(nextValues, 'selectAll');
    }

    handleVisibleChange(visible, type) {
        this.setVisible(visible, type);
    }

    afterClose() {
        // 关闭的时候清空搜索值
        if (this.hasSearch()) {
            this.handleSearchClear('popupClose');
        }
    }

    maxTagPlaceholder(selectedValues, totalValues) {
        const { locale } = this.props;

        return `${str.template(locale.maxTagPlaceholder, {
            selected: selectedValues.length,
            total: totalValues.length,
        })}`;
    }

    /**
     * 如果用户是自定义的弹层，则直接以 value 为准，不再校验 dataSource
     * @param {object} props
     */
    renderValues() {
        const {
            prefix,
            mode,
            size,
            valueRender,
            fillProps,
            disabled,
            maxTagCount,
            maxTagPlaceholder,
            tagInline,
        } = this.props;
        let value = this.state.value;

        if (isNull(value)) {
            return null;
        }

        // get detail value
        if (!this.useDetailValue()) {
            if (value === this.valueDataSource.value) {
                value = this.valueDataSource.valueDS;
            } else {
                value = getValueDataSource(
                    value,
                    this.valueDataSource.mapValueDS,
                    this.dataStore.getMapDS()
                ).valueDS;
            }
        }

        if (mode === 'single') {
            if (!value) {
                return null;
            }

            const retvalue =
                fillProps && fillProps in value
                    ? value[fillProps]
                    : valueRender(value);
            // 0 => '0'
            return typeof retvalue === 'number'
                ? retvalue.toString()
                : retvalue;
        } else if (value) {
            let limitedCountValue = value;
            let maxTagPlaceholderEl;
            const totalValue = this.dataStore.getFlattenDS();
            const holder =
                'maxTagPlaceholder' in this.props
                    ? maxTagPlaceholder
                    : this.maxTagPlaceholder;

            if (
                maxTagCount !== undefined &&
                value.length > maxTagCount &&
                !tagInline
            ) {
                limitedCountValue = limitedCountValue.slice(0, maxTagCount);
                maxTagPlaceholderEl = (
                    <Tag
                        key="_count"
                        type="primary"
                        size={size === 'large' ? 'medium' : 'small'}
                        animation={false}
                    >
                        {holder(value, totalValue)}
                    </Tag>
                );
            }

            if (value.length > 0 && tagInline) {
                maxTagPlaceholderEl = (
                    <div className={`${prefix}select-tag-compact`} key="_count">
                        {holder(value, totalValue)}
                    </div>
                );
            }

            value = limitedCountValue;
            if (!Array.isArray(value)) {
                value = [value];
            }

            const selectedValueNodes = value.map(v => {
                if (!v) {
                    return null;
                }
                const labelNode = fillProps ? v[fillProps] : valueRender(v);

                return (
                    <Tag
                        key={v.value}
                        disabled={disabled || v.disabled}
                        type="primary"
                        size={size === 'large' ? 'medium' : 'small'}
                        animation={false}
                        onClose={this.handleTagClose.bind(this, v)}
                        closable
                    >
                        {labelNode}
                    </Tag>
                );
            });

            if (maxTagPlaceholderEl) {
                if (tagInline) {
                    selectedValueNodes.unshift(maxTagPlaceholderEl);
                } else {
                    selectedValueNodes.push(maxTagPlaceholderEl);
                }
            }
            return selectedValueNodes;
        }

        return null;
    }
    /**
     * 1. fix flash while click <label/>
     * 2. fix onBlur while has clear
     * @returns
     */
    handleWrapClick = e => {
        // ignore click on input to choose text
        if (e.target.nodeName !== 'INPUT') {
            e.preventDefault();
        }
        this.focusInput();
    };

    handleArrowClick = e => {
        e.preventDefault();
        this.focusInput();

        // because of can not close Popup by click Input while hasSearch.
        // so when Popup open and hasSearch, we should close Popup intentionally
        this.state.visible && this.hasSearch() && this.setVisible(false);
    };

    handleClear = e => {
        e.stopPropagation();
        this.handleChange(undefined, 'clear');
    };

    hasClear() {
        const { hasClear, readOnly, disabled, showSearch } = this.props;
        const { value, visible } = this.state;

        return (
            typeof value !== 'undefined' &&
            value !== null &&
            hasClear &&
            !readOnly &&
            !disabled &&
            !(showSearch && visible)
        );
    }

    /**
     * render arrow
     * @param {object} props
     * @param {function} [clickHandler]
     */
    renderExtraNode() {
        const { hasArrow, hasClear, prefix } = this.props;

        const ret = [];

        if (hasArrow) {
            ret.push(
                <span
                    key="arrow"
                    aria-hidden
                    onClick={this.handleArrowClick}
                    className={`${prefix}select-arrow`}
                >
                    <Icon type="arrow-down" />
                </span>
            );
        }

        // do not use this.hasClear() here, to make sure clear btn always exists, can not influenced by apis like `disabled` `readOnly`
        if (hasClear) {
            ret.push(
                <span
                    key="clear"
                    aria-hidden
                    onClick={this.handleClear}
                    className={`${prefix}select-clear`}
                >
                    <Icon type="delete-filling" />
                </span>
            );
        }

        return ret;
    }

    /**
     * 选择器
     * @override
     * @param {object} props
     */
    renderSelect() {
        const {
            prefix,
            showSearch,
            placeholder,
            mode,
            size,
            className,
            style,
            readOnly,
            disabled,
            hasBorder,
            label,
            locale,
            state,
            onBlur,
            onFocus,
            onMouseEnter,
            onMouseLeave,
            rtl,
        } = this.props;
        const others = obj.pickOthers(Select.propTypes, this.props);
        const othersData = obj.pickAttrsWith(others, 'data-');

        const visible = this.state.visible;
        const isSingle = mode === 'single';
        const hasSearch = this.hasSearch();
        const valueNodes = this.renderValues();

        // compatible with selectPlaceHolder. TODO: removed in 2.0 version
        let _placeholder =
            placeholder || locale.selectPlaceholder || locale.selectPlaceHolder;
        if (valueNodes && valueNodes.length) {
            _placeholder = null;
        }

        // 弹窗展开时将当前的值作为 placeholder，这个功能的前提是 valueNode 必须是一个字符串
        if (
            showSearch &&
            visible &&
            isSingle &&
            typeof valueNodes === 'string'
        ) {
            _placeholder = valueNodes;
        }

        // 下拉箭头
        const extra = this.renderExtraNode();

        const triggerClazz = classNames(
            [
                `${prefix}select`,
                `${prefix}select-trigger`,
                `${prefix}select-${mode}`,
                `${prefix}${size}`,
                className,
            ],
            {
                [`${prefix}active`]: visible, // 用于设置 searchInput 样式
                [`${prefix}inactive`]: !visible, // 用于设置 searchInput 样式
                [`${prefix}no-search`]: !hasSearch, // 用于判断是否将 searchInput 设置为 1px + 透明
                [`${prefix}has-search`]: hasSearch, // 用于单选时展开后判断是否隐藏值
                [`${prefix}select-in-ie`]: isIE9,
                [`${prefix}select-in-ie-fixwidth`]: this.state.fixWidth,
                [`${prefix}has-clear`]: this.hasClear(),
            }
        );

        const valuetext = this.valueDataSource.valueDS
            ? this.valueDataSource.valueDS.label
            : '';
        return (
            <span
                {...othersData}
                className={triggerClazz}
                style={style}
                dir={rtl ? 'rtl' : undefined}
                ref={this.saveSelectRef}
                onClick={this.handleWrapClick}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                onMouseDown={this.handleWrapClick}
            >
                <Input
                    aria-valuetext={valuetext}
                    {...obj.pickOthers(othersData, others)}
                    role="combobox"
                    tabIndex={0}
                    aria-expanded={this.state.visible}
                    aria-disabled={disabled}
                    state={state}
                    label={label}
                    extra={extra}
                    value={this.state.searchValue}
                    size={size}
                    readOnly={!this.hasSearch() || readOnly}
                    disabled={disabled}
                    placeholder={_placeholder}
                    hasBorder={hasBorder}
                    hasClear={false}
                    htmlSize="1"
                    inputRender={inputEl => {
                        return this.renderSearchInput(
                            valueNodes,
                            _placeholder,
                            inputEl
                        );
                    }}
                    onChange={this.handleSearch}
                    onKeyDown={this.handleSearchKeyDown}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    className={`${prefix}select-inner`}
                    ref={this.saveInputRef}
                />
                <span className={`${prefix}sr-only`} aria-live="polite">
                    {this.state.srReader}
                </span>
            </span>
        );
    }

    renderSearchInput(valueNodes, placeholder, inputEl) {
        const { prefix, mode, tagInline } = this.props;
        const isSingle = mode === 'single';

        const mirrorText = this.state.searchValue;

        const cls = classNames({
            [`${prefix}select-values`]: true,
            [`${prefix}input-text-field`]: true,
            [`${prefix}select-compact`]: !isSingle && tagInline,
        });

        const searchInput = [
            isSingle && valueNodes ? (
                <em key="select-value">{valueNodes}</em>
            ) : (
                valueNodes
            ),
        ];
        const triggerSearch = (
            <span
                key="trigger-search"
                className={`${prefix}select-trigger-search`}
            >
                {inputEl}
                <span aria-hidden>{mirrorText || placeholder}&nbsp;</span>
            </span>
        );

        if (!isSingle && tagInline) {
            searchInput.unshift(triggerSearch);
        } else {
            searchInput.push(triggerSearch);
        }

        return <span className={cls}>{searchInput}</span>;
    }

    /**
     * 渲染弹层的 header 内容
     * @override
     * @param {object} props
     */
    renderMenuHeader() {
        const { prefix, hasSelectAll, mode, menuProps } = this.props;

        if (menuProps && 'header' in menuProps) {
            return menuProps.header;
        }

        const sourceCount = this.dataStore.getEnableDS().length;
        // 多选模式下才有全选
        if (!hasSelectAll || mode === 'single' || !sourceCount) {
            return null;
        }

        const text =
            typeof hasSelectAll === 'boolean' ? 'Select All' : hasSelectAll;

        const selectAllYet = this.selectAllYet;

        const cls = classNames({
            [`${prefix}select-all`]: true,
            [`${prefix}selected`]: selectAllYet,
        });

        const clsInner = classNames({
            [`${prefix}select-all-inner`]: true,
        });

        // remove style={{'lineHeight': 'unset'}} in next Y
        // remove style={{'display': 'none'}} in next Y
        return (
            <div
                key="all"
                onClick={this.handleSelectAll}
                className={cls}
                style={{ lineHeight: 'unset' }}
            >
                {selectAllYet ? (
                    <Icon
                        className={`${prefix}menu-icon-selected`}
                        style={{ display: 'none' }}
                        type="select"
                    />
                ) : null}
                <span className={clsInner}>{text}</span>
            </div>
        );
    }

    render() {
        const { mode } = this.props;
        const props = { ...this.props };

        // forbid to close Popup by click Input while hasSearch
        if (this.hasSearch()) {
            props.canCloseByTrigger = false;
        }
        if (mode === 'single') {
            props.cache = true;
        }
        return super.render(props);
    }
}

export default Select;
