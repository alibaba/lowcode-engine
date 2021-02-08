import { componentRendererFactory, types } from '@ali/lowcode-renderer-core';

export default function raxComponentRendererFactory() {
  const OriginComponent = componentRendererFactory();
  return class ComponentRenderer extends OriginComponent {
    render() {
      // @ts-ignore
      const that: types.IRenderer = this;
      const { __schema, __components } = that.props;
      if (that.__checkSchema(__schema)) {
        return '自定义组件 schema 结构异常！';
      }
      that.__debug(`render - ${__schema.fileName}`);

      const { noContainer } = that.__parseData(__schema.props);

      const children = ((context) => {
        that.context = context;
        that.__generateCtx({ component: that });
        that.__render();
        // 传 null，使用内置的 div 来渲染，解决在页面中渲染 vc-component 报错的问题
        return that.__renderComp(null, {
          compContext: that,
          blockContext: that,
        });
      });
      const content = that.__renderContextConsumer(children);

      if (noContainer) {
        return content;
      }

      return that.__renderContent(content);
    }
  };
}
