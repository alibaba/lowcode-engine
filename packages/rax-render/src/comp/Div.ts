import { createElement, PureComponent } from 'rax';

export default class DivView extends PureComponent {
  static displayName = 'Div';

  static version = '0.0.0';

  render() {
    return createElement('div', this.props);
  }
}
