import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Menu from '../../menu';
import { func, obj, dom } from '../../util';

const { Item, CheckboxItem } = Menu;
const { bindCtx } = func;
const { pickOthers } = obj;
const { getOffset } = dom;

export default class TransferItem extends Component {
    static menuChildType = CheckboxItem.menuChildType;

    static propTypes = {
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
        panelPosition: PropTypes.oneOf(['left', 'right']),
    };

    constructor(props) {
        super(props);

        this.state = {
            highlight: false,
        };

        bindCtx(this, [
            'getItemDOM',
            'handleClick',
            'handleDragStart',
            'handleDragOver',
            'handleDragEnd',
            'handleDrop',
        ]);
    }

    componentDidMount() {
        if (this.props.needHighlight) {
            this.addHighlightTimer = setTimeout(() => {
                this.setState({
                    highlight: true,
                });
            }, 1);
            this.removeHighlightTimer = setTimeout(() => {
                this.setState({
                    highlight: false,
                });
            }, 201);
        }
    }

    componentWillUnmount() {
        clearTimeout(this.addHighlightTimer);
        clearTimeout(this.removeHighlightTimer);
    }

    getItemDOM(ref) {
        this.item = ref;
    }

    handleClick() {
        const { onClick, panelPosition, item } = this.props;
        onClick(panelPosition === 'left' ? 'right' : 'left', item.value);
    }

    handleDragStart(ev) {
        ev &&
            ev.dataTransfer &&
            typeof ev.dataTransfer.setData === 'function' &&
            ev.dataTransfer.setData('text/plain', ev.target.id);
        const { onDragStart, panelPosition, item } = this.props;
        onDragStart(panelPosition, item.value);
    }

    getDragGap(e) {
        const referenceTop = getOffset(e.currentTarget).top;
        const referenceHeight = e.currentTarget.offsetHeight;
        return e.pageY <= referenceTop + referenceHeight / 2
            ? 'before'
            : 'after';
    }

    handleDragOver(e) {
        const { panelPosition, dragPosition, onDragOver, item } = this.props;
        if (panelPosition === dragPosition) {
            e.preventDefault();

            const dragGap = this.getDragGap(e);
            if (this.dragGap !== dragGap) {
                this.dragGap = dragGap;
                onDragOver(item.value);
            }
        }
    }

    handleDragEnd() {
        const { onDragEnd } = this.props;
        onDragEnd();
    }

    handleDrop(e) {
        e.preventDefault();

        const { onDrop, item, panelPosition, dragValue } = this.props;
        onDrop(panelPosition, dragValue, item.value, this.dragGap);
    }

    render() {
        const {
            prefix,
            mode,
            checked,
            disabled,
            item,
            onCheck,
            itemRender,
            draggable,
            dragOverValue,
            panelPosition,
            dragPosition,
        } = this.props;
        const others = pickOthers(
            Object.keys(TransferItem.propTypes),
            this.props
        );
        const { highlight } = this.state;
        const isSimple = mode === 'simple';

        const classNames = cx({
            [`${prefix}transfer-panel-item`]: true,
            [`${prefix}insert-${this.dragGap}`]:
                dragOverValue === item.value && panelPosition === dragPosition,
            [`${prefix}focused`]: highlight,
            [`${prefix}simple`]: isSimple,
        });

        const itemProps = {
            ref: this.getItemDOM,
            className: classNames,
            children: itemRender(item),
            disabled,
            draggable: draggable && !disabled,
            onDragStart: this.handleDragStart,
            onDragOver: this.handleDragOver,
            onDragEnd: this.handleDragEnd,
            onDrop: this.handleDrop,
            ...others,
        };
        if (isSimple) {
            if (!itemProps.disabled) {
                itemProps.onClick = this.handleClick;
            }

            return <Item {...itemProps} />;
        }

        return (
            <CheckboxItem
                checked={checked}
                onChange={onCheck.bind(this, item.value)}
                {...itemProps}
            />
        );
    }
}
