import classnames from 'classnames';
import Debug from 'debug';
import { create as createDataSourceEngine } from '@ali/lowcode-datasource-engine/interpret';
import adapter from '../adapter';
import divFactory from '../components/Div';
import visualDomFactory from '../components/VisualDom';
import contextFactory from '../context';
import {
  forEach,
  getValue,
  parseData,
  parseExpression,
  parseI18n,
  isEmpty,
  isSchema,
  isFileSchema,
  isJSExpression,
  isJSSlot,
  isJSFunction,
  transformArrayToMap,
  transformStringToFunction,
  checkPropTypes,
  getI18n,
  acceptsRef,
  getFileCssName,
  capitalizeFirstLetter,
  DataHelper,
  isI18n,
  isVariable,
} from '../utils';
import { IRendererProps, ISchema, IInfo, ComponentModel, IRenderer } from '../types';
import { compWrapper } from '../hoc';

export default function baseRenererFactory() {
  const { BaseRenderer: customBaseRenderer } = adapter.getRenderers();

  if (customBaseRenderer) {
    return customBaseRenderer;
  }

  const { Component, createElement } = adapter.getRuntime();
  const Div = divFactory();
  const VisualDom = visualDomFactory();
  const AppContext = contextFactory();

  const debug = Debug('renderer:base');
  const DESIGN_MODE = {
    EXTEND: 'extend',
    BORDER: 'border',
    PREVIEW: 'preview',
  };
  const OVERLAY_LIST = ['Dialog', 'Overlay', 'Animate', 'ConfigProvider'];
  let scopeIdx = 0;

  return class BaseRenderer extends Component implements IRenderer {
    static dislayName = 'base-renderer';

    static defaultProps = {
      __schema: {},
    };

    static contextType = AppContext;

    __namespace = 'base';

    constructor(props: IRendererProps, context: any) {
      super(props, context);
      this.__beforeInit(props);
      this.__init(props);
      this.__afterInit(props);
      this.__initDebug();
      this.__debug(`constructor - ${props?.__schema?.fileName}`);
    }

    __beforeInit(/* props: IRendererProps */) { }

    __init(props: IRendererProps) {
      this.appHelper = props.__appHelper;
      this.__compScopes = {};
      this.__instanceMap = {};
      this.__bindCustomMethods(props);
      this.__initI18nAPIs();
    }

    __afterInit(/* props: IRendererProps */) { }

    static getDerivedStateFromProps(props: IRendererProps, state: any) {
      debug('getDerivedStateFromProps');
      const func = props?.__schema?.lifeCycles?.getDerivedStateFromProps;

      if (func) {
        return func(props, state);
      }
      return null;
    }

    async getSnapshotBeforeUpdate() {
      this.__setLifeCycleMethods('getSnapshotBeforeUpdate', arguments);
      this.__debug(`getSnapshotBeforeUpdate - ${this.props?.__schema?.fileName}`);
    }

    async componentDidMount() {
      this.reloadDataSource();
      this.__setLifeCycleMethods('componentDidMount', arguments);
      this.__debug(`componentDidMount - ${this.props?.__schema?.fileName}`);
    }

    async componentDidUpdate(...args: any) {
      this.__setLifeCycleMethods('componentDidUpdate', args);
      this.__debug(`componentDidUpdate - ${this.props.__schema.fileName}`);
    }

    async componentWillUnmount(...args: any) {
      this.__setLifeCycleMethods('componentWillUnmount', args);
      this.__debug(`componentWillUnmount - ${this.props?.__schema?.fileName}`);
    }

    async componentDidCatch(e: any) {
      this.__setLifeCycleMethods('componentDidCatch', arguments);
      console.warn(e);
    }

    reloadDataSource = () => new Promise((resolve, reject) => {
      this.__debug('reload data source');
      if (!this.__dataHelper) {
        this.__showPlaceholder = false;
        return resolve({});
      }
      this.__dataHelper
        .getInitData()
        .then((res: any) => {
          this.__showPlaceholder = false;
          if (isEmpty(res)) {
            this.forceUpdate();
            return resolve({});
          }
          this.setState(res, resolve);
        })
        .catch((err: Error) => {
          if (this.__showPlaceholder) {
            this.__showPlaceholder = false;
            this.forceUpdate();
          }
          reject(err);
        });
    });

    __setLifeCycleMethods = (method: string, args?: any) => {
      const lifeCycleMethods = getValue(this.props.__schema, 'lifeCycles', {});
      let fn = lifeCycleMethods[method];
      if (fn) {
        // TODO, cache
        if (isJSExpression(fn) || isJSFunction(fn)) {
          fn = parseExpression(fn, this);
        }
        if (typeof fn !== 'function') {
          console.error(`生命周期${method}类型不符`, fn);
          return;
        }
        try {
          return fn.apply(this, args);
        } catch (e) {
          console.error(`[${this.props.__schema.componentName}]生命周期${method}出错`, e);
        }
      }
    };

    __bindCustomMethods = (props = this.props) => {
      const { __schema } = props;
      const customMethodsList = Object.keys(__schema.methods || {}) || [];
      this.__customMethodsList
        && this.__customMethodsList.forEach((item: any) => {
          if (!customMethodsList.includes(item)) {
            delete this[item];
          }
        });
      this.__customMethodsList = customMethodsList;
      forEach(__schema.methods, (val: any, key: string) => {
        if (isJSExpression(val) || isJSFunction(val)) {
          val = parseExpression(val, this);
        }
        if (typeof val !== 'function') {
          console.error(`自定义函数${key}类型不符`, val);
          return;
        }
        this[key] = val.bind(this);
      });
    };

    __generateCtx = (ctx: object) => {
      const { pageContext, compContext } = this.context;
      const obj = {
        page: pageContext,
        component: compContext,
        ...ctx,
      };
      forEach(obj, (val: any, key: string) => {
        this[key] = val;
      });
    };

    __parseData = (data: any, ctx?: object) => {
      const { __ctx } = this.props;
      return parseData(data, ctx || __ctx || this);
    };

    __initDataSource = (props = this.props) => {
      const schema = props.__schema || {};
      const dataSource = (schema && schema.dataSource) || {};
      // requestHandlersMap 存在才走数据源引擎方案
      if (props?.__appHelper?.requestHandlersMap) {
        const { dataSourceMap, reloadDataSource } = createDataSourceEngine(dataSource, (this as any), {
          requestHandlersMap: props.__appHelper.requestHandlersMap,
        });
        this.dataSourceMap = dataSourceMap;
        this.reloadDataSource = () => new Promise((resolve) => {
          this.__debug('reload data source');
          // this.__showPlaceholder = true;
          reloadDataSource().then(() => {
            // this.__showPlaceholder = false;
            // @TODO 是否需要 forceUpate
            // this.forceUpdate();
            resolve({});
          });
        });
      } else {
        const appHelper = props.__appHelper;
        this.__dataHelper = new DataHelper(this, dataSource, appHelper, (config: any) => this.__parseData(config));
        this.dataSourceMap = this.__dataHelper.dataSourceMap;
        this.reloadDataSource = () => new Promise((resolve, reject) => {
          this.__debug('reload data source');
          if (!this.__dataHelper) {
            // this.__showPlaceholder = false;
            return resolve({});
          }
          this.__dataHelper
            .getInitData()
            .then((res: any) => {
              // this.__showPlaceholder = false;
              if (isEmpty(res)) {
                this.forceUpdate();
                return resolve({});
              }
              this.setState(res, resolve);
            })
            .catch((err: Error) => {
              if (this.__showPlaceholder) {
                this.__showPlaceholder = false;
                this.forceUpdate();
              }
              reject(err);
            });
        });
      }
      // 设置容器组件占位，若设置占位则在初始异步请求完成之前用loading占位且不渲染容器组件内部内容
      // @TODO __showPlaceholder 的逻辑一旦开启就关不掉，先注释掉了
      /* this.__showPlaceholder = this.__parseData(schema.props && schema.props.autoLoading) && (dataSource.list || []).some(
        (item) => !!this.__parseData(item.isInit),
      ); */
    };

    __initI18nAPIs = () => {
      this.i18n = (key: string, values = {}) => {
        const { locale, messages } = this.props;
        return getI18n(key, values, locale, messages);
      };
      this.getLocale = () => this.props.locale;
      this.setLocale = (loc: string) => this.appHelper?.utils?.i18n?.setLocale && this.appHelper?.utils?.i18n?.setLocale(loc);
    };

    __writeCss = () => {
      const css = getValue(this.props.__schema, 'css', '');
      let style = this.styleElement;
      if (!this.styleElement) {
        style = document.createElement('style');
        style.type = 'text/css';
        style.setAttribute('from', 'style-sheet');
        if (style.firstChild) {
          style.removeChild(style.firstChild);
        }
        const head = document.head || document.getElementsByTagName('head')[0];
        head.appendChild(style);
        this.styleElement = style;
      }

      if (style.innerHTML === css) {
        return;
      }

      style.innerHTML = css;
    };

    __render = () => {
      const schema = this.props.__schema;
      this.__setLifeCycleMethods('render');
      this.__writeCss();

      const { engine } = this.context;
      if (engine) {
        engine.props.onCompGetCtx(schema, this);
        // 画布场景才需要每次渲染bind自定义方法
        if (engine.props.designMode) {
          this.__bindCustomMethods();
          this.dataSourceMap = this.__dataHelper && this.__dataHelper.updateConfig(schema.dataSource);
        }
      }
    };

    __getRef = (ref: any) => {
      const { engine } = this.context;
      const { __schema } = this.props;
      ref && engine?.props?.onCompGetRef(__schema, ref);
      this.__ref = ref;
    };

    getSchemaChildren = (schema: ISchema) => {
      if (!schema || !schema.props) {
        return schema?.children;
      }
      if (!schema.children) return schema.props.children;
      if (!schema.props.children) return schema.children;
      let _children = ([] as ComponentModel[]).concat(schema.children);
      if (Array.isArray(schema.props.children)) {
        _children = _children.concat(schema.props.children);
      } else {
        _children.push(schema.props.children);
      }
      return _children;
    };

    __createDom = () => {
      const { __schema, __ctx, __components = {} } = this.props;
      const self: any = {};
      self.__proto__ = __ctx || this;
      const _children = this.getSchemaChildren(__schema);
      return this.__createVirtualDom(_children, self, ({
        schema: __schema,
        Comp: __components[__schema.componentName],
      } as IInfo));
    };

    // 将模型结构转换成react Element
    // schema 模型结构
    // self 为每个渲染组件构造的上下文，self是自上而下继承的
    // parentInfo 父组件的信息，包含schema和Comp
    // idx 若为循环渲染的循环Index
    __createVirtualDom = (schema: any, self: any, parentInfo: IInfo, idx: string | number = ''): any => {
      const { engine } = this.context || {};
      try {
        if (!schema) return null;

        // FIXME
        if (schema.componentName === 'Text' && typeof schema.props.text === 'string') {
          schema = { ...schema };
          schema.children = [schema.props.text];
        }

        const { __appHelper: appHelper, __components: components = {} } = this.props || {};

        if (isJSExpression(schema)) {
          return parseExpression(schema, self);
        }
        if (isI18n(schema)) {
          return parseI18n(schema, self);
        }
        if (isJSSlot(schema)) {
          return this.__createVirtualDom(schema.value, self, parentInfo);
        }
        if (typeof schema === 'string') return schema;
        if (typeof schema === 'number' || typeof schema === 'boolean') {
          return schema.toString();
        }
        if (Array.isArray(schema)) {
          if (schema.length === 1) return this.__createVirtualDom(schema[0], self, parentInfo);
          return schema.map((item, idy) => this.__createVirtualDom(item, self, parentInfo, item?.__ctx?.lceKey ? '' : idy));
        }
        // FIXME
        const _children = this.getSchemaChildren(schema);
        // 解析占位组件
        if (schema.componentName === 'Flagment' && _children) {
          const tarChildren = isJSExpression(_children) ? parseExpression(_children, self) : _children;
          return this.__createVirtualDom(tarChildren, self, parentInfo);
        }

        if (schema.$$typeof) {
          return schema;
        }
        if (!isSchema(schema)) return null;
        let Comp = components[schema.componentName] || engine.getNotFoundComponent();

        if (schema.hidden && engine?.props?.designMode) {
          return null;
        }

        if (schema.loop != null) {
          const loop = parseData(schema.loop, self);
          if ((Array.isArray(loop) && loop.length > 0) || isJSExpression(loop)) {
            return this.__createLoopVirtualDom(
              {
                ...schema,
                loop,
              },
              self,
              parentInfo,
              idx,
            );
          }
        }
        const condition = schema.condition == null ? true : parseData(schema.condition, self);
        if (!condition) return null;

        let scopeKey = '';
        // 判断组件是否需要生成scope，且只生成一次，挂在this.__compScopes上
        if (Comp.generateScope) {
          const key = parseExpression(schema.props.key, self);
          if (key) {
            // 如果组件自己设置key则使用组件自己的key
            scopeKey = key;
          } else if (!schema.__ctx) {
            // 在生产环境schema没有__ctx上下文，需要手动生成一个lceKey
            schema.__ctx = {
              lceKey: `lce${++scopeIdx}`,
            };
            scopeKey = schema.__ctx.lceKey;
          } else {
            // 需要判断循环的情况
            scopeKey = schema.__ctx.lceKey + (idx !== undefined ? `_${idx}` : '');
          }
          if (!this.__compScopes[scopeKey]) {
            this.__compScopes[scopeKey] = Comp.generateScope(this, schema);
          }
        }
        // 如果组件有设置scope，需要为组件生成一个新的scope上下文
        if (scopeKey && this.__compScopes[scopeKey]) {
          const compSelf = { ...this.__compScopes[scopeKey] };
          compSelf.__proto__ = self;
          self = compSelf;
        }

        // 容器类组件的上下文通过props传递，避免context传递带来的嵌套问题
        const otherProps: any = isFileSchema(schema)
          ? {
            __schema: schema,
            __appHelper: appHelper,
            __components: components,
          }
          : {};
        if (engine?.props?.designMode) {
          otherProps.__designMode = engine.props.designMode;
        }
        const componentInfo: any = {};
        const props: any =
          this.__parseProps(schema.props, self, '', {
            schema,
            Comp,
            componentInfo: {
              ...componentInfo,
              props: transformArrayToMap(componentInfo.props, 'name'),
            },
          }) || {};

        // 对于可以获取到ref的组件做特殊处理
        if (!acceptsRef(Comp)) {
          Comp = compWrapper(Comp);
        }
        otherProps.ref = (ref: any) => {
          this.$(props.fieldId, ref); // 收集ref
          const refProps = props.ref;
          if (refProps && typeof refProps === 'string') {
            this[refProps] = ref;
          }
          ref && engine?.props?.onCompGetRef(schema, ref);
        };

        // scope需要传入到组件上
        if (scopeKey && this.__compScopes[scopeKey]) {
          props.__scope = this.__compScopes[scopeKey];
        }
        // FIXME 这里清除 key 是为了避免循环渲染中更改 key 导致的渲染重复
        props.key = '';
        if (schema?.__ctx?.lceKey) {
          if (!isFileSchema(schema)) {
            engine?.props?.onCompGetCtx(schema, self);
          }
          props.key = props.key || `${schema.__ctx.lceKey}_${schema.__ctx.idx || 0}_${idx !== undefined ? idx : ''}`;
        } else if (typeof idx === 'number' && !props.key) {
          props.key = idx;
        }

        props.__id = schema.id;
        if (!props.key) {
          props.key = props.__id;
        }

        let child: any = null;
        if (/*! isFileSchema(schema) && */_children) {
          child = this.__createVirtualDom(
            isJSExpression(_children) ? parseExpression(_children, self) : _children,
            self,
            {
              schema,
              Comp,
            },
          );
        }
        const renderComp = (props: any) => engine.createElement(Comp, props, child);
        // 设计模式下的特殊处理
        if (engine && [DESIGN_MODE.EXTEND, DESIGN_MODE.BORDER].includes(engine.props.designMode)) {
          // 对于overlay,dialog等组件为了使其在设计模式下显示，外层需要增加一个div容器
          if (OVERLAY_LIST.includes(schema.componentName)) {
            const { ref, ...overlayProps } = otherProps;
            return createElement(Div, {
              ref,
              __designMode: engine.props.designMode,
            }, renderComp({ ...props, ...overlayProps }));
          }
          // 虚拟dom显示
          if (componentInfo?.parentRule) {
            const parentList = componentInfo.parentRule.split(',');
            const { schema: parentSchema, Comp: parentComp } = parentInfo;
            if (
              !parentList.includes(parentSchema.componentName) ||
              parentComp !== components[parentSchema.componentName]
            ) {
              props.__componentName = schema.componentName;
              Comp = VisualDom;
            } else {
              // 若虚拟dom在正常的渲染上下文中，就不显示设计模式了
              props.__disableDesignMode = true;
            }
          }
        }
        return renderComp({ ...props, ...otherProps });
      } catch (e) {
        return engine.createElement(engine.getFaultComponent(), {
          error: e,
          schema,
          self,
          parentInfo,
          idx,
        });
      }
    };

    __createLoopVirtualDom = (schema: any, self: any, parentInfo: IInfo, idx: number | string) => {
      if (isFileSchema(schema)) {
        console.warn('file type not support Loop');
        return null;
      }
      if (!Array.isArray(schema.loop)) return null;
      const itemArg = (schema.loopArgs && schema.loopArgs[0]) || 'item';
      const indexArg = (schema.loopArgs && schema.loopArgs[1]) || 'index';
      return schema.loop.map((item: string[], i: number) => {
        const loopSelf: any = {
          [itemArg]: item,
          [indexArg]: i,
        };
        loopSelf.__proto__ = self;
        return this.__createVirtualDom(
          {
            ...schema,
            loop: undefined,
          },
          loopSelf,
          parentInfo,
          idx ? `${idx}_${i}` : i,
        );
      });
    };

    __parseProps = (props: any, self: any, path: string, info: IInfo): any => {
      const { schema, Comp, componentInfo = {} } = info;
      const propInfo = getValue(componentInfo.props, path);
      // FIXME! 将这行逻辑外置，解耦，线上环境不要验证参数，调试环境可以有，通过传参自定义
      const propType = propInfo?.extra?.propType;
      const ignoreParse = schema.__ignoreParse || [];
      const checkProps = (value: any) => {
        if (!propType) return value;
        return checkPropTypes(value, path, propType, componentInfo.name) ? value : undefined;
      };

      const parseReactNode = (data: any, params: any) => {
        if (isEmpty(params)) {
          return checkProps(this.__createVirtualDom(data, self, ({ schema, Comp } as IInfo)));
        }
        return checkProps(function () {
          const args: any = {};
          if (Array.isArray(params) && params.length) {
            params.forEach((item, idx) => {
              if (typeof item === 'string') {
                args[item] = arguments[idx];
              } else if (item && typeof item === 'object') {
                args[item.name] = arguments[idx];
              }
            });
          }
          args.__proto__ = self;
          return self.__createVirtualDom(data, args, { schema, Comp });
        });
      };

      // 判断是否需要解析变量
      if (
        ignoreParse.some((item: any) => {
          if (item instanceof RegExp) {
            return item.test(path);
          }
          return item === path;
        })
      ) {
        return checkProps(props);
      }
      if (isJSExpression(props)) {
        props = parseExpression(props, self);
        // 只有当变量解析出来为模型结构的时候才会继续解析
        if (!isSchema(props) && !isJSSlot(props)) return checkProps(props);
      }

      const handleLegaoI18n = (props: any) => props[props.use || 'zh_CN'];

      // 兼容乐高设计态 i18n 数据
      if (isI18n(props)) {
        const i18nProp = handleLegaoI18n(props);
        if (i18nProp) {
          props = i18nProp;
        } else {
          return parseI18n(props, self);
        }
      }

      // 兼容乐高设计态的变量绑定
      if (isVariable(props)) {
        props = props.value;
        if (isI18n(props)) {
          props = handleLegaoI18n(props);
        }
      }

      if (isJSFunction(props)) {
        props = transformStringToFunction(props.value);
      }
      if (isJSSlot(props)) {
        const { params, value } = props;
        if (!isSchema(value) || isEmpty(value)) return undefined;
        return parseReactNode(value, params);
      }
      // 兼容通过componentInfo判断的情况
      if (isSchema(props)) {
        const isReactNodeFunction = !!(
          propInfo?.type === 'ReactNode'
          && propInfo?.props?.type === 'function'
        );

        const isMixinReactNodeFunction = !!(
          propInfo?.type === 'Mixin'
          && propInfo?.props?.types?.indexOf('ReactNode') > -1
          && propInfo?.props?.reactNodeProps?.type === 'function'
        );
        return parseReactNode(
          props,
          isReactNodeFunction
            ? propInfo.props.params
            : isMixinReactNodeFunction
              ? propInfo.props.reactNodeProps.params
              : null,
        );
      }
      if (Array.isArray(props)) {
        return checkProps(props.map((item, idx) => this.__parseProps(item, self, path ? `${path}.${idx}` : `${idx}`, info)));
      }
      if (typeof props === 'function') {
        return checkProps(props.bind(self));
      }
      if (props && typeof props === 'object') {
        if (props.$$typeof) return checkProps(props);
        const res: any = {};
        forEach(props, (val: any, key: string) => {
          if (key.startsWith('__')) {
            res[key] = val;
            return;
          }
          res[key] = this.__parseProps(val, self, path ? `${path}.${key}` : key, info);
        });
        return checkProps(res);
      }
      if (typeof props === 'string') {
        return checkProps(props.trim());
      }
      return checkProps(props);
    };

    $(filedId: string, instance?: any) {
      this.__instanceMap = this.__instanceMap || {};
      if (!filedId) {
        return this.__instanceMap;
      }
      if (instance) {
        this.__instanceMap[filedId] = instance;
      }
      return this.__instanceMap[filedId];
    }

    __initDebug = () => {
      this.__logger = Debug(`renderer:${this.__namespace || 'base'}`);
    };

    __debug = (msg = '') => {
      if (this.__logger) {
        this.__logger(`${this.__namespace}.${msg}`);
      }
    };

    __renderContextProvider = (customProps?: object, children?: any) => {
      customProps = customProps || {};
      children = children || this.__createDom();
      return createElement(AppContext.Provider, {
        value: {
          ...this.context,
          blockContext: this,
          ...customProps,
        },
        children,
      });
    };

    __renderContextConsumer = (children: any) => {
      return createElement(AppContext.Consumer, {}, children);
    };

    __renderComp(Comp: any, ctxProps: object) {
      const { __schema } = this.props;
      const data = this.__parseData(__schema?.props);
      const { className } = data;
      const { engine } = this.context || {};
      if (!engine) {
        return null;
      }
      const child = engine.createElement(
        Comp || Div,
        {
          ...data,
          ...this.props,
          ref: this.__getRef,
          className: classnames(getFileCssName(__schema?.fileName), className, this.props.className),
          __id: __schema?.id,
        },
        this.__createDom(),
      );
      return this.__renderContextProvider(ctxProps, child);
    }

    __renderContent(children: any) {
      const { __schema } = this.props;
      const props = this.__parseData(__schema.props);
      const { id, className, style = {} } = props;
      return createElement('div', {
        ref: this.__getRef,
        className: classnames(`lce-${this.__namespace}`, getFileCssName(__schema.fileName), className, this.props.className),
        id: this.props.id || id,
        style: { ...style, ...(typeof this.props.style === 'object' ? this.props.style : {}) },
      }, children);
    }

    __checkSchema = (schema: ISchema, extraComponents: string | string[] = []) => {
      if (typeof extraComponents === 'string') {
        extraComponents = [extraComponents];
      }

      const buitin = capitalizeFirstLetter(this.__namespace);
      const componentNames = [buitin, ...extraComponents];
      return !isSchema(schema, true) || !componentNames.includes(schema.componentName);
    };

    get requestHandlersMap() {
      return this.appHelper?.requestHandlersMap;
    }

    get utils() {
      return this.appHelper?.utils;
    }

    get constants() {
      return this.appHelper?.constants;
    }

    get history() {
      return this.appHelper?.history;
    }

    get location() {
      return this.appHelper?.location;
    }

    get match() {
      return this.appHelper?.match;
    }

    render() {
      return null;
    }
  };
}
