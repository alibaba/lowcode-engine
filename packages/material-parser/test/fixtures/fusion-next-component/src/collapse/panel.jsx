import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ConfigProvider from '../config-provider';
import Icon from '../icon';
import { func, KEYCODE } from '../util';

/** Collapse.Panel */
class Panel extends React.Component {
    static propTypes = {
        /**
         * 样式类名的品牌前缀
         */
        prefix: PropTypes.string,
        /**
         * 子组件接受行内样式
         */
        style: PropTypes.object,
        children: PropTypes.any,
        isExpanded: PropTypes.bool,
        /**
         * 是否禁止用户操作
         */
        disabled: PropTypes.bool,
        /**
         * 标题
         */
        title: PropTypes.node,
        /**
         * 扩展class
         */
        className: PropTypes.string,
        onClick: PropTypes.func,
        id: PropTypes.string,
    };

    static defaultProps = {
        prefix: 'next-',
        isExpanded: false,
        onClick: func.noop,
    };

    static isNextPanel = true; //

    onKeyDown = e => {
        const { keyCode } = e;
        if (keyCode === KEYCODE.SPACE) {
            const { onClick } = this.props;
            e.preventDefault();
            onClick && onClick(e);
        }
    };
    render() {
        const {
            title,
            children,
            className,
            isExpanded,
            disabled,
            style,
            prefix,
            onClick,
            id,
            ...others
        } = this.props;

        const cls = classNames({
            [`${prefix}collapse-panel`]: true,
            [`${prefix}collapse-panel-hidden`]: !isExpanded,
            [`${prefix}collapse-panel-expanded`]: isExpanded,
            [`${prefix}collapse-panel-disabled`]: disabled,
            [className]: className,
        });

        const iconCls = classNames({
            [`${prefix}collapse-panel-icon`]: true,
            [`${prefix}collapse-panel-icon-expanded`]: isExpanded,
        });

        // 为了无障碍 需要添加两个id
        const headingId = id ? `${id}-heading` : undefined;
        const regionId = id ? `${id}-region` : undefined;
        return (
            <div className={cls} style={style} id={id} {...others}>
                <div
                    id={headingId}
                    className={`${prefix}collapse-panel-title`}
                    onClick={onClick}
                    onKeyDown={this.onKeyDown}
                    tabIndex="0"
                    aria-disabled={disabled}
                    aria-expanded={isExpanded}
                    aria-controls={regionId}
                    role="button"
                >
                    <Icon
                        type="arrow-up"
                        className={iconCls}
                        aria-hidden="true"
                    />
                    {title}
                </div>
                <div
                    className={`${prefix}collapse-panel-content`}
                    role="region"
                    id={regionId}
                >
                    {children}
                </div>
            </div>
        );
    }
}

export default ConfigProvider.config(Panel);
