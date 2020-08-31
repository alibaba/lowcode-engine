import { Component } from 'react';
import { app, Provider } from '@ali/lowcode-runtime';

interface IProps {
  getPageData: () => any;
  context: Provider;
  [key: string]: any;
}

interface IState {
  schema: object | null;
  hasError: boolean;
}

export default class LazyComponent extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      schema: null,
      hasError: false,
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  async componentDidMount() {
    const { getPageData, context } = this.props;
    if (getPageData && !this.state.schema) {
      try {
        const schema = await getPageData();
        this.setState({ schema });
        context.emitPageReady();
      } catch (error) {
        this.setState({ hasError: true });
      }
    }
  }

  componentDidCatch(error: any, errorInfo: any) {
    const { afterCatch } = app.getErrorBoundary() || {};
    if (typeof afterCatch === 'function') {
      afterCatch.call(this, error, errorInfo);
    }
  }

  render() {
    const { schema, hasError } = this.state;
    if (hasError) {
      const { fallbackUI: ErrorView } = app.getErrorBoundary() || {};
      if (!ErrorView) {
        return '';
      }
      return <ErrorView />;
    }

    const { getPageData, ...restProps } = this.props;
    const Renderer = app.getRenderer();
    const Loading = app.getLoading();
    if (!Renderer || !schema) {
      if (!Loading) {
        return null;
      }
      // loading扩展点
      return <Loading />;
    }
    return (
      <Renderer
        schema={schema}
        loading={Loading ? <Loading /> : null}
        {...restProps}
      />
    )
  }
}
