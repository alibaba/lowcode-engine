import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

/** Tab.Item */
class TabItem extends React.Component {
    static propTypes = {
        prefix: PropTypes.string,
        /**
         * 选项卡标题
         */
        title: PropTypes.node,
        /**
         * 单个选项卡是否可关闭
         */
        closeable: PropTypes.bool,
        /**
         * 选项卡是否被禁用
         */
        disabled: PropTypes.bool,
        active: PropTypes.bool,
        lazyLoad: PropTypes.bool,
        unmountInactiveTabs: PropTypes.bool,
        children: PropTypes.any,
    };

    static defaultProps = {
        prefix: 'next-',
        closeable: false,
    };

    render() {
        const {
            prefix,
            active,
            lazyLoad,
            unmountInactiveTabs,
            children,
        } = this.props;

        this._actived = this._actived || active;
        if (lazyLoad && !this._actived) {
            return null;
        }

        if (unmountInactiveTabs && !active) {
            return null;
        }

        const cls = classnames({
            [`${prefix}tabs-tabpane`]: true,
            [`${active ? 'active' : 'hidden'}`]: true,
        });

        return (
            <div
                role="tabpanel"
                aria-hidden={active ? 'false' : 'true'}
                className={cls}
            >
                {children}
            </div>
        );
    }
}

export default TabItem;
