import LowCodeRenderer from '@ali/lowcode-react-renderer';
import { ReactInstance, Fragment, Component, createElement } from 'react';
import { observer } from '@recore/obx-react';
import { SimulatorRenderer } from './renderer';
import './renderer.less';
import { host } from './host';

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
    // const { components, schemas } = LowCodeRenderer.others;
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
          return createElement(Component, viewProps, children);
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
