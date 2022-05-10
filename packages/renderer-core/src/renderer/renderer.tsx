import Debug from 'debug';
import adapter from '../adapter';
import contextFactory from '../context';
import { isFileSchema, isEmpty } from '../utils';
import baseRendererFactory from './base';
import divFactory from '../components/Div';
import { IGeneralConstructor, IRenderComponent, IRendererProps, IRendererState } from '../types';
import { RootSchema } from '@alilc/lowcode-types';

export default function rendererFactory(): IRenderComponent {
  const runtime = adapter.getRuntime();
  const Component = runtime.Component as IGeneralConstructor<IRendererProps, Record<string, any>>;
  const PureComponent = runtime.PureComponent as IGeneralConstructor<IRendererProps, Record<string, any>>;
  const { createElement, findDOMNode } = runtime;
  const RENDERER_COMPS: any = adapter.getRenderers();
  const BaseRenderer = baseRendererFactory();
  const AppContext = contextFactory();
  const Div = divFactory();

  const ConfigProvider = adapter.getConfigProvider() || Div;

  const debug = Debug('renderer:entry');

  class FaultComponent extends PureComponent {
    render() {
      // FIXME: errorlog
      console.error('render error', this.props);
      return createElement(Div, {
        style: {
          width: '100%',
          height: '50px',
          lineHeight: '50px',
          textAlign: 'center',
          fontSize: '15px',
          color: '#ff0000',
          border: '2px solid #ff0000',
        },
      }, '组件渲染异常，请查看控制台日志');
    }
  }

  class NotFoundComponent extends PureComponent {
    render() {
      return createElement(Div, this.props, this.props.children || 'Component Not Found');
    }
  }

  return class Renderer extends Component {
    static dislayName = 'renderer';

    state: Partial<IRendererState> = {};

    __ref: any;

    static defaultProps: IRendererProps = {
      appHelper: undefined,
      components: {},
      designMode: '',
      suspended: false,
      schema: {} as RootSchema,
      onCompGetRef: () => { },
      onCompGetCtx: () => { },
    };

    static findDOMNode = findDOMNode;

    constructor(props: IRendererProps, context: any) {
      super(props, context);
      this.state = {};
      debug(`entry.constructor - ${props?.schema?.componentName}`);
    }

    async componentDidMount() {
      debug(`entry.componentDidMount - ${this.props.schema && this.props.schema.componentName}`);
    }

    async componentDidUpdate() {
      debug(`entry.componentDidUpdate - ${this.props?.schema?.componentName}`);
    }

    async componentWillUnmount() {
      debug(`entry.componentWillUnmount - ${this.props?.schema?.componentName}`);
    }

    async componentDidCatch(e: any) {
      console.warn(e);
    }

    shouldComponentUpdate(nextProps: IRendererProps) {
      return !nextProps.suspended;
    }

    __getRef = (ref: any) => {
      this.__ref = ref;
      if (ref) {
        this.props.onCompGetRef?.(this.props.schema, ref);
      }
    };

    isValidComponent(SetComponent: any) {
      return SetComponent;
    }

    patchDidCatch(SetComponent: any) {
      if (!this.isValidComponent(SetComponent)) {
        return;
      }
      if (SetComponent.patchedCatch) {
        return;
      }
      if (!SetComponent.prototype) {
        return;
      }
      SetComponent.patchedCatch = true;

      // Rax 的 getDerivedStateFromError 有 BUG，这里先用 componentDidCatch 来替代
      // @see https://github.com/alibaba/rax/issues/2211
      const originalDidCatch = SetComponent.prototype.componentDidCatch;
      SetComponent.prototype.componentDidCatch = function didCatch(this: any, error: Error, errorInfo: any) {
        this.setState({ engineRenderError: true, error });
        if (originalDidCatch && typeof originalDidCatch === 'function') {
          originalDidCatch.call(this, error, errorInfo);
        }
      };

      const engine = this;
      const originRender = SetComponent.prototype.render;
      SetComponent.prototype.render = function () {
        if (this.state && this.state.engineRenderError) {
          this.state.engineRenderError = false;
          return engine.createElement(engine.getFaultComponent(), {
            ...this.props,
            error: this.state.error,
          });
        }
        return originRender.call(this);
      };
      const originShouldComponentUpdate = SetComponent.prototype.shouldComponentUpdate;
      SetComponent.prototype.shouldComponentUpdate = function (nextProps: IRendererProps, nextState: any) {
        if (nextState && nextState.engineRenderError) {
          return true;
        }
        return originShouldComponentUpdate ? originShouldComponentUpdate.call(this, nextProps, nextState) : true;
      };
    }

    createElement(SetComponent: any, props: any, children?: any) {
      // TODO: enable in runtime mode?
      this.patchDidCatch(SetComponent);
      return (this.props.customCreateElement || createElement)(SetComponent, props, children);
    }

    getNotFoundComponent() {
      return this.props.notFoundComponent || NotFoundComponent;
    }

    getFaultComponent() {
      return this.props.faultComponent || FaultComponent;
    }

    render() {
      const { schema, designMode, appHelper, components } = this.props;
      if (isEmpty(schema)) {
        return null;
      }
      // 兼容乐高区块模板
      if (schema.componentName !== 'Div' && !isFileSchema(schema)) {
        return '模型结构异常';
      }
      debug('entry.render');
      const { componentName } = schema;
      const allComponents = { ...RENDERER_COMPS, ...components };
      let Comp = allComponents[componentName] || RENDERER_COMPS[`${componentName}Renderer`];
      if (Comp && Comp.prototype) {
        if (!(Comp.prototype instanceof BaseRenderer)) {
          Comp = RENDERER_COMPS[`${componentName}Renderer`];
        }
      }

      if (Comp) {
        return createElement(AppContext.Provider, { value: {
          appHelper,
          components: allComponents,
          engine: this,
        } }, createElement(ConfigProvider, {
          device: this.props.device,
          locale: this.props.locale,
        }, createElement(Comp, {
          key: schema.__ctx && `${schema.__ctx.lceKey}_${schema.__ctx.idx || '0'}`,
          ref: this.__getRef,
          __appHelper: appHelper,
          __components: allComponents,
          __schema: schema,
          __designMode: designMode,
          ...this.props,
        })));
      }
      return null;
    }
  };
}
