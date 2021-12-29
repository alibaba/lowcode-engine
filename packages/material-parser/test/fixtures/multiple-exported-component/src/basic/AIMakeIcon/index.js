import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import createFromIconfont from './IconFont';

class AIMakeIcon extends Component {
  static propTypes = {
    className: PropTypes.string,
    iconClassName: PropTypes.string,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
    styleBoxModel: PropTypes.object.isRequired,
    styleText: PropTypes.object.isRequired,
    styleBackground: PropTypes.object.isRequired,
    style: PropTypes.object,
  };

  static defaultProps = {
    className: '',
    iconClassName: 'iconfont',
    children: '',
    style: {},
  };

  render() {
    const {
      className,
      iconClassName,
      children,
      styleBoxModel,
      styleText,
      styleBackground,
      style,
      ...otherProps
    } = this.props;
    const styles = {
      ...styleBoxModel,
      ...styleText,
      ...styleBackground,
      ...style,
    };
    return (
      <i
        {...otherProps}
        className={classNames(className, iconClassName)}
        style={styles}
      >
        {children}
      </i>
    );
  }
}

AIMakeIcon.createFromIconfont = createFromIconfont;

export default AIMakeIcon;
