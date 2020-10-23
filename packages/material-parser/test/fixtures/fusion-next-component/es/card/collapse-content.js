import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Icon from '../icon';
import Button from '../button';
import ConfigProvider from '../config-provider';
import nextLocale from '../locale/zh-cn';

/**
 * Card.CollaspeContent
 * @order 3
 */
var CardCollaspeContent = (_temp = _class = function (_Component) {
    _inherits(CardCollaspeContent, _Component);

    function CardCollaspeContent(props, context) {
        _classCallCheck(this, CardCollaspeContent);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props, context));

        _this.handleToggle = function () {
            _this.setState(function (prevState) {
                return {
                    expand: !prevState.expand
                };
            });
        };

        _this._contentRefHandler = function (ref) {
            _this.content = ref;
        };

        _this.saveFooter = function (ref) {
            _this.footer = ref;
        };

        _this.state = {
            needMore: false,
            expand: false,
            contentHeight: 'auto'
        };
        return _this;
    }

    CardCollaspeContent.prototype.componentDidMount = function componentDidMount() {
        this._setNeedMore();
        this._setContentHeight();
    };

    CardCollaspeContent.prototype.componentDidUpdate = function componentDidUpdate() {
        this._setContentHeight();
    };

    // 是否展示 More 按钮
    CardCollaspeContent.prototype._setNeedMore = function _setNeedMore() {
        var contentHeight = this.props.contentHeight;

        var childrenHeight = this._getNodeChildrenHeight(this.content);
        this.setState({
            needMore: contentHeight !== 'auto' && childrenHeight > contentHeight
        });
    };

    // 设置 Body 的高度


    CardCollaspeContent.prototype._setContentHeight = function _setContentHeight() {
        if (this.state.expand) {
            var childrenHeight = this._getNodeChildrenHeight(this.content);
            this.content.style.height = childrenHeight + 'px'; // get the real height
        } else {
            var el = ReactDOM.findDOMNode(this.footer);
            var height = this.props.contentHeight;

            if (el) {
                height = height - el.getBoundingClientRect().height;
            }

            this.content.style.height = height + 'px';
        }
    };

    CardCollaspeContent.prototype._getNodeChildrenHeight = function _getNodeChildrenHeight(node) {
        if (!node) {
            return 0;
        }

        var contentChildNodes = node.childNodes;
        var length = contentChildNodes.length;

        if (!length) {
            return 0;
        }

        var lastNode = contentChildNodes[length - 1];

        return lastNode.offsetTop + lastNode.offsetHeight;
    };

    CardCollaspeContent.prototype.render = function render() {
        var _props = this.props,
            prefix = _props.prefix,
            children = _props.children,
            locale = _props.locale;
        var _state = this.state,
            needMore = _state.needMore,
            expand = _state.expand;


        return React.createElement(
            'div',
            { className: prefix + 'card-body' },
            React.createElement(
                'div',
                {
                    className: prefix + 'card-content',
                    ref: this._contentRefHandler
                },
                children
            ),
            needMore ? React.createElement(
                'div',
                {
                    className: prefix + 'card-footer',
                    ref: this.saveFooter,
                    onClick: this.handleToggle
                },
                React.createElement(
                    Button,
                    { text: true, type: 'primary' },
                    expand ? locale.fold : locale.expand,
                    React.createElement(Icon, {
                        type: 'arrow-down',
                        size: 'xs',
                        className: expand ? 'expand' : ''
                    })
                )
            ) : null
        );
    };

    return CardCollaspeContent;
}(Component), _class.propTypes = {
    prefix: PropTypes.string,
    /**
     * 内容区域的固定高度
     */
    contentHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    locale: PropTypes.object,
    children: PropTypes.node
}, _class.defaultProps = {
    prefix: 'next-',
    contentHeight: 120,
    locale: nextLocale.Card
}, _temp);
CardCollaspeContent.displayName = 'CardCollaspeContent';


export default ConfigProvider.config(CardCollaspeContent, {
    componentName: 'Card'
});