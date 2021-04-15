import { Node } from '@ali/lowcode-designer';
import LowCodeRenderer from '@ali/lowcode-react-renderer';
import { ReactInstance, Fragment, Component, createElement } from 'react';
import { observer } from '@recore/obx-react';
import { isFromVC } from '@ali/lowcode-utils';
import { SimulatorRendererContainer, DocumentInstance } from './renderer';
import { Router, Route, Switch } from 'react-router';
import './renderer.less';

const DEFAULT_SIMULATOR_LOCALE = 'zh-CN';

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
  render() {
    const { rendererContainer } = this.props;
    return (
      <Router history={rendererContainer.history}>
        <Layout rendererContainer={rendererContainer}>
          <Routes rendererContainer={rendererContainer} />
        </Layout>
      </Router>
    );
  }
}

@observer
export class Routes extends Component<{ rendererContainer: SimulatorRendererContainer }> {
  render() {
    const { rendererContainer } = this.props;
    return (
      <Switch>
        {rendererContainer.documentInstances.map((instance) => {
          return (
            <Route
              path={instance.path}
              key={instance.id}
              render={(routeProps) => <Renderer documentInstance={instance} rendererContainer={rendererContainer} {...routeProps} />}
            />
          );
        })}
      </Switch>
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
    const { layout } = rendererContainer;
    if (layout) {
      const { Component, props, componentName } = layout;
      if (Component) {
        return <Component key="layout" props={props}>{children}</Component>;
      }
      if (componentName && rendererContainer.getComponent(componentName)) {
        return createElement(
          rendererContainer.getComponent(componentName),
          {
            ...props,
            rendererContainer,
            key: 'layout',
          },
          [children],
        );
      }
    }

    return <Fragment>{children}</Fragment>;
  }
}

@observer
class Renderer extends Component<{
    rendererContainer: SimulatorRendererContainer;
    documentInstance: DocumentInstance }
  > {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { documentInstance, rendererContainer: renderer } = this.props;
    const { container } = documentInstance;
    const { designMode, device, locale } = container;
    const messages = container.context?.utils?.i18n?.messages || {};

    return (
      // @ts-ignore
      <LowCodeRenderer
        locale={locale}
        messages={messages}
        schema={documentInstance.schema}
        components={container.components}
        appHelper={container.context}
        designMode={designMode}
        device={device}
        suspended={renderer.suspended}
        self={renderer.scope}
        customCreateElement={(Component: any, props: any, children: any) => {
          const { __id, __desingMode, ...viewProps } = props;
          viewProps.componentId = __id;
          const leaf = documentInstance.getNode(__id) as Node;
          if (isFromVC(leaf?.componentMeta)) {
            viewProps._leaf = leaf;
          }
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
          if (viewProps._componentName === 'a') {
            delete viewProps.href;
          }
          // FIXME: 渲染仍有问题
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
          }

          return createElement(
            getDeviceView(Component, device, designMode),
            viewProps,
            leaf?.isContainer() ? (children == null ? [] : Array.isArray(children) ? children : [children]) : children,
          );
        }}
        onCompGetRef={(schema: any, ref: ReactInstance | null) => {
          documentInstance.mountInstance(schema.id, ref);
        }}
        // onCompGetCtx={(schema: any, ctx: object) => {
        // documentInstance.mountContext(schema.id, ctx);
        // }}
      />
    );
  }
}
