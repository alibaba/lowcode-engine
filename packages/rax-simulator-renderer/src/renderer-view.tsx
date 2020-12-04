import RaxEngine from '@ali/lowcode-rax-renderer/lib/index';
import { History } from 'history';
import { Component, createElement, Fragment } from 'rax';
import { useRouter } from './rax-use-router';
import { DocumentInstance, SimulatorRendererContainer } from './renderer';
import './renderer.less';
import { uniqueId } from '@ali/lowcode-utils';

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
  rendererContainer: SimulatorRendererContainer,
  history: History
}) => {
  const { rendererContainer, history } = props;
  const { documentInstances } = rendererContainer;

  const routes = {
    history,
    routes: documentInstances.map(instance => {
      return {
        path: instance.path,
        component: (props: any) => <Renderer key={instance.id} rendererContainer={rendererContainer} documentInstance={instance} {...props} />
      };
    })
  };
  const { component } = useRouter(routes);
  return component;
}

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
    const layout = rendererContainer.layout;

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

  render() {
    const { documentInstance } = this.props;
    const { container } = documentInstance;
    const { designMode, device } = container;
    const { rendererContainer: renderer } = this.props;
    return (
      <RaxEngine
        schema={documentInstance.schema}
        components={renderer.components}
        appHelper={renderer.context}
        context={renderer.context}
        appHelper={renderer.context}
        device={device}
        designMode={renderer.designMode}
        key={this.key}
        suspended={documentInstance.suspended}
        self={documentInstance.scope}
        onCompGetRef={(schema: any, ref: any) => {
          documentInstance.mountInstance(schema.id, ref);
        }}
        customCreateElement={(Component: any, props: any, children: any) => {
          const { __id, __desingMode, ...viewProps } = props;
          viewProps.componentId = __id;
          const leaf = documentInstance.getNode(__id);
          viewProps._leaf = leaf;
          viewProps._componentName = leaf?.componentName;

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
            leaf?.isContainer() ? (children == null ? [] : Array.isArray(children) ? children : [children]) : null,
          );
        }}
      />
    );
  }
}
