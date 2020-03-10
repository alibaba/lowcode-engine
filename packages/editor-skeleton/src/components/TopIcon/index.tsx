import React, { PureComponent } from 'react';

import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Icon, Button } from '@alifd/next';
import './index.scss';
export default class TopIcon extends PureComponent {
  static displayName = 'TopIcon';
  static propTypes = {
    active: PropTypes.bool,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    icon: PropTypes.string,
    id: PropTypes.string,
    locked: PropTypes.bool,
    onClick: PropTypes.func,
    showTitle: PropTypes.bool,
    style: PropTypes.object,
    title: PropTypes.string,
  };
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
    title: '',
  };

  render() {
    const {
      active,
      disabled,
      icon,
      locked,
      title,
      className,
      id,
      style,
      showTitle,
      onClick,
    } = this.props;
    return (
      <Button
        type="normal"
        size="large"
        text={true}
        className={classNames('lowcode-top-btn', className, {
          active,
          disabled,
          locked,
        })}
        id={id}
        style={style}
        onClick={disabled ? null : onClick}
      >
        <div>
          <Icon size="large" type={icon} />
          {showTitle && <span>{title}</span>}
        </div>
      </Button>
    );
  }
}
