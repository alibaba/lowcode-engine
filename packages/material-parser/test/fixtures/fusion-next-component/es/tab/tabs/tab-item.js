import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

/** Tab.Item */
var TabItem = (_temp = _class = function (_React$Component) {
    _inherits(TabItem, _React$Component);

    function TabItem() {
        _classCallCheck(this, TabItem);

        return _possibleConstructorReturn(this, _React$Component.apply(this, arguments));
    }

    TabItem.prototype.render = function render() {
        var _classnames;

        var _props = this.props,
            prefix = _props.prefix,
            active = _props.active,
            lazyLoad = _props.lazyLoad,
            unmountInactiveTabs = _props.unmountInactiveTabs,
            children = _props.children;


        this._actived = this._actived || active;
        if (lazyLoad && !this._actived) {
            return null;
        }

        if (unmountInactiveTabs && !active) {
            return null;
        }

        var cls = classnames((_classnames = {}, _classnames[prefix + 'tabs-tabpane'] = true, _classnames['' + (active ? 'active' : 'hidden')] = true, _classnames));

        return React.createElement(
            'div',
            {
                role: 'tabpanel',
                'aria-hidden': active ? 'false' : 'true',
                className: cls
            },
            children
        );
    };

    return TabItem;
}(React.Component), _class.propTypes = {
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
    children: PropTypes.any
}, _class.defaultProps = {
    prefix: 'next-',
    closeable: false
}, _temp);
TabItem.displayName = 'TabItem';


export default TabItem;