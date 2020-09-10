import _extends from 'babel-runtime/helpers/extends';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { polyfill } from 'react-lifecycles-compat';
import ConfigProvider from '../config-provider';
import { func, obj } from '../util';
import Panel from './panel';

/** Collapse */
var Collapse = (_temp = _class = function (_React$Component) {
    _inherits(Collapse, _React$Component);

    function Collapse(props) {
        _classCallCheck(this, Collapse);

        var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

        var expandedKeys = void 0;
        if ('expandedKeys' in props) {
            expandedKeys = props.expandedKeys;
        } else {
            expandedKeys = props.defaultExpandedKeys;
        }

        _this.state = {
            expandedKeys: typeof expandedKeys === 'undefined' ? [] : expandedKeys
        };
        return _this;
    }

    Collapse.getDerivedStateFromProps = function getDerivedStateFromProps(props) {
        if ('expandedKeys' in props) {
            return {
                expandedKeys: typeof props.expandedKeys === 'undefined' ? [] : props.expandedKeys
            };
        }
        return null;
    };

    Collapse.prototype.onItemClick = function onItemClick(key) {
        var expandedKeys = this.state.expandedKeys;
        if (this.props.accordion) {
            expandedKeys = String(expandedKeys[0]) === String(key) ? [] : [key];
        } else {
            expandedKeys = [].concat(expandedKeys);
            var stringKey = String(key);
            var index = expandedKeys.findIndex(function (k) {
                return String(k) === stringKey;
            });
            var isExpanded = index > -1;
            if (isExpanded) {
                expandedKeys.splice(index, 1);
            } else {
                expandedKeys.push(key);
            }
        }
        this.setExpandedKey(expandedKeys);
    };

    Collapse.prototype.genratePanelId = function genratePanelId(itemId, index) {
        var collapseId = this.props.id;

        var id = void 0;
        if (itemId) {
            // 优先用 item自带的id
            id = itemId;
        } else if (collapseId) {
            // 其次用 collapseId 和 index 生成id
            id = collapseId + '-panel-' + index;
        }
        return id;
    };

    Collapse.prototype.getProps = function getProps(item, index, key) {
        var _this2 = this;

        var expandedKeys = this.state.expandedKeys;
        var title = item.title;

        var disabled = this.props.disabled;

        if (!disabled) {
            disabled = item.disabled;
        }

        var isExpanded = false;

        if (this.props.accordion) {
            isExpanded = String(expandedKeys[0]) === String(key);
        } else {
            isExpanded = expandedKeys.some(function (expandedKey) {
                if (expandedKey === null || expandedKey === undefined || key === null || key === undefined) {
                    return false;
                }

                if (expandedKey === key || expandedKey.toString() === key.toString()) {
                    return true;
                }
                return false;
            });
        }

        var id = this.genratePanelId(item.id, index);
        return {
            key: key,
            title: title,
            isExpanded: isExpanded,
            disabled: disabled,
            id: id,
            onClick: disabled ? null : function () {
                _this2.onItemClick(key);
                if ('onClick' in item) {
                    item.onClick(key);
                }
            }
        };
    };

    Collapse.prototype.getItemsByDataSource = function getItemsByDataSource() {
        var _this3 = this;

        var props = this.props;
        var dataSource = props.dataSource;
        // 是否有dataSource.item传入过key

        var hasKeys = dataSource.some(function (item) {
            return 'key' in item;
        });

        return dataSource.map(function (item, index) {
            // 传入过key就用item.key 没传入则统一使用index为key
            var key = hasKeys ? item.key : '' + index;
            return React.createElement(
                Panel,
                _extends({}, _this3.getProps(item, index, key), { key: key }),
                item.content
            );
        });
    };

    Collapse.prototype.getItemsByChildren = function getItemsByChildren() {
        var _this4 = this;

        // 是否有child传入过key
        var allKeys = React.Children.map(this.props.children, function (child) {
            return child && child.key;
        });
        var hasKeys = Boolean(allKeys.length);

        return React.Children.map(this.props.children, function (child, index) {
            if (child && typeof child.type === 'function' && child.type.isNextPanel) {
                // 传入过key就用child.key 没传入则统一使用index为key
                var key = hasKeys ? child.key : '' + index;
                return React.cloneElement(child, _this4.getProps(child.props, index, key));
            } else {
                return child;
            }
        });
    };

    Collapse.prototype.setExpandedKey = function setExpandedKey(expandedKeys) {
        if (!('expandedKeys' in this.props)) {
            this.setState({ expandedKeys: expandedKeys });
        }
        this.props.onExpand(this.props.accordion ? expandedKeys[0] : expandedKeys);
    };

    Collapse.prototype.render = function render() {
        var _classNames;

        var _props = this.props,
            prefix = _props.prefix,
            className = _props.className,
            style = _props.style,
            disabled = _props.disabled,
            dataSource = _props.dataSource,
            id = _props.id,
            rtl = _props.rtl;

        var collapseClassName = classNames((_classNames = {}, _classNames[prefix + 'collapse'] = true, _classNames[prefix + 'collapse-disabled'] = disabled, _classNames[className] = Boolean(className), _classNames));

        var others = obj.pickOthers(Collapse.propTypes, this.props);
        return React.createElement(
            'div',
            _extends({
                id: id,
                className: collapseClassName,
                style: style
            }, others, {
                role: 'presentation',
                dir: rtl ? 'rtl' : undefined
            }),
            dataSource ? this.getItemsByDataSource() : this.getItemsByChildren()
        );
    };

    return Collapse;
}(React.Component), _class.propTypes = {
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
    rtl: PropTypes.bool
}, _class.defaultProps = {
    accordion: false,
    prefix: 'next-',
    onExpand: func.noop
}, _class.contextTypes = {
    prefix: PropTypes.string
}, _temp);
Collapse.displayName = 'Collapse';


export default polyfill(ConfigProvider.config(Collapse));