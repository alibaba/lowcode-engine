import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Menu from '../menu';
import { func, obj, dom } from '../util';
import CascaderMenu from './menu';
import CascaderMenuItem from './item';
import {
    filterChildValue,
    getAllCheckedValues,
    forEachEnableNode,
    isSiblingOrSelf,
    isNodeChecked,
} from './utils';

const { bindCtx } = func;
const { pickOthers } = obj;
const { addClass, removeClass, setStyle, getStyle } = dom;

/**
 * Cascader
 */
export default class Cascader extends Component {
    static propTypes = {
        prefix: PropTypes.string,
        rtl: PropTypes.bool,
        pure: PropTypes.bool,
        className: PropTypes.string,
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
        onSelect: PropTypes.func,
        /**
         * （非受控）默认展开值，如果不设置，组件内部会根据 defaultValue/value 进行自动设置
         */
        defaultExpandedValue: PropTypes.arrayOf(PropTypes.string),
        /**
         * （受控）当前展开值
         */
        expandedValue: PropTypes.arrayOf(PropTypes.string),
        /**
         * 展开触发的方式
         */
        expandTriggerType: PropTypes.oneOf(['click', 'hover']),
        /**
         * 展开时触发的回调函数
         * @param {Array} expandedValue 各列展开值的数组
         */
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
         * 单选时是否只能选中叶子节点
         */
        canOnlySelectLeaf: PropTypes.bool,
        /**
         * 多选时是否只能选中叶子节点
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
         * 每列列表项渲染函数
         * @param {Object} data 数据
         * @return {ReactNode} 列表项内容
         */
        itemRender: PropTypes.func,
        /**
         * 异步加载数据函数
         * @param {Object} data 当前点击异步加载的数据
         * @param {Object} source 当前点击数据，source是原始对象
         */
        loadData: PropTypes.func,
        searchValue: PropTypes.string,
        onBlur: PropTypes.func,
        filteredPaths: PropTypes.array,
        filteredListStyle: PropTypes.object,
        resultRender: PropTypes.func,
    };

    static defaultProps = {
        prefix: 'next-',
        rtl: false,
        pure: false,
        dataSource: [],
        defaultValue: null,
        canOnlySelectLeaf: false,
        canOnlyCheckLeaf: false,
        expandTriggerType: 'click',
        multiple: false,
        useVirtual: false,
        checkStrictly: false,
        itemRender: item => item.label,
    };

    constructor(props, context) {
        super(props, context);

        const {
            defaultValue,
            value,
            defaultExpandedValue,
            expandedValue,
            dataSource,
            multiple,
            checkStrictly,
            canOnlyCheckLeaf,
            loadData,
        } = props;

        this.updateCache(dataSource);

        let normalizedValue = this.normalizeValue(
            typeof value === 'undefined' ? defaultValue : value
        );
        if (!loadData) {
            normalizedValue = normalizedValue.filter(v => this._v2n[v]);
        }
        // TODO loadData
        const realExpandedValue =
            typeof expandedValue === 'undefined'
                ? typeof defaultExpandedValue === 'undefined'
                    ? this.getExpandedValue(normalizedValue[0])
                    : this.normalizeValue(defaultExpandedValue)
                : this.normalizeValue(expandedValue);
        const st = {
            value: normalizedValue,
            expandedValue: realExpandedValue,
        };
        if (multiple && !checkStrictly && !canOnlyCheckLeaf) {
            st.value = this.completeValue(props.dataSource, st.value);
        }

        this.state = st;

        this.lastExpandedValue = [...this.state.expandedValue];

        bindCtx(this, [
            'handleMouseLeave',
            'handleFocus',
            'handleFold',
            'getCascaderNode',
            'onBlur',
        ]);
    }

    componentDidMount() {
        this.setCascaderInnerWidth();
    }

