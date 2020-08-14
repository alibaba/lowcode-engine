import _extends from 'babel-runtime/helpers/extends';
import _objectWithoutProperties from 'babel-runtime/helpers/objectWithoutProperties';
import React from 'react';
import cx from 'classnames';
import ConfigProvider from '../config-provider';
import Icon from './index';

var customCache = new Set();

export default function createFromIconfontCN() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var scriptUrl = options.scriptUrl,
        _options$extraCommonP = options.extraCommonProps,
        extraCommonProps = _options$extraCommonP === undefined ? {} : _options$extraCommonP;

    /**
     * DOM API required.
     * Make sure in browser environment.
     * The Custom Icon will create a <script/>
     * that loads SVG symbols and insert the SVG Element into the document body.
     */

    if (typeof document !== 'undefined' && typeof window !== 'undefined' && typeof document.createElement === 'function' && typeof scriptUrl === 'string' && scriptUrl.length && !customCache.has(scriptUrl)) {
        var script = document.createElement('script');
        script.setAttribute('src', scriptUrl);
        script.setAttribute('data-namespace', scriptUrl);
        customCache.add(scriptUrl);
        document.body.appendChild(script);
    }

    var Iconfont = function Iconfont(props) {
        var _cx;

        var type = props.type,
            size = props.size,
            children = props.children,
            className = props.className,
            _props$prefix = props.prefix,
            prefix = _props$prefix === undefined ? 'next-' : _props$prefix,
            others = _objectWithoutProperties(props, ['type', 'size', 'children', 'className', 'prefix']);

        // component > children > type


        var content = null;
        if (props.type) {
            content = React.createElement('use', { xlinkHref: '#' + type });
        }
        if (children) {
            content = children;
        }

        var classes = cx((_cx = {}, _cx[prefix + 'icon-remote'] = true, _cx), className);

        return React.createElement(
            Icon,
            { size: size },
            React.createElement(
                'svg',
                _extends({
                    className: classes,
                    focusable: false
                }, others, extraCommonProps),
                content
            )
        );
    };

    Iconfont.displayName = 'Iconfont';

    return ConfigProvider.config(Iconfont);
}