import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Select from '../select';
import Cascader from '../cascader';
import Menu from '../menu';
import { func, obj, dom, KEYCODE } from '../util';

const { bindCtx } = func;
const { pickOthers } = obj;
const { getStyle } = dom;

/**
 * CascaderSelect
 */
export default class CascaderSelect extends Component {
    static propTypes = {
        prefix: PropTypes.string,
        pure: PropTypes.bool,
        className: PropTypes.string,
        /**
         * 选择框大小
         */
        size: PropTypes.oneOf(['small', 'medium', 'large']),
        /**
         * 选择框占位符
         */
        placeholder: PropTypes.string,
        /**
         * 是否禁用
         */
        disabled: PropTypes.bool,
        /**
         * 是否有下拉箭头
         */
        hasArrow: PropTypes.bool,
        /**
         * 是否有边框
         */
        hasBorder: PropTypes.bool,
        /**
         * 是否有清除按钮
         */
        hasClear: PropTypes.bool,
        /**
         * 自定义内联 label
         */
        label: PropTypes.node,
        /**
         * 是否只读，只读模式下可以展开弹层但不能选
         */
        readOnly: PropTypes.bool,
        /**
         * 数据源，结构可参考下方说明
         */
        dataSource: PropTypes.arrayOf(PropTypes.object),
        /**
         * （非受控）默认值
         */
        defaultValue: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.arrayOf(PropTypes.string),
        ]),
        /**
         * （受控）当前值
         */
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.arrayOf(PropTypes.string),
        ]),
        /**
         * 选中值改变时触发的回调函数
         * @param {String|Array} value 选中的值，单选时返回单个值，多选时返回数组
         * @param {Object|Array} data 选中的数据，包括 value 和 label，单选时返回单个值，多选时返回数组，父子节点选中关联时，同时选中，只返回父节点
         * @param {Object} extra 额外参数
         * @param {Array} extra.selectedPath 单选时选中的数据的路径
         * @param {Boolean} extra.checked 多选时当前的操作是选中还是取消选中
         * @param {Object} extra.currentData 多选时当前操作的数据
         * @param {Array} extra.checkedData 多选时所有被选中的数据
         * @param {Array} extra.indeterminateData 多选时半选的数据
         */
        onChange: PropTypes.func,
        /**
         * 默认展开值，如果不设置，组件内部会根据 defaultValue/value 进行自动设置
         */
        defaultExpandedValue: PropTypes.arrayOf(PropTypes.string),
        /**
         * 展开触发的方式
         */
        expandTriggerType: PropTypes.oneOf(['click', 'hover']),
        onExpand: PropTypes.func,
        /**
         * 是否开启虚拟滚动
         */
        useVirtual: PropTypes.bool,
        /**
         * 是否多选
         */
        multiple: PropTypes.bool,
        /**
         * 是否选中即发生改变, 该属性仅在单选模式下有效
         */
        changeOnSelect: PropTypes.bool,
        /**
         * 是否只能勾选叶子项的checkbox，该属性仅在多选模式下有效
         */
        canOnlyCheckLeaf: PropTypes.bool,
        /**
         * 父子节点是否选中不关联
         */
        checkStrictly: PropTypes.bool,
        /**
         * 每列列表样式对象
         */
        listStyle: PropTypes.object,
        /**
         * 每列列表类名
         */
        listClassName: PropTypes.string,
        /**
         * 选择框单选时展示结果的自定义渲染函数
         * @param {Array} label 选中路径的文本数组
         * @return {ReactNode} 渲染在选择框中的内容
         * @default 单选时：labelPath => labelPath.join(' / ')；多选时：labelPath => labelPath[labelPath.length - 1]
         */
        displayRender: PropTypes.func,
        /**
         * 渲染 item 内容的方法
         * @param {Object} item 渲染节点的item
         * @return {ReactNode} item node
         */
        itemRender: PropTypes.func,
        /**
         * 是否显示搜索框
         */
        showSearch: PropTypes.bool,
        /**
         * 自定义搜索函数
         * @param {String} searchValue 搜索的关键字
         * @param {Array} path 节点路径
         * @return {Boolean} 是否匹配
         * @default 根据路径所有节点的文本值模糊匹配
         */
        filter: PropTypes.func,
        /**
         * 搜索结果自定义渲染函数
         * @param {String} searchValue 搜索的关键字
         * @param {Array} path 匹配到的节点路径
         * @return {ReactNode} 渲染的内容
         * @default 按照节点文本 a / b / c 的模式渲染
         */
        resultRender: PropTypes.func,
        /**
         * 搜索结果列表是否和选择框等宽
         */
        resultAutoWidth: PropTypes.bool,
        /**
         * 无数据时显示内容
         */
        notFoundContent: PropTypes.node,
        /**
         * 异步加载数据函数
         * @param {Object} data 当前点击异步加载的数据
         */
        loadData: PropTypes.func,
        /**
         * 自定义下拉框头部
         */
        header: PropTypes.node,
        /**
         * 自定义下拉框底部
         */
        footer: PropTypes.node,
        /**
         * 初始下拉框是否显示
         */
        defaultVisible: PropTypes.bool,
        /**
         * 当前下拉框是否显示
         */
        visible: PropTypes.bool,
        /**
         * 下拉框显示或关闭时触发事件的回调函数
         * @param {Boolean} visible 是否显示
         * @param {String} type 触发显示关闭的操作类型, fromTrigger 表示由trigger的点击触发； docClick 表示由document的点击触发
         */
        onVisibleChange: PropTypes.func,
        /**
         * 下拉框自定义样式对象
         */
        popupStyle: PropTypes.object,
        /**
         * 下拉框样式自定义类名
         */
        popupClassName: PropTypes.string,
        /**
         * 下拉框挂载的容器节点
         */
        popupContainer: PropTypes.any,
        /**
         * 透传到 Popup 的属性对象
         */
        popupProps: PropTypes.object,
        /**
         * 是否跟随滚动
         */
        followTrigger: PropTypes.bool,
        /**
         * 是否为预览态
         */
        isPreview: PropTypes.bool,
        /**
         * 预览态模式下渲染的内容
         * @param {Array<data>} value 选择值 { label: , value:}
         */
        renderPreview: PropTypes.func,
    };

    static defaultProps = {
        prefix: 'next-',
        pure: false,
        size: 'medium',
        disabled: false,
        hasArrow: true,
        hasBorder: true,
        hasClear: false,
        dataSource: [],
        defaultValue: null,
        expandTriggerType: 'click',
        onExpand: () => {},
        useVirtual: false,
        multiple: false,
        changeOnSelect: false,
        canOnlyCheckLeaf: false,
        checkStrictly: false,
        showSearch: false,
        filter: (searchValue, path) => {
            return path.some(item => item.label.indexOf(searchValue) > -1);
        },
        resultRender: (searchValue, path) => {
            const parts = [];
            path.forEach((item, i) => {
                const others = item.label.split(searchValue);
                others.forEach((other, j) => {
                    if (other) {
                        parts.push(other);
                    }
                    if (j < others.length - 1) {
                        parts.push(<em key={`${i}-${j}`}>{searchValue}</em>);
                    }
                });
                if (i < path.length - 1) {
                    parts.push(' / ');
                }
            });
            return <span>{parts}</span>;
        },
        resultAutoWidth: true,
        notFoundContent: 'Not Found',
        defaultVisible: false,
        onVisibleChange: () => {},
        popupProps: {},
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            value: this.normalizeValue(
                'value' in props ? props.value : props.defaultValue
            ),
            searchValue: '',
            visible:
                typeof props.visible === 'undefined'
                    ? props.defaultVisible
                    : props.visible,
        };

        bindCtx(this, [
            'handleVisibleChange',
            'handleAfterOpen',
            'handleSelect',
            'handleChange',
            'handleClear',
            'handleRemove',
            'handleSearch',
            'getPopup',
            'saveSelectRef',
            'saveCascaderRef',
            'handleKeyDown',
        ]);
    }

    componentWillReceiveProps(nextProps) {
        const st = {};

        if ('value' in nextProps) {
            st.value = this.normalizeValue(nextProps.value);
        }
        if ('visible' in nextProps) {
            st.visible = nextProps.visible;
        }

        if (Object.keys(st).length) {
            this.setState(st);
        }
    }

    normalizeValue(value) {
        if (value) {
            if (Array.isArray(value)) {
                return value;
            }

            return [value];
        }

        return [];
    }

    updateCache(dataSource) {
        this._v2n = {};
        this._p2n = {};
        const loop = (data, prefix = '0') =>
            data.forEach((item, index) => {
                const { value, children } = item;
                const pos = `${prefix}-${index}`;
                this._v2n[value] = this._p2n[pos] = { ...item, pos };

                if (children && children.length) {
                    loop(children, pos);
                }
            });

        loop(dataSource);
    }

    flatValue(value) {
        const getDepth = v => {
            const pos = this.getPos(v);
            if (!pos) {
                return 0;
            }
            return pos.split('-').length;
        };
        const newValue = value.slice(0).sort((prev, next) => {
            return getDepth(prev) - getDepth(next);
        });

        for (let i = 0; i < newValue.length; i++) {
            for (let j = 0; j < newValue.length; j++) {
                if (
                    i !== j &&
                    this.isDescendantOrSelf(
                        this.getPos(newValue[i]),
                        this.getPos(newValue[j])
                    )
                ) {
                    newValue.splice(j, 1);
                    j--;
                }
            }
        }

        return newValue;
    }

    isDescendantOrSelf(currentPos, targetPos) {
        if (!currentPos || !targetPos) {
            return false;
        }

        const currentNums = currentPos.split('-');
        const targetNums = targetPos.split('-');

        return (
            currentNums.length <= targetNums.length &&
            currentNums.every((num, index) => {
                return num === targetNums[index];
            })
        );
    }

    getValue(pos) {
        return this._p2n[pos] ? this._p2n[pos].value : null;
    }

    getPos(value) {
        return this._v2n[value] ? this._v2n[value].pos : null;
    }

    getData(value) {
        return value.map(v => this._v2n[v]);
    }

    getLabelPath(data) {
        const nums = data.pos.split('-');
        return nums.slice(1).reduce((ret, num, index) => {
            const p = nums.slice(0, index + 2).join('-');
            ret.push(this._p2n[p].label);
            return ret;
        }, []);
    }

    getSignleData(value) {
        if (!value.length) {
            return null;
        }

        if (Array.isArray(value)) value = value[0];

        const data = this._v2n[value];
        if (!data) {
            return {
                value,
            };
        }

        const labelPath = this.getLabelPath(data);
        const displayRender =
            this.props.displayRender || (labels => labels.join(' / '));

        return {
            ...data,
            label: displayRender(labelPath, data),
        };
    }

    getMultipleData(value) {
        if (!value.length) {
            return null;
        }

        const { checkStrictly, canOnlyCheckLeaf, displayRender } = this.props;
        let data = (checkStrictly || canOnlyCheckLeaf
            ? value
            : this.flatValue(value)
        ).map(v => this._v2n[v] || { value: v });

        if (displayRender) {
            data = data.map(item => {
                if (!item.pos) {
                    return item;
                }
                const labelPath = this.getLabelPath(item);

                return {
                    ...item,
                    label: displayRender(labelPath, item),
                };
            });
        }

        return data;
    }

    getIndeterminate(value) {
        const indeterminate = [];

        const positions = value.map(this.getPos.bind(this));
        positions.forEach(pos => {
            if (!pos) {
                return false;
            }
            const nums = pos.split('-');
            for (let i = nums.length; i > 2; i--) {
                const parentPos = nums.slice(0, i - 1).join('-');
                const parentValue = this.getValue(parentPos);
                if (indeterminate.indexOf(parentValue) === -1) {
                    indeterminate.push(parentValue);
                }
            }
        });

        return indeterminate;
    }

    saveSelectRef(ref) {
        this.select = ref;
    }

    saveCascaderRef(ref) {
        this.cascader = ref;
    }

    completeValue(value) {
        const newValue = [];

        const flatValue = this.flatValue(value).reverse();
        const ps = Object.keys(this._p2n);
        for (let i = 0; i < ps.length; i++) {
            for (let j = 0; j < flatValue.length; j++) {
                const v = flatValue[j];
                if (this.isDescendantOrSelf(this.getPos(v), ps[i])) {
                    newValue.push(this.getValue(ps[i]));
                    ps.splice(i, 1);
                    i--;
                    break;
                }
            }
        }

        return newValue;
    }

    isLeaf(data) {
        return !(
            (data.children && data.children.length) ||
            (!!this.props.loadData && !data.isLeaf)
        );
    }

    handleVisibleChange(visible, type) {
        const { searchValue } = this.state;
        if (!('visible' in this.props)) {
            this.setState({
                visible,
            });
        }

        if (!visible && searchValue) {
            this.setState({
                searchValue: '',
            });
        }

        if (['fromCascader', 'keyboard'].indexOf(type) !== -1 && !visible) {
            this.select.focusInput();
        }

        this.props.onVisibleChange(visible, type);
    }

    handleKeyDown(e) {
        const { onKeyDown } = this.props;
        const { visible } = this.state;

        if (onKeyDown) {
            onKeyDown(e);
        }

        if (!visible) {
            return;
        }

        switch (e.keyCode) {
            case KEYCODE.UP:
            case KEYCODE.DOWN:
                this.cascader.setFocusValue();
                e.preventDefault();
                break;
            default:
                break;
        }
    }

    getPopup(ref) {
        this.popup = ref;
        if (typeof this.props.popupProps.ref === 'function') {
            this.props.popupProps.ref(ref);
        }
    }

    handleAfterOpen() {
        if (!this.popup) {
            return;
        }

        const { prefix, popupProps } = this.props;
        const dropDownNode = this.popup
            .getInstance()
            .overlay.getInstance()
            .getContentNode();
        const cascaderNode = dropDownNode.querySelector(`.${prefix}cascader`);
        if (cascaderNode) {
            this.cascaderHeight = getStyle(cascaderNode, 'height');
        }

        if (typeof popupProps.afterOpen === 'function') {
            popupProps.afterOpen();
        }
    }

    handleSelect(value, data) {
        const { multiple, changeOnSelect } = this.props;
        const { visible, searchValue } = this.state;

        if (
            !multiple &&
            (!changeOnSelect || this.isLeaf(data) || !!searchValue)
        ) {
            this.handleVisibleChange(!visible, 'fromCascader');
        }
    }

    handleChange(value, data, extra) {
        const { multiple, onChange } = this.props;
        const { searchValue, value: stateValue } = this.state;

        const st = {};

        if (multiple && stateValue && Array.isArray(stateValue)) {
            value = [...stateValue.filter(v => !this._v2n[v]), ...value];
        }

        if (!('value' in this.props)) {
            st.value = value;
        }
        if (!multiple && searchValue) {
            st.searchValue = '';
        }
        if (Object.keys(st).length) {
            this.setState(st);
        }

        if (onChange) {
            onChange(value, data, extra);
        }

        if (searchValue && this.select) {
            this.select.handleSearchClear();
        }
    }

    handleClear() {
        // 单选时点击清空按钮
        const { hasClear, multiple, treeCheckable } = this.props;
        if (hasClear && (!multiple || !treeCheckable)) {
            if (!('value' in this.props)) {
                this.setState({
                    value: [],
                });
            }

            this.props.onChange(null, null);
        }
    }

    handleRemove(currentData) {
        const { value: currentValue } = currentData;
        let value;

        const { multiple, checkStrictly, onChange } = this.props;
        if (multiple) {
            value = [...this.state.value];
            value.splice(value.indexOf(currentValue), 1);

            if (this.props.onChange) {
                const data = this.getData(value);
                const checked = false;

                if (checkStrictly) {
                    this.props.onChange(value, data, {
                        checked,
                        currentData,
                        checkedData: data,
                    });
                } else {
                    const checkedValue = this.completeValue(value);
                    const checkedData = this.getData(checkedValue);
                    const indeterminateValue = this.getIndeterminate(value);
                    const indeterminateData = this.getData(indeterminateValue);
                    this.props.onChange(value, data, {
                        checked,
                        currentData,
                        checkedData,
                        indeterminateData,
                    });
                }
            }
        } else {
            value = [];
            onChange(null, null);
        }

        if (!('value' in this.props)) {
            this.setState({
                value,
            });
        }
    }

    handleSearch(searchValue) {
        this.setState({
            searchValue,
        });
    }

    getPath(pos) {
        const items = [];

        const nums = pos.split('-');
        if (nums === 2) {
            items.push(this._p2n[pos]);
        } else {
            for (let i = 1; i < nums.length; i++) {
                const p = nums.slice(0, i + 1).join('-');
                items.push(this._p2n[p]);
            }
        }

        return items;
    }

    filterItems() {
        const {
            multiple,
            changeOnSelect,
            canOnlyCheckLeaf,
            filter,
        } = this.props;
        const { searchValue } = this.state;
        let items = Object.keys(this._p2n).map(p => this._p2n[p]);
        if ((!multiple && !changeOnSelect) || (multiple && canOnlyCheckLeaf)) {
            items = items.filter(
                item => !item.children || !item.children.length
            );
        }

        return items
            .map(item => this.getPath(item.pos))
            .filter(path => filter(searchValue, path));
    }

    renderNotFound() {
        const { prefix, notFoundContent } = this.props;

        return (
            <Menu className={`${prefix}cascader-select-not-found`}>
                <Menu.Item>{notFoundContent}</Menu.Item>
            </Menu>
        );
    }

    renderCascader() {
        const { dataSource } = this.props;
        if (dataSource.length === 0) {
            return this.renderNotFound();
        }

        const { searchValue } = this.state;
        let filteredPaths = [];
        if (searchValue) {
            filteredPaths = this.filterItems();
            if (filteredPaths.length === 0) {
                return this.renderNotFound();
            }
        }

        const {
            multiple,
            useVirtual,
            changeOnSelect,
            checkStrictly,
            canOnlyCheckLeaf,
            defaultExpandedValue,
            expandTriggerType,
            onExpand,
            listStyle,
            listClassName,
            loadData,
            showSearch,
            resultRender,
            readOnly,
            itemRender,
        } = this.props;
        const { value } = this.state;

        const props = {
            dataSource,
            value,
            multiple,
            useVirtual,
            canOnlySelectLeaf: !changeOnSelect,
            checkStrictly,
            canOnlyCheckLeaf,
            defaultExpandedValue,
            expandTriggerType,
            ref: this.saveCascaderRef,
            onExpand,
            listStyle,
            listClassName,
            loadData,
            itemRender,
        };
        if (!readOnly) {
            props.onChange = this.handleChange;
            props.onSelect = this.handleSelect;
        }
        if (showSearch) {
            props.searchValue = searchValue;
            props.filteredPaths = filteredPaths;
            props.resultRender = resultRender;
            props.filteredListStyle = { height: this.cascaderHeight };
        }

        return <Cascader {...props} />;
    }

    renderPopupContent() {
        const { prefix, header, footer } = this.props;
        return (
            <div className={`${prefix}cascader-select-dropdown`}>
                {header}
                {this.renderCascader()}
                {footer}
            </div>
        );
    }

    renderPreview(others) {
        const { prefix, multiple, className, renderPreview } = this.props;
        const { value } = this.state;
        const previewCls = classNames(className, `${prefix}form-preview`);
        let items =
            (multiple
                ? this.getMultipleData(value)
                : this.getSignleData(value)) || [];

        if (!Array.isArray(items)) {
            items = [items];
        }

        if (typeof renderPreview === 'function') {
            return (
                <div {...others} className={previewCls}>
                    {renderPreview(items, this.props)}
                </div>
            );
        }

        return (
            <p {...others} className={previewCls}>
                {items.map(({ label }) => label).join(', ')}
            </p>
        );
    }

    render() {
        const {
            prefix,
            size,
            hasArrow,
            hasBorder,
            hasClear,
            label,
            readOnly,
            placeholder,
            dataSource,
            disabled,
            multiple,
            className,
            showSearch,
            popupStyle,
            popupClassName,
            popupContainer,
            popupProps,
            followTrigger,
            isPreview,
        } = this.props;
        const { value, searchValue, visible } = this.state;
        const others = pickOthers(
            Object.keys(CascaderSelect.propTypes),
            this.props
        );

        this.updateCache(dataSource);

        if (isPreview) {
            return this.renderPreview(others);
        }

        const popupContent = this.renderPopupContent();

        const props = {
            prefix,
            className,
            size,
            placeholder,
            disabled,
            hasArrow,
            hasBorder,
            hasClear,
            label,
            readOnly,
            ref: this.saveSelectRef,
            autoWidth: false,
            mode: multiple ? 'multiple' : 'single',
            value: multiple
                ? this.getMultipleData(value)
                : this.getSignleData(value),
            onChange: this.handleClear,
            onRemove: this.handleRemove,
            visible,
            onVisibleChange: this.handleVisibleChange,
            showSearch,
            // searchValue,
            onSearch: this.handleSearch,
            onKeyDown: this.handleKeyDown,
            popupContent,
            popupStyle,
            popupClassName,
            popupContainer,
            popupProps,
            followTrigger,
        };

        if (showSearch) {
            props.popupProps = {
                ...popupProps,
                ref: this.getPopup,
                afterOpen: this.handleAfterOpen,
            };
            props.autoWidth = showSearch && !!searchValue;
        }

        return <Select {...props} {...others} />;
    }
}