    componentWillReceiveProps(nextProps) {
        this.updateCache(nextProps.dataSource);

        const state = {};
        if ('value' in nextProps) {
            state.value = this.normalizeValue(nextProps.value);
            if (!nextProps.loadData) {
                state.value = state.value.filter(v => this._v2n[v]);
            }

            const { multiple, checkStrictly, canOnlyCheckLeaf } = nextProps;
            if (multiple && !checkStrictly && !canOnlyCheckLeaf) {
                state.value = this.completeValue(
                    nextProps.dataSource,
                    state.value
                );
            }
            if (
                !this.state.expandedValue.length &&
                !('expandedValue' in nextProps)
            ) {
                state.expandedValue = this.getExpandedValue(state.value[0]);
            }
        }
        if ('expandedValue' in nextProps) {
            state.expandedValue = this.normalizeValue(nextProps.expandedValue);
        }
        if (Object.keys(state).length) {
            this.setState(state);
        }
    }

    componentDidUpdate() {
        this.setCascaderInnerWidth();
    }

    getCascaderNode(ref) {
        this.cascader = ref;
        if (this.cascader) {
            this.cascaderInner = this.cascader.querySelector(
                `.${this.props.prefix}cascader-inner`
            );
        }
    }

    setCascaderInnerWidth() {
        if (!this.cascaderInner) {
            return;
        }
        const menus = [].slice.call(
            this.cascaderInner.querySelectorAll(
                `.${this.props.prefix}cascader-menu-wrapper`
            )
        );
        if (menus.length === 0) {
            return;
        }

        const menusWidth = Math.ceil(
            menus.reduce((ret, menu) => {
                return ret + getStyle(menu, 'width');
            }, 0)
        );

        if (getStyle(this.cascaderInner, 'width') !== menusWidth) {
            setStyle(this.cascaderInner, 'width', menusWidth);
        }

        if (getStyle(this.cascader, 'display') === 'inline-block') {
            const hasRightBorderClass = `${this.props.prefix}has-right-border`;
            menus.forEach(menu => removeClass(menu, hasRightBorderClass));
            if (this.cascader.clientWidth > menusWidth) {
                addClass(menus[menus.length - 1], hasRightBorderClass);
            }
        }
    }

    setCache(data, prefix = '0') {
        data.forEach((item, index) => {
            const { value, children } = item;
            const pos = `${prefix}-${index}`;
            const newValue = String(value);
            item.value = newValue;
            this._v2n[newValue] = this._p2n[pos] = {
                ...item,
                pos,
                _source: item,
            };

            if (children && children.length) {
                this.setCache(children, pos);
            }
        });
    }

