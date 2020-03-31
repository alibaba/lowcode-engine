import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { findDOMNode } from 'react-dom';
import { polyfill } from 'react-lifecycles-compat';

import { obj, events, func } from '../util';
import ConfigProvider from '../config-provider';
import { getScroll, getRect, getNodeHeight } from './util';

/** Affix */
class Affix extends React.Component {
    static propTypes = {
        prefix: PropTypes.string,
        /**
         * 设置 Affix 需要监听滚动事件的容器元素
         * @return {ReactElement} 目标容器元素的实例
         */
        container: PropTypes.func,
        /**
         * 距离窗口顶部达到指定偏移量后触发
         */
        offsetTop: PropTypes.number,
        /**
         * 距离窗口底部达到制定偏移量后触发
         */
        offsetBottom: PropTypes.number,
        /**
         * 当元素的样式发生固钉样式变化时触发的回调函数
         * @param {Boolean} affixed 元素是否被固钉
         */
        onAffix: PropTypes.func,
        /**
         * 是否启用绝对布局实现 affix
         * @param {Boolean} 是否启用绝对布局
         */
        useAbsolute: PropTypes.bool,
        className: PropTypes.string,
        style: PropTypes.object,
        children: PropTypes.any,
    };

    static defaultProps = {
        prefix: 'next-',
        container: () => window,
        onAffix: func.noop,
    };

    static _getAffixMode(nextProps) {
        const affixMode = {
            top: false,
            bottom: false,
            offset: 0,
        };
        if (!nextProps) {
            return affixMode;
        }
        const { offsetTop, offsetBottom } = nextProps;

        if (typeof offsetTop !== 'number' && typeof offsetBottom !== 'number') {
            // set default
            affixMode.top = true;
        } else if (typeof offsetTop === 'number') {
            affixMode.top = true;
            affixMode.bottom = false;
            affixMode.offset = offsetTop;
        } else if (typeof offsetBottom === 'number') {
            affixMode.bottom = true;
            affixMode.top = false;
            affixMode.offset = offsetBottom;
        }

        return affixMode;
    }

    constructor(props, context) {
        super(props, context);
        this.state = {
            style: null,
            containerStyle: null,
            affixMode: Affix._getAffixMode(props),
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if ('offsetTop' in nextProps || 'offsetBottom' in nextProps) {
            return {
                affixMode: Affix._getAffixMode(nextProps),
            };
        }
        return null;
    }

    componentDidMount() {
        const { container } = this.props;
        this._updateNodePosition();
        // wait for parent rendered
        this.timeout = setTimeout(() => {
            this._setEventHandlerForContainer(container);
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        setTimeout(this._updateNodePosition);
    }

    componentWillUnmount() {
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
        const { container } = this.props;
        this._removeEventHandlerForContainer(container);
    }

    _setEventHandlerForContainer(getContainer) {
        const container = getContainer();
        if (!container) {
            return;
        }
        events.on(container, 'scroll', this._updateNodePosition, false);
        events.on(container, 'resize', this._updateNodePosition, false);
    }

    _removeEventHandlerForContainer(getContainer) {
        const container = getContainer();
        if (container) {
            events.off(container, 'scroll', this._updateNodePosition);
            events.off(container, 'resize', this._updateNodePosition);
        }
    }

    updatePosition = () => {
        this._updateNodePosition();
    };

    _updateNodePosition = () => {
        const { affixMode } = this.state;
        const { container, useAbsolute } = this.props;
        const affixContainer = container();

        if (!affixContainer || !this.affixNode) {
            return false;
        }
        const containerScrollTop = getScroll(affixContainer, true); // 容器在垂直位置上的滚动 offset
        const affixOffset = this._getOffset(this.affixNode, affixContainer); // 目标节点当前相对于容器的 offset
        const containerHeight = getNodeHeight(affixContainer); // 容器的高度
        const affixHeight = this.affixNode.offsetHeight;
        const containerRect = getRect(affixContainer);

        const affixChildHeight = this.affixChildNode.offsetHeight;

        const affixStyle = {
            width: affixOffset.width,
        };
        const containerStyle = {
            width: affixOffset.width,
            height: affixChildHeight,
        };
        if (
            affixMode.top &&
            containerScrollTop > affixOffset.top - affixMode.offset
        ) {
            // affix top
            if (useAbsolute) {
                affixStyle.position = 'absolute';
                affixStyle.top =
                    containerScrollTop - (affixOffset.top - affixMode.offset);
                containerStyle.position = 'relative';
            } else {
                affixStyle.position = 'fixed';
                affixStyle.top = affixMode.offset + containerRect.top;
            }
            this._setAffixStyle(affixStyle, true);
            this._setContainerStyle(containerStyle);
        } else if (
            affixMode.bottom &&
            containerScrollTop <
                affixOffset.top +
                    affixHeight +
                    affixMode.offset -
                    containerHeight
        ) {
            // affix bottom
            affixStyle.height = affixHeight;
            if (useAbsolute) {
                affixStyle.position = 'absolute';
                affixStyle.top =
                    containerScrollTop -
                    (affixOffset.top +
                        affixHeight +
                        affixMode.offset -
                        containerHeight);
                containerStyle.position = 'relative';
            } else {
                affixStyle.position = 'fixed';
                affixStyle.bottom = affixMode.offset;
            }
            this._setAffixStyle(affixStyle, true);
            this._setContainerStyle(containerStyle);
        } else {
            this._setAffixStyle(null);
            this._setContainerStyle(null);
        }
    };

    _setAffixStyle(affixStyle, affixed = false) {
        if (obj.shallowEqual(affixStyle, this.state.style)) {
            return;
        }

        this.setState({
            style: affixStyle,
        });

        const { onAffix } = this.props;

        if (affixed) {
            setTimeout(() => onAffix(true));
        } else if (!affixStyle) {
            setTimeout(() => onAffix(false));
        }
    }

    _setContainerStyle(containerStyle) {
        if (obj.shallowEqual(containerStyle, this.state.containerStyle)) {
            return;
        }
        this.setState({ containerStyle });
    }

    _getOffset(affixNode, affixContainer) {
        const affixRect = affixNode.getBoundingClientRect(); // affix 元素 相对浏览器窗口的位置
        const containerRect = getRect(affixContainer); // affix 容器 相对浏览器窗口的位置
        const containerScrollTop = getScroll(affixContainer, true);
        const containerScrollLeft = getScroll(affixContainer, false);

        return {
            top: affixRect.top - containerRect.top + containerScrollTop,
            left: affixRect.left - containerRect.left + containerScrollLeft,
            width: affixRect.width,
            height: affixRect.height,
        };
    }

    _affixNodeRefHandler = ref => {
        this.affixNode = findDOMNode(ref);
    };

    _affixChildNodeRefHandler = ref => {
        this.affixChildNode = findDOMNode(ref);
    };

    render() {
        const { affixMode } = this.state;
        const { prefix, className, style, children } = this.props;
        const state = this.state;
        const classNames = classnames({
            [`${prefix}affix`]: state.style,
            [`${prefix}affix-top`]: !state.style && affixMode.top,
            [`${prefix}affix-bottom`]: !state.style && affixMode.bottom,
            [className]: className,
        });
        const combinedStyle = { ...state.containerStyle, ...style };

        return (
            <div ref={this._affixNodeRefHandler} style={combinedStyle}>
                <div
                    ref={this._affixChildNodeRefHandler}
                    className={classNames}
                    style={state.style}
                >
                    {children}
                </div>
            </div>
        );
    }
}

export default ConfigProvider.config(polyfill(Affix));
