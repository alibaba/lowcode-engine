import { Component, createElement } from 'react';
import { app } from '@ali/lowcode-runtime';

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

  async componentDidMount() {
    const { getPageData } = this.props;
    if (getPageData && !this.state.schema) {
      const schema = await getPageData();
      this.setState({ schema });
    }
  }

  render() {
    const { getPageData, ...restProps } = this.props;
    const { schema } = this.state;
    const Renderer = app.getRenderer();
    const Loading = app.getLoading();
    if (!Renderer || !schema) {
      if (!Loading) {
        return null;
      }
      // loading扩展点
      return createElement(Loading);
    }
    return createElement(Renderer as any, { schema, loading: Loading ? createElement(Loading) : null, ...restProps });
  }
}
