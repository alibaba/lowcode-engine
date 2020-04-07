import React, { Component, Children } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Icon from '../../icon';
import Checkbox from '../../checkbox';
import Animate from '../../animate';
import { func, obj, KEYCODE } from '../../util';
import TreeNodeInput from './tree-node-input';

const { Expand } = Animate;
const { bindCtx } = func;
const { isPromise, pickOthers, pickAttrsWith } = obj;
const isRoot = pos => /^0-(\d)+$/.test(pos);

/**
 * Tree.Node
 */
export default class TreeNode extends Component {
    static propTypes = {
        _key: PropTypes.string,
        prefix: PropTypes.string,
        rtl: PropTypes.bool,
        className: PropTypes.string,
        /**
         * 树节点
         */
        children: PropTypes.node,
        /**
         * 节点文本内容
         */
        label: PropTypes.node,
        /**
         * 单独设置是否支持选中，覆盖 Tree 的 selectable
         */
        selectable: PropTypes.bool,
        /**
         * 单独设置是否出现复选框，覆盖 Tree 的 checkable
         */
        checkable: PropTypes.bool,
        /**
         * 单独设置是否支持编辑，覆盖 Tree 的 editable
         */
        editable: PropTypes.bool,
        /**
         * 单独设置是否支持拖拽，覆盖 Tree 的 draggable
         */
        draggable: PropTypes.bool,
        /**
         * 是否禁止节点响应
         */
        disabled: PropTypes.bool,
        /**
         * 是否禁止勾选节点复选框
         */
        checkboxDisabled: PropTypes.bool,
        /**
         * 是否是叶子节点，设置loadData时生效
         */
        isLeaf: PropTypes.bool,
        root: PropTypes.object,
        eventKey: PropTypes.string,
        pos: PropTypes.string,
        expanded: PropTypes.bool,
        selected: PropTypes.bool,
        checked: PropTypes.bool,
        indeterminate: PropTypes.bool,
        dragOver: PropTypes.bool,
        dragOverGapTop: PropTypes.bool,
        dragOverGapBottom: PropTypes.bool,
        parentNode: PropTypes.object,
        onKeyDown: PropTypes.func,
        size: PropTypes.number,
    };

    static defaultProps = {
        label: '---',
        rtl: false,
        disabled: false,
        checkboxDisabled: false,
        isLeaf: false,
        size: 1,
    };

    constructor(props) {
        super(props);

        this.state = {
            editing: false,
            loading: false,
            label: props.label,
        };

        bindCtx(this, [
            'handleExpand',
            'handleSelect',
            'handleCheck',
            'handleEditStart',
            'handleEditFinish',
            'handleRightClick',
            'handleDragStart',
            'handleDragEnter',
            'handleDragOver',
            'handleDragLeave',
            'handleDragEnd',
            'handleDrop',
            'handleInputKeyDown',
            'handleKeyDown',
        ]);
    }

    componentDidMount() {
        this.itemNode = findDOMNode(this.refs.node);
        this.setFocus();
    }

    componentWillReceiveProps(nextProps) {
        if ('label' in nextProps) {
            this.setState({
                label: nextProps.label,
            });
        }
    }

    componentDidUpdate() {
        this.setFocus();
    }

    getParentNode() {
        return this.props.root.getParentNode(this.props.pos);
    }

    focusable() {
        const { root, disabled } = this.props;
        const { focusable } = root.props;
        return focusable && !disabled;
    }

    getFocused() {
        const { _key, root } = this.props;
        const { focusedKey } = root.state;
        return focusedKey === _key;
    }

    setFocus() {
        const focused = this.getFocused();
        if (focused && this.focusable()) {
            this.itemNode.focus({ preventScroll: true });
        }
    }

    handleExpand(e) {
        const { root, expanded, eventKey } = this.props;

        if (root.props.isNodeBlock) {
            e.stopPropagation();
        }

        const { loading } = this.state;
        if (loading) {
            return;
        }

        const returnValue = root.handleExpand(!expanded, eventKey, this);
        if (isPromise(returnValue)) {
            this.setLoading(true);
            return returnValue.then(
                () => {
                    this.setLoading(false);
                },
                () => {
                    this.setLoading(false);
                }
            );
        }
    }

    setLoading(loading) {
        this.setState({ loading });
    }

    handleSelect(e) {
        e.preventDefault();

        const { root, selected, eventKey } = this.props;
        root.handleSelect(!selected, eventKey, this, e);
    }

    handleCheck() {
        const { root, checked, eventKey } = this.props;
        root.handleCheck(!checked, eventKey, this);
    }

    handleEditStart(e) {
        e.preventDefault();

        this.setState({
            editing: true,
        });
    }

    handleEditFinish(e) {
        const label = e.target.value;

        this.setState({
            editing: false,
            label,
        });

        const { root, eventKey } = this.props;
        root.props.onEditFinish(eventKey, label, this);
    }

