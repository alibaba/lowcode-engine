import { Fragment, Component, createElement } from 'rax';
// import { observer } from './obx-rax/observer';
import RaxEngine from '@ali/lowcode-rax-renderer/lib/index';
// import RaxEngine from '../../rax-render/lib/index';
import { SimulatorRendererContainer, DocumentInstance } from './renderer';
import { host } from './host';

import './renderer.less';

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
          } catch (e) {}
        }
      }
      if (dRef) {
        if (typeof dRef === 'function') {
          dRef(x);
        } else {
          try {
            dRef.current = x;
          } catch (e) {}
        }
      }
    };
  }
  return originCloneElement(child, props, ...rest);
};

export default class SimulatorRendererView extends Component<{ rendererContainer: SimulatorRendererContainer }> {
  render() {
    const { rendererContainer } = this.props;
    return (
      <Layout rendererContainer={rendererContainer}>
        <Routes rendererContainer={rendererContainer} />
      </Layout>
    );
  }
}

export class Routes extends Component<{ rendererContainer: SimulatorRendererContainer }> {
  render() {
    const { rendererContainer } = this.props;
    return (
      <Fragment>
        {rendererContainer.documentInstances.map((instance, index) => {
          console.log("Routes");
          return (
            <Renderer key={index} rendererContainer={rendererContainer} documentInstance={instance} />
          );
        })}
      </Fragment>
    );
  }
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
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { rendererContainer, children } = this.props;
    const layout = rendererContainer.layout;

    if (layout) {
      const { Component, props } = layout;
      return <Component props={props}>{children}</Component>;
    }

    return <Fragment>{children}</Fragment>;
  }
}

class Renderer extends Component<{ rendererContainer: SimulatorRendererContainer, documentInstance: DocumentInstance }> {
  constructor(props: any) {
    super(props);
    this.props.rendererContainer.onReRender(() => {
      this.forceUpdate();
    });
  }
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { documentInstance } = this.props;
    const { container } = documentInstance;
    const { designMode, device } = container;
    const { rendererContainer: renderer } = this.props;
    // const { device, designMode } = renderer;

    return (
      <RaxEngine
        schema={documentInstance.schema}
        components={renderer.components}
        context={renderer.context}
        designMode={renderer.designMode}
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
