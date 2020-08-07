import LowCodeRenderer from '@ali/lowcode-react-renderer';
import { ReactInstance, Fragment, Component, createElement } from 'react';
import { observer } from '@recore/obx-react';
import { SimulatorRendererContainer, DocumentInstance } from './renderer';
import './renderer.less';

// patch cloneElement avoid lost keyProps
const originCloneElement = window.React.cloneElement;
(window as any).React.cloneElement = (child: any, { _leaf, ...props }: any = {}, ...rest: any[]) => {
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
        <Router onChange={(currentPath: string) => {
          rendererContainer.redirect(currentPath);
        }}>
          {rendererContainer.getDocumentInstances().map((instance) => {
            return <Route path={instance.document.get('fileName')}>
              <Renderer documentInstance={instance} />
            </Route>
          })}
        </Router>
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

@observer
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

@observer
class Renderer extends Component<{ documentInstance: DocumentInstance }> {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    const { documentInstance } = this.props;
    const { container } = documentInstance;
    const { designMode, device } = container;

    return (
      <LowCodeRenderer
        schema={documentInstance.schema}
        components={container.components}
        appHelper={container.context}
        // context={renderer.context}
        designMode={designMode}
        suspended={documentInstance.suspended}
        self={documentInstance.scope}
        customCreateElement={(Component: any, props: any, children: any) => {
          const { __id, __desingMode, ...viewProps } = props;
          viewProps.componentId = __id;
          const leaf = documentInstance.getNode(__id);
          viewProps._leaf = leaf;
          viewProps._componentName = leaf?.componentName;
          let _children = leaf?.isContainer() ? (children == null ? [] : Array.isArray(children) ? children : [children]) : children;
          if (props.children && props.children.length) {
            if (Array.isArray(props.children)) {
              _children = Array.isArray(_children) ? _children.concat(props.children) : props.children.unshift(_children);
            } else {
              Array.isArray(_children) && _children.push(props.children) || (_children = [_children].push(props.children));
            }
          }
          // 如果是容器 && 无children && 高宽为空 增加一个占位容器，方便拖动
          if (leaf?.isContainer() && (_children == null || !_children.length) && (!viewProps.style || Object.keys(viewProps.style).length == 0)){
            _children = <div style={{
              height:'66px',
              backgroundColor:'#f0f0f0',
              borderColor:'#a7b1bd',
              border: '1px dotted',
              color:'#a7b1bd',
              textAlign:'center',
              lineHeight:'66px'
            }}>
              拖拽组件或模板到这里
            </div>
          }

          if (viewProps._componentName === 'Menu') {
            Object.assign(viewProps, {
              _componentName: 'Menu',
              className: '_css_pesudo_menu_kbrzyh0f',
              context: { VE: (window as any).VisualEngine },
              direction: undefined,
              events: { ignored: true },
              fieldId: 'menu_kbrzyh0f',
              footer: '',
              header: '',
              mode: 'inline',
              onItemClick: { ignored: true },
              onSelect: { ignored: true },
              popupAlign: 'follow',
              selectMode: false,
              triggerType: 'click',
            });
            console.info('menuprops', viewProps);
          }

          return createElement(
            getDeviceView(Component, device, designMode),
            viewProps,
            _children,
          );
        }}
        onCompGetRef={(schema: any, ref: ReactInstance | null) => {
          documentInstance.mountInstance(schema.id, ref);
        }}
        //onCompGetCtx={(schema: any, ctx: object) => {
        // renderer.mountContext(schema.id, ctx);
        //}}
      />
    );
  }
}
