import { Component } from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import './index.css';

export default class VisualDom extends Component {
  static displayName = 'VisualDom';
  static defaultProps = {
    children: null
  };
  render() {
    const { children, title, label, text, __componentName } = this.props;

    return (
      <View className="visual-dom">
        <View className="panel-container">
          <Text className="title">{title || label || text || __componentName}</Text>
          <View className="content">{children}</View>
        </View>
      </View>
    );
  }
}
