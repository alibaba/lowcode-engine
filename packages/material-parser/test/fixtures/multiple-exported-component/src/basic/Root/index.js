import React from 'react';
import PropTypes from 'prop-types';

class Root extends React.Component {
  static propTypes = {
    style: PropTypes.object,
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element),
    ]),
  };

  static defaultProps = {
    style: {
      padding: 0,
      backgroundColor: '#f0f2f5',
      minHeight: '100%',
    },
    children: null,
  };

  render() {
    const { style, children } = this.props;
    const newStyle = Object.assign({}, Root.defaultProps.style, style);
    return <div style={newStyle}>{children}</div>;
  }
}

export default Root;
