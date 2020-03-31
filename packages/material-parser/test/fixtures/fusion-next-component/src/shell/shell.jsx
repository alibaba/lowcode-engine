import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import ConfigProvider from '../config-provider';
import Icon from '../icon';
import { KEYCODE } from '../util';

import { isBoolean, getCollapseMap } from './util';

/**
 * Shell
 */
export default function ShellBase(props) {
    const { componentName } = props;
    class Shell extends Component {
        static displayName = componentName;

        static _typeMark = componentName;

        static propTypes = {
            ...ConfigProvider.propTypes,
            prefix: PropTypes.string,
            /**
             * 设备类型
             * @enumdesc 手机, 平板, PC电脑
             */
            device: PropTypes.oneOf(['phone', 'tablet', 'desktop']),
            /**
             * 设备类型
             * @enumdesc 浅色, 深色, 主题色
             */
            type: PropTypes.oneOf(['light', 'dark', 'brand']),
        };

        static defaultProps = {
            prefix: 'next-',
            device: 'desktop',
            type: 'light',
        };

        constructor(props) {
            super(props);

            const deviceMap = getCollapseMap(props.device);
            this.layout = {};

            this.state = {
                controll: false,
                collapseMap: deviceMap,
                device: props.device,
            };
        }

        componentWillReceiveProps(nextProps) {
            const { device } = this.props;

            if (nextProps.device !== device) {
                const deviceMap = getCollapseMap(nextProps.device);
                const { collapseMap } = this.state;

                Object.keys(deviceMap).forEach(block => {
                    const { props } = this.layout[block] || {};
                    if (collapseMap[block] !== deviceMap[block]) {
                        if (
                            props &&
                            typeof props.onCollapseChange === 'function'
                        ) {
                            props.onCollapseChange(deviceMap[block]);
                        }
                    }
                });

                this.setState({
                    controll: false,
                    collapseMap: deviceMap,
                    device: nextProps.device,
                });
            }
        }

        setChildCollapse = (child, mark) => {
            const { device, collapseMap, controll } = this.state;
            const { collapse } = child.props;
            const deviceMap = getCollapseMap(device);
            const props = {};

            // 非受控模式
            if (isBoolean(collapse) === false) {
                props.collapse = controll ? collapseMap[mark] : deviceMap[mark];
                // props.collapse = collapseMap[mark];
            }

            if (device !== 'phone' && mark === 'Navigation') {
                props.miniable = true;
            }

            return React.cloneElement(child, props);
        };

        toggleAside = (mark, props, e) => {
            const { device, collapseMap } = this.state;
            const deviceMap = getCollapseMap(device);
            const current = props.collapse;

            const newCollapseMap = {
                ...deviceMap,
                ...collapseMap,
                [mark]: !current,
            };
            this.setState({
                controll: true,
                collapseMap: newCollapseMap,
            });

            if (props && typeof props.onCollapseChange === 'function') {
                props.onCollapseChange(newCollapseMap[mark]);
            }

            const { children } = this.props;
            let com;
            if (mark === 'Navigation') {
                com = children
                    .filter(
                        child =>
                            child &&
                            child.type._typeMark.replace('Shell_', '') ===
                                mark &&
                            child.props.direction !== 'hoz'
                    )
                    .pop();
            } else {
                com = children
                    .filter(
                        child =>
                            child &&
                            child.type._typeMark.replace('Shell_', '') === mark
                    )
                    .pop();
            }

            const { triggerProps = {} } = com.props;

            if (typeof triggerProps.onClick === 'function') {
                triggerProps.onClick(e, this.state.collapseMap[mark]);
            }
        };

        toggleNavigation = e => {
            const mark = 'Navigation';
            const { props } = this.layout[mark];

            if ('keyCode' in e && e.keyCode !== KEYCODE.ENTER) {
                return;
            }

            this.toggleAside(mark, props, e);
        };

        toggleLocalNavigation = e => {
            const mark = 'LocalNavigation';
            const { props } = this.layout[mark];

            if ('keyCode' in e && e.keyCode !== KEYCODE.ENTER) {
                return;
            }

            this.toggleAside(mark, props, e);
        };

        toggleAncillary = e => {
            const mark = 'Ancillary';
            const { props } = this.layout[mark];

            if ('keyCode' in e && e.keyCode !== KEYCODE.ENTER) {
                return;
            }

            this.toggleAside(mark, props, e);
        };

        toggleToolDock = e => {
            const mark = 'ToolDock';
            const { props } = this.layout[mark];

            if ('keyCode' in e && e.keyCode !== KEYCODE.ENTER) {
                return;
            }

            this.toggleAside(mark, props, e);
        };

        renderShell = props => {
            const { prefix, children, className, type, ...others } = props;

            const { device } = this.state;

            const layout = {};
            layout.header = {};
            let hasToolDock = false,
                needNavigationTrigger = false,
                needDockTrigger = false;

            React.Children.map(children, child => {
                if (child && typeof child.type === 'function') {
                    const mark = child.type._typeMark.replace('Shell_', '');
                    switch (mark) {
                        case 'Branding':
                        case 'Action':
                            layout.header[mark] = child;
                            break;
                        case 'MultiTask':
                            layout.taskHeader = child;
                            break;
                        case 'LocalNavigation':
                            if (!layout[mark]) {
                                layout[mark] = [];
                            }
                            layout[mark] = this.setChildCollapse(child, mark);
                            break;
                        case 'Ancillary':
                            if (!layout[mark]) {
                                layout[mark] = [];
                            }

                            layout[mark] = this.setChildCollapse(child, mark);
                            break;
                        case 'ToolDock':
                            hasToolDock = true;

                            if (!layout[mark]) {
                                layout[mark] = [];
                            }

                            const childT = this.setChildCollapse(child, mark);
                            layout[mark] = childT;

                            break;
                        case 'AppBar':
                        case 'Content':
                        case 'Footer':
                            layout.content || (layout.content = []);
                            layout.content.push(child);
                            break;
                        case 'Page':
                            layout.page || (layout.page = []);
                            layout.page = child;
                            break;
                        case 'Navigation':
                            if (child.props.direction === 'hoz') {
                                layout.header[mark] = child;
                            } else {
                                if (!layout[mark]) {
                                    layout[mark] = [];
                                }

                                needNavigationTrigger = true;

                                const childN = this.setChildCollapse(
                                    child,
                                    mark
                                );
                                layout[mark] = childN;
                            }
                            break;
                        default:
                            break;
                    }
                }
            });

            const headerCls = classnames({
                [`${prefix}shell-header`]: true,
            });

            const mainCls = classnames({
                [`${prefix}shell-main`]: true,
            });

            const submainCls = classnames({
                [`${prefix}shell-sub-main`]: true,
            });

            const asideCls = classnames({
                [`${prefix}shell-aside`]: true,
            });

            if (hasToolDock) {
                if (device === 'phone') {
                    needDockTrigger = true;
                }
            }

            // 如果存在垂直模式的 Navigation, 则需要在 Branding 上出现 trigger
            if (needNavigationTrigger) {
                const branding = layout.header.Branding;
                let { trigger, collapse } = layout.Navigation.props;

                if ('trigger' in layout.Navigation.props) {
                    trigger =
                        (trigger &&
                            React.cloneElement(trigger, {
                                onClick: this.toggleNavigation,
                                'aria-expanded': !collapse,
                            })) ||
                        trigger;
                } else {
                    trigger = (
                        <div
                            key="nav-trigger"
                            role="button"
                            tabIndex={0}
                            aria-expanded={!collapse}
                            aria-label={'toggle'}
                            className="nav-trigger"
                            onClick={this.toggleNavigation}
                            onKeyDown={this.toggleNavigation}
                        >
                            {collapse ? (
                                <Icon size="small" type="toggle-right" />
                            ) : (
                                <Icon size="small" type="toggle-left" />
                            )}
                        </div>
                    );
                }

                if (!branding) {
                    trigger && (layout.header.Branding = trigger);
                } else {
                    layout.header.Branding = React.cloneElement(branding, {}, [
                        trigger,
                        branding.props.children,
                    ]);
                }
            }

            // 如果存在 toolDock, 则需要在 Action 上出现 trigger
            if (needDockTrigger) {
                const action = layout.header.Action;
                let { trigger, collapse } = layout.ToolDock.props;

                if ('trigger' in layout.ToolDock.props) {
                    trigger =
                        (trigger &&
                            React.cloneElement(trigger, {
                                onClick: this.toggleToolDock,
                                'aria-expanded': !collapse,
                            })) ||
                        trigger;
                } else {
                    trigger = (
                        <div
                            key="dock-trigger"
                            tabIndex={0}
                            role="button"
                            aria-expanded={!collapse}
                            aria-label={'toggle'}
                            className="dock-trigger"
                            onClick={this.toggleToolDock}
                            onKeyDown={this.toggleToolDock}
                        >
                            <Icon size="small" type="add" />
                        </div>
                    );
                }

                if (!action) {
                    layout.header.Action = trigger;
                } else {
                    layout.header.Action = React.cloneElement(action, {}, [
                        action.props.children,
                        trigger,
                    ]);
                }
            }

            let headerDom = [],
                contentArr = [],
                innerArr = [],
                taskHeaderDom = null;

            if (layout.taskHeader) {
                const taskHeaderCls = classnames({
                    [`${prefix}shell-task-header`]: true,
                });

                taskHeaderDom = (
                    <section key="task-header" className={taskHeaderCls}>
                        {layout.taskHeader}
                    </section>
                );
            }

            // 按照dom结构，innerArr 包括 LocalNavigation content Ancillary
            if (layout.LocalNavigation) {
                let { trigger, collapse } = layout.LocalNavigation.props;

                if ('trigger' in layout.LocalNavigation.props) {
                    trigger =
                        (trigger &&
                            React.cloneElement(trigger, {
                                onClick: this.toggleLocalNavigation,
                                'aria-expanded': !collapse,
                            })) ||
                        trigger;
                } else {
                    trigger = (
                        <div
                            key="local-nav-trigger"
                            role="button"
                            tabIndex={0}
                            aria-expanded={!collapse}
                            aria-label={'toggle'}
                            className="local-nav-trigger aside-trigger"
                            onClick={this.toggleLocalNavigation}
                            onKeyDown={this.toggleLocalNavigation}
                        >
                            {collapse ? (
                                <Icon size="small" type="arrow-right" />
                            ) : (
                                <Icon size="small" type="arrow-left" />
                            )}
                        </div>
                    );
                }

                const localNavCls = classnames(asideCls, {
                    [`${prefix}aside-localnavigation`]: true,
                });

                innerArr.push(
                    <aside key="localnavigation" className={localNavCls}>
                        {React.cloneElement(layout.LocalNavigation, {}, [
                            <div
                                key="wrapper"
                                className={`${prefix}shell-content-wrapper`}
                            >
                                {layout.LocalNavigation.props.children}
                            </div>,
                            trigger,
                        ])}
                    </aside>
                );
            }

            if (layout.content) {
                innerArr.push(
                    <section key="submain" className={submainCls} tabIndex={0}>
                        {layout.content}
                    </section>
                );
            }

            if (layout.Ancillary) {
                let { trigger, collapse } = layout.Ancillary.props;

                if ('trigger' in layout.Ancillary.props) {
                    trigger =
                        (trigger &&
                            React.cloneElement(trigger, {
                                onClick: this.toggleAncillary,
                                'aria-expanded': !collapse,
                            })) ||
                        trigger;
                } else {
                    trigger = (
                        <div
                            key="ancillary-trigger"
                            role="button"
                            tabIndex={0}
                            aria-expanded={!collapse}
                            aria-label={'toggle'}
                            className="ancillary-trigger aside-trigger"
                            onClick={this.toggleAncillary}
                            onKeyDown={this.toggleAncillary}
                        >
                            {collapse ? (
                                <Icon size="small" type="arrow-left" />
                            ) : (
                                <Icon size="small" type="arrow-right" />
                            )}
                        </div>
                    );
                }

                const ancillaryCls = classnames(asideCls, {
                    [`${prefix}aside-ancillary`]: true,
                });

                innerArr.push(
                    <aside key="ancillary" className={ancillaryCls}>
                        {React.cloneElement(layout.Ancillary, {}, [
                            <div
                                key="wrapper"
                                className={`${prefix}shell-content-wrapper`}
                            >
                                {layout.Ancillary.props.children}
                            </div>,
                            trigger,
                        ])}
                    </aside>
                );
            }

            // 按照dom结构, arr 包括 header Navigation ToolDock 和 innerArr
            if (Object.keys(layout.header).length > 0) {
                headerDom = (
                    <header key="header" className={headerCls}>
                        {layout.header.Branding}
                        {layout.header.Navigation}
                        {layout.header.Action}
                    </header>
                );
            }

            layout.Navigation &&
                contentArr.push(
                    React.cloneElement(layout.Navigation, {
                        className: classnames(
                            asideCls,
                            layout.Navigation.props.className
                        ),
                        key: 'navigation',
                    })
                );

            // const contentArea = innerArr.length > 0
            //     ? <section key="main" className={mainCls}>{innerArr}</section>
            //     : layout.page;

            // contentArr.push(contentArea);
            contentArr = contentArr.concat(
                innerArr.length > 0 ? innerArr : [layout.page]
            );

            layout.ToolDock &&
                contentArr.push(
                    React.cloneElement(layout.ToolDock, {
                        className: classnames(
                            asideCls,
                            layout.ToolDock.props.className
                        ),
                        key: 'tooldock',
                    })
                );

            const cls = classnames({
                [`${prefix}shell`]: true,
                [`${prefix}shell-${device}`]: true,
                [`${prefix}shell-${type}`]: true,
                [className]: !!className,
            });

            if (componentName === 'Page') {
                return <section className={mainCls}>{contentArr}</section>;
            }

            this.layout = layout;

            return (
                <section className={cls} {...others}>
                    {headerDom}
                    {taskHeaderDom}
                    <section className={mainCls}>{contentArr}</section>
                </section>
            );
        };

        render() {
            return this.renderShell(this.props);
        }
    }

    return Shell;
}
