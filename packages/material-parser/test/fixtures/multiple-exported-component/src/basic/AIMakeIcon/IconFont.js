import React, { Component } from 'react';
import PropTypes from 'prop-types';

// 缓存已加载的字体文件
const customCache = new Set();

// 动态加载字体文件
export default function createFromIconfont(options) {
  const { scriptUrl } = options;
  if (
    typeof document !== 'undefined'
    && typeof window !== 'undefined'
    && typeof document.createElement === 'function'
    && typeof scriptUrl === 'string'
    && scriptUrl.length
    && !customCache.has(scriptUrl)
  ) {
    const script = document.createElement('script');
    script.setAttribute('src', scriptUrl);
    script.setAttribute('data-namespace', scriptUrl);
    customCache.add(scriptUrl);
    document.body.appendChild(script);
  }

  class IconFont extends Component {
    render() {
      const { type, ...restProps } = this.props;
      const innerSvgProps = {
        width: '1em',
        height: '1em',
        fill: 'currentColor',
        'aria-hidden': 'true',
        focusable: 'false',
      };
      // 引用指定svg
      const content = <use xlinkHref={`#${type}`} />;

      return (
        <i {...restProps} className={`iconfont ${type}`}>
          <svg {...innerSvgProps}>{content}</svg>
        </i>
      );
    }
  }

  IconFont.propTypes = {
    type: PropTypes.string.isRequired, // icon
  };

  return IconFont;
}
