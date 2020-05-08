import * as React from 'react';
import classNames from 'classnames';
import omit from 'omit.js';
import CloseOutlined from '@ant-design/icons/CloseOutlined';

import CheckableTag from './CheckableTag';
import { ConfigConsumer, ConfigConsumerProps } from '../config-provider';
import {
  PresetColorTypes,
  PresetStatusColorTypes,
  PresetColorType,
  PresetStatusColorType,
} from '../_util/colors';
import Wave from '../_util/wave';
import { LiteralUnion } from '../_util/type';

export { CheckableTagProps } from './CheckableTag';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  prefixCls?: string;
  className?: string;
  color?: LiteralUnion<PresetColorType | PresetStatusColorType, string>;
  closable?: boolean;
  visible?: boolean;
  onClose?: Function;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
}

interface TagState {
  visible: boolean;
}

const PresetColorRegex = new RegExp(`^(${PresetColorTypes.join('|')})(-inverse)?$`);
const PresetStatusColorRegex = new RegExp(`^(${PresetStatusColorTypes.join('|')})$`);

class Tag extends React.Component<TagProps, TagState> {
  static CheckableTag = CheckableTag;

  static defaultProps = {
    closable: false,
  };

  static getDerivedStateFromProps(nextProps: TagProps) {
    if ('visible' in nextProps) {
      return {
        visible: nextProps.visible,
      };
    }
    return null;
  }

  state = {
    visible: true,
  };

  getTagStyle() {
    const { color, style } = this.props;
    const isPresetColor = this.isPresetColor();
    return {
      backgroundColor: color && !isPresetColor ? color : undefined,
      ...style,
    };
  }

  getTagClassName({ getPrefixCls, direction }: ConfigConsumerProps) {
    const { prefixCls: customizePrefixCls, className, color } = this.props;
    const { visible } = this.state;
    const isPresetColor = this.isPresetColor();
    const prefixCls = getPrefixCls('tag', customizePrefixCls);
    return classNames(
      prefixCls,
      {
        [`${prefixCls}-${color}`]: isPresetColor,
        [`${prefixCls}-has-color`]: color && !isPresetColor,
        [`${prefixCls}-hidden`]: !visible,
        [`${prefixCls}-rtl`]: direction === 'rtl',
      },
      className,
    );
  }

  setVisible(visible: boolean, e: React.MouseEvent<HTMLElement>) {
    const { onClose } = this.props;
    if (onClose) {
      onClose(e);
    }

    if (e.defaultPrevented) {
      return;
    }
    if (!('visible' in this.props)) {
      this.setState({ visible });
    }
  }

  handleIconClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    this.setVisible(false, e);
  };

  isPresetColor(): boolean {
    const { color } = this.props;
    if (!color) {
      return false;
    }
    return PresetColorRegex.test(color) || PresetStatusColorRegex.test(color);
  }

  renderCloseIcon() {
    const { closable } = this.props;
    return closable ? <CloseOutlined onClick={this.handleIconClick} /> : null;
  }

  renderTag = (configProps: ConfigConsumerProps) => {
    const { children, icon, ...otherProps } = this.props;
    const isNeedWave =
      'onClick' in otherProps || (children && (children as React.ReactElement<any>).type === 'a');
    const tagProps = omit(otherProps, ['onClose', 'color', 'visible', 'closable', 'prefixCls']);
    const iconNode = icon || null;
    const kids = iconNode ? (
      <>
        {iconNode}
        <span>{children}</span>
      </>
    ) : (
      children
    );

    return isNeedWave ? (
      <Wave>
        <span
          {...tagProps}
          className={this.getTagClassName(configProps)}
          style={this.getTagStyle()}
        >
          {kids}
          {this.renderCloseIcon()}
        </span>
      </Wave>
    ) : (
      <span {...tagProps} className={this.getTagClassName(configProps)} style={this.getTagStyle()}>
        {kids}
        {this.renderCloseIcon()}
      </span>
    );
  };

  render() {
    return <ConfigConsumer>{this.renderTag}</ConfigConsumer>;
  }
}

export default Tag;
