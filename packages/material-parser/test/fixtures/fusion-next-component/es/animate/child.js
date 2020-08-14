import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Transition } from 'react-transition-group';
import { func, support, events, dom, guid } from '../util';

var noop = function noop() {};
var on = events.on,
    off = events.off;
var addClass = dom.addClass,
    removeClass = dom.removeClass;

var prefixes = ['-webkit-', '-moz-', '-o-', 'ms-', ''];

function getStyleProperty(node, name) {
    var style = window.getComputedStyle(node);
    var ret = '';
    for (var i = 0; i < prefixes.length; i++) {
        ret = style.getPropertyValue(prefixes[i] + name);
        if (ret) {
            break;
        }
    }
    return ret;
}

var AnimateChild = (_temp = _class = function (_Component) {
    _inherits(AnimateChild, _Component);

    function AnimateChild(props) {
        _classCallCheck(this, AnimateChild);

        var _this2 = _possibleConstructorReturn(this, _Component.call(this, props));

        func.bindCtx(_this2, ['handleEnter', 'handleEntering', 'handleEntered', 'handleExit', 'handleExiting', 'handleExited', 'addEndListener']);
        _this2.endListeners = {
            transitionend: [],
            animationend: []
        };
        _this2.timeoutMap = {};
        return _this2;
    }

    AnimateChild.prototype.componentWillUnmount = function componentWillUnmount() {
        var _this3 = this;

        Object.keys(this.endListeners).forEach(function (eventName) {
            _this3.endListeners[eventName].forEach(function (listener) {
                off(_this3.node, eventName, listener);
            });
        });
        this.endListeners = {
            transitionend: [],
            animationend: []
        };
    };

    AnimateChild.prototype.generateEndListener = function generateEndListener(node, done, eventName, id) {
        var _this = this;
        return function endListener(e) {
            if (e && e.target === node) {
                if (_this.timeoutMap[id]) {
                    clearTimeout(_this.timeoutMap[id]);
                    delete _this.timeoutMap[id];
                }

                done();
                off(node, eventName, endListener);
                var listeners = _this.endListeners[eventName];
                var index = listeners.indexOf(endListener);
                index > -1 && listeners.splice(index, 1);
            }
        };
    };

    AnimateChild.prototype.addEndListener = function addEndListener(node, done) {
        var _this4 = this;

        if (support.transition || support.animation) {
            var id = guid();

            this.node = node;
            if (support.transition) {
                var transitionEndListener = this.generateEndListener(node, done, 'transitionend', id);
                on(node, 'transitionend', transitionEndListener);
                this.endListeners.transitionend.push(transitionEndListener);
            }
            if (support.animation) {
                var animationEndListener = this.generateEndListener(node, done, 'animationend', id);
                on(node, 'animationend', animationEndListener);
                this.endListeners.animationend.push(animationEndListener);
            }

            setTimeout(function () {
                var transitionDelay = parseFloat(getStyleProperty(node, 'transition-delay')) || 0;
                var transitionDuration = parseFloat(getStyleProperty(node, 'transition-duration')) || 0;
                var animationDelay = parseFloat(getStyleProperty(node, 'animation-delay')) || 0;
                var animationDuration = parseFloat(getStyleProperty(node, 'animation-duration')) || 0;
                var time = Math.max(transitionDuration + transitionDelay, animationDuration + animationDelay);
                if (time) {
                    _this4.timeoutMap[id] = setTimeout(function () {
                        done();
                    }, time * 1000 + 200);
                }
            }, 15);
        } else {
            done();
        }
    };

    AnimateChild.prototype.removeEndtListener = function removeEndtListener() {
        this.transitionOff && this.transitionOff();
        this.animationOff && this.animationOff();
    };

    AnimateChild.prototype.removeClassNames = function removeClassNames(node, names) {
        Object.keys(names).forEach(function (key) {
            removeClass(node, names[key]);
        });
    };

    AnimateChild.prototype.handleEnter = function handleEnter(node, isAppearing) {
        var names = this.props.names;

        if (names) {
            this.removeClassNames(node, names);
            var className = isAppearing ? 'appear' : 'enter';
            addClass(node, names[className]);
        }

        var hook = isAppearing ? this.props.onAppear : this.props.onEnter;
        hook(node);
    };

    AnimateChild.prototype.handleEntering = function handleEntering(node, isAppearing) {
        var _this5 = this;

        setTimeout(function () {
            var names = _this5.props.names;

            if (names) {
                var className = isAppearing ? 'appearActive' : 'enterActive';
                addClass(node, names[className]);
            }

            var hook = isAppearing ? _this5.props.onAppearing : _this5.props.onEntering;
            hook(node);
        }, 10);
    };

    AnimateChild.prototype.handleEntered = function handleEntered(node, isAppearing) {
        var names = this.props.names;

        if (names) {
            var classNames = isAppearing ? [names.appear, names.appearActive] : [names.enter, names.enterActive];
            classNames.forEach(function (className) {
                removeClass(node, className);
            });
        }

        var hook = isAppearing ? this.props.onAppeared : this.props.onEntered;
        hook(node);
    };

    AnimateChild.prototype.handleExit = function handleExit(node) {
        var names = this.props.names;

        if (names) {
            this.removeClassNames(node, names);
            addClass(node, names.leave);
        }

        this.props.onExit(node);
    };

    AnimateChild.prototype.handleExiting = function handleExiting(node) {
        var _this6 = this;

        setTimeout(function () {
            var names = _this6.props.names;

            if (names) {
                addClass(node, names.leaveActive);
            }
            _this6.props.onExiting(node);
        }, 10);
    };

    AnimateChild.prototype.handleExited = function handleExited(node) {
        var names = this.props.names;

        if (names) {
            [names.leave, names.leaveActive].forEach(function (className) {
                removeClass(node, className);
            });
        }

        this.props.onExited(node);
    };

    AnimateChild.prototype.render = function render() {
        /* eslint-disable no-unused-vars */
        var _props = this.props,
            names = _props.names,
            onAppear = _props.onAppear,
            onAppeared = _props.onAppeared,
            onAppearing = _props.onAppearing,
            onEnter = _props.onEnter,
            onEntering = _props.onEntering,
            onEntered = _props.onEntered,
            onExit = _props.onExit,
            onExiting = _props.onExiting,
            onExited = _props.onExited,
            others = _objectWithoutProperties(_props, ['names', 'onAppear', 'onAppeared', 'onAppearing', 'onEnter', 'onEntering', 'onEntered', 'onExit', 'onExiting', 'onExited']);
        /* eslint-enable no-unused-vars */

        return React.createElement(Transition, _extends({}, others, {
            onEnter: this.handleEnter,
            onEntering: this.handleEntering,
            onEntered: this.handleEntered,
            onExit: this.handleExit,
            onExiting: this.handleExiting,
            onExited: this.handleExited,
            addEndListener: this.addEndListener
        }));
    };

    return AnimateChild;
}(Component), _class.propTypes = {
    names: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    onAppear: PropTypes.func,
    onAppearing: PropTypes.func,
    onAppeared: PropTypes.func,
    onEnter: PropTypes.func,
    onEntering: PropTypes.func,
    onEntered: PropTypes.func,
    onExit: PropTypes.func,
    onExiting: PropTypes.func,
    onExited: PropTypes.func
}, _class.defaultProps = {
    onAppear: noop,
    onAppearing: noop,
    onAppeared: noop,
    onEnter: noop,
    onEntering: noop,
    onEntered: noop,
    onExit: noop,
    onExiting: noop,
    onExited: noop
}, _temp);
AnimateChild.displayName = 'AnimateChild';
export { AnimateChild as default };