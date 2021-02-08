import baseRendererFactory from './base';
import { IRendererProps } from '../types';

export default function blockRendererFactory() {
  const BaseRenderer = baseRendererFactory();
  return class BlockRenderer extends BaseRenderer {
    static dislayName = 'block-renderer';

    __namespace = 'block';

    __afterInit(props: IRendererProps) {
      this.__generateCtx({});
      const schema = props.__schema || {};
      this.state = this.__parseData(schema.state || {});
      this.__initDataSource(props);
      this.__setLifeCycleMethods('constructor', arguments);
    }

    render() {
      const { __schema, __components } = this.props;

      if (this.__checkSchema(__schema, 'Div')) {
        return '区块 schema 结构异常！';
      }

      this.__debug(`render - ${__schema.fileName}`);
      this.__generateCtx({});
      this.__render();

      const { Block } = __components;
      if (Block) {
        return this.__renderComp(Block, {});
      }

      return this.__renderContent(this.__renderContextProvider());
    }
  };
}
