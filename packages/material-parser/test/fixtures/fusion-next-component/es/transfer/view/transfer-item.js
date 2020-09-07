import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Menu from '../../menu';
import { func, obj, dom } from '../../util';

var Item = Menu.Item,
    CheckboxItem = Menu.CheckboxItem;
var bindCtx = func.bindCtx;
var pickOthers = obj.pickOthers;
var getOffset = dom.getOffset;
var TransferItem = (_temp = _class = function (_Component) {
    _inherits(TransferItem, _Component);

    function TransferItem(props) {
        _classCallCheck(this, TransferItem);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        _this.state = {
            highlight: false
        };

        bindCtx(_this, ['getItemDOM', 'handleClick', 'handleDragStart', 'handleDragOver', 'handleDragEnd', 'handleDrop']);
        return _this;
    }

    TransferItem.prototype.componentDidMount = function componentDidMount() {
        var _this2 = this;

        if (this.props.needHighlight) {
            this.addHighlightTimer = setTimeout(function () {
                _this2.setState({
                    highlight: true
                });
            }, 1);
            this.removeHighlightTimer = setTimeout(function () {
                _this2.setState({
                    highlight: false
                });
            }, 201);
        }
    };

    TransferItem.prototype.componentWillUnmount = function componentWillUnmount() {
        clearTimeout(this.addHighlightTimer);
        clearTimeout(this.removeHighlightTimer);
    };

    TransferItem.prototype.getItemDOM = function getItemDOM(ref) {
        this.item = ref;
    };

    TransferItem.prototype.handleClick = function handleClick() {
        var _props = this.props,
            onClick = _props.onClick,
            panelPosition = _props.panelPosition,
            item = _props.item;

        onClick(panelPosition === 'left' ? 'right' : 'left', item.value);
    };

    TransferItem.prototype.handleDragStart = function handleDragStart(ev) {
        ev && ev.dataTransfer && typeof ev.dataTransfer.setData === 'function' && ev.dataTransfer.setData('text/plain', ev.target.id);
        var _props2 = this.props,
            onDragStart = _props2.onDragStart,
            panelPosition = _props2.panelPosition,
            item = _props2.item;

        onDragStart(panelPosition, item.value);
    };

    TransferItem.prototype.getDragGap = function getDragGap(e) {
        var referenceTop = getOffset(e.currentTarget).top;
        var referenceHeight = e.currentTarget.offsetHeight;
        return e.pageY <= referenceTop + referenceHeight / 2 ? 'before' : 'after';
    };

    TransferItem.prototype.handleDragOver = function handleDragOver(e) {
        var _props3 = this.props,
            panelPosition = _props3.panelPosition,
            dragPosition = _props3.dragPosition,
            onDragOver = _props3.onDragOver,
            item = _props3.item;

        if (panelPosition === dragPosition) {
            e.preventDefault();

            var dragGap = this.getDragGap(e);
            if (this.dragGap !== dragGap) {
                this.dragGap = dragGap;
                onDragOver(item.value);
            }
        }
    };

    TransferItem.prototype.handleDragEnd = function handleDragEnd() {
        var onDragEnd = this.props.onDragEnd;

        onDragEnd();
    };

    TransferItem.prototype.handleDrop = function handleDrop(e) {
        e.preventDefault();

        var _props4 = this.props,
            onDrop = _props4.onDrop,
            item = _props4.item,
            panelPosition = _props4.panelPosition,
            dragValue = _props4.dragValue;

        onDrop(panelPosition, dragValue, item.value, this.dragGap);
    };

    TransferItem.prototype.render = function render() {
        var _cx;

        var _props5 = this.props,
            prefix = _props5.prefix,
            mode = _props5.mode,
            checked = _props5.checked,
            disabled = _props5.disabled,
            item = _props5.item,
            onCheck = _props5.onCheck,
            itemRender = _props5.itemRender,
            draggable = _props5.draggable,
            dragOverValue = _props5.dragOverValue,
            panelPosition = _props5.panelPosition,
            dragPosition = _props5.dragPosition;

        var others = pickOthers(Object.keys(TransferItem.propTypes), this.props);
        var highlight = this.state.highlight;

        var isSimple = mode === 'simple';

        var classNames = cx((_cx = {}, _cx[prefix + 'transfer-panel-item'] = true, _cx[prefix + 'insert-' + this.dragGap] = dragOverValue === item.value && panelPosition === dragPosition, _cx[prefix + 'focused'] = highlight, _cx[prefix + 'simple'] = isSimple, _cx));

        var itemProps = _extends({
            ref: this.getItemDOM,
            className: classNames,
            children: itemRender(item),
            disabled: disabled,
            draggable: draggable && !disabled,
            onDragStart: this.handleDragStart,
            onDragOver: this.handleDragOver,
            onDragEnd: this.handleDragEnd,
            onDrop: this.handleDrop
        }, others);
        if (isSimple) {
            if (!itemProps.disabled) {
                itemProps.onClick = this.handleClick;
            }

            return React.createElement(Item, itemProps);
        }

        return React.createElement(CheckboxItem, _extends({
            checked: checked,
            onChange: onCheck.bind(this, item.value)
        }, itemProps));
    };

    return TransferItem;
}(Component), _class.menuChildType = CheckboxItem.menuChildType, _class.propTypes = {
    prefix: PropTypes.string,
    mode: PropTypes.oneOf(['normal', 'simple']),
    value: PropTypes.array,
    disabled: PropTypes.bool,
    item: PropTypes.object,
    onCheck: PropTypes.func,
    onClick: PropTypes.func,
    needHighlight: PropTypes.bool,
    itemRender: PropTypes.func,
    draggable: PropTypes.bool,
    onDragStart: PropTypes.func,
    onDragOver: PropTypes.func,
    onDragEnd: PropTypes.func,
    onDrop: PropTypes.func,
    dragPosition: PropTypes.oneOf(['left', 'right']),
    dragValue: PropTypes.string,
    dragOverValue: PropTypes.string,
    panelPosition: PropTypes.oneOf(['left', 'right'])
}, _temp);
TransferItem.displayName = 'TransferItem';
export { TransferItem as default };