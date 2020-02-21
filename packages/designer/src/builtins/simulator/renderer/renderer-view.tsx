import LowCodeRenderer from '@ali/iceluna-sdk';
import { ReactInstance, Fragment, Component } from 'react';
import { observer } from '@recore/core-obx';
import { SimulatorRenderer } from './renderer';
import './renderer.less';

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
class Layout extends Component<{ renderer: SimulatorRenderer; }> {
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
    const { components, schemas } = LowCodeRenderer.others
    return (
      <LowCodeRenderer
        schema={renderer.schema}
        components={components /*renderer.components*/}
        appHelper={renderer.context}
        // context={renderer.context}
        designMode={renderer.designMode}
        componentsMap={renderer.componentsMap}
        suspended={renderer.suspended}
        self={renderer.scope}
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
