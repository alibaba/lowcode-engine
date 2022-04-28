import baseRendererFactory from './base';
import { IBaseRendererProps, IBaseRenderComponent } from '../types';

export default function componentRendererFactory(): IBaseRenderComponent {
  const BaseRenderer = baseRendererFactory();
  return class CompRenderer extends BaseRenderer {
    static dislayName = 'comp-renderer';

    __namespace = 'component';

    __afterInit(props: IBaseRendererProps) {
      this.__generateCtx({
        component: this,
      });
      const schema = props.__schema || {};
      this.state = this.__parseData(schema.state || {});
      this.__initDataSource(props);
      this.__setLifeCycleMethods('constructor', arguments as any);
    }

    render() {
      const { __schema, __components } = this.props;
      if (this.__checkSchema(__schema)) {
        return '自定义组件 schema 结构异常！';
      }
      this.__debug(`${CompRenderer.dislayName} render - ${__schema.fileName}`);

      this.__generateCtx({
        component: this,
      });
      this.__render();

      const noContainer = this.__parseData(__schema.props?.noContainer);

      this.__bindCustomMethods(this.props);

      if (noContainer) {
        return this.__renderContextProvider({ compContext: this });
      }

      const Component = __components?.[__schema?.componentName];

      if (!Component) {
        return this.__renderContent(this.__renderContextProvider({ compContext: this }));
      }

      return this.__renderComp(Component, this.__renderContextProvider({ compContext: this }));
    }

    /** 需要重载下面几个方法，如果在低代码组件中绑定了对应的生命周期时会出现死循环 */
    componentDidMount() {}
    getSnapshotBeforeUpdate() {}
    componentDidUpdate() {}
    componentWillUnmount() {}
    componentDidCatch() {}
  };
}
