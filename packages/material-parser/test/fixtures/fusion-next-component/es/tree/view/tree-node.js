import _extends from 'babel-runtime/helpers/extends';
import _typeof from 'babel-runtime/helpers/typeof';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component, Children } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Icon from '../../icon';
import Checkbox from '../../checkbox';
import Animate from '../../animate';
import { func, obj, KEYCODE } from '../../util';
import TreeNodeInput from './tree-node-input';

var Expand = Animate.Expand;
var bindCtx = func.bindCtx;
var isPromise = obj.isPromise,
    pickOthers = obj.pickOthers,
    pickAttrsWith = obj.pickAttrsWith;

var isRoot = function isRoot(pos) {
    return (/^0-(\d)+$/.test(pos)
    );
};

/**
 * Tree.Node
 */
var TreeNode = (_temp = _class = function (_Component) {
    _inherits(TreeNode, _Component);

    function TreeNode(props) {
        _classCallCheck(this, TreeNode);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        _this.state = {
            editing: false,
            loading: false,
            label: props.label
        };

        bindCtx(_this, ['handleExpand', 'handleSelect', 'handleCheck', 'handleEditStart', 'handleEditFinish', 'handleRightClick', 'handleDragStart', 'handleDragEnter', 'handleDragOver', 'handleDragLeave', 'handleDragEnd', 'handleDrop', 'handleInputKeyDown', 'handleKeyDown']);
        return _this;
    }

    TreeNode.prototype.componentDidMount = function componentDidMount() {
        this.itemNode = findDOMNode(this.refs.node);
        this.setFocus();
    };

    TreeNode.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        if ('label' in nextProps) {
            this.setState({
                label: nextProps.label
            });
        }
    };

    TreeNode.prototype.componentDidUpdate = function componentDidUpdate() {
        this.setFocus();
    };

    TreeNode.prototype.getParentNode = function getParentNode() {
        return this.props.root.getParentNode(this.props.pos);
    };

    TreeNode.prototype.focusable = function focusable() {
        var _props = this.props,
            root = _props.root,
            disabled = _props.disabled;
        var focusable = root.props.focusable;

        return focusable && !disabled;
    };

    TreeNode.prototype.getFocused = function getFocused() {
        var _props2 = this.props,
            _key = _props2._key,
            root = _props2.root;
        var focusedKey = root.state.focusedKey;

        return focusedKey === _key;
    };

    TreeNode.prototype.setFocus = function setFocus() {
        var focused = this.getFocused();
        if (focused && this.focusable()) {
            this.itemNode.focus({ preventScroll: true });
        }
    };

    TreeNode.prototype.handleExpand = function handleExpand(e) {
        var _this2 = this;

        var _props3 = this.props,
            root = _props3.root,
            expanded = _props3.expanded,
            eventKey = _props3.eventKey;


        if (root.props.isNodeBlock) {
            e.stopPropagation();
        }

        var loading = this.state.loading;

        if (loading) {
            return;
        }

        var returnValue = root.handleExpand(!expanded, eventKey, this);
        if (isPromise(returnValue)) {
            this.setLoading(true);
            return returnValue.then(function () {
                _this2.setLoading(false);
            }, function () {
                _this2.setLoading(false);
            });
        }
    };

    TreeNode.prototype.setLoading = function setLoading(loading) {
        this.setState({ loading: loading });
    };

    TreeNode.prototype.handleSelect = function handleSelect(e) {
        e.preventDefault();

        var _props4 = this.props,
            root = _props4.root,
            selected = _props4.selected,
            eventKey = _props4.eventKey;

        root.handleSelect(!selected, eventKey, this, e);
    };

    TreeNode.prototype.handleCheck = function handleCheck() {
        var _props5 = this.props,
            root = _props5.root,
            checked = _props5.checked,
            eventKey = _props5.eventKey;

        root.handleCheck(!checked, eventKey, this);
    };

    TreeNode.prototype.handleEditStart = function handleEditStart(e) {
        e.preventDefault();

        this.setState({
            editing: true
        });
    };

    TreeNode.prototype.handleEditFinish = function handleEditFinish(e) {
        var label = e.target.value;

        this.setState({
            editing: false,
            label: label
        });

        var _props6 = this.props,
            root = _props6.root,
            eventKey = _props6.eventKey;

        root.props.onEditFinish(eventKey, label, this);
    };

    TreeNode.prototype.handleRightClick = function handleRightClick(e) {
        this.props.root.props.onRightClick({
            event: e,
            node: this
        });
    };

    TreeNode.prototype.handleDragStart = function handleDragStart(e) {
        e.stopPropagation();

        this.props.root.handleDragStart(e, this);
    };

    TreeNode.prototype.handleDragEnter = function handleDragEnter(e) {
        e.preventDefault();
        e.stopPropagation();

        this.props.root.handleDragEnter(e, this);
    };

    TreeNode.prototype.handleDragOver = function handleDragOver(e) {
        if (this.props.root.canDrop(this)) {
            e.preventDefault();
            e.stopPropagation();

            this.props.root.handleDragOver(e, this);
        }
    };

    TreeNode.prototype.handleDragLeave = function handleDragLeave(e) {
        e.stopPropagation();

        this.props.root.handleDragLeave(e, this);
    };

    TreeNode.prototype.handleDragEnd = function handleDragEnd(e) {
        e.stopPropagation();

        this.props.root.handleDragEnd(e, this);
    };

    TreeNode.prototype.handleDrop = function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();

        this.props.root.handleDrop(e, this);
    };

    TreeNode.prototype.handleInputKeyDown = function handleInputKeyDown(e) {
        if (e.keyCode === KEYCODE.ENTER) {
            this.handleEditFinish(e);
        }
    };

    TreeNode.prototype.handleKeyDown = function handleKeyDown(e) {
        var _props7 = this.props,
            _key = _props7._key,
            root = _props7.root,
            disabled = _props7.disabled;

        if (disabled) {
            return;
        }

        if (this.focusable()) {
            root.handleItemKeyDown(_key, this, e);
        }

        this.props.onKeyDown && this.props.onKeyDown(e);
    };

    TreeNode.prototype.addCallbacks = function addCallbacks(props) {
        var _props8 = this.props,
            disabled = _props8.disabled,
            root = _props8.root;

        if (!disabled) {
            var selectable = typeof this.props.selectable !== 'undefined' ? this.props.selectable : root.props.selectable;
            if (selectable) {
                props.onClick = this.handleSelect;
            }
            var editable = typeof this.props.editable !== 'undefined' ? this.props.editable : root.props.editable;
            if (editable) {
                props.onDoubleClick = this.handleEditStart;
            }
            var draggable = typeof this.props.draggable !== 'undefined' ? this.props.draggable : root.props.draggable;
            if (draggable) {
                props.draggable = true;
                props.onDragStart = this.handleDragStart;
                props.onDragEnd = this.handleDragEnd;
            }
            props.onContextMenu = this.handleRightClick;
        }
    };

    TreeNode.prototype.renderSwitcher = function renderSwitcher() {
        var _cx;

        var _props9 = this.props,
            prefix = _props9.prefix,
            disabled = _props9.disabled,
            expanded = _props9.expanded,
            root = _props9.root;
        var loadData = root.props.loadData;
        var loading = this.state.loading;

        var showLine = this.showLine;

        var lineState = showLine ? 'line' : 'noline';
        var className = cx((_cx = {}, _cx[prefix + 'tree-switcher'] = true, _cx['' + prefix + lineState] = !loading, _cx[prefix + 'close'] = !loading && !showLine && !expanded, _cx[prefix + 'disabled'] = disabled, _cx[prefix + 'loading'] = loading, _cx[prefix + 'loading-' + lineState] = loading, _cx));
        var iconType = loadData && loading ? 'loading' : showLine ? expanded ? 'minus' : 'add' : 'arrow-down';

        return (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            React.createElement(
                'span',
                {
                    className: className,
                    onClick: disabled ? null : this.handleExpand
                },
                this.renderRightAngle(),
                React.createElement(Icon, {
                    className: prefix + 'tree-switcher-icon',
                    type: iconType
                })
            )
        );
    };

    TreeNode.prototype.renderNoopSwitcher = function renderNoopSwitcher() {
        var _cx2;

        var _props10 = this.props,
            prefix = _props10.prefix,
            pos = _props10.pos;

        var showLine = this.showLine;

        var lineState = showLine ? 'line' : 'noline';
        var className = cx((_cx2 = {}, _cx2[prefix + 'tree-switcher'] = true, _cx2[prefix + 'noop-' + lineState] = true, _cx2[prefix + 'noop-line-noroot'] = showLine && !isRoot(pos), _cx2));

        return React.createElement(
            'span',
            { className: className },
            this.renderRightAngle()
        );
    };

    TreeNode.prototype.renderRightAngle = function renderRightAngle() {
        var _props11 = this.props,
            prefix = _props11.prefix,
            pos = _props11.pos;

        return this.showLine && !isRoot(pos) ? React.createElement('span', { className: prefix + 'tree-right-angle' }) : null;
    };

    TreeNode.prototype.renderCheckbox = function renderCheckbox() {
        var _props12 = this.props,
            checked = _props12.checked,
            indeterminate = _props12.indeterminate,
            disabled = _props12.disabled,
            checkboxDisabled = _props12.checkboxDisabled;
        var label = this.state.label;


        return React.createElement(Checkbox, {
            'aria-label': typeof label === 'string' ? label : null,
            checked: checked,
            tabIndex: -1,
            indeterminate: indeterminate,
            disabled: disabled || checkboxDisabled,
            onChange: this.handleCheck
        });
    };

    TreeNode.prototype.renderLabel = function renderLabel() {
        var _cx3;

        var _props13 = this.props,
            prefix = _props13.prefix,
            root = _props13.root,
            disabled = _props13.disabled;
        var isNodeBlock = root.props.isNodeBlock;
        var label = this.state.label;

        var selectable = typeof this.props.selectable !== 'undefined' ? this.props.selectable : root.props.selectable;
        var labelProps = {
            className: cx((_cx3 = {}, _cx3[prefix + 'tree-node-label'] = true, _cx3[prefix + 'tree-node-label-selectable'] = selectable && !disabled, _cx3))
        };

        if (!isNodeBlock) {
            this.addCallbacks(labelProps);
        }

        return React.createElement(
            'div',
            {
                className: prefix + 'tree-node-label-wrapper',
                ref: 'labelWrapper'
            },
            React.createElement(
                'div',
                labelProps,
                label
            )
        );
    };

    TreeNode.prototype.renderInput = function renderInput() {
        var prefix = this.props.prefix;
        var label = this.state.label;

        return React.createElement(
            'div',
            {
                className: prefix + 'tree-node-label-wrapper',
                ref: 'labelWrapper'
            },
            React.createElement(TreeNodeInput, {
                prefix: prefix,
                defaultValue: label,
                onBlur: this.handleEditFinish,
                onKeyDown: this.handleInputKeyDown
            })
        );
    };

    TreeNode.prototype.renderChildTree = function renderChildTree(hasChildTree) {
        var _props14 = this.props,
            prefix = _props14.prefix,
            children = _props14.children,
            expanded = _props14.expanded,
            root = _props14.root;
        var _root$props = root.props,
            animation = _root$props.animation,
            renderChildNodes = _root$props.renderChildNodes;


        if (!expanded || !hasChildTree) {
            return null;
        }

        var childTree = void 0;

        if (renderChildNodes) {
            childTree = renderChildNodes(children);
        } else {
            childTree = React.createElement(
                'ul',
                { role: 'group', className: prefix + 'tree-child-tree' },
                children
            );
        }

        if (animation) {
            childTree = React.createElement(
                Expand,
                { animationAppear: false },
                childTree
            );
        }

        return childTree;
    };

    TreeNode.prototype.render = function render() {
        var _cx4, _cx5, _ref;

        var _props15 = this.props,
            prefix = _props15.prefix,
            rtl = _props15.rtl,
            className = _props15.className,
            children = _props15.children,
            isLeaf = _props15.isLeaf,
            root = _props15.root,
            pos = _props15.pos,
            selected = _props15.selected,
            checked = _props15.checked,
            disabled = _props15.disabled,
            expanded = _props15.expanded,
            dragOver = _props15.dragOver,
            dragOverGapTop = _props15.dragOverGapTop,
            dragOverGapBottom = _props15.dragOverGapBottom,
            _key = _props15._key,
            size = _props15.size;
        var _root$props2 = root.props,
            loadData = _root$props2.loadData,
            isNodeBlock = _root$props2.isNodeBlock,
            showLine = _root$props2.showLine,
            rootDraggable = _root$props2.draggable,
            filterTreeNode = _root$props2.filterTreeNode;
        var label = this.state.label;


        this.showLine = !isNodeBlock && showLine;
        var indexArr = pos.split('-');

        var ARIA_PREFIX = 'aria-';
        var ariaProps = pickAttrsWith(this.props, ARIA_PREFIX);
        var others = pickOthers(Object.keys(TreeNode.propTypes), this.props);

        // remove aria keys
        Object.keys(others).forEach(function (key) {
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
        var newClassName = cx((_cx4 = {}, _cx4[prefix + 'tree-node'] = true, _cx4[prefix + 'filtered'] = !!filterTreeNode && !!root.filterTreeNode(this), _cx4[className] = !!className, _cx4));

        var innerClassName = cx((_cx5 = {}, _cx5[prefix + 'tree-node-inner'] = true, _cx5[prefix + 'selected'] = selected, _cx5[prefix + 'disabled'] = disabled, _cx5[prefix + 'drag-over'] = dragOver, _cx5[prefix + 'drag-over-gap-top'] = dragOverGapTop, _cx5[prefix + 'drag-over-gap-bottom'] = dragOverGapBottom, _cx5));

        var defaultPaddingLeft = (typeof isNodeBlock === 'undefined' ? 'undefined' : _typeof(isNodeBlock)) === 'object' ? parseInt(isNodeBlock.defaultPaddingLeft || 0) : 0;
        var indent = (typeof isNodeBlock === 'undefined' ? 'undefined' : _typeof(isNodeBlock)) === 'object' ? parseInt(isNodeBlock.indent || 24) : 24;
        var level = indexArr.length - 2;
        var paddingLeftProp = rtl ? 'paddingRight' : 'paddingLeft';

        var innerStyle = isNodeBlock ? (_ref = {}, _ref[paddingLeftProp] = indent * level + defaultPaddingLeft + 'px', _ref) : null;

        var innerProps = _extends({
            className: innerClassName,
            style: innerStyle,
            onKeyDown: this.handleKeyDown
        }, ariaProps);
        if (isNodeBlock) {
            this.addCallbacks(innerProps);
        }

        var hasChildTree = children && Children.count(children);
        var canExpand = hasChildTree || loadData && !isLeaf;
        var checkable = typeof this.props.checkable !== 'undefined' ? this.props.checkable : root.props.checkable;
        var editing = this.state.editing;


        innerProps.tabIndex = root.tabbableKey === _key ? '0' : '-1';

        if (rtl) {
            others.dir = 'rtl';
        }

        return React.createElement(
            'li',
            _extends({ role: 'presentation', className: newClassName }, others),
            React.createElement(
                'div',
                _extends({
                    ref: 'node',
                    role: 'treeitem',
                    'aria-selected': selected,
                    'aria-disabled': disabled,
                    'aria-checked': checked,
                    'aria-expanded': expanded && !!hasChildTree,
                    'aria-label': typeof label === 'string' ? label : null,
                    'aria-level': level + 1,
                    'aria-posinset': Number(indexArr[indexArr.length - 1]) + 1,
                    'aria-setsize': size
                }, innerProps),
                canExpand ? this.renderSwitcher() : this.renderNoopSwitcher(),
                checkable ? this.renderCheckbox() : null,
                editing ? this.renderInput() : this.renderLabel()
            ),
            this.renderChildTree(hasChildTree)
        );
    };

    return TreeNode;
}(Component), _class.propTypes = {
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
    size: PropTypes.number
}, _class.defaultProps = {
    label: '---',
    rtl: false,
    disabled: false,
    checkboxDisabled: false,
    isLeaf: false,
    size: 1
}, _temp);
TreeNode.displayName = 'TreeNode';
export { TreeNode as default };