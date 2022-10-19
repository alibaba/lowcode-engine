import RaxRenderer from '@alilc/lowcode-rax-renderer';
import { History } from 'history';
import { Component, createElement, Fragment } from 'rax';
import { useRouter } from './rax-use-router';
import { DocumentInstance, SimulatorRendererContainer } from './renderer';
import './renderer.less';
import { uniqueId } from '@alilc/lowcode-utils';
import { GlobalEvent } from '@alilc/lowcode-types';
import { host } from './host';

// patch cloneElement avoid lost keyProps
const originCloneElement = (window as any).Rax.cloneElement;
(window as any).Rax.cloneElement = (child: any, { _leaf, ...props }: any = {}, ...rest: any[]) => {
  if (child.ref && props.ref) {
    const dRef = props.ref;
    const cRef = child.ref;
    props.ref = (x: any) => {
      if (cRef) {
        if (typeof cRef === 'function') {
          cRef(x);
        } else {
          try {
            cRef.current = x;
          } catch (e) {
            console.error(e);
          }
        }
      }
      if (dRef) {
        if (typeof dRef === 'function') {
          dRef(x);
        } else {
          try {
            dRef.current = x;
          } catch (e) {
            console.error(e);
          }
        }
      }
    };
  }
  return originCloneElement(child, props, ...rest);
};

export default class SimulatorRendererView extends Component<{ rendererContainer: SimulatorRendererContainer }> {
  private unlisten: any;

  componentDidMount() {
    const { rendererContainer } = this.props;
    this.unlisten = rendererContainer.onLayoutChange(() => {
      this.forceUpdate();
    });
  }

  componentWillUnmount() {
    if (this.unlisten) {
      this.unlisten();
    }
  }

  render() {
    const { rendererContainer } = this.props;
    return (
      <Layout rendererContainer={rendererContainer}>
        <Routes rendererContainer={rendererContainer} history={rendererContainer.history} />
      </Layout>
    );
  }
}

export const Routes = (props: {
  rendererContainer: SimulatorRendererContainer;
  history: History;
}) => {
  const { rendererContainer, history } = props;
  const { documentInstances } = rendererContainer;

  const routes = {
    history,
    routes: documentInstances.map(instance => {
      return {
        path: instance.path,
        component: (props: any) => <Renderer key={instance.id} rendererContainer={rendererContainer} documentInstance={instance} {...props} />,
      };
    }),
  };
  const { component } = useRouter(routes);
  return component;
};

function ucfirst(s: string) {
  return s.charAt(0).toUpperCase() + s.substring(1);
}
function getDeviceView(view: any, device: string, mode: string) {
  if (!view || typeof view === 'string') {
    return view;
  }

  // compatible vision Mobile | Preview
  device = ucfirst(device);
  if (device === 'Mobile' && view.hasOwnProperty(device)) {
    view = view[device];
  }
  mode = ucfirst(mode);
  if (mode === 'Preview' && view.hasOwnProperty(mode)) {
    view = view[mode];
  }
  return view;
}

class Layout extends Component<{ rendererContainer: SimulatorRendererContainer }> {
  constructor(props: any) {
    super(props);
    this.props.rendererContainer.onReRender(() => {
      this.forceUpdate();
    });
  }

  render() {
    const { rendererContainer, children } = this.props;
    const { layout } = rendererContainer;

    if (layout) {
      const { Component, props, componentName } = layout;
      if (Component) {
        return <Component props={props}>{children}</Component>;
      }
      if (componentName && rendererContainer.getComponent(componentName)) {
        return createElement(
          rendererContainer.getComponent(componentName),
          {
            ...props,
            rendererContainer,
          },
          [children],
        );
      }
    }

    return <Fragment>{children}</Fragment>;
  }
}

class Renderer extends Component<{
  rendererContainer: SimulatorRendererContainer;
  documentInstance: DocumentInstance;
}> {
  private unlisten: any;
  private key: string;
  private startTime: number | null = null;

  componentWillMount() {
    this.key = uniqueId('renderer');
  }

  componentDidMount() {
    const { documentInstance } = this.props;
    this.unlisten = documentInstance.onReRender((params) => {
      if (params && params.shouldRemount) {
        this.key = uniqueId('renderer');
      }
      this.forceUpdate();
    });
  }

  componentWillUnmount() {
    if (this.unlisten) {
      this.unlisten();
    }
  }
  shouldComponentUpdate() {
    return false;
  }

  componentDidUpdate() {
    if (this.startTime) {
      const time = Date.now() - this.startTime;
      const nodeCount = host.designer.currentDocument?.getNodeCount?.();
      host.designer.editor?.emit(GlobalEvent.Node.Rerender, {
        componentName: 'Renderer',
        type: 'All',
        time,
        nodeCount,
      });
    }
  }

  schemaChangedSymbol = false;

  getSchemaChangedSymbol = () => {
    return this.schemaChangedSymbol;
  };

  setSchemaChangedSymbol = (symbol: boolean) => {
    this.schemaChangedSymbol = symbol;
  };

  render() {
    const { documentInstance } = this.props;
    const { container, document } = documentInstance;
    const { designMode, device } = container;
    const { rendererContainer: renderer } = this.props;
    this.startTime = Date.now();
    this.schemaChangedSymbol = false;

    return (
      <RaxRenderer
        schema={documentInstance.schema}
        components={renderer.components}
        appHelper={renderer.context}
        context={renderer.context}
        device={device}
        designMode={renderer.designMode}
        key={this.key}
        __host={host}
        __container={container}
        suspended={documentInstance.suspended}
        self={documentInstance.scope}
        onCompGetRef={(schema: any, ref: any) => {
          documentInstance.mountInstance(schema.id, ref);
        }}
        thisRequiredInJSE={host.thisRequiredInJSE}
        documentId={document.id}
        getNode={(id: string) => documentInstance.getNode(id) as any}
        rendererName="PageRenderer"
        customCreateElement={(Component: any, props: any, children: any) => {
          const { __id, ...viewProps } = props;
          viewProps.componentId = __id;
          const leaf = documentInstance.getNode(__id);
          viewProps._leaf = leaf;
          viewProps._componentName = leaf?.componentName;
          // 如果是容器 && 无children && 高宽为空 增加一个占位容器，方便拖动
          if (
            !viewProps.dataSource &&
            leaf?.isContainer() &&
            (children == null || (Array.isArray(children) && !children.length)) &&
            (!viewProps.style || Object.keys(viewProps.style).length === 0)
          ) {
            children = (
              <div className="lc-container-placeholder" style={viewProps.placeholderStyle}>
                {viewProps.placeholder || '拖拽组件或模板到这里'}
              </div>
            );
          }

          // if (viewProps._componentName === 'Menu') {
          //   Object.assign(viewProps, {
          //     _componentName: 'Menu',
          //     className: '_css_pesudo_menu_kbrzyh0f',
          //     context: { VE: (window as any).VisualLowCodeRenderer },
          //     direction: undefined,
          //     events: { ignored: true },
          //     fieldId: 'menu_kbrzyh0f',
          //     footer: '',
          //     header: '',
          //     mode: 'inline',
          //     onItemClick: { ignored: true },
          //     onSelect: { ignored: true },
          //     popupAlign: 'follow',
          //     selectMode: false,
          //     triggerType: 'click',
          //   });
          //   console.info('menuprops', viewProps);
          // }

          return createElement(
            getDeviceView(Component, device, designMode),
            viewProps,
            leaf?.isContainer() ? (children == null ? [] : Array.isArray(children) ? children : [children]) : children,
          );
        }}
      />
    );
  }
}
