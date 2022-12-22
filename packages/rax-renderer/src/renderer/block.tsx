import { blockRendererFactory, types } from '@alilc/lowcode-renderer-core';

const raxBlockRendererFactory: () => any = () => {
  const OriginBlock = blockRendererFactory();
  return class BlockRenderer extends OriginBlock {
    render() {
      // @ts-ignore
      const that: types.IRenderer = this;
      const { __schema, __components } = that.props;
      if (that.__checkSchema(__schema)) {
        return '区块 schema 结构异常！';
      }
      that.__debug(`render - ${__schema.fileName}`);

      const children = ((context) => {
        that.context = context;
        that.__generateCtx({});
        that.__render();
        return that.__renderComp((__components as any)?.Block, { blockContext: that });
      });
      return that.__renderContextConsumer(children);
    }
  };
};

export default raxBlockRendererFactory;