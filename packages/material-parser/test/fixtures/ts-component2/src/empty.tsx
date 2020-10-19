import * as React from 'react';
import classNames from 'classnames';
import './index';
interface DefaultEmptyImg {
  className?: string;
  imageStyle?: React.CSSProperties;
}

export const DefaultEmptyImg = (props: DefaultEmptyImg) => {
  const { className, imageStyle, ...restProps } = props;
  const prefixCls = 'design-empty-default';
  const alt = 'empty';

  return (
    <div className={classNames(prefixCls, className)} {...restProps}>
      <div className={`${prefixCls}-image`} style={imageStyle}>
        <img alt={alt} src="https://img.alicdn.com/tfs/TB13G0LTNv1gK0jSZFFXXb0sXXa-54-54.svg" />
      </div>
      <p className={`${prefixCls}-description`}>暂时没有数据</p>
    </div>
  );
};
