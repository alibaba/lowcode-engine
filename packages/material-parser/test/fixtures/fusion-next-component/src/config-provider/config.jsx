import React from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { obj, log } from '../util';
import getContextProps from './get-context-props';
import ErrorBoundary from './error-boundary';

const { shallowEqual } = obj;

function getDisplayName(Component) {
    return Component.displayName || Component.name || 'Component';
}

let globalLocales;
let currentGlobalLanguage = 'zh-cn';
let currentGlobalLocale = {};
let currentGlobalRtl;

export function initLocales(locales) {
    globalLocales = locales;

    if (locales) {
        currentGlobalLocale = locales[currentGlobalLanguage];

        if (typeof currentGlobalRtl !== 'boolean') {
            currentGlobalRtl = currentGlobalLocale && currentGlobalLocale.rtl;
        }
    }
}

export function setLanguage(language) {
    if (globalLocales) {
        currentGlobalLanguage = language;
        currentGlobalLocale = globalLocales[language];

        if (typeof currentGlobalRtl !== 'boolean') {
            currentGlobalRtl = currentGlobalLocale && currentGlobalLocale.rtl;
        }
    }
}

export function setLocale(locale) {
    currentGlobalLocale = {
        ...(globalLocales ? globalLocales[currentGlobalLanguage] : {}),
        ...locale,
    };

    if (typeof currentGlobalRtl !== 'boolean') {
        currentGlobalRtl = currentGlobalLocale && currentGlobalLocale.rtl;
    }
}

export function setDirection(dir) {
    currentGlobalRtl = dir === 'rtl';
}

export function getLocale() {
    return currentGlobalLocale;
}

export function getLanguage() {
    return currentGlobalLanguage;
}

export function getDirection() {
    return currentGlobalRtl;
}

export function config(Component, options = {}) {
    // 非 forwardRef 创建的 class component
    if (
        obj.isClassComponent(Component) &&
        Component.prototype.shouldComponentUpdate === undefined
    ) {
        // class component: 通过定义 shouldComponentUpdate 改写成 pure component, 有refs
        Component.prototype.shouldComponentUpdate = function shouldComponentUpdate(
            nextProps,
            nextState
        ) {
            if (this.props.pure) {
                return (
                    !shallowEqual(this.props, nextProps) ||
                    !shallowEqual(this.state, nextState)
                );
            }

            return true;
        };
    }

    class ConfigedComponent extends React.Component {
        static propTypes = {
            ...(Component.propTypes || {}),
            prefix: PropTypes.string,
            locale: PropTypes.object,
            pure: PropTypes.bool,
            rtl: PropTypes.bool,
            device: PropTypes.oneOf(['tablet', 'desktop', 'phone']),
            popupContainer: PropTypes.any,
            errorBoundary: PropTypes.oneOfType([
                PropTypes.bool,
                PropTypes.object,
            ]),
        };
        static contextTypes = {
            ...(Component.contextTypes || {}),
            nextPrefix: PropTypes.string,
            nextLocale: PropTypes.object,
            nextPure: PropTypes.bool,
            nextRtl: PropTypes.bool,
            nextWarning: PropTypes.bool,
            nextDevice: PropTypes.oneOf(['tablet', 'desktop', 'phone']),
            nextPopupContainer: PropTypes.any,
            nextErrorBoundary: PropTypes.oneOfType([
                PropTypes.bool,
                PropTypes.object,
            ]),
        };

        constructor(props, context) {
            super(props, context);

            this._getInstance = this._getInstance.bind(this);
            this._deprecated = this._deprecated.bind(this);
        }

        _getInstance(ref) {
            this._instance = ref;

            if (this._instance && options.exportNames) {
                options.exportNames.forEach(name => {
                    const field = this._instance[name];
                    if (typeof field === 'function') {
                        this[name] = field.bind(this._instance);
                    } else {
                        this[name] = field;
                    }
                });
            }
        }

        _deprecated(...args) {
            if (this.context.nextWarning !== false) {
                log.deprecated(...args);
            }
        }

        getInstance() {
            return this._instance;
        }

        render() {
            const {
                prefix,
                locale,
                pure,
                rtl,
                device,
                popupContainer,
                errorBoundary,
                ...others
            } = this.props;
            const {
                nextPrefix,
                nextLocale = {},
                nextPure,
                nextRtl,
                nextDevice,
                nextPopupContainer,
                nextErrorBoundary,
            } = this.context;

            const displayName =
                options.componentName || getDisplayName(Component);
            const contextProps = getContextProps(
                {
                    prefix,
                    locale,
                    pure,
                    device,
                    popupContainer,
                    rtl,
                    errorBoundary,
                },
                {
                    nextPrefix,
                    nextLocale: { ...currentGlobalLocale, ...nextLocale },
                    nextPure,
                    nextDevice,
                    nextPopupContainer,
                    nextRtl:
                        typeof nextRtl === 'boolean'
                            ? nextRtl
                            : currentGlobalRtl === true
                            ? true
                            : undefined,
                    nextErrorBoundary,
                },
                displayName
            );

            // errorBoundary is only for <ErrorBoundary>
            const newContextProps = [
                'prefix',
                'locale',
                'pure',
                'rtl',
                'device',
                'popupContainer',
            ].reduce((ret, name) => {
                if (typeof contextProps[name] !== 'undefined') {
                    ret[name] = contextProps[name];
                }
                return ret;
            }, {});

            if ('pure' in newContextProps && newContextProps.pure) {
                log.warning(
                    'pure of ConfigProvider is deprecated, use Function Component or React.PureComponent'
                );
            }

            const newOthers = options.transform
                ? options.transform(others, this._deprecated)
                : others;

            const content = (
                <Component
                    {...newOthers}
                    {...newContextProps}
                    ref={
                        obj.isClassComponent(Component)
                            ? this._getInstance
                            : null
                    }
                />
            );

            const { open, ...othersBoundary } = contextProps.errorBoundary;

            return open ? (
                <ErrorBoundary {...othersBoundary}>{content}</ErrorBoundary>
            ) : (
                content
            );
        }
    }

    ConfigedComponent.displayName = `Config(${getDisplayName(Component)})`;

    hoistNonReactStatic(ConfigedComponent, Component);

    return ConfigedComponent;
}
