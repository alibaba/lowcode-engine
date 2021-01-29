import adapter from '../adapter';

export default function divFactory() {
  const { PureComponent, createElement } = adapter.getRuntime();
  return class Div extends PureComponent {
    static displayName = 'Div';

    static version = '0.0.0';

    render() {
      return createElement('div', this.props);
    }
  };
}
