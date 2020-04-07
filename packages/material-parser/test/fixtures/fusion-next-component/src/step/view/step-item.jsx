import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../../icon';
import Progress from '../../progress';
import ConfigProvider from '../../config-provider';
import { support, events, dom } from '../../util';

/** Step.Item */
class StepItem extends Component {
    static propTypes = {
        prefix: PropTypes.string,
        rtl: PropTypes.bool,
        /**
         * 步骤的状态，如不传，会根据外层的 Step 的 current 属性生成，可选值为 `wait`, `process`, `finish`
         */
        status: PropTypes.oneOf(['wait', 'process', 'finish']),
        /**
         * 标题
         */
        title: PropTypes.node,
        direction: PropTypes.oneOf(['hoz', 'ver']),
        labelPlacement: PropTypes.oneOf(['hoz', 'ver']),
        shape: PropTypes.oneOf(['circle', 'arrow', 'dot']),
        /**
         * 图标
         */
        icon: PropTypes.string,
        /**
         * 内容填充, shape为 arrow 时无效
         */
        content: PropTypes.node,
        /**
         * StepItem 的自定义渲染, 会覆盖父节点设置的itemRender
         * @param {Number} index   节点索引
         * @param {String} status  节点状态
         * @returns {Node} 节点的渲染结果
         */
        itemRender: PropTypes.func,
        /**
         * 百分比
         */
        percent: PropTypes.number,
        index: PropTypes.number,
        total: PropTypes.number,
        animation: PropTypes.bool, // 是否开启动效，由父级传入
        /**
         * 是否禁用
         */
        disabled: PropTypes.bool,
        parentWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        parentHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        /**
         * 点击步骤时的回调
         * @param {Number} index 节点索引
         */
        onClick: PropTypes.func,
        /**
         * 自定义样式
         */
        className: PropTypes.string,
        readOnly: PropTypes.bool,
    };

    static defaultProps = {
        shape: 'circle',
        index: 0,
        total: 1,
        onClick: () => {},
    };

    constructor(props) {
        super(props);
        this.removeClickedCls = this.removeClickedCls.bind(this);
        this._refHandlerCreator = this._refHandlerCreator.bind(this);
        this.resize = this.resize.bind(this);
    }

    componentDidMount() {
        const { shape, direction, labelPlacement, index, total } = this.props;
        if (shape === 'arrow') {
            return;
        }

        if (direction === 'vertical' || direction === 'ver') {
            this.resize();
            this.forceUpdate(); // 解决Step嵌套的情况下，嵌套节点宽度为0的问题
            this.eventHandler = events.on(window, 'resize', this.resize); // 调整垂直Step
        } else if (
            (direction === 'horizontal' || direction === 'hoz') &&
            (labelPlacement === 'horizontal' || labelPlacement === 'hoz') &&
            index !== total - 1
        ) {
            // 调整横向Content
            this.adjustTail();
        }
    }

    componentDidUpdate() {
        const {
            shape,
            direction,
            labelPlacement,
            index,
            total,
            rtl,
        } = this.props;
        if (shape === 'arrow') {
            return;
        }
        const resetTailStyle = () => {
            dom.setStyle(this.tail, {
                width: '',
                // eslint-disable-next-line
                top: '',
            });
        };

        if (direction === 'vertical' || direction === 'ver') {
            this.resize();
        } else if (direction === 'horizontal' || direction === 'hoz') {
            const pos = rtl ? 'right' : 'left';
            dom.setStyle(this.body, {
                width: '',
                [pos]: '',
            });
            if (
                shape === 'circle' &&
                (labelPlacement === 'horizontal' || labelPlacement === 'hoz') &&
                index !== total - 1
            ) {
                // 调整横向Content
                this.adjustTail();
            } else {
                resetTailStyle();
            }
        } else if (index !== total - 1) {
            resetTailStyle();
        }
    }

    componentWillUnmount() {
        this.eventHandler && this.eventHandler.off();
    }

    adjustTail() {
        const width = this.container.offsetWidth + this.title.offsetWidth;
        dom.setStyle(this.tail, {
            width: `calc(100% - ${width}px)`,
            top: `${dom.getStyle(this.container, 'height') / 2}px`,
        });
    }

    resize() {
        const stepWidth = dom.getStyle(this.step, 'width');
        const { rtl } = this.props;

        rtl
            ? (this.body.style.right = `${stepWidth}px`)
            : (this.body.style.left = `${stepWidth}px`);
        dom.setStyle(this.body, {
            width:
                dom.getStyle(this.step.parentNode.parentNode, 'width') -
                stepWidth,
        });
        dom.setStyle(
            this.tail,
            'height',
            dom.getStyle(this.body, 'height') -
                dom.getStyle(this.container, 'height')
        );
    }

