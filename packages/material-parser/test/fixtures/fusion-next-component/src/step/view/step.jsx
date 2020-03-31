import React, { Component, Children } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { support, events, dom } from '../../util';

const getHeight = el => dom.getStyle(el, 'height');
const setHeight = (el, height) => dom.setStyle(el, 'height', height);

/** Step */
export default class Step extends Component {
    static propTypes = {
        prefix: PropTypes.string,
        rtl: PropTypes.bool,
        /**
         * 当前步骤
         */
        current: PropTypes.number,
        /**
         * 展示方向
         */
        direction: PropTypes.oneOf(['hoz', 'ver']),
        /**
         * 横向布局时( direction 为 hoz )的内容排列
         */
        labelPlacement: PropTypes.oneOf(['hoz', 'ver']),
        /**
         * 类型
         */
        shape: PropTypes.oneOf(['circle', 'arrow', 'dot']),
        /**
         * 是否只读模式
         */
        readOnly: PropTypes.bool,
        /**
         * 是否开启动效
         */
        animation: PropTypes.bool,
        /**
         * 自定义样式名
         */
        className: PropTypes.string,
        /**
         * StepItem 的自定义渲染
         * @param {Number} index   节点索引
         * @param {String} status  节点状态
         * @returns {Node} 节点的渲染结果
         */
        itemRender: PropTypes.func,
    };

    static defaultProps = {
        prefix: 'next-',
        current: 0,
        direction: 'hoz',
        labelPlacement: 'ver',
        shape: 'circle',
        animation: true,
        itemRender: null,
    };

    static contextTypes = {
        prefix: PropTypes.string,
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            parentWidth: 'auto',
            parentHeight: 'auto',
            currentfocus: 0,
        };
        this.resize = this.resize.bind(this);
    }

    componentDidMount() {
        /* istanbul ignore if */
        if (!support.flex) {
            this.resize();
            events.on(window, 'resize', this.resize);
        }
        this.adjustHeight();
    }

    componentWillReceiveProps(newProps) {
        if ('current' in newProps) {
            this.setState({
                current: newProps.current,
            });
        }
    }

    componentDidUpdate() {
        this.adjustHeight();
    }

    componentWillUnmount() {
        /* istanbul ignore if */
        if (!support.flex) {
            events.off(window, 'resize', this.resize);
        }
    }

    adjustHeight() {
        const { shape, direction, prefix, labelPlacement } = this.props;
        if (
            shape !== 'arrow' &&
            (direction === 'horizontal' || direction === 'hoz') &&
            (labelPlacement === 'vertical' || labelPlacement === 'ver')
        ) {
            const step = ReactDOM.findDOMNode(this.step);
            // just resize when init
            if (step.style.height) return;
            const height = Array.prototype.slice
                .call(step.getElementsByClassName(`${prefix}step-item`))
                .reduce((ret, re) => {
                    const itemHeight =
                        getHeight(re) +
                        getHeight(
                            re.getElementsByClassName(
                                `${prefix}step-item-body`
                            )[0]
                        );
                    return Math.max(itemHeight, ret);
                }, 0);
            setHeight(step, height);
        }
    }

    resize() {
        if (this.step) {
            this.setState({
                parentWidth: this.step.offsetWidth || 0,
                parentHeight: this.step.offsetHeight || 0,
            });
        }
    }

    // set dir key for aria handle
    // handleKeyDown = e => {
    //     const { shape, children } = this.props;
    //     const { length: max } = children;
    //     let { currentfocus } = this.state;
    //     const initPosition = currentfocus;
    //     switch (e.keyCode) {
    //         case KEYCODE.RIGHT:
    //         case KEYCODE.DOWN:
    //             currentfocus++;
    //             break;
    //         case KEYCODE.LEFT:
    //         case KEYCODE.UP:
    //             currentfocus--;
    //             break;
    //         default:
    //             break;
    //     }
    //     currentfocus =
    //         currentfocus >= max ? 0 : currentfocus < 0 ? max - 1 : currentfocus;
    //     this.setState({ currentfocus }, () => {
    //         const child = this.step.children[currentfocus];
    //         if (!child) return;
    //         const focusItem =
    //             shape === 'arrow'
    //                 ? child
    //                 : child.querySelector('.next-step-item-body');
    //         focusItem && focusItem.focus();
    //     });
    //     if (initPosition !== currentfocus) {
    //         e.preventDefault();
    //     }
    // };

    _getValidChildren(children) {
        const result = [];
        React.Children.forEach(children, child => {
            if (React.isValidElement(child)) {
                result.push(child);
            }
        });
        return result;
    }

    _stepRefHandler = ref => {
        this.step = ref;
    };

    render() {
        // eslint-disable-next-line
        const {
            className,
            current,
            labelPlacement,
            shape,
            readOnly,
            animation,
            itemRender,
            rtl,
            ...others
        } = this.props;
        let { prefix, direction, children } = this.props;
        prefix = this.context.prefix || prefix;
        const { parentWidth, parentHeight } = this.state;

        // type不同对应的direction不同
        direction = shape === 'arrow' ? 'hoz' : direction;

        // children去除null
        children = this._getValidChildren(children);

        // 修改子节点属性
        const cloneChildren = Children.map(children, (child, index) => {
            const status =
                index < current
                    ? 'finish'
                    : index === current
                    ? 'process'
                    : 'wait';

            return React.cloneElement(child, {
                prefix,
                key: index,
                index,
                total: children.length,
                status: child.props.status || status,
                shape,
                direction,
                labelPlacement,
                parentWidth,
                parentHeight,
                readOnly,
                animation,
                tabIndex: 0,
                // tabIndex: this.state.currentfocus === index ? '0' : '-1',
                'aria-current': status === 'process' ? 'step' : null,
                itemRender: child.props.itemRender
                    ? child.props.itemRender
                    : itemRender, // 优先使用Item的itemRender
            });
        });

        const _direction =
            direction === 'ver' || direction === 'vertical'
                ? 'vertical'
                : 'horizontal';
        const _labelPlacement =
            labelPlacement === 'ver' || labelPlacement === 'vertical'
                ? 'vertical'
                : 'horizontal';
        const stepCls = classNames({
            [`${prefix}step`]: true,
            [`${prefix}step-${shape}`]: shape,
            [`${prefix}step-${_direction}`]: _direction,
            [`${prefix}step-label-${_labelPlacement}`]: _labelPlacement,
            [className]: className,
        });

        if (rtl) {
            others.dir = 'rtl';
        }

        // others.onKeyDown = makeChain(this.handleKeyDown, others.onKeyDown);

        return (
            <ol {...others} className={stepCls} ref={this._stepRefHandler}>
                {cloneChildren}
            </ol>
        );
    }
}
