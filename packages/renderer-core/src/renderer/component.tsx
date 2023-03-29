import { IPublicTypeNodeSchema } from '@alilc/lowcode-types';
import adapter from '../adapter';
import baseRendererFactory from './base';
import { IBaseRendererProps, IBaseRenderComponent } from '../types';
import logger from '../utils/logger';
import './component.css';

export default function componentRendererFactory(): IBaseRenderComponent {
  const { PureComponent, createElement } = adapter.getRuntime();
  class FaultComponent extends PureComponent<IPublicTypeNodeSchema | any> {
    render() {
      logger.error(`%c组件 ${this.props.componentName} 渲染异常, 异常原因: ${this.props.error?.message || this.props.error || '未知'}`, 'color: #ff0000;');
      return createElement('div', {
        className: 'lc-component-placeholder',
      }, [
        createElement('img', {
          className: 'placeholder-icon',
          src: 'https://img.alicdn.com/imgextra/i3/O1CN014vaSuf29FSP05MRkB_!!6000000008038-55-tps-200-200.svg',
        }),
        createElement('span', {}, `${this.props.componentName || ''} 低代码组件占位`),
        createElement('span', { className: 'question-wrapper' }, [
          createElement('img', {
            className: 'question-icon',
            src: 'https://img.alicdn.com/imgextra/i3/O1CN01qvltzs1tbPXJTARss_!!6000000005920-55-tps-200-200.svg',
          }),
          createElement('span', {
            className: 'tooltip',
          }, '由于一些原因，导致低代码组件无法正常渲染，因此显示占位。通常这种情况不会影响组件配置可以正常使用，如果希望恢复至正常渲染，可以查看控制台相关报错'),
        ]),
      ]);
    }
  }
  const BaseRenderer = baseRendererFactory();
  return class CompRenderer extends BaseRenderer {
    static displayName = 'CompRenderer';
    static FaultComponent = FaultComponent;

    __namespace = 'component';

    __afterInit(props: IBaseRendererProps) {
      this.__generateCtx({
        component: this,
      });
      const schema = props.__schema || {};
      this.state = this.__parseData(schema.state || {});
      this.__initDataSource(props);
      this.__executeLifeCycleMethod('constructor', arguments as any);
    }

    render() {
      const { __schema, __components } = this.props;
      if (this.__checkSchema(__schema)) {
        return '自定义组件 schema 结构异常！';
      }
      this.__debug(`${CompRenderer.displayName} render - ${__schema.fileName}`);

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
