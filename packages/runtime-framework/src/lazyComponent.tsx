import { Component, createElement } from 'react';
import Boot from './boot';

interface IProps {
  getPageData: () => any;
  [key: string]: any;
}

interface IState {
  schema: object | null;
}

export default class LazyComponent extends Component<IProps, IState> {
  private schema: object | null = null;

  constructor(props: IProps) {
    super(props);
    this.state = {
      schema: null,
    };
  }

  public async componentDidMount() {
    const { getPageData } = this.props;
    if (getPageData && !this.schema) {
      const schema = await getPageData();
      this.schema = schema;
      this.setState({ schema });
    }
  }

  public render() {
    const { getPageData, ...restProps } = this.props;
    const { schema } = this.state;
    const Renderer = Boot.getRenderer();
    const Loading = Boot.getLoading();
    if (!Renderer || !schema) {
      if (!Loading) {
        return null;
      }
      // loading扩展点
      return createElement(Loading);
    }
    return createElement(Renderer as any, { schema, ...restProps });
  }
}
