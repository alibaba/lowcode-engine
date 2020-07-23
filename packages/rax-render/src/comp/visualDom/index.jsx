import { Component } from 'rax';
import './index.css';

export default class VisualDom extends Component {
  static displayName = 'VisualDom';
  static defaultProps = {
    children: null
  };
  render() {
    const { children, title, label, text, __componentName } = this.props;

    return (
      <div className="visual-dom">
        <div className="panel-container">
          <span className="title">{title || label || text || __componentName}</span>
          <div className="content">{children}</div>
        </div>
      </div>
    );
  }
}
