import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { polyfill } from 'react-lifecycles-compat';
import ConfigProvider from '../config-provider';
import { func, obj } from '../util';
import Panel from './panel';

/** Collapse */
class Collapse extends React.Component {
    static propTypes = {
        /**
         * 样式前缀
         */
        prefix: PropTypes.string,
        /**
         * 组件接受行内样式
         */
        style: PropTypes.object,
        /**
         * 使用数据模型构建
         */
        dataSource: PropTypes.array,
        /**
         * 默认展开keys
         */
        defaultExpandedKeys: PropTypes.array,
        /**
         * 受控展开keys
         */
        expandedKeys: PropTypes.array,
        /**
         * 展开状态发升变化时候的回调
         */
        onExpand: PropTypes.func,
        /**
         * 所有禁用
         */
        disabled: PropTypes.bool,
        /**
         * 扩展class
         */
        className: PropTypes.string,
        /**
         * 手风琴模式，一次只能打开一个
         */
        accordion: PropTypes.bool,
        children: PropTypes.node,
        id: PropTypes.string,
        rtl: PropTypes.bool,
    };

    static defaultProps = {
        accordion: false,
        prefix: 'next-',
        onExpand: func.noop,
    };

    static contextTypes = {
        prefix: PropTypes.string,
    };

    constructor(props) {
        super(props);

        let expandedKeys;
        if ('expandedKeys' in props) {
            expandedKeys = props.expandedKeys;
        } else {
            expandedKeys = props.defaultExpandedKeys;
        }

        this.state = {
            expandedKeys:
                typeof expandedKeys === 'undefined' ? [] : expandedKeys,
        };
    }

    static getDerivedStateFromProps(props) {
        if ('expandedKeys' in props) {
            return {
                expandedKeys:
                    typeof props.expandedKeys === 'undefined'
                        ? []
                        : props.expandedKeys,
            };
        }
        return null;
    }

    onItemClick(key) {
        let expandedKeys = this.state.expandedKeys;
        if (this.props.accordion) {
            expandedKeys = String(expandedKeys[0]) === String(key) ? [] : [key];
        } else {
            expandedKeys = [...expandedKeys];
            const stringKey = String(key);
            const index = expandedKeys.findIndex(k => String(k) === stringKey);
            const isExpanded = index > -1;
            if (isExpanded) {
                expandedKeys.splice(index, 1);
            } else {
                expandedKeys.push(key);
            }
        }
        this.setExpandedKey(expandedKeys);
    }

    genratePanelId(itemId, index) {
        const { id: collapseId } = this.props;
        let id;
        if (itemId) {
            // 优先用 item自带的id
            id = itemId;
        } else if (collapseId) {
            // 其次用 collapseId 和 index 生成id
            id = `${collapseId}-panel-${index}`;
        }
        return id;
    }
    getProps(item, index, key) {
        const expandedKeys = this.state.expandedKeys;
        const { title } = item;
        let disabled = this.props.disabled;

        if (!disabled) {
            disabled = item.disabled;
        }

        let isExpanded = false;

        if (this.props.accordion) {
            isExpanded = String(expandedKeys[0]) === String(key);
        } else {
            isExpanded = expandedKeys.some(expandedKey => {
                if (
                    expandedKey === null ||
                    expandedKey === undefined ||
                    key === null ||
                    key === undefined
                ) {
                    return false;
                }

                if (
                    expandedKey === key ||
                    expandedKey.toString() === key.toString()
                ) {
                    return true;
                }
                return false;
            });
        }

        const id = this.genratePanelId(item.id, index);
        return {
            key,
            title,
            isExpanded,
            disabled,
            id,
            onClick: disabled
                ? null
                : () => {
                      this.onItemClick(key);
                      if ('onClick' in item) {
                          item.onClick(key);
                      }
                  },
        };
    }

    getItemsByDataSource() {
        const { props } = this;
        const { dataSource } = props;
        // 是否有dataSource.item传入过key
        const hasKeys = dataSource.some(item => 'key' in item);

        return dataSource.map((item, index) => {
            // 传入过key就用item.key 没传入则统一使用index为key
            const key = hasKeys ? item.key : `${index}`;
            return (
                <Panel {...this.getProps(item, index, key)} key={key}>
                    {item.content}
                </Panel>
            );
        });
    }

    getItemsByChildren() {
        // 是否有child传入过key
        const allKeys = React.Children.map(
            this.props.children,
            child => child && child.key
        );
        const hasKeys = Boolean(allKeys.length);

        return React.Children.map(this.props.children, (child, index) => {
            if (
                child &&
                typeof child.type === 'function' &&
                child.type.isNextPanel
            ) {
                // 传入过key就用child.key 没传入则统一使用index为key
                const key = hasKeys ? child.key : `${index}`;
                return React.cloneElement(
                    child,
                    this.getProps(child.props, index, key)
                );
            } else {
                return child;
            }
        });
    }

    setExpandedKey(expandedKeys) {
        if (!('expandedKeys' in this.props)) {
            this.setState({ expandedKeys });
        }
        this.props.onExpand(
            this.props.accordion ? expandedKeys[0] : expandedKeys
        );
    }

    render() {
        const {
            prefix,
            className,
            style,
            disabled,
            dataSource,
            id,
            rtl,
        } = this.props;
        const collapseClassName = classNames({
            [`${prefix}collapse`]: true,
            [`${prefix}collapse-disabled`]: disabled,
            [className]: Boolean(className),
        });

        const others = obj.pickOthers(Collapse.propTypes, this.props);
        return (
            <div
                id={id}
                className={collapseClassName}
                style={style}
                {...others}
                role="presentation"
                dir={rtl ? 'rtl' : undefined}
            >
                {dataSource
                    ? this.getItemsByDataSource()
                    : this.getItemsByChildren()}
            </div>
        );
    }
}

export default polyfill(ConfigProvider.config(Collapse));
