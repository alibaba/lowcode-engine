import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup } from 'react-transition-group';
import AnimateChild from './child';

const noop = () => {};
const FirstChild = props => {
    const childrenArray = React.Children.toArray(props.children);
    return childrenArray[0] || null;
};

/**
 * Animate
 */
class Animate extends Component {
    static propTypes = {
        /**
         * 动画 className
         */
        animation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
        /**
         * 子元素第一次挂载时是否执行动画
         */
        animationAppear: PropTypes.bool,
        /**
         * 包裹子元素的标签
         */
        component: PropTypes.any,
        /**
         * 是否只有单个子元素，如果有多个子元素，请设置为 false
         */
        singleMode: PropTypes.bool,
        /**
         * 子元素
         */
        children: PropTypes.oneOfType([
            PropTypes.element,
            PropTypes.arrayOf(PropTypes.element),
        ]),
        /**
         * 执行第一次挂载动画前触发的回调函数
         * @param {HTMLElement} node 执行动画的 dom 元素
         */
        beforeAppear: PropTypes.func,
        /**
         * 执行第一次挂载动画，添加 xxx-appear-active 类名后触发的回调函数
         *  @param {HTMLElement} node 执行动画的 dom 元素
         */
        onAppear: PropTypes.func,
        /**
         * 执行完第一次挂载动画后触发的函数
         * @param {HTMLElement} node 执行动画的 dom 元素
         */
        afterAppear: PropTypes.func,
        /**
         * 执行进场动画前触发的回调函数
         * @param {HTMLElement} node 执行动画的 dom 元素
         */
        beforeEnter: PropTypes.func,
        /**
         * 执行进场动画，添加 xxx-enter-active 类名后触发的回调函数
         * @param {HTMLElement} node 执行动画的 dom 元素
         */
        onEnter: PropTypes.func,
        /**
         * 执行完进场动画后触发的回调函数
         * @param {HTMLElement} node 执行动画的 dom 元素
         */
        afterEnter: PropTypes.func,
        /**
         * 执行离场动画前触发的回调函数
         * @param {HTMLElement} node 执行动画的 dom 元素
         */
        beforeLeave: PropTypes.func,
        /**
         * 执行离场动画，添加 xxx-leave-active 类名后触发的回调函数
         * @param {HTMLElement} node 执行动画的 dom 元素
         */
        onLeave: PropTypes.func,
        /**
         * 执行完离场动画后触发的回调函数
         * @param {HTMLElement} node 执行动画的 dom 元素
         */
        afterLeave: PropTypes.func,
    };

    static defaultProps = {
        animationAppear: true,
        component: 'div',
        singleMode: true,
        beforeAppear: noop,
        onAppear: noop,
        afterAppear: noop,
        beforeEnter: noop,
        onEnter: noop,
        afterEnter: noop,
        beforeLeave: noop,
        onLeave: noop,
        afterLeave: noop,
    };

    normalizeNames(names) {
        if (typeof names === 'string') {
            return {
                appear: `${names}-appear`,
                appearActive: `${names}-appear-active`,
                enter: `${names}-enter`,
                enterActive: `${names}-enter-active`,
                leave: `${names}-leave`,
                leaveActive: `${names}-leave-active`,
            };
        }
        if (typeof names === 'object') {
            return {
                appear: names.appear,
                appearActive: `${names.appear}-active`,
                enter: `${names.enter}`,
                enterActive: `${names.enter}-active`,
                leave: `${names.leave}`,
                leaveActive: `${names.leave}-active`,
            };
        }
    }

    render() {
        /* eslint-disable no-unused-vars */
        const {
            animation,
            children,
            animationAppear,
            singleMode,
            component,
            beforeAppear,
            onAppear,
            afterAppear,
            beforeEnter,
            onEnter,
            afterEnter,
            beforeLeave,
            onLeave,
            afterLeave,
            ...others
        } = this.props;
        /* eslint-enable no-unused-vars */

        const animateChildren = Children.map(children, child => {
            return (
                <AnimateChild
                    key={child.key}
                    names={this.normalizeNames(animation)}
                    onAppear={beforeAppear}
                    onAppearing={onAppear}
                    onAppeared={afterAppear}
                    onEnter={beforeEnter}
                    onEntering={onEnter}
                    onEntered={afterEnter}
                    onExit={beforeLeave}
                    onExiting={onLeave}
                    onExited={afterLeave}
                >
                    {child}
                </AnimateChild>
            );
        });

        return (
            <TransitionGroup
                appear={animationAppear}
                component={singleMode ? FirstChild : component}
                {...others}
            >
                {animateChildren}
            </TransitionGroup>
        );
    }
}

export default Animate;
