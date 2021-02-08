import { pageRendererFactory, types } from '@ali/lowcode-renderer-core';

export default function raxPageRendererFactory() {
  const OriginPage = pageRendererFactory();
  return class PageRenderer extends OriginPage {
    async componentDidUpdate() {
      // @ts-ignore
      super.componentDidUpdate(...arguments);
    }

    render() {
      // @ts-ignore
      const that: types.IRenderer = this;
      const { __schema, __components } = that.props;
      if (that.__checkSchema(__schema)) {
        return '页面 schema 结构异常！';
      }
      that.__debug(`render - ${__schema?.fileName}`);

      const { Page } = __components as any;
      if (Page) {
        const children = ((context) => {
          that.context = context;
          that.__render();
          return that.__renderComp(Page, { pageContext: that });
        });
        return that.__renderContextConsumer(children);
      }

      return that.__renderContent(that.__renderContextProvider({ pageContext: that }));
    }
  };
}
