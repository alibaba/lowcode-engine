import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp, _initialiseProps;

import React, { Component, Children } from 'react';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';
import Icon from '../icon';
import ConfigProvider from '../config-provider';
import Item from './item';
import { events } from '../util';

/**
 * Breadcrumb
 */
var Breadcrumb = (_temp = _class = function (_Component) {
    _inherits(Breadcrumb, _Component);

    function Breadcrumb(props) {
        _classCallCheck(this, Breadcrumb);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        _initialiseProps.call(_this);

        _this.state = {
            maxNode: props.maxNode === 'auto' ? 100 : props.maxNode
        };
        return _this;
    }

    Breadcrumb.getDerivedStateFromProps = function getDerivedStateFromProps(props, state) {
        if (state.prevMaxNode === props.maxNode) {
            return {};
        }

        return {
            prevMaxNode: props.maxNode,
            maxNode: props.maxNode === 'auto' ? 100 : props.maxNode
        };
    };

    Breadcrumb.prototype.componentDidMount = function componentDidMount() {
        this.computeMaxNode();
        events.on(window, 'resize', this.computeMaxNode);
    };

    Breadcrumb.prototype.componentDidUpdate = function componentDidUpdate() {
        this.computeMaxNode();
    };

    Breadcrumb.prototype.componentWillUnmount = function componentWillUnmount() {
        events.off(window, 'resize', this.computeMaxNode);
    };

    Breadcrumb.prototype.render = function render() {
        var _props = this.props,
            prefix = _props.prefix,
            rtl = _props.rtl,
            className = _props.className,
            children = _props.children,
            separator = _props.separator,
            component = _props.component,
            maxNodeProp = _props.maxNode,
            others = _objectWithoutProperties(_props, ['prefix', 'rtl', 'className', 'children', 'separator', 'component', 'maxNode']);

        var maxNode = this.state.maxNode;


        var items = void 0;
        var length = Children.count(children);

        if (maxNode > 1 && length > maxNode) {
            var breakpointer = length - maxNode + 1;
            items = [];

            Children.forEach(children, function (item, i) {
                var ariaProps = {};

                if (i === length - 1) {
                    ariaProps['aria-current'] = 'page';
                }

                if (i && i === breakpointer) {
                    items.push(React.cloneElement(item, _extends({
                        separator: separator,
                        prefix: prefix,
                        key: i,
                        activated: i === length - 1
                    }, ariaProps, {
                        className: prefix + 'breadcrumb-text-ellipsis'
                    }), '...'));
                } else if (!i || i > breakpointer) {
                    items.push(React.cloneElement(item, _extends({
                        separator: separator,
                        prefix: prefix,
                        key: i
                    }, ariaProps, {
                        activated: i === length - 1
                    })));
                }
            });
        } else {
            items = Children.map(children, function (item, i) {
                var ariaProps = {};

                if (i === length - 1) {
                    ariaProps['aria-current'] = 'page';
                }

                return React.cloneElement(item, _extends({
                    separator: separator,
                    prefix: prefix,
                    activated: i === length - 1
                }, ariaProps, {
                    key: i
                }));
            });
        }

        if (rtl) {
            others.dir = 'rtl';
        }

        var BreadcrumbComponent = component;

        delete others.maxNode;

        return React.createElement(
            BreadcrumbComponent,
            _extends({
                'aria-label': 'Breadcrumb',
                className: className
            }, others, {
                style: _extends({ position: 'relative' }, others.style || {})
            }),
            React.createElement(
                'ul',
                { className: prefix + 'breadcrumb' },
                items
            ),
            maxNodeProp === 'auto' ? React.createElement(
                'ul',
                {
                    style: {
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        visibility: 'hidden'
                    },
                    ref: this.saveBreadcrumbRef,
                    className: prefix + 'breadcrumb'
                },
                Children.map(children, function (item, i) {
                    return React.cloneElement(item, {
                        separator: separator,
                        prefix: prefix,
                        activated: i === length - 1,
                        key: i
                    });
                })
            ) : null
        );
    };

    return Breadcrumb;
}(Component), _class.Item = Item, _class.propTypes = {
    /**
     * 样式类名的品牌前缀
     */
    prefix: PropTypes.string,
    rtl: PropTypes.bool,
    /*eslint-disable*/
    /**
     * 面包屑子节点，需传入 Breadcrumb.Item
     */
    children: function children(props, propName) {
        Children.forEach(props[propName], function (child) {
            if (!(child && typeof child.type === 'function' && child.type._typeMark === 'breadcrumb_item')) {
                throw new Error("Breadcrumb's children must be Breadcrumb.Item!");
            }
        });
    },
    /*eslint-enable*/
    /**
     * 面包屑最多显示个数，超出部分会被隐藏, 设置为 auto 会自动根据父元素的宽度适配。
     */
    maxNode: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf(['auto'])]),
    /**
     * 分隔符，可以是文本或 Icon
     */
    separator: PropTypes.node,
    /**
     * 设置标签类型
     */
    component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    className: PropTypes.any
}, _class.defaultProps = {
    prefix: 'next-',
    maxNode: 100,
    separator: React.createElement(Icon, { type: 'arrow-right' }),
    component: 'nav'
}, _initialiseProps = function _initialiseProps() {
    var _this2 = this;

    this.computeMaxNode = function () {
        // 计算最大node节点，无法获取到 ... 节点的宽度，目前会有 nodeWidth - ellipsisNodeWidth 的误差
        if (_this2.props.maxNode !== 'auto' || !_this2.breadcrumbEl) return;
        var scrollWidth = _this2.breadcrumbEl.scrollWidth;
        var rect = _this2.breadcrumbEl.getBoundingClientRect();

        if (scrollWidth <= rect.width) return;
        var maxNode = _this2.breadcrumbEl.children.length;
        var index = 1;
        var fullWidth = scrollWidth;

        while (index < _this2.breadcrumbEl.children.length - 1) {
            var el = _this2.breadcrumbEl.children[index];
            maxNode--;
            fullWidth -= el.getBoundingClientRect().width;
            if (fullWidth <= rect.width) {
                break;
            }
            index++;
        }

        maxNode = Math.max(3, maxNode);

        if (maxNode !== _this2.state.maxNode) {
            _this2.setState({
                maxNode: maxNode
            });
        }
    };

    this.saveBreadcrumbRef = function (ref) {
        _this2.breadcrumbEl = ref;
    };
}, _temp);
Breadcrumb.displayName = 'Breadcrumb';


export default ConfigProvider.config(polyfill(Breadcrumb));