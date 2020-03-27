import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './index.scss';
export default class VisualDom extends PureComponent {
  static displayName = 'VisualDom';
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
  };
  static defaultProps = {
    children: null,
  };
  render() {
    const { children, cell, title, label, text, __componentName } = this.props;
    let mainContent = children;
    if (cell && typeof cell === 'function') {
      mainContent = cell();
    }
    return (
      <div className="visual-dom">
        <div className="panel-container">
          <span className="title">{title || label || text || __componentName}</span>
          <div className="content">{mainContent}</div>
        </div>
      </div>
    );
  }
}
