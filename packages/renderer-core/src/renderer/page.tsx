import baseRendererFactory from './base';
import { parseData } from '../utils';
import { IRendererProps } from '../types';

export default function pageRendererFactory() {
  const BaseRenderer = baseRendererFactory();
  return class PageRenderer extends BaseRenderer {
    static dislayName = 'page-renderer';

    __namespace = 'page';

    __afterInit(props: IRendererProps) {
      this.__generateCtx({
        page: this,
      });
      const schema = props.__schema || {};
      this.state = this.__parseData(schema.state || {});
      this.__initDataSource(props);
      this.__setLifeCycleMethods('constructor', arguments);
    }

    async componentDidUpdate(prevProps: any) {
      const { __ctx } = this.props;
      const prevState = parseData(prevProps.__schema.state, __ctx);
      const newState = parseData(this.props.__schema.state, __ctx);
      // 当编排的时候修改schema.state值，需要将最新schema.state值setState
      if (JSON.stringify(newState) != JSON.stringify(prevState)) {
        this.setState(newState);
      }

      super.componentDidUpdate(...arguments);
    }

    render() {
      const { __schema, __components } = this.props;
      if (this.__checkSchema(__schema)) {
        return '页面schema结构异常！';
      }
      this.__debug(`render - ${__schema.fileName}`);

      this.__bindCustomMethods(this.props);
      this.__initDataSource(this.props);

      // this.__setLifeCycleMethods('constructor', arguments);

      this.__generateCtx({
        page: this,
      });
      this.__render();


      const { Page } = __components;
      if (Page) {
        return this.__renderComp(Page, { pageContext: this });
      }

      return this.__renderContent(this.__renderContextProvider({ pageContext: this }));
    }
  };
}
