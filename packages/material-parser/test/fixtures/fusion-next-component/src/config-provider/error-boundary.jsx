import React from 'react';
import PropTypes from 'prop-types';

DefaultUI.propTypes = {
    error: PropTypes.object,
    errorInfo: PropTypes.object,
};

function DefaultUI() {
    return '';
}

export default class ErrorBoundary extends React.Component {
    static propTypes = {
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
        fallbackUI: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = { error: null, errorInfo: null };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo,
        });

        const { afterCatch } = this.props;

        if ('afterCatch' in this.props && typeof afterCatch === 'function') {
            this.props.afterCatch(error, errorInfo);
        }
    }

    render() {
        const { fallbackUI: FallbackUI = DefaultUI } = this.props;

        if (this.state.errorInfo) {
            return (
                <FallbackUI
                    error={this.state.error}
                    errorInfo={this.state.errorInfo}
                />
            );
        }
        // Normally, just render children
        return this.props.children;
    }
}
