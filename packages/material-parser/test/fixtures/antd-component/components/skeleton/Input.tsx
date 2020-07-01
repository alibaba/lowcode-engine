import * as React from 'react';
import omit from 'omit.js';
import classNames from 'classnames';
import Element, { SkeletonElementProps } from './Element';
import { ConfigConsumer, ConfigConsumerProps } from '../config-provider';

export interface SkeletonInputProps extends Omit<SkeletonElementProps, 'size' | 'shape'> {
  size?: 'large' | 'small' | 'default';
}

const SkeletonInput = (props: SkeletonInputProps) => {
  const renderSkeletonInput = ({ getPrefixCls }: ConfigConsumerProps) => {
    const { prefixCls: customizePrefixCls, className, active } = props;
    const prefixCls = getPrefixCls('skeleton', customizePrefixCls);
    const otherProps = omit(props, ['prefixCls']);
    const cls = classNames(prefixCls, className, `${prefixCls}-element`, {
      [`${prefixCls}-active`]: active,
    });
    return (
      <div className={cls}>
        <Element prefixCls={`${prefixCls}-input`} {...otherProps} />
      </div>
    );
  };
  return <ConfigConsumer>{renderSkeletonInput}</ConfigConsumer>;
};

SkeletonInput.defaultProps = {
  size: 'default',
};

export default SkeletonInput;
