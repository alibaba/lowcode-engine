import LowCodeRenderer from '@ali/lowcode-react-renderer';
import { isObject } from 'lodash';
import { ReactInstance, Fragment, Component, createElement } from 'react';
import { observer } from '@recore/obx-react';
import { SimulatorRenderer } from './renderer';
import { host } from './host';
import './renderer.less';

// patch cloneElement avoid lost keyProps
const originCloneElement = window.React.cloneElement;
(window as any).React.cloneElement = (child: any, { _leaf, ...props }: any = {}) => {
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
  return originCloneElement(child, props);
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

function getDeviceView(view: any, device: string) {
  if (!view || typeof view === 'string' || device === 'default') {
    return view;
  }

  /*
  const viewport = Viewport.getViewport();
  if (viewport) {
    if (view.hasOwnProperty(device)) {
      view = view[device];
    }

    if (view.hasOwnProperty(mode)) {
      view = view[mode];
    }
  }*/
  return view;
}

@observer
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

@observer
class Renderer extends Component<{ renderer: SimulatorRenderer }> {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { renderer } = this.props;
    const device = renderer.designMode
    return (
      <LowCodeRenderer
        schema={renderer.schema}
        components={renderer.components}
        appHelper={renderer.context}
        // context={renderer.context}
        designMode={renderer.designMode}
        suspended={renderer.suspended}
        self={renderer.scope}
        customCreateElement={(Component: any, props: any, children: any) => {
          const { __id, __desingMode, ...viewProps } = props;
          viewProps.componentId = __id;
          viewProps._leaf = host.document.getNode(__id);

          return createElement(
            getDeviceView(Component, device),
            viewProps,
            children == null ? [] : Array.isArray(children) ? children : [children],
          );
        }}
        onCompGetRef={(schema: any, ref: ReactInstance | null) => {
          renderer.mountInstance(schema.id, ref);
        }}
        //onCompGetCtx={(schema: any, ctx: object) => {
        // renderer.mountContext(schema.id, ctx);
        //}}
      />
    );
  }
}
