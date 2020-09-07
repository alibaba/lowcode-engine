import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ConfigProvider from '../config-provider';
import Animate from '../animate';
import Message from '../message';
import uuid from '../util/guid';
import _config from './config';

var getAnimation = function getAnimation(placement) {
    switch (placement) {
        case 'tl':
        case 'bl':
            return 'slideInLeft';
        case 'tr':
        case 'br':
            return 'slideInRight';
        default:
            return null;
    }
};

var Notification = (_temp = _class = function (_Component) {
    _inherits(Notification, _Component);

    function Notification(props) {
        _classCallCheck(this, Notification);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        _this.close = function (key) {
            var notifications = _this.state.notifications;

            var index = notifications.findIndex(function (notification) {
                return notification.key === key;
            });

            if (index === -1) return;
            var _notifications$index = notifications[index],
                onClose = _notifications$index.onClose,
                timer = _notifications$index.timer;


            notifications.splice(index, 1);

            var timerIndex = _this.timers.findIndex(function (v) {
                return v === timer;
            });

            if (timerIndex !== -1) {
                _this.timers.splice(timerIndex, 1);
            }

            if (timer) {
                clearTimeout(timer);
            }

            _this.setState({
                notifications: notifications
            });

            if (onClose) {
                onClose();
            }
        };

        _this.open = function (_ref) {
            var key = _ref.key,
                duration = _ref.duration,
                others = _objectWithoutProperties(_ref, ['key', 'duration']);

            var notifications = [].concat(_this.state.notifications);
            if (!key) {
                key = uuid('notification-');
            }

            var index = notifications.findIndex(function (notification) {
                return notification.key === key;
            });

            if (index !== -1) {
                notifications[index] = _extends({}, notifications[index], others);
            } else {
                var timer = void 0;

                if (duration > 0) {
                    timer = setTimeout(function () {
                        _this.close(key);
                    }, duration);
                    _this.timers.push(timer);
                }
                notifications.push(_extends({}, others, {
                    key: key,
                    timer: timer
                }));
            }

            if (_config.maxCount > 0 && _config.maxCount < notifications.length) {
                while (notifications.length > _config.maxCount) {
                    var _key = notifications[0].key;

                    _this.close(_key);
                    notifications.splice(0, 1);
                }
            }

            _this.setState({
                notifications: notifications
            });

            return key;
        };

        _this.state = {
            notifications: []
        };
        _this.timers = [];
        return _this;
    }

    Notification.prototype.componentWillUnmount = function componentWillUnmount() {
        this.timers.forEach(function (timer) {
            if (!timer) return;
            clearTimeout(timer);
        });
    };

    Notification.prototype.render = function render() {
        var _ref2;

        var prefix = this.props.prefix;
        var notifications = this.state.notifications;


        return React.createElement(
            'div',
            {
                className: prefix + 'notification',
                style: (_ref2 = {}, _ref2[_config.placement.indexOf('b') === 0 ? 'bottom' : 'top'] = _config.offset[1], _ref2[_config.placement.indexOf('l') !== -1 ? 'left' : 'right'] = _config.offset[0], _ref2)
            },
            React.createElement(
                Animate,
                {
                    animationAppear: true,
                    animation: {
                        enter: getAnimation(_config.placement),
                        leave: prefix + 'notification-fade-leave'
                    },
                    singleMode: false
                },
                notifications.map(function (_ref3) {
                    var key = _ref3.key,
                        type = _ref3.type,
                        title = _ref3.title,
                        content = _ref3.content,
                        icon = _ref3.icon,
                        onClick = _ref3.onClick,
                        style = _ref3.style,
                        className = _ref3.className;
                    return React.createElement(
                        Message,
                        {
                            key: key,
                            shape: 'toast',
                            type: type,
                            title: title,
                            iconType: icon,
                            closeable: true,
                            animation: false,
                            size: _config.size,
                            visible: true,
                            style: style,
                            className: className,
                            onClick: onClick,
                            onClose: function onClose() {
                                return close(key);
                            }
                        },
                        content
                    );
                })
            )
        );
    };

    return Notification;
}(Component), _class.propTypes = {
    prefix: PropTypes.string
}, _class.defaultProps = {
    prefix: 'next-'
}, _temp);
Notification.displayName = 'Notification';


var ConfigedNotification = ConfigProvider.config(Notification, {
    exportNames: ['open', 'close']
});
var instance = void 0;
var mounting = false;
var waitOpens = [];

function open() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (!options.title && !options.content) return;

    var duration = !options.duration && options.duration !== 0 ? _config.duration : options.duration;

    if (!instance) {
        if (!options.key) {
            options.key = uuid('notification-');
        }

        waitOpens.push(_extends({}, options, {
            duration: duration
        }));

        if (!mounting) {
            mounting = true;
            var div = document.createElement('div');
            if (_config.getContainer) {
                var root = _config.getContainer();
                root.appendChild(div);
            } else {
                document.body.appendChild(div);
            }

            ReactDOM.render(React.createElement(
                ConfigProvider,
                ConfigProvider.getContext(),
                React.createElement(ConfigedNotification, {
                    ref: function ref(_ref4) {
                        instance = _ref4;
                    }
                })
            ), div, function () {
                waitOpens.forEach(function (item) {
                    return instance.open(item);
                });
                waitOpens = [];
                mounting = false;
            });
        }

        return options.key;
    }

    var key = instance.open(_extends({}, options, {
        duration: duration
    }));

    return key;
}

function close(key) {
    if (!instance) {
        var index = waitOpens.findIndex(function (item) {
            return item.key === key;
        });
        waitOpens.splice(index, 1);
        return;
    }

    instance.close(key);
}

function destroy() {
    if (!instance) return;
    var mountNode = ReactDOM.findDOMNode(instance).parentNode;
    if (mountNode) {
        ReactDOM.unmountComponentAtNode(mountNode);
        mountNode.parentNode.removeChild(mountNode);
    }
}

var levels = {};

['success', 'error', 'warning', 'notice', 'help'].forEach(function (type) {
    levels[type] = function () {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        return open(_extends({}, options, {
            type: type
        }));
    };
});
export default _extends({
    config: function config() {
        for (var _len = arguments.length, args = Array(_len), _key2 = 0; _key2 < _len; _key2++) {
            args[_key2] = arguments[_key2];
        }

        return _extends.apply(undefined, [_config].concat(args));
    },

    open: open,
    close: close,
    destroy: destroy
}, levels);