    updateCache(dataSource) {
        this._v2n = {};
        this._p2n = {};
        this.setCache(dataSource);
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

    getExpandedValue(v) {
        if (!v || !this._v2n[v]) {
            return [];
        }

        const pos = this._v2n[v].pos;
        if (pos.split('-').length === 2) {
            return [];
        }

        const expandedMap = {};
        Object.keys(this._p2n).forEach(p => {
            if (this.isDescendantOrSelf(p, pos) && p !== pos) {
                expandedMap[this._p2n[p].value] = p;
            }
        });

        return Object.keys(expandedMap).sort((prev, next) => {
            return (
                expandedMap[prev].split('-').length -
                expandedMap[next].split('-').length
            );
        });
    }
    /*eslint-disable max-statements*/
    completeValue(dataSource, value) {
        return getAllCheckedValues(value, this._v2n, this._p2n);
    }
    /*eslint-enable*/
    flatValue(value) {
        return filterChildValue(value, this._v2n, this._p2n);
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

    processValue(value, v, checked) {
        const index = value.indexOf(v);
        if (checked && index === -1) {
            value.push(v);
        } else if (!checked && index > -1) {
            value.splice(index, 1);
        }
    }

    handleSelect(v, canExpand) {
        if (!(this.props.canOnlySelectLeaf && canExpand)) {
            const data = this._v2n[v];
            const nums = data.pos.split('-');
            const selectedPath = nums.slice(1).reduce((ret, num, index) => {
                const p = nums.slice(0, index + 2).join('-');
                ret.push(this._p2n[p]);
                return ret;
            }, []);

            if (this.state.value[0] !== v) {
                if (!('value' in this.props)) {
                    this.setState({
                        value: [v],
                    });
                }

                if ('onChange' in this.props) {
                    this.props.onChange(v, data, {
                        selectedPath,
                    });
                }
            }

            if ('onSelect' in this.props) {
                this.props.onSelect(v, data, {
                    selectedPath,
                });
            }
        }

        if (canExpand) {
            if (!this.props.canOnlySelectLeaf) {
                this.lastExpandedValue = this.state.expandedValue.slice(0, -1);
            }
        } else {
            this.lastExpandedValue = [...this.state.expandedValue];
        }
    }
    /*eslint-disable max-statements*/
    handleCheck(v, checked) {
        const { checkStrictly, canOnlyCheckLeaf } = this.props;
        const value = [...this.state.value];

        if (checkStrictly || canOnlyCheckLeaf) {
            this.processValue(value, v, checked);
        } else {
            const pos = this.getPos(v);

            const ps = Object.keys(this._p2n);

            forEachEnableNode(this._v2n[v], node => {
                if (node.checkable === false) return;
                this.processValue(value, node.value, checked);
            });

            let currentPos = pos;
            const nums = pos.split('-');
            for (let i = nums.length; i > 2; i--) {
                let parentCheck = true;

                const parentPos = nums.slice(0, i - 1).join('-');
                if (
                    this._p2n[parentPos].disabled ||
                    this._p2n[parentPos].checkboxDisabled ||
                    this._p2n[parentPos].checkable === false
                ) {
                    currentPos = parentPos;
                    continue;
                }

                const parentValue = this._p2n[parentPos].value;
                const parentChecked = value.indexOf(parentValue) > -1;
                if (!checked && !parentChecked) {
                    break;
                }

                for (let j = 0; j < ps.length; j++) {
                    const p = ps[j];
                    const pnode = this._p2n[p];
                    if (
                        isSiblingOrSelf(currentPos, p) &&
                        !pnode.disabled &&
                        !pnode.checkboxDisabled
                    ) {
                        const k = pnode.value;
                        // eslint-disable-next-line max-depth
                        if (pnode.checkable === false) {
                            // eslint-disable-next-line max-depth
                            if (
                                !pnode.children ||
                                pnode.children.length === 0
                            ) {
                                continue;
                            }
                            // eslint-disable-next-line max-depth
                            for (let m = 0; m < pnode.children.length; m++) {
                                // eslint-disable-next-line max-depth
                                if (
                                    !pnode.children.every(child =>
                                        isNodeChecked(child, value)
                                    )
                                ) {
                                    parentCheck = false;
                                    break;
                                }
                            }
                        } else if (value.indexOf(k) === -1) {
                            parentCheck = false;
                        }

                        if (!parentCheck) break;
                    }
                }

                this.processValue(value, parentValue, parentCheck);

                currentPos = parentPos;
            }
        }

        if (!('value' in this.props)) {
            this.setState({
                value,
            });
        }

        if ('onChange' in this.props) {
            if (checkStrictly || canOnlyCheckLeaf) {
                const data = this.getData(value);
                this.props.onChange(value, data, {
                    checked,
                    currentData: this._v2n[v],
                    checkedData: data,
                });
            } else {
                const flatValue = this.flatValue(value);
                const flatData = this.getData(flatValue);
                const checkedData = this.getData(value);
                const indeterminateValue = this.getIndeterminate(value);
                const indeterminateData = this.getData(indeterminateValue);
                this.props.onChange(flatValue, flatData, {
                    checked,
                    currentData: this._v2n[v],
                    checkedData,
                    indeterminateData,
                });
            }
        }

        this.lastExpandedValue = [...this.state.expandedValue];
    }

    handleExpand(value, level, canExpand, focusedFirstChild) {
        const { expandedValue } = this.state;

        if (canExpand || expandedValue.length > level) {
            if (canExpand) {
                expandedValue.splice(
                    level,
                    expandedValue.length - level,
                    value
                );
            } else {
                expandedValue.splice(level);
            }

            const callback = () => {
                this.setExpandValue(expandedValue);

                if (focusedFirstChild) {
                    const endExpandedValue =
                        expandedValue[expandedValue.length - 1];
                    this.setState({
                        focusedValue: this._v2n[endExpandedValue].children[0]
                            .value,
                    });
                }
            };

            const { loadData } = this.props;
            if (canExpand && loadData) {
                const data = this._v2n[value];
                return loadData(data, data._source).then(callback);
            } else {
                return callback();
            }
        }
    }

    handleMouseLeave() {
        this.setExpandValue([...this.lastExpandedValue]);
    }

    setExpandValue(expandedValue) {
        if (!('expandedValue' in this.props)) {
            this.setState({
                expandedValue,
            });
        }

        if ('onExpand' in this.props) {
            this.props.onExpand(expandedValue);
        }
    }

    getFirstFocusKeyByDataSource(dataSource) {
        if (!dataSource || dataSource.length === 0) {
            return '';
        }

        for (let i = 0; i < dataSource.length; i++) {
            if (dataSource[i] && !dataSource[i].disabled) {
                return dataSource[i].value;
            }
        }

        return '';
    }

    getFirstFocusKeyByFilteredPaths(filteredPaths) {
        if (!filteredPaths || filteredPaths.length === 0) {
            return '';
        }

        for (let i = 0; i < filteredPaths.length; i++) {
            const path = filteredPaths[i];
            if (!path.some(item => item.disabled)) {
                const lastItem = path[path.length - 1];
                return lastItem.value;
            }
        }

        return '';
    }

    getFirstFocusKey() {
        const { dataSource, searchValue, filteredPaths } = this.props;

        return !searchValue
            ? this.getFirstFocusKeyByDataSource(dataSource)
            : this.getFirstFocusKeyByFilteredPaths(filteredPaths);
    }

    setFocusValue() {
        this.setState({
            focusedValue: this.getFirstFocusKey(),
        });
    }

    handleFocus(focusedValue) {
        this.setState({
            focusedValue,
        });
    }

    handleFold() {
        const { expandedValue } = this.state;
        if (expandedValue.length > 0) {
            this.setExpandValue(expandedValue.slice(0, -1));
        }

        this.setState({
            focusedValue: expandedValue[expandedValue.length - 1],
        });
    }

    getIndeterminate(value) {
        const indeterminateValues = [];

        const poss = filterChildValue(
            value
                .filter(v => !!this._v2n[v])
                .filter(
                    v =>
                        !this._v2n[v].disabled &&
                        !this._v2n[v].checkboxDisabled &&
                        this._v2n[v].checkable !== false
                ),
            this._v2n,
            this._p2n
        ).map(v => this._v2n[v].pos);
        poss.forEach(pos => {
            const nums = pos.split('-');
            for (let i = nums.length; i > 2; i--) {
                const parentPos = nums.slice(0, i - 1).join('-');
                const parent = this._p2n[parentPos];
                if (parent.disabled || parent.checkboxDisabled) break;
                const parentValue = parent.value;
                if (indeterminateValues.indexOf(parentValue) === -1) {
                    indeterminateValues.push(parentValue);
                }
            }
        });

        return indeterminateValues;
    }

    onBlur(e) {
        this.setState({
            focusedValue: undefined,
        });

        this.props.onBlur && this.props.onBlur(e);
    }

    renderMenu(data, level) {
        const {
            prefix,
            multiple,
            useVirtual,
            checkStrictly,
            expandTriggerType,
            loadData,
            canOnlyCheckLeaf,
            listClassName,
            listStyle,
            itemRender,
        } = this.props;
        const { value, expandedValue, focusedValue } = this.state;

        return (
            <CascaderMenu
                key={level}
                prefix={prefix}
                useVirtual={useVirtual}
                className={listClassName}
                style={listStyle}
                ref={this.saveMenuRef}
                focusedKey={focusedValue}
                onItemFocus={this.handleFocus}
                onBlur={this.onBlur}
            >
                {data.map(item => {
                    const disabled = !!item.disabled;
                    const canExpand =
                        (!!item.children && !!item.children.length) ||
                        (!!loadData && !item.isLeaf);
                    const expanded = expandedValue[level] === item.value;
                    const props = {
                        prefix,
                        disabled,
                        canExpand,
                        expanded,
                        expandTriggerType,
                        onExpand: this.handleExpand.bind(
                            this,
                            item.value,
                            level,
                            canExpand
                        ),
                        onFold: this.handleFold,
                    };

                    if (multiple) {
                        props.checkable = !(canOnlyCheckLeaf && canExpand);
                        props.checked =
                            value.indexOf(item.value) > -1 || !!item.checked;
                        props.indeterminate =
                            (checkStrictly || canOnlyCheckLeaf
                                ? false
                                : this.indeterminate.indexOf(item.value) >
                                  -1) || !!item.indeterminate;
                        props.checkboxDisabled = !!item.checkboxDisabled;
                        props.onCheck = this.handleCheck.bind(this, item.value);
                    } else {
                        props.selected = value[0] === item.value;
                        props.onSelect = this.handleSelect.bind(
                            this,
                            item.value,
                            canExpand
                        );
                    }

                    return (
                        <CascaderMenuItem key={item.value} {...props}>
                            {itemRender(item)}
                        </CascaderMenuItem>
                    );
                })}
            </CascaderMenu>
        );
    }

    renderMenus() {
        const { dataSource } = this.props;
        const { expandedValue } = this.state;

        const menus = [];
        let data = dataSource;

        for (let i = 0; i <= expandedValue.length; i++) {
            if (!data) {
                break;
            }

            menus.push(this.renderMenu(data, i));

            let expandedItem;
            for (let j = 0; j < data.length; j++) {
                if (data[j].value === expandedValue[i]) {
                    expandedItem = data[j];
                    break;
                }
            }
            data = expandedItem ? expandedItem.children : null;
        }

        return menus;
    }

    renderFilteredItem(path) {
        const { prefix, resultRender, searchValue, multiple } = this.props;
        const { value } = this.state;
        const lastItem = path[path.length - 1];

        let Item;
        const props = {
            key: lastItem.value,
            className: `${prefix}cascader-filtered-item`,
            disabled: path.some(item => item.disabled),
            children: resultRender(searchValue, path),
        };

        if (multiple) {
            Item = Menu.CheckboxItem;
            const { checkStrictly, canOnlyCheckLeaf } = this.props;
            props.checked = value.indexOf(lastItem.value) > -1;
            props.indeterminate =
                !checkStrictly &&
                !canOnlyCheckLeaf &&
                this.indeterminate.indexOf(lastItem.value) > -1;
            props.checkboxDisabled = lastItem.checkboxDisabled;
            props.onChange = this.handleCheck.bind(this, lastItem.value);
        } else {
            Item = Menu.Item;
            props.selected = value[0] === lastItem.value;
            props.onSelect = this.handleSelect.bind(
                this,
                lastItem.value,
                false
            );
        }

        return <Item {...props} />;
    }

    renderFilteredList() {
        const { prefix, filteredListStyle, filteredPaths } = this.props;
        const { focusedValue } = this.state;
        return (
            <Menu
                focusedKey={focusedValue}
                onItemFocus={this.handleFocus}
                className={`${prefix}cascader-filtered-list`}
                style={filteredListStyle}
            >
                {filteredPaths.map(path => this.renderFilteredItem(path))}
            </Menu>
        );
    }

    render() {
        const {
            prefix,
            rtl,
            className,
            expandTriggerType,
            multiple,
            dataSource,
            checkStrictly,
            canOnlyCheckLeaf,
            searchValue,
        } = this.props;
        const others = pickOthers(Object.keys(Cascader.propTypes), this.props);
        const { value } = this.state;

        if (rtl) {
            others.dir = 'rtl';
        }

        const props = {
            className: cx({
                [`${prefix}cascader`]: true,
                multiple,
                [className]: !!className,
            }),
            ref: 'cascader',
            ...others,
        };
        if (expandTriggerType === 'hover') {
            props.onMouseLeave = this.handleMouseLeave;
        }

        if (multiple && !checkStrictly && !canOnlyCheckLeaf) {
            this.indeterminate = this.getIndeterminate(value);
        }

        return (
            <div {...props} ref={this.getCascaderNode}>
                {!searchValue ? (
                    <div className={`${prefix}cascader-inner`}>
                        {dataSource && dataSource.length
                            ? this.renderMenus()
                            : null}
                    </div>
                ) : (
                    this.renderFilteredList()
                )}
            </div>
        );
    }
}
