import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';
import classNames from 'classnames';
import Animate from '../animate';
import { support, dom } from '../util';

/**
 * badge sup component
 */

// util::getDigitArray
const getDigitArray = num =>
    num
        .toString()
        .split('')
        .reverse()
        .map(i => parseInt(i, 10));

class Sup extends Component {
    static propTypes = {
        prefix: PropTypes.string,
        count: PropTypes.number,
        showZero: PropTypes.bool,
        overflowCount: PropTypes.number,
        content: PropTypes.node,
        dot: PropTypes.bool,
        style: PropTypes.object,
    };

    static defaultProps = {
        prefix: 'next-',
        count: 0,
        showZero: false,
        overflowCount: 99,
        dot: false,
    };

    // 单排可滚动的数字列表
    static renderDigit(prefix, digit, key) {
        const children = [];
        for (let i = 0; i < 30; i++) {
            children.push(<span key={i}>{i % 10}</span>);
        }

        return (
            <span className={`${prefix}badge-scroll-number-only`} key={key}>
                {children}
            </span>
        );
    }

    // 可滚动数字组
    static renderNumber(prefix, count) {
        return getDigitArray(count)
            .map((digit, i) => Sup.renderDigit(prefix, digit, i))
            .reverse();
    }

    constructor(props) {
        super(props);

        // render 时， 上一次的渲染数字 和 当前渲染的数字
        this.state = {
            lastCount: 0,
            currentCount: props.count,
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if ('count' in nextProps) {
            return {
                lastCount: prevState.currentCount,
                currentCount: nextProps.count,
            };
        }

        return null;
    }

    componentDidMount() {
        this.computeStyle(true);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.count !== this.props.count) {
            this.computeStyle(false);

            // NOTE why called `computeStyle` again after 300ms ?
            setTimeout(() => {
                this.computeStyle(true, true);
            }, 300);
        }
    }

    computeStyle(removeTransition, revert) {
        const { prefix, count, overflowCount } = this.props;
        const { lastCount } = this.state;

        if (count < 0) {
            return;
        }
        const supNode = this.refs.sup;

        if (supNode && dom.hasClass(supNode, `${prefix}badge-count`)) {
            let scrollNums = supNode.querySelectorAll(
                `.${prefix}badge-scroll-number-only`
            );

            if (scrollNums.length) {
                const height = window.getComputedStyle(supNode).height;

                scrollNums = [].slice.call(scrollNums, 0).reverse();

                getDigitArray(count).forEach((digit, i) => {
                    const position = this.getPositionByDigit(digit, i, revert);
                    const transformTo = -position * parseInt(height, 10);

                    removeTransition =
                        removeTransition ||
                        typeof getDigitArray(lastCount)[i] === 'undefined' ||
                        lastCount > overflowCount ||
                        lastCount <= 0;

                    const scrollStyle = support.animation
                        ? {
                              transition: removeTransition
                                  ? 'none'
                                  : 'transform .3s cubic-bezier(.645, .045, .355, 1), -webkit-transform .3s cubic-bezier(.645, .045, .355, 1)',
                              WebkitTransform: `translateY(${transformTo}px)`,
                              transform: `translateY(${transformTo}px)`,
                              height,
                              lineHeight: height,
                          }
                        : {
                              top: `${transformTo}px`,
                              height,
                              lineHeight: height,
                          };

                    Object.keys(scrollStyle).forEach(key => {
                        scrollNums[i].style[key] = scrollStyle[key];
                    });
                });
            }
        }
    }

    getPositionByDigit(digit, i, revert) {
        const { lastCount } = this.state;
        if (revert) {
            return 10 + digit;
        }
        const lastDigit = getDigitArray(lastCount)[i] || 0;

        if (this.props.count > lastCount) {
            return (digit >= lastDigit ? 10 : 20) + digit;
        }

        if (digit <= lastDigit) {
            return 10 + digit;
        }

        return digit;
    }

    render() {
        const {
            prefix,
            count,
            showZero,
            overflowCount,
            dot,
            style,
            content,
        } = this.props;

        const supClasses = classNames(`${prefix}badge-scroll-number`, {
            [`${prefix}badge-count`]: !!count || (count === 0 && showZero),
            [`${prefix}badge-dot`]: dot,
            [`${prefix}badge-custom`]: !!content,
        });

        let children = null;
        const show = dot || count > 0 || (count === 0 && showZero) || content;

        if (count > 0 || (count === 0 && showZero)) {
            const realCount =
                overflowCount > 0 && count > overflowCount
                    ? `${overflowCount}+`
                    : count;

            children = isNaN(realCount)
                ? realCount
                : Sup.renderNumber(prefix, count);
        } else if (content) {
            children = content;
        }

        const animation = {
            appear: 'zoomIn',
            enter: 'zoomIn',
            leave: 'zoomOut',
        };

        const wrapper = support.animation ? (
            <Animate animation={animation} />
        ) : (
            <span />
        );
        const element = show ? (
            <sup ref="sup" className={supClasses} style={style}>
                {children}
            </sup>
        ) : null;

        return React.cloneElement(wrapper, {}, element);
    }
}

export default polyfill(Sup);