    handleRightClick(e) {
        this.props.root.props.onRightClick({
            event: e,
            node: this,
        });
    }

    handleDragStart(e) {
        e.stopPropagation();

        this.props.root.handleDragStart(e, this);
    }

    handleDragEnter(e) {
        e.preventDefault();
        e.stopPropagation();

        this.props.root.handleDragEnter(e, this);
    }

    handleDragOver(e) {
        if (this.props.root.canDrop(this)) {
            e.preventDefault();
            e.stopPropagation();

            this.props.root.handleDragOver(e, this);
        }
    }

    handleDragLeave(e) {
        e.stopPropagation();

        this.props.root.handleDragLeave(e, this);
    }

    handleDragEnd(e) {
        e.stopPropagation();

        this.props.root.handleDragEnd(e, this);
    }

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();

        this.props.root.handleDrop(e, this);
    }

    handleInputKeyDown(e) {
        if (e.keyCode === KEYCODE.ENTER) {
            this.handleEditFinish(e);
        }
    }

    handleKeyDown(e) {
        const { _key, root, disabled } = this.props;
        if (disabled) {
            return;
        }

        if (this.focusable()) {
            root.handleItemKeyDown(_key, this, e);
        }

        this.props.onKeyDown && this.props.onKeyDown(e);
    }

    addCallbacks(props) {
        const { disabled, root } = this.props;
        if (!disabled) {
            const selectable =
                typeof this.props.selectable !== 'undefined'
                    ? this.props.selectable
                    : root.props.selectable;
            if (selectable) {
                props.onClick = this.handleSelect;
            }
            const editable =
                typeof this.props.editable !== 'undefined'
                    ? this.props.editable
                    : root.props.editable;
            if (editable) {
                props.onDoubleClick = this.handleEditStart;
            }
            const draggable =
                typeof this.props.draggable !== 'undefined'
                    ? this.props.draggable
                    : root.props.draggable;
            if (draggable) {
                props.draggable = true;
                props.onDragStart = this.handleDragStart;
                props.onDragEnd = this.handleDragEnd;
            }
            props.onContextMenu = this.handleRightClick;
        }
    }

    renderSwitcher() {
        const { prefix, disabled, expanded, root } = this.props;
        const { loadData } = root.props;
        const { loading } = this.state;
        const showLine = this.showLine;

        const lineState = showLine ? 'line' : 'noline';
        const className = cx({
            [`${prefix}tree-switcher`]: true,
            [`${prefix}${lineState}`]: !loading,
            [`${prefix}close`]: !loading && !showLine && !expanded,
            [`${prefix}disabled`]: disabled,
            [`${prefix}loading`]: loading,
            [`${prefix}loading-${lineState}`]: loading,
        });
        const iconType =
            loadData && loading
                ? 'loading'
                : showLine
                ? expanded
                    ? 'minus'
                    : 'add'
                : 'arrow-down';

        return (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <span
                className={className}
                onClick={disabled ? null : this.handleExpand}
            >
                {this.renderRightAngle()}
                <Icon
                    className={`${prefix}tree-switcher-icon`}
                    type={iconType}
                />
            </span>
        );
    }

    renderNoopSwitcher() {
        const { prefix, pos } = this.props;
        const showLine = this.showLine;

        const lineState = showLine ? 'line' : 'noline';
        const className = cx({
            [`${prefix}tree-switcher`]: true,
            [`${prefix}noop-${lineState}`]: true,
            [`${prefix}noop-line-noroot`]: showLine && !isRoot(pos),
        });

        return <span className={className}>{this.renderRightAngle()}</span>;
    }

    renderRightAngle() {
        const { prefix, pos } = this.props;
        return this.showLine && !isRoot(pos) ? (
            <span className={`${prefix}tree-right-angle`} />
        ) : null;
    }

    renderCheckbox() {
        const {
            checked,
            indeterminate,
            disabled,
            checkboxDisabled,
        } = this.props;
        const { label } = this.state;

        return (
            <Checkbox
                aria-label={typeof label === 'string' ? label : null}
                checked={checked}
                tabIndex={-1}
                indeterminate={indeterminate}
                disabled={disabled || checkboxDisabled}
                onChange={this.handleCheck}
            />
        );
    }

    renderLabel() {
        const { prefix, root, disabled } = this.props;
        const { isNodeBlock } = root.props;
        const { label } = this.state;
        const selectable =
            typeof this.props.selectable !== 'undefined'
                ? this.props.selectable
                : root.props.selectable;
        const labelProps = {
            className: cx({
                [`${prefix}tree-node-label`]: true,
                [`${prefix}tree-node-label-selectable`]:
                    selectable && !disabled,
            }),
        };

        if (!isNodeBlock) {
            this.addCallbacks(labelProps);
        }

        return (
            <div
                className={`${prefix}tree-node-label-wrapper`}
                ref="labelWrapper"
            >
                <div {...labelProps}>{label}</div>
            </div>
        );
    }

    renderInput() {
        const { prefix } = this.props;
        const { label } = this.state;
        return (
            <div
                className={`${prefix}tree-node-label-wrapper`}
                ref="labelWrapper"
            >
                <TreeNodeInput
                    prefix={prefix}
                    defaultValue={label}
                    onBlur={this.handleEditFinish}
                    onKeyDown={this.handleInputKeyDown}
                />
            </div>
        );
    }

    renderChildTree(hasChildTree) {
        const { prefix, children, expanded, root } = this.props;
        const { animation, renderChildNodes } = root.props;

        if (!expanded || !hasChildTree) {
            return null;
        }

        let childTree;

        if (renderChildNodes) {
            childTree = renderChildNodes(children);
        } else {
            childTree = (
                <ul role="group" className={`${prefix}tree-child-tree`}>
                    {children}
                </ul>
            );
        }

        if (animation) {
            childTree = <Expand animationAppear={false}>{childTree}</Expand>;
        }

        return childTree;
    }

    render() {
        const {
            prefix,
            rtl,
            className,
            children,
            isLeaf,
            root,
            pos,
            selected,
            checked,
            disabled,
            expanded,
            dragOver,
            dragOverGapTop,
            dragOverGapBottom,
            _key,
            size,
        } = this.props;
        const {
            loadData,
            isNodeBlock,
            showLine,
            draggable: rootDraggable,
            filterTreeNode,
        } = root.props;
        const { label } = this.state;

        this.showLine = !isNodeBlock && showLine;
        const indexArr = pos.split('-');

        const ARIA_PREFIX = 'aria-';
        const ariaProps = pickAttrsWith(this.props, ARIA_PREFIX);
        const others = pickOthers(Object.keys(TreeNode.propTypes), this.props);

        // remove aria keys
        Object.keys(others).forEach(key => {
            if (key.match(ARIA_PREFIX)) {
                delete others[key];
            }
        });

        if (rootDraggable) {
            others.onDragEnter = this.handleDragEnter;
            others.onDragOver = this.handleDragOver;
            others.onDragLeave = this.handleDragLeave;
            others.onDrop = this.handleDrop;
        }
        const newClassName = cx({
            [`${prefix}tree-node`]: true,
            [`${prefix}filtered`]:
                !!filterTreeNode && !!root.filterTreeNode(this),
            [className]: !!className,
        });

        const innerClassName = cx({
            [`${prefix}tree-node-inner`]: true,
            [`${prefix}selected`]: selected,
            [`${prefix}disabled`]: disabled,
            [`${prefix}drag-over`]: dragOver,
            [`${prefix}drag-over-gap-top`]: dragOverGapTop,
            [`${prefix}drag-over-gap-bottom`]: dragOverGapBottom,
        });

        const defaultPaddingLeft =
            typeof isNodeBlock === 'object'
                ? parseInt(isNodeBlock.defaultPaddingLeft || 0)
                : 0;
        const indent =
            typeof isNodeBlock === 'object'
                ? parseInt(isNodeBlock.indent || 24)
                : 24;
        const level = indexArr.length - 2;
        const paddingLeftProp = rtl ? 'paddingRight' : 'paddingLeft';

        const innerStyle = isNodeBlock
            ? { [paddingLeftProp]: `${indent * level + defaultPaddingLeft}px` }
            : null;

        const innerProps = {
            className: innerClassName,
            style: innerStyle,
            onKeyDown: this.handleKeyDown,
            ...ariaProps,
        };
        if (isNodeBlock) {
            this.addCallbacks(innerProps);
        }

        const hasChildTree = children && Children.count(children);
        const canExpand = hasChildTree || (loadData && !isLeaf);
        const checkable =
            typeof this.props.checkable !== 'undefined'
                ? this.props.checkable
                : root.props.checkable;
        const { editing } = this.state;

        innerProps.tabIndex = root.tabbableKey === _key ? '0' : '-1';

        if (rtl) {
            others.dir = 'rtl';
        }

        return (
            <li role="presentation" className={newClassName} {...others}>
                <div
                    ref="node"
                    role="treeitem"
                    aria-selected={selected}
                    aria-disabled={disabled}
                    aria-checked={checked}
                    aria-expanded={expanded && !!hasChildTree}
                    aria-label={typeof label === 'string' ? label : null}
                    aria-level={level + 1}
                    aria-posinset={Number(indexArr[indexArr.length - 1]) + 1}
                    aria-setsize={size}
                    {...innerProps}
                >
                    {canExpand
                        ? this.renderSwitcher()
                        : this.renderNoopSwitcher()}
                    {checkable ? this.renderCheckbox() : null}
                    {editing ? this.renderInput() : this.renderLabel()}
                </div>
                {this.renderChildTree(hasChildTree)}
            </li>
        );
    }
}
