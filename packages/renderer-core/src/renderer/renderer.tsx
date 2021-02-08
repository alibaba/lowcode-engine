import Debug from 'debug';
import { isEmpty } from '@ali/b3-one/lib/obj';
import adapter from '../adapter';
import contextFactory from '../context';
import { isFileSchema, goldlog } from '../utils';
import baseRendererFactory from './base';
import divFactory from '../components/Div';
import { IProps } from '../types';

export default function rendererFactory() {
  const { createElement, Component, PureComponent, findDOMNode } = adapter.getRuntime();
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
      console.error('component not found', this.props);
      return createElement(Div, this.props, this.props.children || 'Component Not Found');
    }
  }

  return class Renderer extends Component {
    static dislayName = 'renderer';

    static defaultProps = {
      appHelper: null,
      components: {},
      designMode: '',
      suspended: false,
      schema: {},
      onCompGetRef: () => { },
      onCompGetCtx: () => { },
    };

    static findDOMNode = findDOMNode;

    constructor(props: IProps, context: any) {
      super(props, context);
      this.state = {};
      debug(`entry.constructor - ${props?.schema?.componentName}`);
    }

    async componentDidMount() {
      goldlog(
        'EXP',
        {
          action: 'appear',
          value: !!this.props.designMode,
        },
        'renderer',
      );
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

    shouldComponentUpdate(nextProps: IProps) {
      return !nextProps.suspended;
    }

    __getRef = (ref: any) => {
      this.__ref = ref;
      if (ref) {
        this.props.onCompGetRef(this.props.schema, ref, true);
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
      SetComponent.patchedCatch = true;
      SetComponent.getDerivedStateFromError = (error: Error) => {
        return { engineRenderError: true, error };
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
      SetComponent.prototype.shouldComponentUpdate = function (nextProps: IProps, nextState: any) {
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
        } }, createElement(ConfigProvider, { device: this.props.device }, createElement(Comp, {
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
