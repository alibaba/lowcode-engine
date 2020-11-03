import { Fragment, Component, createElement } from 'rax';
// import { observer } from './obx-rax/observer';
import RaxEngine from '@ali/lowcode-rax-renderer/lib/index';
// import RaxEngine from '../../rax-render/lib/index';
import { SimulatorRenderer } from './renderer';
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

export default class SimulatorRendererView extends Component<{ renderer: SimulatorRenderer }> {
  render() {
    const { renderer } = this.props;
    return (
      <Layout renderer={renderer}>
        <Renderer renderer={renderer} />
      </Layout>
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

// @observer
class Layout extends Component<{ renderer: SimulatorRenderer }> {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { renderer, children } = this.props;
    const layout = renderer.layout;

    if (layout) {
      const { Component, props } = layout;
      return <Component props={props}>{children}</Component>;
    }

    return <Fragment>{children}</Fragment>;
  }
}

// @observer
class Renderer extends Component<{ renderer: SimulatorRenderer }> {
  constructor(props: any) {
    super(props);
    this.props.renderer.onReRender(() => {
      this.forceUpdate();
    });
  }
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { renderer } = this.props;
    const { device, designMode } = renderer;

    return (
      <RaxEngine
        schema={renderer.schema}
        components={renderer.components}
        context={renderer.context}
        requestHandlersMap={host.requestHandlersMap}
        device={device}
        designMode={renderer.designMode}
        suspended={renderer.suspended}
        self={renderer.scope}
        onCompGetRef={(schema: any, ref: any) => {
          renderer.mountInstance(schema.id, ref);
        }}
        customCreateElement={(Component: any, props: any, children: any) => {
          const { __id, __desingMode, ...viewProps } = props;
          viewProps.componentId = __id;
          const leaf = host.document.getNode(__id);
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
