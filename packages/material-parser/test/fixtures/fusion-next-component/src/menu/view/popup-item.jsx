import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Icon from '../../icon';
import Overlay from '../../overlay';
import { func, obj, dom } from '../../util';
import Item from './item';
import SelectableItem from './selectable-item';

const { bindCtx } = func;
const { setStyle } = dom;
const Popup = Overlay.Popup;

/**
 * Menu.PopupItem
 * @order 2
 */
export default class PopupItem extends Component {
    static menuChildType = 'submenu';

    static propTypes = {
        _key: PropTypes.string,
        root: PropTypes.object,
        level: PropTypes.number,
        hasSubMenu: PropTypes.bool,
        noIcon: PropTypes.bool,
        rtl: PropTypes.bool,
        selectable: PropTypes.bool,
        /**
         * 标签内容
         */
        label: PropTypes.node,
        /**
         * 自定义弹层内容
         */
        children: PropTypes.node,
        className: PropTypes.string,
        triggerType: PropTypes.oneOf(['click', 'hover']),
        align: PropTypes.oneOf(['outside', 'follow']),
        autoWidth: PropTypes.bool,
    };

    static defaultProps = {
        selectable: false,
        noIcon: false,
    };

    constructor(props) {
        super(props);

        bindCtx(this, [
            'handleOpen',
            'handlePopupOpen',
            'handlePopupClose',
            'getPopup',
        ]);
    }

    getPopup(ref) {
        this.popup = ref;
    }

    getOpen() {
        const { _key, root } = this.props;
        const { openKeys } = root.state;

        return openKeys.indexOf(_key) > -1;
    }

    getChildSelected() {
        const { _key, root } = this.props;
        const { selectMode } = root.props;
        const { selectedKeys } = root.state;

        const _keyPos = root.k2n[_key].pos;

        return (
            !!selectMode &&
            selectedKeys.some(
                key => root.k2n[key] && root.k2n[key].pos.indexOf(_keyPos) === 0
            )
        );
    }

    getPopupProps() {
        let { popupProps } = this.props.root.props;
        if (typeof popupProps === 'function') {
            popupProps = popupProps(this.props);
        }
        return popupProps;
    }

    handleOpen(open, triggerType, e) {
        const { _key, root } = this.props;
        root.handleOpen(_key, open, triggerType, e);

        const popupProps = this.popupProps;
        popupProps.onVisibleChange &&
            popupProps.onVisibleChange(open, triggerType, e);
    }

    handlePopupOpen() {
        const { root, level, align, autoWidth } = this.props;
        const {
            popupAutoWidth: rootPopupAutoWidth,
            popupAlign: rootPopupAlign,
            direction,
        } = root.props;
        const popupAlign = align || rootPopupAlign;
        const popupAutoWidth =
            'autoWidth' in this.props ? autoWidth : rootPopupAutoWidth;
        const itemNode = findDOMNode(this);
        const menuNode = itemNode.parentNode;
        this.popupNode = this.popup
            .getInstance()
            .overlay.getInstance()
            .getContentNode();
        root.popupNodes.push(this.popupNode);

        if (popupAutoWidth) {
            const targetNode =
                direction === 'hoz' && level === 1 ? itemNode : menuNode;

            if (targetNode.offsetWidth > this.popupNode.offsetWidth) {
                setStyle(
                    this.popupNode,
                    'width',
                    `${targetNode.offsetWidth}px`
                );
            }
        }
        if (popupAlign === 'outside' && !(direction === 'hoz' && level === 1)) {
            setStyle(this.popupNode, 'height', `${menuNode.offsetHeight}px`);
            setStyle(this.popupNode, 'overflow-y', 'scroll');
        }
        // removeClass(this.popupNode, `${prefix}hide`);

        const popupProps = this.popupProps;
        popupProps.onOpen && popupProps.onOpen();
    }

    handlePopupClose() {
        const { root } = this.props;
        const popupNodes = root.popupNodes;
        const index = popupNodes.indexOf(this.popupNode);
        index > -1 && popupNodes.splice(index, 1);

        const popupProps = this.popupProps;
        popupProps.onClose && popupProps.onClose();
    }

