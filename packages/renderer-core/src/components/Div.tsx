import adapter from '../adapter';
import { IGeneralConstructor } from '../types';

export default function divFactory(): IGeneralConstructor {
  const { PureComponent, createElement } = adapter.getRuntime();
  return class Div extends PureComponent {
    static displayName = 'Div';

    static version = '0.0.0';

    render() {
      return createElement('div', this.props);
    }
  };
}
