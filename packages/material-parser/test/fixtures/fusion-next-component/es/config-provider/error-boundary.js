import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';

var _class, _temp;

import React from 'react';
import PropTypes from 'prop-types';

DefaultUI.propTypes = {
    error: PropTypes.object,
    errorInfo: PropTypes.object
};

function DefaultUI() {
    return '';
}

var ErrorBoundary = (_temp = _class = function (_React$Component) {
    _inherits(ErrorBoundary, _React$Component);

    function ErrorBoundary(props) {
        _classCallCheck(this, ErrorBoundary);

        var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

        _this.state = { error: null, errorInfo: null };
        return _this;
    }

    ErrorBoundary.prototype.componentDidCatch = function componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });

        var afterCatch = this.props.afterCatch;


        if ('afterCatch' in this.props && typeof afterCatch === 'function') {
            this.props.afterCatch(error, errorInfo);
        }
    };

    ErrorBoundary.prototype.render = function render() {
        var _props$fallbackUI = this.props.fallbackUI,
            FallbackUI = _props$fallbackUI === undefined ? DefaultUI : _props$fallbackUI;


        if (this.state.errorInfo) {
            return React.createElement(FallbackUI, {
                error: this.state.error,
                errorInfo: this.state.errorInfo
            });
        }
        // Normally, just render children
        return this.props.children;
    };

    return ErrorBoundary;
}(React.Component), _class.propTypes = {
    children: PropTypes.element,
    /**
     * 捕获错误后的自定义处理, 比如埋点上传
     * @param {Object} error 错误
     * @param {Object} errorInfo 错误详细信息
     */
    afterCatch: PropTypes.func,
    /**
     * 捕获错误后的展现 自定义组件
     * @param {Object} error 错误
     * @param {Object} errorInfo 错误详细信息
     * @returns {Element} 捕获错误后的处理
     */
    fallbackUI: PropTypes.func
}, _temp);
ErrorBoundary.displayName = 'ErrorBoundary';
export { ErrorBoundary as default };