    _getNode() {
        const {
            prefix,
            index,
            status,
            icon,
            shape,
            percent,
            itemRender,
        } = this.props;
        let nodeElement = icon;
        if (shape === 'dot') {
            nodeElement = icon ? (
                <Icon type={icon} />
            ) : (
                <div className={`${prefix}step-item-node-dot`}> </div>
            );
        } else if (shape === 'circle' && percent) {
            nodeElement = (
                <Progress
                    shape="circle"
                    percent={percent}
                    className={`${prefix}step-item-progress`}
                />
            );
        } else if (
            shape === 'circle' &&
            !!itemRender &&
            typeof itemRender === 'function'
        ) {
            nodeElement = null; // 如果是需要自定义节点，则不处理，返回空
        } else {
            nodeElement = (
                <div className={`${prefix}step-item-node-circle`}>
                    {icon ? (
                        <Icon type={icon} />
                    ) : (
                        this._itemRender(index, status)
                    )}
                </div>
            );
        }

        return nodeElement;
    }
    getNode(args) {
        const {
            prefix,
            itemRender,
            index,
            status,
            title,
            content,
            shape,
        } = this.props;
        const { others, stepCls, overlayCls } = args;
        const nodeElement = this._getNode();
        let finalNodeElement = (
            <div
                className={`${prefix}step-item-container`}
                ref={this._refHandlerCreator('container')}
            >
                <div
                    className={`${prefix}step-item-node-placeholder`}
                    onClick={this.onClick}
                >
                    <div
                        className={`${prefix}step-item-node`}
                        ref={this._refHandlerCreator('stepNode')}
                        onTransitionEnd={this.removeClickedCls}
                    >
                        {nodeElement}
                    </div>
                </div>
            </div>
        );

        if (!nodeElement) {
            // 需要自定义子节点
            finalNodeElement = (
                <div className={`${prefix}step-item-container`}>
                    <div
                        className={`${prefix}step-item-node-placeholder`}
                        onClick={this.onClick}
                    >
                        {itemRender(index, status, title, content)}
                    </div>
                </div>
            );
        }
        if (shape !== 'arrow') {
            delete others.tabIndex;
            delete others['aria-current'];
        }

        return (
            <li
                {...others}
                style={this.getStyle()}
                className={stepCls}
                ref={this._refHandlerCreator('step')}
            >
                {finalNodeElement}
                <div
                    className={`${prefix}step-item-body`}
                    ref={this._refHandlerCreator('body')}
                    tabIndex={this.props.tabIndex}
                    aria-current={this.props['aria-current']}
                >
                    <div
                        className={`${prefix}step-item-title`}
                        ref={this._refHandlerCreator('title')}
                    >
                        {title}
                    </div>
                    <div className={`${prefix}step-item-content`}>
                        {content}
                    </div>
                </div>
                <div
                    className={`${prefix}step-item-tail`}
                    ref={this._refHandlerCreator('tail')}
                >
                    <div className={`${prefix}step-item-tail-underlay`}>
                        <div
                            className={`${prefix}step-item-tail-overlay`}
                            style={overlayCls}
                        />
                    </div>
                </div>
            </li>
        );
    }

    getStyle() {
        const {
            parentWidth,
            parentHeight,
            direction,
            total,
            index,
            shape,
        } = this.props;
        let width = 'auto';

        if (Number(parentWidth) && Number(parentHeight)) {
            if (!support.flex && shape === 'arrow') {
                width = Math.floor(
                    parentWidth / total - parentHeight / 2 - parentHeight / 8
                );
            }
        }
        if (
            shape !== 'arrow' &&
            (direction === 'horizontal' || direction === 'hoz')
        ) {
            width =
                total - 1 !== index ? `${Math.floor(100 / total)}%` : 'auto';
        }
        return {
            width: width,
        };
    }

    onClick = () => {
        const { index, disabled, readOnly, animation } = this.props;
        if (disabled || readOnly) {
            return false;
        }

        if (animation && this.stepNode) {
            dom.hasClass(this.stepNode, 'clicked')
                ? dom.removeClass(this.stepNode, 'clicked')
                : dom.addClass(this.stepNode, 'clicked');
        }
        this.props.onClick(index);
    };

    removeClickedCls() {
        const { animation } = this.props;
        if (
            animation &&
            this.stepNode &&
            dom.hasClass(this.stepNode, 'clicked')
        ) {
            dom.removeClass(this.stepNode, 'clicked');
        }
    }

    // 节点的渲染方法
    _itemRender(index, status) {
        const { itemRender } = this.props;
        if (itemRender) {
            return itemRender(index, status);
        }
        return status === 'finish' ? <Icon type="select" /> : index + 1;
    }

    _refHandlerCreator(refName) {
        const self = this;
        return function(ref) {
            self[refName] = ref;
        };
    }

    render() {
        // eslint-disable-next-line
        const {
            prefix,
            locale,
            className,
            status,
            title,
            icon,
            index,
            total,
            shape,
            content,
            direction,
            disabled,
            onClick,
            readOnly,
            animation,
            parentHeight,
            itemRender,
            parentWidth,
            labelPlacement,
            rtl,
            ...others
        } = this.props;

        const stepCls = classNames({
            [`${prefix}step-item`]: true,
            [`${prefix}step-item-${status}`]: status,
            [`${prefix}step-item-first`]: index === 0,
            [`${prefix}step-item-last`]: index === total - 1,
            [`${prefix}step-item-disabled`]: disabled,
            [`${prefix}step-item-read-only`]: readOnly,
            [className]: className,
        });

        const overlayCls = status === 'finish' ? { width: '100%' } : null;
        const arrowElement = (
            <li
                {...others}
                style={this.getStyle()}
                className={stepCls}
                onClick={this.onClick}
            >
                <div className={`${prefix}step-item-container`}>
                    <div className={`${prefix}step-item-title`}>{title}</div>
                </div>
            </li>
        );
        const otherElement = this.getNode({ others, stepCls, overlayCls });

        return shape === 'arrow' ? arrowElement : otherElement;
    }
}
export default ConfigProvider.config(StepItem);
