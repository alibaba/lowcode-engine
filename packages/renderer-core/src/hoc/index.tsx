import { cloneEnumerableProperty } from '@alilc/lowcode-utils';
import adapter from '../adapter';
import { IBaseRendererInstance, IRendererProps } from '../types';

interface Options {
  baseRenderer: IBaseRendererInstance;
  schema: any;
}

function patchDidCatch(Comp: any, { baseRenderer }: Options) {
  if (Comp.patchedCatch) {
    return;
  }
  Comp.patchedCatch = true;
  const { PureComponent } = adapter.getRuntime();
  // Rax 的 getDerivedStateFromError 有 BUG，这里先用 componentDidCatch 来替代
  // @see https://github.com/alibaba/rax/issues/2211
  const originalDidCatch = Comp.prototype.componentDidCatch;
  Comp.prototype.componentDidCatch = function didCatch(this: any, error: Error, errorInfo: any) {
    this.setState({ engineRenderError: true, error });
    if (originalDidCatch && typeof originalDidCatch === 'function') {
      originalDidCatch.call(this, error, errorInfo);
    }
  };

  const { engine } = baseRenderer.context;
  const originRender = Comp.prototype.render;
  Comp.prototype.render = function () {
    if (this.state && this.state.engineRenderError) {
      this.state.engineRenderError = false;
      return engine.createElement(engine.getFaultComponent(), {
        ...this.props,
        error: this.state.error,
        componentName: this.props._componentName,
      });
    }
    return originRender.call(this);
  };
  if (!(Comp.prototype instanceof PureComponent)) {
    const originShouldComponentUpdate = Comp.prototype.shouldComponentUpdate;
    Comp.prototype.shouldComponentUpdate = function (nextProps: IRendererProps, nextState: any) {
      if (nextState && nextState.engineRenderError) {
        return true;
      }
      return originShouldComponentUpdate
        ? originShouldComponentUpdate.call(this, nextProps, nextState)
        : true;
    };
  }
}

const cache = new Map();

export function compWrapper(Comp: any, options: Options) {
  const { createElement, Component, forwardRef } = adapter.getRuntime();
  if (
    Comp?.prototype?.isReactComponent || // react
    Comp?.prototype?.setState || // rax
    Comp?.prototype instanceof Component
  ) {
    patchDidCatch(Comp, options);
    return Comp;
  }

  if (cache.has(options.schema.id)) {
    return cache.get(options.schema.id);
  }

  class Wrapper extends Component {
    render() {
      return createElement(Comp, { ...this.props, ref: this.props.forwardRef });
    }
  }
  (Wrapper as any).displayName = Comp.displayName;

  patchDidCatch(Wrapper, options);

  const WrapperComponent = cloneEnumerableProperty(
    forwardRef((props: any, ref: any) => {
      return createElement(Wrapper, { ...props, forwardRef: ref });
    }),
    Comp,
  );

  cache.set(options.schema.id, WrapperComponent);

  return WrapperComponent;
}
