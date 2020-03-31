import React from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon from '../../icon';
import Overlay from '../../overlay';
import Menu from '../../menu';
import Animate from '../../animate';
import { events, KEYCODE, dom } from '../../util';
import {
    triggerEvents,
    getOffsetLT,
    getOffsetWH,
    isTransformSupported,
} from './utils';

const floatRight = { float: 'right', zIndex: 1 };
const floatLeft = { float: 'left', zIndex: 1 };
const { Popup } = Overlay;

class Nav extends React.Component {
    static propTypes = {
        prefix: PropTypes.string,
        rtl: PropTypes.bool,
        animation: PropTypes.bool,
        activeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        excessMode: PropTypes.string,
        extra: PropTypes.any,
        tabs: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
        tabPosition: PropTypes.string,
        tabRender: PropTypes.func,
        triggerType: PropTypes.string,
        popupProps: PropTypes.object,
        onTriggerEvent: PropTypes.func,
        onKeyDown: PropTypes.func,
        onClose: PropTypes.func,
        style: PropTypes.object,
        className: PropTypes.string,
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            showBtn: false,
            dropdownTabs: [],
        };
        this.offset = 0;
    }

    componentDidMount() {
        if (!this.props.animation) {
            this.initialSettings();
        }

        events.on(window, 'resize', this.onWindowResized);
    }

    componentDidUpdate() {
        // 此处通过延时处理，屏蔽动画带来的定位不准确问题（由于要支持ie9，因此无法使用transitionend）
        clearTimeout(this.scrollTimer);
        this.scrollTimer = setTimeout(() => {
            this.scrollToActiveTab();
        }, 410); // transition-duration is set to be .4s, wait for the transition finishes before re-calc

        clearTimeout(this.slideTimer);
        this.slideTimer = setTimeout(() => {
            this.setSlideBtn();
        }, 200);
    }

    componentWillUnmount() {
        events.off(window, 'resize', this.onWindowResized);
    }

    initialSettings() {
        this.setSlideBtn();
        this.getDropdownItems(this.props);
    }

    /**
     * The key method about move
     * @param {number} target position to slide to
     * @param {bool} checkSlideBtn need to check the slide button status or not
     * @param {bool} setActive need to check the active status or not
     */
    setOffset(target, checkSlideBtn = true, setActive = true) {
        const { tabPosition, rtl } = this.props;
        const navWH = getOffsetWH(this.nav, tabPosition);
        const wrapperWH = getOffsetWH(this.wrapper);

        // target should not be great than 0, i.e. should not over slide to left-most
        target = target >= 0 ? 0 : target;
        // when need to slide, should not slide to exceed right-most
        target =
            target <= wrapperWH - navWH && wrapperWH - navWH < 0
                ? wrapperWH - navWH
                : target;

        const relativeOffset = target - this.offset;
        if (this.activeTab && this.props.excessMode === 'slide' && setActive) {
            const activeTabWH = getOffsetWH(this.activeTab);
            const activeTabOffset =
                getOffsetLT(this.activeTab) + relativeOffset;
            const wrapperOffset = getOffsetLT(this.wrapper);
            target = this._adjustTarget({
                wrapperOffset,
                wrapperWH,
                activeTabWH,
                activeTabOffset,
                rtl,
                target,
            });
        }

        if (this.offset !== target) {
            // needs move
            this.offset = target;
            let navOffset = {};
            const navStyle = this.nav.style;

            const canTransform = isTransformSupported(navStyle);
            if (tabPosition === 'left' || tabPosition === 'right') {
                navOffset = canTransform
                    ? {
                          value: `translate3d(0, ${target}px, 0)`,
                      }
                    : {
                          name: 'top',
                          value: `${target}px`,
                      };
            } else if (!this.props.rtl) {
                navOffset = canTransform
                    ? {
                          value: `translate3d(${target}px, 0, 0)`,
                      }
                    : {
                          name: 'left',
                          value: `${target}px`,
                      };
            } else {
                navOffset = canTransform
                    ? {
                          value: `translate3d(${-target}px, 0, 0)`,
                      }
                    : {
                          name: 'right',
                          value: `${target}px`,
                      };
            }

            if (canTransform) {
                Object.assign(navStyle, {
                    transform: navOffset.value,
                    webkitTransform: navOffset.value,
                    mozTransform: navOffset.value,
                });
            } else {
                navStyle[navOffset.name] = navOffset.value;
            }

            if (checkSlideBtn) {
                this.setSlideBtn();
            }
        }
    }

    _adjustTarget({
        wrapperOffset,
        wrapperWH,
        activeTabWH,
        activeTabOffset,
        rtl,
        target,
    }) {
        if (
            // active tab covers wrapper right edge
            wrapperOffset + wrapperWH < activeTabOffset + activeTabWH &&
            activeTabOffset < wrapperOffset + wrapperWH
        ) {
            if (rtl) {
                target += // Move more to make active tab totally in visible zone
                    activeTabOffset + activeTabWH - (wrapperOffset + wrapperWH);
            } else {
                target -=
                    activeTabOffset +
                    activeTabWH -
                    (wrapperOffset + wrapperWH) +
                    1;
            }

            return target;
        }
        if (
            // active tab covers wrapper left edge
            wrapperOffset < activeTabOffset + activeTabWH &&
            activeTabOffset < wrapperOffset
        ) {
            if (rtl) {
                target -= wrapperOffset - activeTabOffset + 1;
            } else {
                target += wrapperOffset - activeTabOffset;
            }
            return target;
        }
        return target;
    }

    _setBtnStyle(prev, next) {
        if (this.prevBtn && this.nextBtn) {
            const cls = 'disabled';
            this.prevBtn.disabled = !prev;
            this.nextBtn.disabled = !next;
            if (prev) {
                dom.removeClass(this.prevBtn, cls);
            } else {
                dom.addClass(this.prevBtn, cls);
            }
            if (next) {
                dom.removeClass(this.nextBtn, cls);
            } else {
                dom.addClass(this.nextBtn, cls);
            }
        }
    }

    setSlideBtn() {
        const { tabPosition } = this.props;

        // TEMP: 这里会受 Animate 影响，re-render 过程中 this.nav 实际上指向的是上次的 tabList 元素，建议暂时关闭 animation 解决
        const navWH = getOffsetWH(this.nav, tabPosition);
        const wrapperWH = getOffsetWH(this.wrapper, tabPosition);
        const minOffset = wrapperWH - navWH;

        let next;
        let prev;
        if (minOffset >= 0 || navWH <= wrapperWH) {
            next = false;
            prev = false;
            this.setOffset(0, false); // no need to check slide again since this call is invoked from inside setSlideBtn
        } else if (this.offset < 0 && this.offset <= minOffset) {
            prev = true;
            next = false;
        } else if (this.offset >= 0) {
            prev = false;
            next = true;
        } else {
            prev = true;
            next = true;
        }

        if ((prev || next) !== this.state.showBtn) {
            this.setState({
                showBtn: prev || next,
            });
        } else {
            this._setBtnStyle(prev, next);
        }
    }

    getDropdownItems({ excessMode, tabs }) {
        if (excessMode !== 'dropdown') {
            return;
        }

        const wrapperWidth = this.wrapper.offsetWidth;
        const childNodes = this.nav.childNodes;

        let index;
        let tabsWidth = 0;
        for (index = 0; index < tabs.length; index++) {
            tabsWidth += childNodes[index].offsetWidth;
            if (tabsWidth > wrapperWidth) {
                break;
            }
        }

        if (index === tabs.length) {
            this.setState({
                dropdownTabs: [],
            });
        } else {
            this.setState({
                dropdownTabs: tabs,
            });
        }
    }

    removeTab = (key, e) => {
        e && e.stopPropagation(); // stop bubble, so that it won't trigger upstream listener
        this.props.onClose(key);
    };

    onCloseKeyDown = (key, e) => {
        if (e.keyCode === KEYCODE.ENTER) {
            e.stopPropagation();
            e.preventDefault();
            this.props.onClose(key);
        }
    };

    defaultTabTemplateRender = (key, { prefix, title, closeable }) => {
        const tail = closeable ? (
            <Icon
                type="close"
                tabIndex="0"
                onKeyDown={e => this.onCloseKeyDown(key, e)}
                onClick={e => this.removeTab(key, e)}
                className={`${prefix}tabs-tab-close`}
            />
        ) : null;
        return (
            <div className={`${this.props.prefix}tabs-tab-inner`}>
                {title}
                {tail}
            </div>
        );
    };

    renderTabList(props) {
        const { prefix, tabs, activeKey, tabRender } = props;
        const tabTemplateFn = tabRender || this.defaultTabTemplateRender;

        const rst = [];
        React.Children.forEach(tabs, child => {
            const {
                disabled,
                className,
                onClick,
                onMouseEnter,
                onMouseLeave,
                style,
            } = child.props;

            const active = activeKey === child.key;
            const cls = classnames(
                {
                    [`${prefix}tabs-tab`]: true,
                    disabled,
                    active,
                },
                className
            );

            let events = {};

            if (!disabled) {
                events = {
                    onClick: this.onNavItemClick.bind(this, child.key, onClick),
                    onMouseEnter: this.onNavItemMouseEnter.bind(
                        this,
                        child.key,
                        onMouseEnter
                    ),
                    onMouseLeave: this.onNavItemMouseLeave.bind(
                        this,
                        child.key,
                        onMouseLeave
                    ),
                };
            }

            rst.push(
                <li
                    role="tab"
                    key={child.key}
                    ref={active ? this.activeTabRefHandler : null}
                    aria-hidden={disabled ? 'true' : 'false'}
                    aria-selected={active ? 'true' : 'false'}
                    tabIndex={active ? 0 : -1}
                    className={cls}
                    style={style}
                    {...events}
                >
                    {tabTemplateFn(child.key, child.props)}
                </li>
            );
        });
        return rst;
    }

    scrollToActiveTab = () => {
        if (
            this.activeTab &&
            ['slide', 'dropdown'].includes(this.props.excessMode)
        ) {
            const activeTabWH = getOffsetWH(this.activeTab);
            const wrapperWH = getOffsetWH(this.wrapper);
            const activeTabOffset = getOffsetLT(this.activeTab);
            const wrapperOffset = getOffsetLT(this.wrapper);
            const target = this.offset;
            if (
                activeTabOffset >= wrapperOffset + wrapperWH ||
                activeTabOffset + activeTabWH <= wrapperOffset
            ) {
                this.setOffset(
                    this.offset + wrapperOffset - activeTabOffset,
                    true,
                    true
                );
                return;
            }
            this.setOffset(target, true, true);
        }
    };

    onPrevClick = () => {
        const wrapperWH = getOffsetWH(this.wrapper);
        this.setOffset(this.offset + wrapperWH, true, false);
    };

    onNextClick = () => {
        const wrapperWH = getOffsetWH(this.wrapper);
        this.setOffset(this.offset - wrapperWH, true, false);
    };

    onNavItemClick(key, callback, e) {
        this.props.onTriggerEvent(triggerEvents.CLICK, key);
        if (callback) {
            return callback(key, e);
        }
    }

    onSelectMenuItem = keys => {
        const { onTriggerEvent, triggerType } = this.props;
        onTriggerEvent(triggerType, keys[0]);
    };

    onNavItemMouseEnter(key, callback, e) {
        this.props.onTriggerEvent(triggerEvents.HOVER, key);
        if (callback) {
            return callback(key, e);
        }
    }

    onNavItemMouseLeave(key, callback, e) {
        if (callback) {
            return callback(key, e);
        }
    }

    onWindowResized = () => {
        if (this.updateTimer) {
            clearTimeout(this.updateTimer);
        }

        this.updateTimer = setTimeout(() => {
            this.setSlideBtn();
            this.getDropdownItems(this.props);
        }, 100);
    };

    renderDropdownTabs(tabs = []) {
        if (!tabs.length) {
            return null;
        }

        const { prefix, activeKey, triggerType, popupProps, rtl } = this.props;
        const trigger = (
            <button className={`${prefix}tabs-btn-down`}>
                <Icon type="arrow-down" />
            </button>
        );

        return (
            <Popup
                rtl={rtl}
                triggerType={triggerType}
                trigger={trigger}
                container={target => target.parentNode}
                className={`${prefix}tabs-bar-popup`}
                {...popupProps}
            >
                <Menu
                    rtl={rtl}
                    selectedKeys={[activeKey]}
                    onSelect={this.onSelectMenuItem}
                    selectMode="single"
                >
                    {tabs.map(tab => {
                        const {
                            disabled,
                            onClick,
                            onMouseEnter,
                            onMouseLeave,
                        } = tab.props;
                        let events = {};
                        if (!disabled) {
                            events = {
                                onClick: this.onNavItemClick.bind(
                                    this,
                                    tab.key,
                                    onClick
                                ),
                                onMouseEnter: this.onNavItemMouseEnter.bind(
                                    this,
                                    tab.key,
                                    onMouseEnter
                                ),
                                onMouseLeave: this.onNavItemMouseLeave.bind(
                                    this,
                                    tab.key,
                                    onMouseLeave
                                ),
                            };
                        }
                        return (
                            <Menu.Item key={tab.key} {...events}>
                                {tab.props.title}
                            </Menu.Item>
                        );
                    })}
                </Menu>
            </Popup>
        );
    }

    navRefHandler = ref => {
        this.nav = findDOMNode(ref);
    };

    wrapperRefHandler = ref => {
        this.wrapper = ref;
    };

    navbarRefHandler = ref => {
        this.navbar = ref;
    };

    activeTabRefHandler = ref => {
        this.activeTab = ref;
    };

    prevBtnHandler = ref => {
        this.prevBtn = findDOMNode(ref);
    };

    nextBtnHandler = ref => {
        this.nextBtn = findDOMNode(ref);
    };

    render() {
        const {
            prefix,
            tabPosition,
            excessMode,
            extra,
            onKeyDown,
            animation,
            style,
            className,
            rtl,
        } = this.props;
        const state = this.state;

        let nextButton;
        let prevButton;
        let restButton;

        const showNextPrev = state.showBtn;

        if (
            excessMode === 'dropdown' &&
            showNextPrev &&
            state.dropdownTabs.length
        ) {
            restButton = this.renderDropdownTabs(state.dropdownTabs);
            prevButton = null;
            nextButton = null;
        } else if (showNextPrev) {
            prevButton = (
                <button
                    onClick={this.onPrevClick}
                    className={`${prefix}tabs-btn-prev`}
                    ref={this.prevBtnHandler}
                >
                    <Icon rtl={rtl} type="arrow-left" />
                </button>
            );

            nextButton = (
                <button
                    onClick={this.onNextClick}
                    className={`${prefix}tabs-btn-next`}
                    ref={this.nextBtnHandler}
                >
                    <Icon rtl={rtl} type="arrow-right" />
                </button>
            );
            restButton = null;
        } else {
            nextButton = null;
            prevButton = null;
            restButton = null;
        }

        const containerCls = classnames({
            [`${prefix}tabs-nav-container`]: true,
            [`${prefix}tabs-nav-container-scrolling`]: showNextPrev,
        });

        const navCls = `${prefix}tabs-nav`;
        const tabList = this.renderTabList(this.props);

        const container = (
            <div
                className={containerCls}
                onKeyDown={onKeyDown}
                key="nav-container"
            >
                <div
                    className={`${prefix}tabs-nav-wrap`}
                    ref={this.wrapperRefHandler}
                >
                    <div className={`${prefix}tabs-nav-scroll`}>
                        {animation ? (
                            <Animate
                                role="tablist"
                                aria-multiselectable={false}
                                component="ul"
                                className={navCls}
                                animation={navCls}
                                singleMode={false}
                                ref={this.navRefHandler}
                                afterAppear={this.initialSettings.bind(this)}
                            >
                                {tabList}
                            </Animate>
                        ) : (
                            <ul
                                role="tablist"
                                className={navCls}
                                ref={this.navRefHandler}
                            >
                                {tabList}
                            </ul>
                        )}
                    </div>
                </div>
                {prevButton}
                {nextButton}
                {restButton}
            </div>
        );

        const navChildren = [container];

        if (extra) {
            const extraProps = {
                className: `${prefix}tabs-nav-extra`,
                key: 'nav-extra',
            };
            if (tabPosition === 'top' || tabPosition === 'bottom') {
                const style = rtl ? floatLeft : floatRight;
                navChildren.unshift(
                    <div {...extraProps} style={style}>
                        {extra}
                    </div>
                );
            } else {
                navChildren.push(<div {...extraProps}>{extra}</div>);
            }
        }

        const navbarCls = classnames(`${prefix}tabs-bar`, className);

        return (
            <div
                className={navbarCls}
                style={style}
                ref={this.navbarRefHandler}
            >
                {navChildren}
            </div>
        );
    }
}

export default Nav;
