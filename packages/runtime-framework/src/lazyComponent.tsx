import { Component, createElement } from 'react';
import Trunk from './trunk';

interface IProps {
  getPageData: () => any;
  [key: string]: any;
}

interface IState {
  schema: object | null;
}

export default class LazyComponent extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      schema: null,
    };
  }

  public async componentDidMount() {
    const { getPageData } = this.props;
    if (getPageData) {
      const schema = await getPageData();
      this.setState({ schema });
    }
  }

  public render() {
    const Renderer = Trunk.getRenderer();
    if (!Renderer) {
      return null;
    }
    const { getPageData, ...restProps } = this.props;
    const { schema } = this.state;
    return createElement(Renderer as any, { schema, ...restProps });
  }
}
