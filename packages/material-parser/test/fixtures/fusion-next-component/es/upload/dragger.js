import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp2;

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../icon';
import { func } from '../util';
import zhCN from '../locale/zh-cn.js';
import Upload from './upload';

/**
 * Upload.Dragger
 * @description IE10+ 支持。继承 Upload 的 API，除非特别说明
 */
var Dragger = (_temp2 = _class = function (_React$Component) {
    _inherits(Dragger, _React$Component);

    function Dragger() {
        var _temp, _this, _ret;

        _classCallCheck(this, Dragger);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
            dragOver: false
        }, _this.onDragOver = function (e) {
            if (!_this.state.dragOver) {
                _this.setState({
                    dragOver: true
                });
            }

            _this.props.onDragOver(e);
        }, _this.onDragLeave = function (e) {
            _this.setState({
                dragOver: false
            });
            _this.props.onDragLeave(e);
        }, _this.onDrop = function (e) {
            _this.setState({
                dragOver: false
            });
            _this.props.onDrop(e);
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    Dragger.prototype.render = function render() {
        var _classNames;

        var _props = this.props,
            className = _props.className,
            style = _props.style,
            shape = _props.shape,
            locale = _props.locale,
            prefix = _props.prefix,
            listType = _props.listType,
            others = _objectWithoutProperties(_props, ['className', 'style', 'shape', 'locale', 'prefix', 'listType']);

        var prefixCls = prefix + 'upload-drag';
        var cls = classNames((_classNames = {}, _classNames['' + prefixCls] = true, _classNames[prefixCls + '-over'] = this.state.dragOver, _classNames[className] = !!className, _classNames));

        var children = this.props.children || React.createElement(
            'div',
            { className: cls },
            React.createElement(
                'p',
                { className: prefixCls + '-icon' },
                React.createElement(Icon, { size: 'large', className: prefixCls + '-upload-icon' })
            ),
            React.createElement(
                'p',
                { className: prefixCls + '-text' },
                locale.drag.text
            ),
            React.createElement(
                'p',
                { className: prefixCls + '-hint' },
                locale.drag.hint
            )
        );

        return React.createElement(
            Upload,
            _extends({}, others, {
                prefix: prefix,
                shape: shape,
                listType: listType,
                dragable: true,
                style: style,
                onDragOver: this.onDragOver,
                onDragLeave: this.onDragLeave,
                onDrop: this.onDrop,
                ref: this.saveUploaderRef
            }),
            children
        );
    };

    return Dragger;
}(React.Component), _class.propTypes = {
    /**
     * 样式前缀
     */
    prefix: PropTypes.string,
    locale: PropTypes.object,
    shape: PropTypes.string,
    onDragOver: PropTypes.func,
    onDragLeave: PropTypes.func,
    onDrop: PropTypes.func,
    limit: PropTypes.number,
    className: PropTypes.string,
    style: PropTypes.object,
    defaultValue: PropTypes.array,
    children: PropTypes.node,
    listType: PropTypes.string,
    timeout: PropTypes.number
}, _class.defaultProps = {
    prefix: 'next-',
    onDragOver: func.noop,
    onDragLeave: func.noop,
    onDrop: func.noop,
    locale: zhCN.Upload
}, _temp2);
Dragger.displayName = 'Dragger';


export default Dragger;