import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutProperties from "@babel/runtime/helpers/objectWithoutProperties";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import React, { Component } from 'react';
import PropTypes from 'prop-types'; // 缓存已加载的字体文件

const customCache = new Set(); // 动态加载字体文件

export default function createFromIconfont(options) {
  const scriptUrl = options.scriptUrl;

  if (typeof document !== 'undefined' && typeof window !== 'undefined' && typeof document.createElement === 'function' && typeof scriptUrl === 'string' && scriptUrl.length && !customCache.has(scriptUrl)) {
    const script = document.createElement('script');
    script.setAttribute('src', scriptUrl);
    script.setAttribute('data-namespace', scriptUrl);
    customCache.add(scriptUrl);
    document.body.appendChild(script);
  }

  const IconFont =
  /* #__PURE__ */
  function (_Component) {
    _inherits(IconFont, _Component);

    function IconFont() {
      _classCallCheck(this, IconFont);

      return _possibleConstructorReturn(this, _getPrototypeOf(IconFont).apply(this, arguments));
    }

    _createClass(IconFont, [{
      key: "render",
      value: function render() {
        const _this$props = this.props;
            const type = _this$props.type;
            const restProps = _objectWithoutProperties(_this$props, ["type"]);

        const innerSvgProps = {
          width: '1em',
          height: '1em',
          fill: 'currentColor',
          'aria-hidden': 'true',
          focusable: 'false',
        }; // 引用指定svg

        const content = React.createElement("use", {
          xlinkHref: `#${type}`,
        });
        return React.createElement("i", _extends({}, restProps, {
          className: `iconfont ${type}`,
        }), React.createElement("svg", innerSvgProps, content));
      },
    }]);

    return IconFont;
  }(Component);

  IconFont.propTypes = {
    type: PropTypes.string.isRequired, // icon

  };
  return IconFont;
}