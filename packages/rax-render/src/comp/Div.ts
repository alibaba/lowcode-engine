import { createElement, PureComponent } from 'rax';

export default class DivView extends PureComponent {
  static displayName = 'Div';

  static version = '0.0.0';

  render(): any {
    return createElement('div', this.props);
  }
}
