import { getLogger } from '@alilc/lowcode-utils';
import baseRendererFactory from './base';
import { IBaseRendererProps, IBaseRenderComponent } from '../types';

const logger = getLogger({ level: 'warn', bizName: 'renderer-core:page' });

export default function pageRendererFactory(): IBaseRenderComponent {
  const BaseRenderer = baseRendererFactory();
  return class PageRenderer extends BaseRenderer {
    static displayName = 'PageRenderer';

    __namespace = 'page';

    __afterInit(props: IBaseRendererProps, ...rest: unknown[]) {
      this.__generateCtx({
        page: this,
      });
      const schema = props.__schema || {};
      this.state = this.__parseData(schema.state || {});
      this.__initDataSource(props);
      this.__executeLifeCycleMethod('constructor', [props, ...rest]);
    }

    async componentDidUpdate(prevProps: IBaseRendererProps, _prevState: {}, snapshot: unknown) {
      const { __ctx } = this.props;
      // 当编排的时候修改 schema.state 值，需要将最新 schema.state 值 setState
      if (JSON.stringify(prevProps.__schema.state) != JSON.stringify(this.props.__schema.state)) {
        const newState = this.__parseData(this.props.__schema.state, __ctx);
        this.setState(newState);
      }

      super.componentDidUpdate?.(prevProps, _prevState, snapshot);
    }

    setState(state: any, callback?: () => void) {
      logger.info('page set state', state);
      super.setState(state, callback);
    }

    render() {
      const { __schema, __components } = this.props;
      if (this.__checkSchema(__schema)) {
        return '页面schema结构异常！';
      }
      this.__debug(`${PageRenderer.displayName} render - ${__schema.fileName}`);

      this.__bindCustomMethods(this.props);
      this.__initDataSource(this.props);

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