    renderItem(selectable, children, others) {
        const { _key, root, level, inlineLevel, label, className } = this.props;
        const { prefix } = root.props;
        const NewItem = selectable ? SelectableItem : Item;
        const open = this.getOpen();
        const isChildSelected = this.getChildSelected();

        const itemProps = {
            'aria-haspopup': true,
            'aria-expanded': open,
            _key,
            root,
            level,
            inlineLevel,
            type: 'submenu',
        };

        itemProps.className = cx({
            [`${prefix}opened`]: open,
            [`${prefix}child-selected`]: isChildSelected,
            [className]: !!className,
        });

        return (
            <NewItem {...itemProps} {...others}>
                <span className={`${prefix}menu-item-text`}>{label}</span>
                {children}
            </NewItem>
        );
    }

    renderPopup(trigger, triggerType, positionProps, children) {
        const { root, level, selectable } = this.props;
        const { direction } = root.props;
        this.popupProps = this.getPopupProps();
        const open = this.getOpen();

        if (direction === 'hoz' && level === 1 && selectable) {
            positionProps.target = () => findDOMNode(this);
        }

        return (
            <Popup
                ref={this.getPopup}
                {...positionProps}
                {...this.popupProps}
                canCloseByEsc={false}
                trigger={trigger}
                triggerType={triggerType}
                visible={open}
                onVisibleChange={this.handleOpen}
                onOpen={this.handlePopupOpen}
                onClose={this.handlePopupClose}
            >
                {children}
            </Popup>
        );
    }

    render() {
        const {
            root,
            level,
            hasSubMenu,
            selectable: selectableFromProps,
            children,
            triggerType,
            align,
            noIcon,
            rtl,
        } = this.props;
        const others = obj.pickOthers(
            Object.keys(PopupItem.propTypes),
            this.props
        );
        const {
            prefix,
            selectMode,
            direction,
            popupAlign: rootPopupAlign,
            triggerType: rootTriggerType,
        } = root.props;
        const popupAlign = align || rootPopupAlign;
        const newTriggerType =
            triggerType || (hasSubMenu ? rootTriggerType : 'hover');
        const newChildren = Array.isArray(children) ? children[0] : children;
        // let newChildren = Array.isArray(children) ? children[0] : children;
        // newChildren = cloneElement(newChildren, {
        //     className: cx({
        //         [`${prefix}menu-popup-content`]: true,
        //         [newChildren.props.className]: !!newChildren.props.className,
        //         [`${prefix}hide`]: popupAutoWidth || popupAlign === 'outside'
        //     })
        // });
        const selectable = selectMode && selectableFromProps;
        const triggerIsIcon = selectable && newTriggerType === 'click';
        const open = this.getOpen();

        const positionProps = {};
        let arrowProps;

        if (direction === 'hoz' && level === 1) {
            positionProps.align = 'tl bl';
            positionProps.offset = [0, 0];

            arrowProps = {
                type: 'arrow-down',
                className: cx({
                    [`${prefix}menu-hoz-icon-arrow`]: true,
                    [`${prefix}open`]: open,
                }),
            };
        } else {
            if (popupAlign === 'outside') {
                positionProps.target = () => {
                    return findDOMNode(root);
                };
                positionProps.align = 'tl tr';

                rtl
                    ? (positionProps.offset = [-2, 0])
                    : (positionProps.offset = [2, 0]);
            } else {
                if (triggerIsIcon) {
                    positionProps.target = () => {
                        return findDOMNode(this);
                    };
                }
                positionProps.align = 'tl tr';

                rtl
                    ? (positionProps.offset = [2, -8])
                    : (positionProps.offset = [-2, -8]);
            }

            arrowProps = {
                type: 'arrow-right',
                className: `${prefix}menu-icon-arrow`,
            };
        }

        const arrow = <Icon {...arrowProps} />;
        const trigger = triggerIsIcon
            ? arrow
            : this.renderItem(selectable, noIcon ? null : arrow, others);
        const popup = this.renderPopup(
            trigger,
            newTriggerType,
            positionProps,
            newChildren
        );
        return triggerIsIcon
            ? this.renderItem(selectable, popup, others)
            : popup;
    }
}
