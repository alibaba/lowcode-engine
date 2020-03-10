import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { Icon, Button } from '@alifd/next';

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
  showTitle?: boolean;
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
    onClick: () => {},
    showTitle: false,
    style: {},
    title: ''
  };

  render() {
    const { active, disabled, icon, locked, title, className, id, style, showTitle, onClick } = this.props;
    return (
      <Button
        type="normal"
        size="large"
        text={true}
        className={classNames('lowcode-top-btn', className, {
          active,
          disabled,
          locked
        })}
        data-tooltip={title}
        id={id}
        style={style}
        onClick={disabled ? undefined : onClick}
      >
        <div>
          <Icon size="large" type={icon} />
          {showTitle && <span>{title}</span>}
        </div>
      </Button>
    );
  }
}
