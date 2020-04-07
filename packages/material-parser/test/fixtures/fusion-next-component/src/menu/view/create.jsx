import React, { Component } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Overlay from '../../overlay';
import { func } from '../../util';
import ConfigProvider from '../../config-provider';
import menu from './menu';

const { bindCtx } = func;
const { getContextProps } = ConfigProvider;
const Menu = ConfigProvider.config(menu);

let menuInstance;

class ContextMenu extends Component {
    static propTypes = {
        className: PropTypes.string,
        popupClassName: PropTypes.string,
        target: PropTypes.any,
        align: PropTypes.string,
        offset: PropTypes.array,
        overlayProps: PropTypes.object,
        afterClose: PropTypes.func,
        mode: PropTypes.oneOf(['inline', 'popup']),
        onOpen: PropTypes.func,
        onItemClick: PropTypes.func,
    };

    static defaultProps = {
        prefix: 'next-',
        align: 'tl tl',
        mode: 'popup',
    };

    constructor(props) {
        super(props);

        this.state = {
            visible: true,
        };

        bindCtx(this, [
            'handleOverlayClose',
            'handleOverlayOpen',
            'handleItemClick',
            'getOverlay',
        ]);
    }

    getOverlay(ref) {
        this.overlay = ref;
    }

    close() {
        this.setState({
            visible: false,
        });
        menuInstance = null;
    }

    handleOverlayClose(triggerType, e, ...others) {
        const clickedPopupMenu =
            triggerType === 'docClick' &&
            this.popupNodes.some(node => node.contains(e.target));
        if (!clickedPopupMenu) {
            this.close();
            const { overlayProps } = this.props;
            if (overlayProps && overlayProps.onRequestClose) {
                overlayProps.onRequestClose(triggerType, e, ...others);
            }
        }
    }

    handleOverlayOpen() {
        this.popupNodes = this.overlay
            .getInstance()
            .getContent()
            .getInstance().popupNodes;
        const { overlayProps } = this.props;
        if (overlayProps && overlayProps.onOpen) {
            overlayProps.onOpen();
        }
    }

    handleItemClick(...args) {
        this.close();

        this.props.onItemClick && this.props.onItemClick(...args);
    }

    render() {
        const {
            className,
            popupClassName,
            target,
            align,
            offset,
            afterClose,
            overlayProps = {},
            ...others
        } = this.props;
        const contextProps = getContextProps(this.props);
        const { prefix } = contextProps;
        const { visible } = this.state;

        const newOverlayProps = {
            ...contextProps,
            ...overlayProps,
            target,
            align,
            offset,
            afterClose,
            visible,
            onRequestClose: this.handleOverlayClose,
            onOpen: this.handleOverlayOpen,
            ref: this.getOverlay,
        };
        const menuProps = {
            ...contextProps,
            triggerType: 'hover',
            ...others,
            className: cx({
                [`${prefix}context`]: true,
                [className]: !!className,
            }),
            popupClassName: cx({
                [`${prefix}context`]: true,
                [popupClassName]: !!popupClassName,
            }),
            onItemClick: this.handleItemClick,
        };

        newOverlayProps.rtl = false;

        return (
            <Overlay {...newOverlayProps}>
                <Menu {...menuProps} />
            </Overlay>
        );
    }
}

/**
 * 创建上下文菜单
 * @exportName create
 * @param {Object} props 属性对象
 */
export default function create(props) {
    if (menuInstance) {
        menuInstance.destroy();
    }

    /* eslint-disable no-unused-vars */
    const { afterClose, ...others } = props;
    /* eslint-enable no-unused-vars */

    const div = document.createElement('div');
    document.body.appendChild(div);

    const closeChain = () => {
        unmountComponentAtNode(div);
        document.body.removeChild(div);

        afterClose && afterClose();
    };

    const newContext = ConfigProvider.getContext();

    let menu;
    render(
        <ConfigProvider {...newContext}>
            <ContextMenu
                ref={ref => {
                    menu = ref;
                }}
                afterClose={closeChain}
                {...others}
            />
        </ConfigProvider>,
        div
    );

    menuInstance = {
        destroy: () => {
            if (menu) {
                menu.close();
            }
        },
    };

    return menuInstance;
}
