import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { func, dom } from '../util';
import Animate from './animate';

var noop = function noop() {};
var getStyle = dom.getStyle;
var Expand = (_temp = _class = function (_Component) {
    _inherits(Expand, _Component);

    function Expand(props) {
        _classCallCheck(this, Expand);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        func.bindCtx(_this, ['beforeEnter', 'onEnter', 'afterEnter', 'beforeLeave', 'onLeave', 'afterLeave']);
        return _this;
    }

    Expand.prototype.beforeEnter = function beforeEnter(node) {
        if (this.leaving) {
            this.afterLeave(node);
        }

        this.cacheCurrentStyle(node);
        this.cacheComputedStyle(node);
        this.setCurrentStyleToZero(node);

        this.props.beforeEnter(node);
    };

    Expand.prototype.onEnter = function onEnter(node) {
        this.setCurrentStyleToComputedStyle(node);

        this.props.onEnter(node);
    };

    Expand.prototype.afterEnter = function afterEnter(node) {
        this.restoreCurrentStyle(node);

        this.props.afterEnter(node);
    };

    Expand.prototype.beforeLeave = function beforeLeave(node) {
        this.leaving = true;

        this.cacheCurrentStyle(node);
        this.cacheComputedStyle(node);
        this.setCurrentStyleToComputedStyle(node);

        this.props.beforeLeave(node);
    };

    Expand.prototype.onLeave = function onLeave(node) {
        this.setCurrentStyleToZero(node);

        this.props.onLeave(node);
    };

    Expand.prototype.afterLeave = function afterLeave(node) {
        this.leaving = false;

        this.restoreCurrentStyle(node);

        this.props.afterLeave(node);
    };

    Expand.prototype.cacheCurrentStyle = function cacheCurrentStyle(node) {
        this.styleBorderTopWidth = node.style.borderTopWidth;
        this.stylePaddingTop = node.style.paddingTop;
        this.styleHeight = node.style.height;
        this.stylePaddingBottom = node.style.paddingBottom;
        this.styleBorderBottomWidth = node.style.borderBottomWidth;
    };

    Expand.prototype.cacheComputedStyle = function cacheComputedStyle(node) {
        this.borderTopWidth = getStyle(node, 'borderTopWidth');
        this.paddingTop = getStyle(node, 'paddingTop');
        this.height = node.offsetHeight;
        this.paddingBottom = getStyle(node, 'paddingBottom');
        this.borderBottomWidth = getStyle(node, 'borderBottomWidth');
    };

    Expand.prototype.setCurrentStyleToZero = function setCurrentStyleToZero(node) {
        node.style.borderTopWidth = '0px';
        node.style.paddingTop = '0px';
        node.style.height = '0px';
        node.style.paddingBottom = '0px';
        node.style.borderBottomWidth = '0px';
    };

    Expand.prototype.setCurrentStyleToComputedStyle = function setCurrentStyleToComputedStyle(node) {
        node.style.borderTopWidth = this.borderTopWidth + 'px';
        node.style.paddingTop = this.paddingTop + 'px';
        node.style.height = this.height + 'px';
        node.style.paddingBottom = this.paddingBottom + 'px';
        node.style.borderBottomWidth = this.borderBottomWidth + 'px';
    };

    Expand.prototype.restoreCurrentStyle = function restoreCurrentStyle(node) {
        node.style.borderTopWidth = this.styleBorderTopWidth;
        node.style.paddingTop = this.stylePaddingTop;
        node.style.height = this.styleHeight;
        node.style.paddingBottom = this.stylePaddingBottom;
        node.style.borderBottomWidth = this.styleBorderBottomWidth;
    };

    Expand.prototype.render = function render() {
        var _props = this.props,
            animation = _props.animation,
            others = _objectWithoutProperties(_props, ['animation']);

        var newAnimation = animation || 'expand';

        return React.createElement(Animate, _extends({}, others, {
            animation: newAnimation,
            beforeEnter: this.beforeEnter,
            onEnter: this.onEnter,
            afterEnter: this.afterEnter,
            beforeLeave: this.beforeLeave,
            onLeave: this.onLeave,
            afterLeave: this.afterLeave
        }));
    };

    return Expand;
}(Component), _class.propTypes = {
    animation: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    beforeEnter: PropTypes.func,
    onEnter: PropTypes.func,
    afterEnter: PropTypes.func,
    beforeLeave: PropTypes.func,
    onLeave: PropTypes.func,
    afterLeave: PropTypes.func
}, _class.defaultProps = {
    beforeEnter: noop,
    onEnter: noop,
    afterEnter: noop,
    beforeLeave: noop,
    onLeave: noop,
    afterLeave: noop
}, _temp);
Expand.displayName = 'Expand';
export { Expand as default };