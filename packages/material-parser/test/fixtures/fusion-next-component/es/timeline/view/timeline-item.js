import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp2;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ConfigProvider from '../../config-provider';
import Animate from '../../animate';
import Icon from '../../icon';
import Button from '../../button';
import { obj } from '../../util';

var Expand = Animate.Expand;
/** Timeline.Item */

var TimelineItem = (_temp2 = _class = function (_Component) {
    _inherits(TimelineItem, _Component);

    function TimelineItem() {
        var _temp, _this, _ret;

        _classCallCheck(this, TimelineItem);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _Component.call.apply(_Component, [this].concat(args))), _this), _this.beforeEnter = function () {
            _this['timeline-item'].style['min-height'] = 'auto';
        }, _this.beforeLeave = function () {
            _this['timeline-item'].style['min-height'] = '48px'; // timeleft 节点最小高度
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    TimelineItem.prototype.toggleFold = function toggleFold(folderIndex) {
        this.props.toggleFold(folderIndex);
    };

    TimelineItem.prototype.render = function render() {
        var _classNames,
            _classNames2,
            _classNames3,
            _classNames4,
            _this2 = this;

        var _props = this.props,
            prefix = _props.prefix,
            className = _props.className,
            state = _props.state,
            icon = _props.icon,
            dot = _props.dot,
            time = _props.time,
            title = _props.title,
            timeLeft = _props.timeLeft,
            content = _props.content,
            index = _props.index,
            total = _props.total,
            folderIndex = _props.folderIndex,
            foldShow = _props.foldShow,
            locale = _props.locale,
            animation = _props.animation,
            others = _objectWithoutProperties(_props, ['prefix', 'className', 'state', 'icon', 'dot', 'time', 'title', 'timeLeft', 'content', 'index', 'total', 'folderIndex', 'foldShow', 'locale', 'animation']);

        var finalItemNode = dot ? dot : icon ? React.createElement(
            'span',
            { className: prefix + 'timeline-item-icon' },
            React.createElement(Icon, { type: icon, size: 'xs' })
        ) : React.createElement('span', { className: prefix + 'timeline-item-dot' });
        var itemCls = classNames((_classNames = {}, _classNames[prefix + 'timeline-item'] = true, _classNames[prefix + 'timeline-item-first'] = index === 0, _classNames[prefix + 'timeline-item-last'] = index === total - 1, _classNames[prefix + 'timeline-item-' + state] = state, _classNames[prefix + 'timeline-item-folded'] = folderIndex, _classNames[prefix + 'timeline-item-unfolded'] = foldShow, _classNames[prefix + 'timeline-item-has-left-content'] = timeLeft, _classNames[className] = className, _classNames));
        var folderCls = classNames((_classNames2 = {}, _classNames2[prefix + 'timeline-item-folder'] = true, _classNames2[prefix + 'timeline-item-has-left-content'] = timeLeft, _classNames2));
        var itemNodeCls = classNames((_classNames3 = {}, _classNames3[prefix + 'timeline-item-node'] = true, _classNames3[prefix + 'timeline-item-node-custom'] = dot, _classNames3));
        var dotTailCls = classNames((_classNames4 = {}, _classNames4[prefix + 'timeline-item-dot-tail'] = true, _classNames4[prefix + 'timeline-item-dot-tail-solid'] = foldShow, _classNames4[prefix + 'timeline-hide'] = index === total - 1 && foldShow, _classNames4));

        var buttonProps = {
            text: true,
            size: 'small',
            type: 'primary',
            onClick: this.toggleFold.bind(this, folderIndex, total)
        };
        var timelineNode = folderIndex && foldShow || !folderIndex ? React.createElement(
            'div',
            _extends({}, obj.pickOthers(TimelineItem.propTypes, others), {
                className: itemCls,
                ref: function ref(e) {
                    _this2['timeline-item'] = e;
                }
            }),
            React.createElement(
                'div',
                { className: prefix + 'timeline-item-left-content' },
                React.createElement(
                    'p',
                    { className: prefix + 'timeline-item-body' },
                    timeLeft
                )
            ),
            React.createElement(
                'div',
                { className: prefix + 'timeline-item-timeline' },
                React.createElement(
                    'div',
                    { className: prefix + 'timeline-item-tail' },
                    React.createElement('i', null)
                ),
                React.createElement(
                    'div',
                    { className: itemNodeCls },
                    finalItemNode
                )
            ),
            React.createElement(
                'div',
                { className: prefix + 'timeline-item-content' },
                React.createElement(
                    'div',
                    { className: prefix + 'timeline-item-title' },
                    title
                ),
                React.createElement(
                    'div',
                    { className: prefix + 'timeline-item-body' },
                    content
                ),
                React.createElement(
                    'div',
                    { className: prefix + 'timeline-item-time' },
                    time
                )
            )
        ) : null;
        return React.createElement(
            'li',
            { tabIndex: '0' },
            animation && folderIndex ? React.createElement(
                Expand,
                {
                    animationAppear: false,
                    beforeEnter: this.beforeEnter,
                    beforeLeave: this.beforeEnter,
                    afterEnter: this.beforeLeave
                },
                timelineNode
            ) : timelineNode,
            folderIndex === index ? React.createElement(
                'div',
                { className: folderCls },
                React.createElement('div', { className: dotTailCls }),
                foldShow ? React.createElement(
                    Button,
                    buttonProps,
                    locale.fold,
                    React.createElement(Icon, { type: 'arrow-up' })
                ) : React.createElement(
                    Button,
                    buttonProps,
                    locale.expand,
                    React.createElement(Icon, { type: 'arrow-down' })
                )
            ) : null
        );
    };

    return TimelineItem;
}(Component), _class.propTypes = _extends({}, ConfigProvider.propTypes, {
    prefix: PropTypes.string,
    index: PropTypes.number,
    total: PropTypes.number,
    folderIndex: PropTypes.number,
    foldShow: PropTypes.bool,
    /**
     * 节点状态
     */
    state: PropTypes.oneOf(['done', 'process', 'error', 'success']),
    /**
     * 图标
     */
    icon: PropTypes.string,
    /**
     * 自定义时间轴节点
     */
    dot: PropTypes.node,
    /**
     * 格式化后的时间
     */
    time: PropTypes.node,
    /**
     * 标题
     */
    title: PropTypes.node,
    /**
     * 左侧时间
     */
    timeLeft: PropTypes.node,
    /**
     * 右侧内容
     */
    content: PropTypes.node,
    toggleFold: PropTypes.func,
    className: PropTypes.string,
    locale: PropTypes.object,
    /**
     * 动画
     */
    animation: PropTypes.bool
}), _class.defaultProps = {
    prefix: 'next-',
    state: 'done',
    toggleFold: function toggleFold() {},
    animation: true
}, _temp2);
TimelineItem.displayName = 'TimelineItem';

export default TimelineItem;