import * as React from 'react';
import classNames from 'classnames';
import { DefaultEmptyImg } from './empty';

export interface EmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  style?: React.CSSProperties;
  imageStyle?: React.CSSProperties;
  image?: React.ReactNode | string;
  description?: React.ReactNode;
  children?: React.ReactNode;
  type?: 'default' | 'custom'; // default 默认， custom 表示自定义
}

const prefixCls = 'design-empty';
interface EmptyType extends React.FC<EmptyProps> {
  IMAGE_TYPE_SERVERBUSY: string; //服务器繁忙
  IMAGE_TYPE_SERVERNOFOUND: string; // 404
  IMAGE_TYPE_FILENOFOUND: string; //文件不存在
  IMAGE_TYPE_PROJECTNOFOUND: string; // 项目不存在
  IMAGE_TYPE_EMPTY: string; //空
}

const Empty: EmptyType = (props: EmptyProps) => {
  const {
    className,
    image = 'Empty.IMAGE_TYPE_EMPTY',
    description,
    children,
    imageStyle,
    type = 'custom',
    ...restProps
  } = props;

  if (type === 'default') {
    return <DefaultEmptyImg />;
  }

  let imageNode: React.ReactNode = null;
  const alt = typeof description === 'string' ? description : 'empty';

  if (typeof image === 'string') {
    imageNode = <img alt={alt} src={image} />;
  } else {
    imageNode = image;
  }

  return (
    <div className={classNames(prefixCls, className)} {...restProps}>
      <div className={`${prefixCls}-image`} style={imageStyle}>
        {imageNode}
      </div>
      {description && <p className={`${prefixCls}-description`}>{description}</p>}
      {children && <div className={`${prefixCls}-footer`}>{children}</div>}
    </div>
  );
};

//服务器繁忙
Empty.IMAGE_TYPE_SERVERBUSY = 'https://img.alicdn.com/tfs/TB1qPJvTFY7gK0jSZKzXXaikpXa-400-400.png';
//404
Empty.IMAGE_TYPE_SERVERNOFOUND =
  'https://img.alicdn.com/tfs/TB18gVGTUH1gK0jSZSyXXXtlpXa-400-400.png';
//文件不存在
Empty.IMAGE_TYPE_FILENOFOUND = 'https://img.alicdn.com/tfs/TB1.ClQTUT1gK0jSZFrXXcNCXXa-400-400.png';
//项目不存在
Empty.IMAGE_TYPE_PROJECTNOFOUND =
  'https://img.alicdn.com/tfs/TB1ZWumfcieb18jSZFvXXaI3FXa-400-400.png';
//空
Empty.IMAGE_TYPE_EMPTY = 'https://img.alicdn.com/tfs/TB13G0LTNv1gK0jSZFFXXb0sXXa-54-54.svg';
export default Empty;
