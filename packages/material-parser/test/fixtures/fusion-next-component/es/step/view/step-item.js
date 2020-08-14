import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../../icon';
import Progress from '../../progress';
import ConfigProvider from '../../config-provider';
import { support, events, dom } from '../../util';

/** Step.Item */
var StepItem = (_temp = _class = function (_Component) {
    _inherits(StepItem, _Component);

    function StepItem(props) {
        _classCallCheck(this, StepItem);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        _this.onClick = function () {
            var _this$props = _this.props,
                index = _this$props.index,
                disabled = _this$props.disabled,
                readOnly = _this$props.readOnly,
                animation = _this$props.animation;

            if (disabled || readOnly) {
                return false;
            }

            if (animation && _this.stepNode) {
                dom.hasClass(_this.stepNode, 'clicked') ? dom.removeClass(_this.stepNode, 'clicked') : dom.addClass(_this.stepNode, 'clicked');
            }
            _this.props.onClick(index);
        };

        _this.removeClickedCls = _this.removeClickedCls.bind(_this);
        _this._refHandlerCreator = _this._refHandlerCreator.bind(_this);
        _this.resize = _this.resize.bind(_this);
        return _this;
    }

    StepItem.prototype.componentDidMount = function componentDidMount() {
        var _props = this.props,
            shape = _props.shape,
            direction = _props.direction,
            labelPlacement = _props.labelPlacement,
            index = _props.index,
            total = _props.total;

        if (shape === 'arrow') {
            return;
        }

        if (direction === 'vertical' || direction === 'ver') {
            this.resize();
            this.forceUpdate(); // 解决Step嵌套的情况下，嵌套节点宽度为0的问题
            this.eventHandler = events.on(window, 'resize', this.resize); // 调整垂直Step
        } else if ((direction === 'horizontal' || direction === 'hoz') && (labelPlacement === 'horizontal' || labelPlacement === 'hoz') && index !== total - 1) {
            // 调整横向Content
            this.adjustTail();
        }
    };

    StepItem.prototype.componentDidUpdate = function componentDidUpdate() {
        var _this2 = this;

        var _props2 = this.props,
            shape = _props2.shape,
            direction = _props2.direction,
            labelPlacement = _props2.labelPlacement,
            index = _props2.index,
            total = _props2.total,
            rtl = _props2.rtl;

        if (shape === 'arrow') {
            return;
        }
        var resetTailStyle = function resetTailStyle() {
            dom.setStyle(_this2.tail, {
                width: '',
                // eslint-disable-next-line
                top: ''
            });
        };

        if (direction === 'vertical' || direction === 'ver') {
            this.resize();
        } else if (direction === 'horizontal' || direction === 'hoz') {
            var _dom$setStyle;

            var pos = rtl ? 'right' : 'left';
            dom.setStyle(this.body, (_dom$setStyle = {
                width: ''
            }, _dom$setStyle[pos] = '', _dom$setStyle));
            if (shape === 'circle' && (labelPlacement === 'horizontal' || labelPlacement === 'hoz') && index !== total - 1) {
                // 调整横向Content
                this.adjustTail();
            } else {
                resetTailStyle();
            }
        } else if (index !== total - 1) {
            resetTailStyle();
        }
    };

    StepItem.prototype.componentWillUnmount = function componentWillUnmount() {
        this.eventHandler && this.eventHandler.off();
    };

    StepItem.prototype.adjustTail = function adjustTail() {
        var width = this.container.offsetWidth + this.title.offsetWidth;
        dom.setStyle(this.tail, {
            width: 'calc(100% - ' + width + 'px)',
            top: dom.getStyle(this.container, 'height') / 2 + 'px'
        });
    };

    StepItem.prototype.resize = function resize() {
        var stepWidth = dom.getStyle(this.step, 'width');
        var rtl = this.props.rtl;


        rtl ? this.body.style.right = stepWidth + 'px' : this.body.style.left = stepWidth + 'px';
        dom.setStyle(this.body, {
            width: dom.getStyle(this.step.parentNode.parentNode, 'width') - stepWidth
        });
        dom.setStyle(this.tail, 'height', dom.getStyle(this.body, 'height') - dom.getStyle(this.container, 'height'));
    };

    StepItem.prototype._getNode = function _getNode() {
        var _props3 = this.props,
            prefix = _props3.prefix,
            index = _props3.index,
            status = _props3.status,
            icon = _props3.icon,
            shape = _props3.shape,
            percent = _props3.percent,
            itemRender = _props3.itemRender;

        var nodeElement = icon;
        if (shape === 'dot') {
            nodeElement = icon ? React.createElement(Icon, { type: icon }) : React.createElement(
                'div',
                { className: prefix + 'step-item-node-dot' },
                ' '
            );
        } else if (shape === 'circle' && percent) {
            nodeElement = React.createElement(Progress, {
                shape: 'circle',
                percent: percent,
                className: prefix + 'step-item-progress'
            });
        } else if (shape === 'circle' && !!itemRender && typeof itemRender === 'function') {
            nodeElement = null; // 如果是需要自定义节点，则不处理，返回空
        } else {
            nodeElement = React.createElement(
                'div',
                { className: prefix + 'step-item-node-circle' },
                icon ? React.createElement(Icon, { type: icon }) : this._itemRender(index, status)
            );
        }

        return nodeElement;
    };

    StepItem.prototype.getNode = function getNode(args) {
        var _props4 = this.props,
            prefix = _props4.prefix,
            itemRender = _props4.itemRender,
            index = _props4.index,
            status = _props4.status,
            title = _props4.title,
            content = _props4.content,
            shape = _props4.shape;
        var others = args.others,
            stepCls = args.stepCls,
            overlayCls = args.overlayCls;

        var nodeElement = this._getNode();
        var finalNodeElement = React.createElement(
            'div',
            {
                className: prefix + 'step-item-container',
                ref: this._refHandlerCreator('container')
            },
            React.createElement(
                'div',
                {
                    className: prefix + 'step-item-node-placeholder',
                    onClick: this.onClick
                },
                React.createElement(
                    'div',
                    {
                        className: prefix + 'step-item-node',
                        ref: this._refHandlerCreator('stepNode'),
                        onTransitionEnd: this.removeClickedCls
                    },
                    nodeElement
                )
            )
        );

        if (!nodeElement) {
            // 需要自定义子节点
            finalNodeElement = React.createElement(
                'div',
                { className: prefix + 'step-item-container' },
                React.createElement(
                    'div',
                    {
                        className: prefix + 'step-item-node-placeholder',
                        onClick: this.onClick
                    },
                    itemRender(index, status, title, content)
                )
            );
        }
        if (shape !== 'arrow') {
            delete others.tabIndex;
            delete others['aria-current'];
        }

        return React.createElement(
            'li',
            _extends({}, others, {
                style: this.getStyle(),
                className: stepCls,
                ref: this._refHandlerCreator('step')
            }),
            finalNodeElement,
            React.createElement(
                'div',
                {
                    className: prefix + 'step-item-body',
                    ref: this._refHandlerCreator('body'),
                    tabIndex: this.props.tabIndex,
                    'aria-current': this.props['aria-current']
                },
                React.createElement(
                    'div',
                    {
                        className: prefix + 'step-item-title',
                        ref: this._refHandlerCreator('title')
                    },
                    title
                ),
                React.createElement(
                    'div',
                    { className: prefix + 'step-item-content' },
                    content
                )
            ),
            React.createElement(
                'div',
                {
                    className: prefix + 'step-item-tail',
                    ref: this._refHandlerCreator('tail')
                },
                React.createElement(
                    'div',
                    { className: prefix + 'step-item-tail-underlay' },
                    React.createElement('div', {
                        className: prefix + 'step-item-tail-overlay',
                        style: overlayCls
                    })
                )
            )
        );
    };

    StepItem.prototype.getStyle = function getStyle() {
        var _props5 = this.props,
            parentWidth = _props5.parentWidth,
            parentHeight = _props5.parentHeight,
            direction = _props5.direction,
            total = _props5.total,
            index = _props5.index,
            shape = _props5.shape;

        var width = 'auto';

        if (Number(parentWidth) && Number(parentHeight)) {
            if (!support.flex && shape === 'arrow') {
                width = Math.floor(parentWidth / total - parentHeight / 2 - parentHeight / 8);
            }
        }
        if (shape !== 'arrow' && (direction === 'horizontal' || direction === 'hoz')) {
            width = total - 1 !== index ? Math.floor(100 / total) + '%' : 'auto';
        }
        return {
            width: width
        };
    };

    StepItem.prototype.removeClickedCls = function removeClickedCls() {
        var animation = this.props.animation;

        if (animation && this.stepNode && dom.hasClass(this.stepNode, 'clicked')) {
            dom.removeClass(this.stepNode, 'clicked');
        }
    };

    // 节点的渲染方法


    StepItem.prototype._itemRender = function _itemRender(index, status) {
        var itemRender = this.props.itemRender;

        if (itemRender) {
            return itemRender(index, status);
        }
        return status === 'finish' ? React.createElement(Icon, { type: 'select' }) : index + 1;
    };

    StepItem.prototype._refHandlerCreator = function _refHandlerCreator(refName) {
        var self = this;
        return function (ref) {
            self[refName] = ref;
        };
    };

    StepItem.prototype.render = function render() {
        var _classNames;

        // eslint-disable-next-line
        var _props6 = this.props,
            prefix = _props6.prefix,
            locale = _props6.locale,
            className = _props6.className,
            status = _props6.status,
            title = _props6.title,
            icon = _props6.icon,
            index = _props6.index,
            total = _props6.total,
            shape = _props6.shape,
            content = _props6.content,
            direction = _props6.direction,
            disabled = _props6.disabled,
            onClick = _props6.onClick,
            readOnly = _props6.readOnly,
            animation = _props6.animation,
            parentHeight = _props6.parentHeight,
            itemRender = _props6.itemRender,
            parentWidth = _props6.parentWidth,
            labelPlacement = _props6.labelPlacement,
            rtl = _props6.rtl,
            others = _objectWithoutProperties(_props6, ['prefix', 'locale', 'className', 'status', 'title', 'icon', 'index', 'total', 'shape', 'content', 'direction', 'disabled', 'onClick', 'readOnly', 'animation', 'parentHeight', 'itemRender', 'parentWidth', 'labelPlacement', 'rtl']);

        var stepCls = classNames((_classNames = {}, _classNames[prefix + 'step-item'] = true, _classNames[prefix + 'step-item-' + status] = status, _classNames[prefix + 'step-item-first'] = index === 0, _classNames[prefix + 'step-item-last'] = index === total - 1, _classNames[prefix + 'step-item-disabled'] = disabled, _classNames[prefix + 'step-item-read-only'] = readOnly, _classNames[className] = className, _classNames));

        var overlayCls = status === 'finish' ? { width: '100%' } : null;
        var arrowElement = React.createElement(
            'li',
            _extends({}, others, {
                style: this.getStyle(),
                className: stepCls,
                onClick: this.onClick
            }),
            React.createElement(
                'div',
                { className: prefix + 'step-item-container' },
                React.createElement(
                    'div',
                    { className: prefix + 'step-item-title' },
                    title
                )
            )
        );
        var otherElement = this.getNode({ others: others, stepCls: stepCls, overlayCls: overlayCls });

        return shape === 'arrow' ? arrowElement : otherElement;
    };

    return StepItem;
}(Component), _class.propTypes = {
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
    readOnly: PropTypes.bool
}, _class.defaultProps = {
    shape: 'circle',
    index: 0,
    total: 1,
    onClick: function onClick() {}
}, _temp);
StepItem.displayName = 'StepItem';

export default ConfigProvider.config(StepItem);