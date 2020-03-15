import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { Icon } from '@alifd/next';

import './index.scss';

export interface TopIconProps {
  active?: boolean;
  className?: string;
  disabled?: boolean;
  icon: string;
  id?: string;
  locked?: boolean;
  marked?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
  title?: string;
}

export default class TopIcon extends PureComponent<TopIconProps> {
  static displayName = 'LowcodeTopIcon';

  static defaultProps = {
    active: false,
    className: '',
    disabled: false,
    icon: '',
    id: '',
    locked: false,
    onClick: (): void => {},
    style: {},
    title: ''
  };

  render(): React.ReactNode {
    const { active, disabled, icon, locked, title, className, id, style, onClick } = this.props;
    return (
      <div
        className={classNames('lowcode-top-icon', className, {
          active,
          disabled,
          locked
        })}
        data-tooltip={title}
        id={id}
        style={style}
        onClick={disabled ? undefined : onClick}
      >
        <Icon type={icon} />
      </div>
    );
  }
}
