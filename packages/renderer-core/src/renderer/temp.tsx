import { IBaseRenderComponent } from '../types';
import logger from '../utils/logger';
import baseRendererFactory from './base';

export default function tempRendererFactory(): IBaseRenderComponent {
  const BaseRenderer = baseRendererFactory();

  return class TempRenderer extends BaseRenderer {
    static displayName = 'TempRenderer';

    __namespace = 'temp';

    cacheSetState?: Record<string, any>;

    __init() {
      this.state = {};
      this.cacheSetState = {};
    }

    async componentDidMount() {
      const ctx = this.props.__ctx;
      if (!ctx) return;
      const { setState } = ctx;
      this.cacheSetState = setState;
      ctx.setState = (...args: any) => {
        setState.call(ctx, ...args);
        setTimeout(() => this.forceUpdate(), 0);
      };
      this.__debug(`componentDidMount - ${this.props.__schema.fileName}`);
    }

    async componentDidUpdate() {
      this.__debug(`componentDidUpdate - ${this.props.__schema.fileName}`);
    }

    async componentWillUnmount() {
      const ctx = this.props.__ctx;
      if (!ctx || !this.cacheSetState) return;
      ctx.setState = this.cacheSetState;
      delete this.cacheSetState;
      this.__debug(`componentWillUnmount - ${this.props.__schema.fileName}`);
    }

    async componentDidCatch(e: any) {
      logger.warn(e);
      this.__debug(`componentDidCatch - ${this.props.__schema.fileName}`);
    }

    render() {
      const { __schema, __ctx } = this.props;
      if (this.__checkSchema(__schema)) {
        return '下钻编辑 schema 结构异常！';
      }

      this.__debug(`${TempRenderer.displayName} render - ${__schema?.fileName}`);

      return this.__renderContent(this.__renderContextProvider({ __ctx }));
    }
  };
}
