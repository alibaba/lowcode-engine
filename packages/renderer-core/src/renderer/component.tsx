import baseRendererFactory from './base';
import { IRendererProps } from '../types';

export default function componentRendererFactory() {
  const BaseRenderer = baseRendererFactory();
  return class CompRenderer extends BaseRenderer {
    static dislayName = 'comp-renderer';
    __namespace = 'component';

    __afterInit(props: IRendererProps) {
      this.__generateCtx({
        component: this,
      });
      const schema = props.__schema || {};
      this.state = this.__parseData(schema.state || {});
      this.__initDataSource(props);
      this.__setLifeCycleMethods('constructor', arguments);
    }

    render() {
      const { __schema } = this.props;
      if (this.__checkSchema(__schema)) {
        return '自定义组件 schema 结构异常！';
      }
      this.__debug(`render - ${__schema.fileName}`);

      this.__generateCtx({
        component: this,
      });
      this.__render();

      const { noContainer } = this.__parseData(__schema.props);

      if (noContainer) {
        return this.__renderContextProvider({ compContext: this });
      }

      return this.__renderContent(this.__renderContextProvider({ compContext: this }));
    }
  };
}
