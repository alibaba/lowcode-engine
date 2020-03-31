import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ConfigProvider from '../../config-provider';
import Animate from '../../animate';
import Icon from '../../icon';
import Button from '../../button';
import { obj } from '../../util';

const { Expand } = Animate;
/** Timeline.Item */
class TimelineItem extends Component {
    static propTypes = {
        ...ConfigProvider.propTypes,
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
        animation: PropTypes.bool,
    };

    static defaultProps = {
        prefix: 'next-',
        state: 'done',
        toggleFold: () => {},
        animation: true,
    };

    toggleFold(folderIndex) {
        this.props.toggleFold(folderIndex);
    }

    beforeEnter = () => {
        this['timeline-item'].style['min-height'] = 'auto';
    };
    beforeLeave = () => {
        this['timeline-item'].style['min-height'] = '48px'; // timeleft 节点最小高度
    };
    render() {
        const {
            prefix,
            className,
            state,
            icon,
            dot,
            time,
            title,
            timeLeft,
            content,
            index,
            total,
            folderIndex,
            foldShow,
            locale,
            animation,
            ...others
        } = this.props;
        const finalItemNode = dot ? (
            dot
        ) : icon ? (
            <span className={`${prefix}timeline-item-icon`}>
                <Icon type={icon} size="xs" />
            </span>
        ) : (
            <span className={`${prefix}timeline-item-dot`} />
        );
        const itemCls = classNames({
            [`${prefix}timeline-item`]: true,
            [`${prefix}timeline-item-first`]: index === 0,
            [`${prefix}timeline-item-last`]: index === total - 1,
            [`${prefix}timeline-item-${state}`]: state,
            [`${prefix}timeline-item-folded`]: folderIndex,
            [`${prefix}timeline-item-unfolded`]: foldShow,
            [`${prefix}timeline-item-has-left-content`]: timeLeft,
            [className]: className,
        });
        const folderCls = classNames({
            [`${prefix}timeline-item-folder`]: true,
            [`${prefix}timeline-item-has-left-content`]: timeLeft,
        });
        const itemNodeCls = classNames({
            [`${prefix}timeline-item-node`]: true,
            [`${prefix}timeline-item-node-custom`]: dot,
        });
        const dotTailCls = classNames({
            [`${prefix}timeline-item-dot-tail`]: true,
            [`${prefix}timeline-item-dot-tail-solid`]: foldShow,
            [`${prefix}timeline-hide`]: index === total - 1 && foldShow,
        });

        const buttonProps = {
            text: true,
            size: 'small',
            type: 'primary',
            onClick: this.toggleFold.bind(this, folderIndex, total),
        };
        const timelineNode =
            (folderIndex && foldShow) || !folderIndex ? (
                <div
                    {...obj.pickOthers(TimelineItem.propTypes, others)}
                    className={itemCls}
                    ref={e => {
                        this['timeline-item'] = e;
                    }}
                >
                    <div className={`${prefix}timeline-item-left-content`}>
                        <p className={`${prefix}timeline-item-body`}>
                            {timeLeft}
                        </p>
                    </div>
                    <div className={`${prefix}timeline-item-timeline`}>
                        <div className={`${prefix}timeline-item-tail`}>
                            <i />
                        </div>
                        <div className={itemNodeCls}>{finalItemNode}</div>
                    </div>
                    <div className={`${prefix}timeline-item-content`}>
                        <div className={`${prefix}timeline-item-title`}>
                            {title}
                        </div>
                        <div className={`${prefix}timeline-item-body`}>
                            {content}
                        </div>
                        <div className={`${prefix}timeline-item-time`}>
                            {time}
                        </div>
                    </div>
                </div>
            ) : null;
        return (
            <li tabIndex="0">
                {animation && folderIndex ? (
                    <Expand
                        animationAppear={false}
                        beforeEnter={this.beforeEnter}
                        beforeLeave={this.beforeEnter}
                        afterEnter={this.beforeLeave}
                    >
                        {timelineNode}
                    </Expand>
                ) : (
                    timelineNode
                )}
                {folderIndex === index ? (
                    <div className={folderCls}>
                        <div className={dotTailCls} />
                        {foldShow ? (
                            <Button {...buttonProps}>
                                {locale.fold}
                                <Icon type="arrow-up" />
                            </Button>
                        ) : (
                            <Button {...buttonProps}>
                                {locale.expand}
                                <Icon type="arrow-down" />
                            </Button>
                        )}
                    </div>
                ) : null}
            </li>
        );
    }
}
export default TimelineItem;
