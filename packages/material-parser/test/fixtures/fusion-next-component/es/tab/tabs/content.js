import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

var TabContent = (_temp = _class = function (_PureComponent) {
    _inherits(TabContent, _PureComponent);

    function TabContent() {
        _classCallCheck(this, TabContent);

        return _possibleConstructorReturn(this, _PureComponent.apply(this, arguments));
    }

    TabContent.prototype.render = function render() {
        var _classnames;

        var _props = this.props,
            prefix = _props.prefix,
            activeKey = _props.activeKey,
            lazyLoad = _props.lazyLoad,
            unmountInactiveTabs = _props.unmountInactiveTabs,
            children = _props.children,
            className = _props.className,
            others = _objectWithoutProperties(_props, ['prefix', 'activeKey', 'lazyLoad', 'unmountInactiveTabs', 'children', 'className']);

        var formatChildren = [];
        React.Children.forEach(children, function (child) {
            /* eslint-disable eqeqeq */
            var active = activeKey == child.key;
            formatChildren.push(React.cloneElement(child, {
                prefix: prefix,
                active: active,
                lazyLoad: lazyLoad,
                unmountInactiveTabs: unmountInactiveTabs
            }));
        });

        var classNames = classnames((_classnames = {}, _classnames[prefix + 'tabs-content'] = true, _classnames), className);

        return React.createElement(
            'div',
            _extends({}, others, { className: classNames }),
            formatChildren
        );
    };

    return TabContent;
}(PureComponent), _class.propTypes = {
    prefix: PropTypes.string,
    activeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    lazyLoad: PropTypes.bool,
    children: PropTypes.any
}, _temp);


export default TabContent;