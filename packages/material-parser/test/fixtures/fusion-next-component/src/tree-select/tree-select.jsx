import React, {
    Component,
    Children,
    isValidElement,
    cloneElement,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Select from '../select';
import Tree from '../tree';
import {
    normalizeToArray,
    getAllCheckedKeys,
    filterChildKey,
    filterParentKey,
    isDescendantOrSelf,
} from '../tree/view/util';
import { func, obj, KEYCODE } from '../util';

const noop = () => {};
const { Node: TreeNode } = Tree;
const { bindCtx } = func;
const { pickOthers } = obj;

/**
 * TreeSelect
 */
export default class TreeSelect extends Component {
    static propTypes = {
        prefix: PropTypes.string,
        pure: PropTypes.bool,
        className: PropTypes.string,
        /**
         * 树节点
         */
        children: PropTypes.node,
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
         * 是否有清空按钮
         */
        hasClear: PropTypes.bool,
        /**
         * 自定义内联 label
         */
        label: PropTypes.node,
        /**
         * 是否只读，只读模式下可以展开弹层但不能选择
         */
        readOnly: PropTypes.bool,
        /**
         * 下拉框是否与选择器对齐
         */
        autoWidth: PropTypes.bool,
        /**
         * 数据源，该属性优先级高于 children
         */
        dataSource: PropTypes.arrayOf(PropTypes.object),
        /**
         * （受控）当前值
         */
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.arrayOf(PropTypes.string),
        ]),
        /**
         * （非受控）默认值
         */
        defaultValue: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.arrayOf(PropTypes.string),
        ]),
        /**
         * 选中值改变时触发的回调函数
         * @param {String|Array} value 选中的值，单选时返回单个值，多选时返回数组
         * @param {Object|Array} data 选中的数据，包括 value, label, pos, key属性，单选时返回单个值，多选时返回数组，父子节点选中关联时，同时选中，只返回父节点
         */
        onChange: PropTypes.func,
        /**
         * 是否显示搜索框
         */
        showSearch: PropTypes.bool,
        /**
         * 在搜索框中输入时触发的回调函数
         * @param {String} keyword 输入的关键字
         */
        onSearch: PropTypes.func,
        onSearchClear: PropTypes.func,
        /**
         * 无数据时显示内容
         */
        notFoundContent: PropTypes.node,
        /**
         * 是否支持多选
         */
        multiple: PropTypes.bool,
        /**
         * 下拉框中的树是否支持勾选节点的复选框
         */
        treeCheckable: PropTypes.bool,
        /**
         * 下拉框中的树勾选节点复选框是否完全受控（父子节点选中状态不再关联）
         */
        treeCheckStrictly: PropTypes.bool,
        /**
         * 定义选中时回填的方式
         * @enumdesc 返回所有选中的节点, 父子节点都选中时只返回父节点, 父子节点都选中时只返回子节点
         */
        treeCheckedStrategy: PropTypes.oneOf(['all', 'parent', 'child']),
        /**
         * 下拉框中的树是否默认展开所有节点
         */
        treeDefaultExpandAll: PropTypes.bool,
        /**
         * 下拉框中的树默认展开节点key的数组
         */
        treeDefaultExpandedKeys: PropTypes.arrayOf(PropTypes.string),
        /**
         * 下拉框中的树异步加载数据的函数，使用请参考[Tree的异步加载数据Demo](https://fusion.design/component/tree)
         * @param {ReactElement} node 被点击展开的节点
         */
        treeLoadData: PropTypes.func,
        /**
         * 透传到 Tree 的属性对象
         */
        treeProps: PropTypes.object,
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
         * @param {String} type 触发显示关闭的操作类型
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
        autoWidth: true,
        defaultValue: null,
        onChange: noop,
        showSearch: false,
        onSearch: noop,
        onSearchClear: noop,
        notFoundContent: 'Not Found',
        multiple: false,
        treeCheckable: false,
        treeCheckStrictly: false,
        treeCheckedStrategy: 'parent',
        treeDefaultExpandAll: false,
        treeDefaultExpandedKeys: [],
        treeProps: {},
        defaultVisible: false,
        onVisibleChange: noop,
    };

    constructor(props, context) {
        super(props, context);

        const { defaultVisible, visible, defaultValue, value } = props;
        this.state = {
            visible: typeof visible === 'undefined' ? defaultVisible : visible,
            value: normalizeToArray(
                typeof value === 'undefined' ? defaultValue : value
            ),
            searchedValue: '',
            expandedKeys: [],
            autoExpandParent: false,
        };

        bindCtx(this, [
            'handleSelect',
            'handleCheck',
            'handleSearch',
            'handleSearchClear',
            'handleVisibleChange',
            'handleChange',
            'handleRemove',
            'handleExpand',
            'handleKeyDown',
            'saveTreeRef',
            'saveSelectRef',
        ]);

        this.updateCache(props);
    }

    componentWillReceiveProps(nextProps) {
        this.updateCache(nextProps);

        const st = {};
        if ('value' in nextProps) {
            st.value = normalizeToArray(nextProps.value);
        }
        if ('visible' in nextProps) {
            st.visible = nextProps.visible;
        }

        if (Object.keys(st).length) {
            this.setState(st);
        }
    }

    updateCache(props) {
        this._k2n = {};
        this._p2n = {};
        this._v2n = {};

        if ('dataSource' in props) {
            const loop = (data, prefix = '0') =>
                data.map((item, index) => {
                    const { value, children } = item;
                    const pos = `${prefix}-${index}`;
                    const key = item.key || pos;
                    const newItem = { ...item, key, pos };
                    if (children && children.length) {
                        newItem.children = loop(children, pos);
                    }

                    this._k2n[key] = this._p2n[pos] = this._v2n[
                        value
                    ] = newItem;
                    return newItem;
                });
            loop(props.dataSource);
        } else if ('children' in props) {
            const loop = (children, prefix = '0') =>
                Children.map(children, (node, index) => {
                    if (!React.isValidElement(node)) {
                        return;
                    }

                    const { value, children } = node.props;
                    const pos = `${prefix}-${index}`;
                    const key = node.key || pos;
                    const newItem = { ...node.props, key, pos };
                    if (children && Children.count(children)) {
                        newItem.children = loop(children, pos);
                    }

                    this._k2n[key] = this._p2n[pos] = this._v2n[
                        value
                    ] = newItem;
                    return newItem;
                });
            loop(props.children);
        }
    }

    getKeysByValue(value) {
        return value.reduce((ret, v) => {
            const k = this._v2n[v] && this._v2n[v].key;
            if (k) {
                ret.push(k);
            }

            return ret;
        }, []);
    }

    getValueByKeys(keys) {
        return keys.map(k => this._k2n[k].value);
    }

    getValueForSelect(value) {
        const { treeCheckedStrategy } = this.props;

        let keys = this.getKeysByValue(value);
        keys = getAllCheckedKeys(keys, this._k2n, this._p2n);

        switch (treeCheckedStrategy) {
            case 'parent':
                keys = filterChildKey(keys, this._k2n, this._p2n);
                break;
            case 'child':
                keys = filterParentKey(keys, this._k2n, this._p2n);
                break;
            default:
                break;
        }

        return this.getValueByKeys(keys);
    }

    getData(value, forSelect) {
        return value.reduce((ret, v) => {
            const k = this._v2n[v] && this._v2n[v].key;
            if (k) {
                const { label, pos, disabled, checkboxDisabled } = this._k2n[k];
                const d = {
                    value: v,
                    label,
                    pos,
                };
                if (forSelect) {
                    d.disabled = disabled || checkboxDisabled;
                } else {
                    d.key = k;
                }
                ret.push(d);
            }

            return ret;
        }, []);
    }

    saveTreeRef(ref) {
        this.tree = ref;
    }

    saveSelectRef(ref) {
        this.select = ref;
    }

    handleVisibleChange(visible, type) {
        if (!('visible' in this.props)) {
            this.setState({
                visible,
            });
        }

        if (['fromTree', 'keyboard'].indexOf(type) !== -1 && !visible) {
            this.select.focusInput();
        }

        this.props.onVisibleChange(visible, type);
    }

    handleSelect(selectedKeys, extra) {
        const { multiple, onChange } = this.props;
        const { selected } = extra;

        if (multiple || selected) {
            const value = this.getValueByKeys(selectedKeys);
            if (!('value' in this.props)) {
                this.setState({
                    value,
                });
            }
            if (!multiple) {
                this.handleVisibleChange(false, 'fromTree');
            }

            const data = this.getData(value);
            multiple ? onChange(value, data) : onChange(value[0], data[0]);
        } else {
            this.handleVisibleChange(false, 'fromTree');
        }
    }

    handleCheck(checkedKeys) {
        const { onChange } = this.props;

        const value = this.getValueByKeys(checkedKeys);
        if (!('value' in this.props)) {
            this.setState({
                value,
            });
        }

        onChange(value, this.getData(value));
    }

    handleRemove(removedItem) {
        const { value: removedValue } = removedItem;
        const {
            treeCheckable,
            treeCheckStrictly,
            treeCheckedStrategy,
            onChange,
        } = this.props;

        let value;
        if (
            treeCheckable &&
            !treeCheckStrictly &&
            ['parent', 'all'].indexOf(treeCheckedStrategy) !== -1
        ) {
            const removedPos = this._v2n[removedValue].pos;
            value = this.state.value.filter(v => {
                const p = this._v2n[v].pos;
                return !isDescendantOrSelf(removedPos, p);
            });

            const nums = removedPos.split('-');
            for (let i = nums.length; i > 2; i--) {
                const parentPos = nums.slice(0, i - 1).join('-');
                const parentValue = this._p2n[parentPos].value;
                const parentIndex = value.indexOf(parentValue);
                if (parentIndex > -1) {
                    value.splice(parentIndex, 1);
                } else {
                    break;
                }
            }
        } else {
            value = this.state.value.filter(v => v !== removedValue);
        }

        if (!('value' in this.props)) {
            this.setState({
                value,
            });
        }

        const data = this.getData(value);
        onChange(value, data);
    }

    handleSearch(searchedValue) {
        const searchedKeys = [];
        const retainedKeys = [];
        Object.keys(this._k2n).forEach(k => {
            const { label, pos } = this._k2n[k];
            if (this.isSearched(label, searchedValue)) {
                searchedKeys.push(k);
                const posArr = pos.split('-');
                posArr.forEach((n, i) => {
                    if (i > 0) {
                        const p = posArr.slice(0, i + 1).join('-');
                        const kk = this._p2n[p].key;
                        if (retainedKeys.indexOf(kk) === -1) {
                            retainedKeys.push(kk);
                        }
                    }
                });
            }
        });

        this.setState({
            searchedValue,
            expandedKeys: searchedKeys,
            autoExpandParent: true,
        });
        this.searchedKeys = searchedKeys;
        this.retainedKeys = retainedKeys;

        this.props.onSearch(searchedValue);
    }

    handleSearchClear(triggerType) {
        this.setState({
            searchedValue: '',
            expandedKeys: [],
        });
        this.props.onSearchClear(triggerType);
    }

    handleExpand(expandedKeys) {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
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
                this.tree.setFocusKey();
                e.preventDefault();
                break;
            default:
                break;
        }
    }

    handleChange() {
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

    isSearched(label, searchedValue) {
        let labelString = '';
        const loop = arg => {
            if (isValidElement(arg) && arg.props.children) {
                Children.forEach(arg.props.children, loop);
            } else if (typeof arg === 'string') {
                labelString += arg;
            }
        };
        loop(label);

        if (
            labelString.length >= searchedValue.length &&
            labelString.indexOf(searchedValue) > -1
        ) {
            return true;
        }

        return false;
    }

    searchNodes(children) {
        const loop = children => {
            const retainedNodes = [];
            Children.forEach(children, child => {
                if (this.searchedKeys.indexOf(child.key) > -1) {
                    retainedNodes.push(child);
                } else if (this.retainedKeys.indexOf(child.key) > -1) {
                    const retainedNode = child.props.children
                        ? cloneElement(child, {}, loop(child.props.children))
                        : child;
                    retainedNodes.push(retainedNode);
                } else {
                    const hideNode = cloneElement(child, {
                        style: { display: 'none' },
                    });
                    retainedNodes.push(hideNode);
                }
            });
            return retainedNodes;
        };

        return loop(children);
    }

    createNodesByData(data, searching) {
        const loop = (data, isParentMatched, prefix = '0') => {
            const retainedNodes = [];

            data.forEach((item, index) => {
                const { children, ...others } = item;
                const pos = `${prefix}-${index}`;
                const key = this._p2n[pos].key;
                const addNode = (isParentMatched, hide) => {
                    if (hide) {
                        others.style = { display: 'none' };
                    }
                    retainedNodes.push(
                        <TreeNode {...others} key={key}>
                            {children && children.length
                                ? loop(children, isParentMatched, pos)
                                : null}
                        </TreeNode>
                    );
                };

                if (searching) {
                    if (
                        this.searchedKeys.indexOf(key) > -1 ||
                        isParentMatched
                    ) {
                        addNode(true);
                    } else if (this.retainedKeys.indexOf(key) > -1) {
                        addNode(false);
                    } else {
                        addNode(false, true);
                    }
                } else {
                    addNode();
                }
            });

            return retainedNodes;
        };

        return loop(data, false);
    }
    /*eslint-disable max-statements*/
    renderPopupContent() {
        const prefix = this.props.prefix;
        const treeSelectPrefix = `${prefix}tree-select-`;

        if (!this.state.visible) {
            return <div className={`${treeSelectPrefix}dropdown`} />;
        }

        const {
            multiple,
            treeCheckable,
            treeCheckStrictly,
            treeCheckedStrategy,
            treeDefaultExpandAll,
            treeDefaultExpandedKeys,
            treeLoadData,
            treeProps: customTreeProps,
            showSearch,
            dataSource,
            children,
            readOnly,
            notFoundContent,
        } = this.props;
        const {
            value,
            searchedValue,
            expandedKeys,
            autoExpandParent,
        } = this.state;

        const treeProps = {
            multiple,
            ref: this.saveTreeRef,
            loadData: treeLoadData,
            defaultExpandAll: treeDefaultExpandAll,
            defaultExpandedKeys: treeDefaultExpandedKeys,
        };

        const keys = this.getKeysByValue(value);
        if (treeCheckable) {
            treeProps.checkable = treeCheckable;
            treeProps.checkStrictly = treeCheckStrictly;
            treeProps.checkedStrategy = treeCheckStrictly
                ? 'all'
                : treeCheckedStrategy;
            treeProps.checkedKeys = keys;
            if (!readOnly) {
                treeProps.onCheck = this.handleCheck;
            }
        } else {
            treeProps.selectedKeys = keys;
            if (!readOnly) {
                treeProps.onSelect = this.handleSelect;
            }
        }

        let notFound = false;
        let newChildren;
        if (showSearch && searchedValue) {
            treeProps.expandedKeys = expandedKeys;
            treeProps.autoExpandParent = autoExpandParent;
            treeProps.onExpand = this.handleExpand;
            treeProps.filterTreeNode = node => {
                return this.searchedKeys.indexOf(node.props.eventKey) > -1;
            };

            if (this.searchedKeys.length) {
                newChildren = dataSource
                    ? this.createNodesByData(dataSource, true)
                    : this.searchNodes(children);
            } else {
                notFound = true;
            }
        } else {
            // eslint-disable-next-line
            if (dataSource) {
                if (dataSource.length) {
                    newChildren = this.createNodesByData(dataSource);
                } else {
                    notFound = true;
                }
            } else {
                // eslint-disable-next-line
                if (Children.count(children)) {
                    newChildren = children;
                } else {
                    notFound = true;
                }
            }
        }

        return (
            <div className={`${treeSelectPrefix}dropdown`}>
                {notFound ? (
                    <div className={`${treeSelectPrefix}not-found`}>
                        {notFoundContent}
                    </div>
                ) : (
                    <Tree {...customTreeProps} {...treeProps}>
                        {newChildren}
                    </Tree>
                )}
            </div>
        );
    }

    renderPreview(data, others) {
        const { prefix, className, renderPreview } = this.props;

        const previewCls = classNames(className, `${prefix}form-preview`);
        let items = data;

        if (data && !Array.isArray(data)) {
            items = [data];
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
    /*eslint-enable*/
    render() {
        const {
            prefix,
            size,
            placeholder,
            disabled,
            hasArrow,
            hasBorder,
            hasClear,
            label,
            readOnly,
            autoWidth,
            popupStyle,
            popupClassName,
            showSearch,
            multiple,
            treeCheckable,
            treeCheckStrictly,
            className,
            popupContainer,
            popupProps,
            followTrigger,
            isPreview,
        } = this.props;
        const others = pickOthers(
            Object.keys(TreeSelect.propTypes),
            this.props
        );
        const { value, visible } = this.state;

        const valueForSelect =
            treeCheckable && !treeCheckStrictly
                ? this.getValueForSelect(value)
                : value;
        let data = this.getData(valueForSelect, true);
        if (!multiple && !treeCheckable) {
            data = data[0];
        }

        if (isPreview) {
            return this.renderPreview(data, others);
        }

        return (
            <Select
                prefix={prefix}
                className={className}
                size={size}
                hasBorder={hasBorder}
                hasArrow={hasArrow}
                hasClear={hasClear}
                placeholder={placeholder}
                disabled={disabled}
                autoWidth={autoWidth}
                label={label}
                readOnly={readOnly}
                ref={this.saveSelectRef}
                mode={treeCheckable || multiple ? 'multiple' : 'single'}
                value={data}
                onRemove={this.handleRemove}
                onChange={this.handleChange}
                visible={visible}
                onVisibleChange={this.handleVisibleChange}
                showSearch={showSearch}
                onSearch={this.handleSearch}
                onSearchClear={this.handleSearchClear}
                onKeyDown={this.handleKeyDown}
                popupContent={this.renderPopupContent()}
                popupContainer={popupContainer}
                popupStyle={popupStyle}
                popupClassName={popupClassName}
                popupProps={popupProps}
                followTrigger={followTrigger}
                {...others}
            />
        );
    }
}

TreeSelect.Node = TreeNode;
