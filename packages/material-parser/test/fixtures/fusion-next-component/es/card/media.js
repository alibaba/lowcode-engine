import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ConfigProvider from '../config-provider';
import { log } from '../util';

var warning = log.warning;


var MEDIA_COMPONENTS = ['video', 'audio', 'picture', 'iframe', 'img'];

/**
 * Card.Media
 * @order 1
 */
var CardMedia = (_temp = _class = function (_Component) {
    _inherits(CardMedia, _Component);

    function CardMedia() {
        _classCallCheck(this, CardMedia);

        return _possibleConstructorReturn(this, _Component.apply(this, arguments));
    }

    CardMedia.prototype.render = function render() {
        var _props = this.props,
            prefix = _props.prefix,
            style = _props.style,
            className = _props.className,
            Component = _props.component,
            image = _props.image,
            src = _props.src,
            others = _objectWithoutProperties(_props, ['prefix', 'style', 'className', 'component', 'image', 'src']);

        if (!('children' in others || Boolean(image || src))) {
            warning('either `children`, `image` or `src` prop must be specified.');
        }

        var isMediaComponent = MEDIA_COMPONENTS.indexOf(Component) !== -1;
        var composedStyle = !isMediaComponent && image ? _extends({ backgroundImage: 'url("' + image + '")' }, style) : style;

        return React.createElement(Component, _extends({}, others, {
            style: composedStyle,
            className: classNames(prefix + 'card-media', className),
            src: isMediaComponent ? image || src : undefined
        }));
    };

    return CardMedia;
}(Component), _class.propTypes = {
    prefix: PropTypes.string,
    /**
     * 设置标签类型
     */
    component: PropTypes.elementType,
    /**
     * 背景图片地址
     */
    image: PropTypes.string,
    /**
     * 媒体源文件地址
     */
    src: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string
}, _class.defaultProps = {
    prefix: 'next-',
    component: 'div',
    style: {}
}, _temp);
CardMedia.displayName = 'CardMedia';


export default ConfigProvider.config(CardMedia);