import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Overlay from '../overlay';
import ConfigProvider from '../config-provider';
import { obj, func } from '../util';

/* eslint-disable react/prefer-stateless-function */

/** Loading */
class Loading extends React.Component {
    static propTypes = {
        /**
         * 样式前缀
         */
        prefix: PropTypes.string,
        /**
         * 自定义内容
         */
        tip: PropTypes.any,
        /**
         * 自定义内容位置
         * @enumdesc 出现在动画右边, 出现在动画下面
         */
        tipAlign: PropTypes.oneOf(['right', 'bottom']),
        /**
         * loading 状态, 默认 true
         */
        visible: PropTypes.bool,
        onVisibleChange: PropTypes.func,
        /**
         * 自定义class
         */
        className: PropTypes.string,
        /**
         * 自定义内联样式
         */
        style: PropTypes.object,
        /**
         * 设置动画尺寸
         * @description 仅仅对默认动画效果起作用
         * @enumdesc 大号, 中号
         */
        size: PropTypes.oneOf(['large', 'medium']),
        /**
         * 自定义动画
         */
        indicator: PropTypes.any,
        /**
         * 动画颜色
         */
        color: PropTypes.string,
        /**
         * 全屏展示
         */
        fullScreen: PropTypes.bool,
        /**
         * 子元素
         */
        children: PropTypes.any,
        /**
         * should loader be displayed inline
         */
        inline: PropTypes.bool,
        rtl: PropTypes.bool,
    };

    static defaultProps = {
        prefix: 'next-',
        visible: true,
        onVisibleChange: func.noop,
        animate: null,
        tipAlign: 'bottom',
        size: 'large',
        inline: true,
    };

    render() {
        const {
            tip,
            visible,
            children,
            className,
            style,
            indicator,
            color,
            prefix,
            fullScreen,
            onVisibleChange,
            tipAlign,
            size,
            inline,
            rtl,
        } = this.props;

        let indicatorDom = null;
        const dotCls = `${prefix}loading-dot`;

        if (indicator) {
            indicatorDom = indicator;
        } else {
            const backgroundColor = color;
            const fusionReactorCls = classNames({
                [`${prefix}loading-fusion-reactor`]: true,
                [`${prefix}loading-medium-fusion-reactor`]: size === 'medium',
            });
            indicatorDom = (
                <div className={fusionReactorCls} dir={rtl ? 'rtl' : undefined}>
                    <span className={dotCls} style={{ backgroundColor }} />
                    <span className={dotCls} style={{ backgroundColor }} />
                    <span className={dotCls} style={{ backgroundColor }} />
                    <span className={dotCls} style={{ backgroundColor }} />
                </div>
            );
        }

        const loadingCls = classNames({
            [`${prefix}loading`]: true,
            [`${prefix}open`]: visible,
            [`${prefix}loading-inline`]: inline,
            [className]: className,
        });

        const tipCls = classNames({
            [`${prefix}loading-tip`]: true,
            [`${prefix}loading-tip-fullscreen`]: fullScreen,
            // 默认非 right就是 bottom
            [`${prefix}loading-right-tip`]: tipAlign === 'right',
        });

        const others = obj.pickOthers(Loading.propTypes, this.props);

        const contentCls = classNames({
            [`${prefix}loading-component`]: visible,
            [`${prefix}loading-wrap`]: true,
        });

        return fullScreen ? (
            [
                children,
                <Overlay
                    key="overlay"
                    hasMask
                    align="cc cc"
                    {...others}
                    className={className}
                    style={style}
                    visible={visible}
                    onRequestClose={onVisibleChange}
                >
                    <div className={tipCls}>
                        <div className={`${prefix}loading-indicator`}>
                            {indicatorDom}
                        </div>
                        <div className={`${prefix}loading-tip-content`}>
                            {tip}
                        </div>
                        {/* 由于撑开问题 使用同样的两个DOM */}
                        <div className={`${prefix}loading-tip-placeholder`}>
                            {tip}
                        </div>
                    </div>
                </Overlay>,
            ]
        ) : (
            <div className={loadingCls} style={style} {...others}>
                {visible ? (
                    <div className={tipCls}>
                        <div className={`${prefix}loading-indicator`}>
                            {indicatorDom}
                        </div>
                        <div className={`${prefix}loading-tip-content`}>
                            {tip}
                        </div>
                        <div className={`${prefix}loading-tip-placeholder`}>
                            {tip}
                        </div>
                    </div>
                ) : null}
                <div className={contentCls}>
                    {visible ? (
                        <div className={`${prefix}loading-masker`} />
                    ) : null}
                    {children}
                </div>
            </div>
        );
    }
}

export default ConfigProvider.config(Loading);
