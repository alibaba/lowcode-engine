/* eslint-disable max-len */
/* eslint-disable react/prop-types */
import classnames from 'classnames';
import { create as createDataSourceEngine } from '@alilc/lowcode-datasource-engine/interpret';
import { isI18nData, isJSExpression, isJSFunction, NodeSchema, NodeData, JSONValue, CompositeValue } from '@alilc/lowcode-types';
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
  transformArrayToMap,
  transformStringToFunction,
  checkPropTypes,
  getI18n,
  canAcceptsRef,
  getFileCssName,
  capitalizeFirstLetter,
  DataHelper,
  isVariable,
  isJSSlot,
} from '../utils';
import { IBaseRendererProps, IInfo, IBaseRenderComponent, IBaseRendererContext, IGeneralConstructor, IRendererAppHelper, DataSource } from '../types';
import { compWrapper } from '../hoc';
import { IComponentConstruct, IComponentHoc, leafWrapper } from '../hoc/leaf';
import logger from '../utils/logger';
import isUseLoop from '../utils/is-use-loop';

export default function baseRendererFactory(): IBaseRenderComponent {
  const { BaseRenderer: customBaseRenderer } = adapter.getRenderers();

  if (customBaseRenderer) {
    return customBaseRenderer;
  }

  const runtime = adapter.getRuntime();
  const Component = runtime.Component as IGeneralConstructor<
    IBaseRendererProps,
    Record<string, any>,
    any
  >;
  const createElement = runtime.createElement;
  const Div = divFactory();
  const VisualDom = visualDomFactory();
  const AppContext = contextFactory();

  const DESIGN_MODE = {
    EXTEND: 'extend',
    BORDER: 'border',
    PREVIEW: 'preview',
  };
  const OVERLAY_LIST = ['Dialog', 'Overlay', 'Animate', 'ConfigProvider'];
  let scopeIdx = 0;

  return class BaseRenderer extends Component {
    static displayName = 'base-renderer';

    static defaultProps = {
      __schema: {},
    };

    static contextType = AppContext;

    __namespace = 'base';

    _self: any = null;
    appHelper?: IRendererAppHelper;
    __compScopes: Record<string, any> = {};
    __instanceMap: Record<string, any> = {};
    __dataHelper: any;
    __showPlaceholder: boolean = false;
    __customMethodsList: any[] = [];
    dataSourceMap: Record<string, any> = {};
    __ref: any;
    i18n: any;
    getLocale: any;
    setLocale: any;
    styleElement: any;
    [key: string]: any;

    constructor(props: IBaseRendererProps, context: IBaseRendererContext) {
      super(props, context);
      this.context = context;
      this.__beforeInit(props);
      this.__init(props);
      this.__afterInit(props);
      this.__debug(`constructor - ${props?.__schema?.fileName}`);
    }

    __beforeInit(_props: IBaseRendererProps) { }

    __init(props: IBaseRendererProps) {
      this.appHelper = props.__appHelper;
      this.__compScopes = {};
      this.__instanceMap = {};
      this.__bindCustomMethods(props);
      this.__initI18nAPIs();
    }

    __afterInit(_props: IBaseRendererProps) { }

    static getDerivedStateFromProps(props: IBaseRendererProps, state: any) {
      logger.log('getDerivedStateFromProps');
      const func = props?.__schema?.lifeCycles?.getDerivedStateFromProps;

      if (func) {
        if (isJSExpression(func) || isJSFunction(func)) {
          const fn = parseExpression(func, this);
          return fn(props, state);
        }

        if (typeof func === 'function') {
          return (func as Function)(props, state);
        }
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
      this.__dataHelper.getInitData()
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

    shouldComponentUpdate() {
      if (this.props.getSchemaChangedSymbol?.() && this.props.__container?.rerender) {
        this.props.__container?.rerender();
        return false;
      }
      return true;
    }

    forceUpdate() {
      if (this.shouldComponentUpdate()) {
        super.forceUpdate();
      }
    }

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

    __generateCtx = (ctx: Record<string, any>) => {
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

    __parseData = (data: any, ctx?: Record<string, any>) => {
      const { __ctx } = this.props;
      return parseData(data, ctx || __ctx || this);
    };

    __initDataSource = (props = this.props) => {
      const schema = props.__schema || {};
      const defaultDataSource: DataSource = {
        list: [],
      };
      const dataSource = (schema && schema?.dataSource) || defaultDataSource;
      // requestHandlersMap 存在才走数据源引擎方案
      if (props?.__appHelper?.requestHandlersMap) {
        this.__dataHelper = {
          updateConfig: (updateDataSource: any) => {
            const { dataSourceMap, reloadDataSource } = createDataSourceEngine(
              updateDataSource,
              this,
              props.__appHelper.requestHandlersMap ? { requestHandlersMap: props.__appHelper.requestHandlersMap } : undefined,
            );

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
            return dataSourceMap;
          },
        };
        this.dataSourceMap = this.__dataHelper.updateConfig(dataSource);
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
          this.__dataHelper.getInitData()
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

    getSchemaChildren = (schema: NodeSchema | undefined) => {
      if (!schema || !schema.props) {
        return schema?.children;
      }
      if (!schema.children) return schema.props.children;
      if (!schema.props.children) return schema.children;
      let _children = ([] as NodeData[]).concat(schema.children);
      if (Array.isArray(schema.props.children)) {
        _children = _children.concat(schema.props.children);
      } else {
        _children.push(schema.props.children);
      }
      return _children;
    };

    __createDom = () => {
      const { __schema, __ctx, __components = {} } = this.props;
      const scope: any = {};
      scope.__proto__ = __ctx || this;
      if (!this._self) {
        this._self = scope;
      }
      const _children = this.getSchemaChildren(__schema);
      let Comp = __components[__schema.componentName];

      if (!Comp) {
        this.__debug(`${__schema.componentName} is invalid!`);
      }

      return this.__createVirtualDom(_children, scope, ({
        schema: __schema,
        Comp: this.__getHocComp(Comp, __schema, scope),
      } as IInfo));
    };


    // 将模型结构转换成react Element
    // schema 模型结构
    // self 为每个渲染组件构造的上下文，self是自上而下继承的
    // parentInfo 父组件的信息，包含schema和Comp
    // idx 若为循环渲染的循环Index
    __createVirtualDom = (schema: NodeData | NodeData[] | undefined, scope: any, parentInfo: IInfo, idx: string | number = ''): any => {
      const { engine } = this.context || {};
      try {
        if (!schema) return null;

        const { __appHelper: appHelper, __components: components = {} } = this.props || {};

        if (isJSExpression(schema)) {
          return parseExpression(schema, scope);
        }
        if (isI18nData(schema)) {
          return parseI18n(schema, scope);
        }
        if (isJSSlot(schema)) {
          return this.__createVirtualDom(schema.value, scope, parentInfo);
        }
        if (typeof schema === 'string') return schema;
        if (typeof schema === 'number' || typeof schema === 'boolean') {
          return String(schema);
        }
        if (Array.isArray(schema)) {
          if (schema.length === 1) return this.__createVirtualDom(schema[0], scope, parentInfo);
          return schema.map((item, idy) => this.__createVirtualDom(item, scope, parentInfo, (item as NodeSchema)?.__ctx?.lceKey ? '' : String(idy)));
        }
        // FIXME
        const _children = this.getSchemaChildren(schema);
        // 解析占位组件
        if (schema?.componentName === 'Fragment' && _children) {
          const tarChildren = isJSExpression(_children) ? parseExpression(_children, scope) : _children;
          return this.__createVirtualDom(tarChildren, scope, parentInfo);
        }

        if (schema?.componentName === 'Text' && typeof schema?.props?.text === 'string') {
          const text: string = schema?.props?.text;
          schema = { ...schema };
          schema.children = [text];
        }

        // @ts-expect-error 如果直接转换好了，可以返回
        if (schema?.$$typeof) {
          return schema;
        }
        if (!isSchema(schema)) return null;
        let Comp = components[schema.componentName] || this.props.__container?.components?.[schema.componentName];

        // 容器类组件的上下文通过props传递，避免context传递带来的嵌套问题
        const otherProps: any = isFileSchema(schema)
          ? {
            __schema: schema,
            __appHelper: appHelper,
            __components: components,
          }
          : {};

        if (!Comp) {
          console.error(`${schema.componentName} component is not found in components list! component list is:`, components || this.props.__container?.components);
          return engine.createElement(
            engine.getNotFoundComponent(),
            {
              componentName: schema.componentName,
              componentId: schema.id,
            },
            this.__getSchemaChildrenVirtualDom(schema, scope, Comp),
          );
        }

        // DesignMode 为 design 情况下，需要进入 leaf Hoc，进行相关事件注册
        const displayInHook = engine?.props?.designMode === 'design';

        if (schema.hidden && !displayInHook) {
          return null;
        }

        if (schema.loop != null) {
          const loop = parseData(schema.loop, scope);
          const useLoop = isUseLoop(loop, this._designModeIsDesign);
          if (useLoop) {
            return this.__createLoopVirtualDom(
              {
                ...schema,
                loop,
              },
              scope,
              parentInfo,
              idx,
            );
          }
        }
        const condition = schema.condition == null ? true : parseData(schema.condition, scope);
        if (!condition && !displayInHook) return null;

        let scopeKey = '';
        // 判断组件是否需要生成scope，且只生成一次，挂在this.__compScopes上
        if (Comp.generateScope) {
          const key = parseExpression(schema.props?.key, scope);
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
          compSelf.__proto__ = scope;
          scope = compSelf;
        }

        if (engine?.props?.designMode) {
          otherProps.__designMode = engine.props.designMode;
        }
        if (this._designModeIsDesign) {
          otherProps.__tag = Math.random();
        }
        const componentInfo: any = {};
        const props: any = this.__getComponentProps(schema, scope, Comp, {
          ...componentInfo,
          props: transformArrayToMap(componentInfo.props, 'name'),
        }) || {};

        this.componentHoc.forEach((ComponentConstruct: IComponentConstruct) => {
          Comp = ComponentConstruct(Comp, {
            schema,
            componentInfo,
            baseRenderer: this,
            scope,
          });
        });

        // 对于不可以接收到 ref 的组件需要做特殊处理
        if (!canAcceptsRef(Comp)) {
          Comp = compWrapper(Comp);
          components[schema.componentName] = Comp;
        }

        otherProps.ref = (ref: any) => {
          this.$(props.fieldId || props.ref, ref); // 收集ref
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
        if (schema?.__ctx?.lceKey) {
          if (!isFileSchema(schema)) {
            engine?.props?.onCompGetCtx(schema, scope);
          }
          props.key = props.key || `${schema.__ctx.lceKey}_${schema.__ctx.idx || 0}_${idx !== undefined ? idx : ''}`;
        } else if ((typeof idx === 'number' || typeof idx === 'string') && !props.key) {
          // 仅当循环场景走这里
          props.key = idx;
        }

        props.__id = schema.id;
        if (!props.key) {
          props.key = props.__id;
        }

        let child = this.__getSchemaChildrenVirtualDom(schema, scope, Comp);
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
            const { schema: parentSchema = { componentName: '' }, Comp: parentComp } = parentInfo;
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
          self: scope,
          parentInfo,
          idx,
        });
      }
    };

    get componentHoc(): IComponentConstruct[] {
      const componentHoc: IComponentHoc[] = [
        {
          designMode: 'design',
          hoc: leafWrapper,
        },
      ];

      return componentHoc
        .filter((d: IComponentHoc) => {
          if (Array.isArray(d.designMode)) {
            return d.designMode.includes(this.props.designMode);
          }

          return d.designMode === this.props.designMode;
        })
        .map((d: IComponentHoc) => d.hoc);
    }

    __getSchemaChildrenVirtualDom = (schema: NodeSchema | undefined, scope: any, Comp: any) => {
      let _children = this.getSchemaChildren(schema);

      // @todo 补完这里的 Element 定义 @承虎
      let children: any = [];
      if (/*! isFileSchema(schema) && */_children) {
        if (!Array.isArray(_children)) {
          _children = [_children];
        }

        _children.forEach((_child: any) => {
          const _childVirtualDom = this.__createVirtualDom(
            isJSExpression(_child) ? parseExpression(_child, scope) : _child,
            scope,
            {
              schema,
              Comp,
            },
          );

          children.push(_childVirtualDom);
        });
      }

      if (children && children.length) {
        return children;
      }
      return null;
    };

    __getComponentProps = (schema: NodeSchema | undefined, scope: any, Comp: any, componentInfo?: any) => {
      if (!schema) {
        return {};
      }
      return this.__parseProps(schema?.props, scope, '', {
        schema,
        Comp,
        componentInfo: {
          ...(componentInfo || {}),
          props: transformArrayToMap((componentInfo || {}).props, 'name'),
        },
      }) || {};
    };

    __createLoopVirtualDom = (schema: NodeSchema, scope: any, parentInfo: IInfo, idx: number | string) => {
      if (isFileSchema(schema)) {
        console.warn('file type not support Loop');
        return null;
      }
      if (!Array.isArray(schema.loop)) return null;
      const itemArg = (schema.loopArgs && schema.loopArgs[0]) || 'item';
      const indexArg = (schema.loopArgs && schema.loopArgs[1]) || 'index';
      const loop: (JSONValue| CompositeValue)[] = schema.loop;
      return loop.map((item: JSONValue | CompositeValue, i: number) => {
        const loopSelf: any = {
          [itemArg]: item,
          [indexArg]: i,
        };
        loopSelf.__proto__ = scope;
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

    get _designModeIsDesign() {
      const { engine } = this.context || {};
      return engine?.props?.designMode === 'design';
    }

    __parseProps = (props: any, scope: any, path: string, info: IInfo): any => {
      const { schema, Comp, componentInfo = {} } = info;
      const propInfo = getValue(componentInfo.props, path);
      // FIXME! 将这行逻辑外置，解耦，线上环境不要验证参数，调试环境可以有，通过传参自定义
      const propType = propInfo?.extra?.propType;
      const ignoreParse = schema?.__ignoreParse || [];
      const checkProps = (value: any) => {
        if (!propType) return value;
        return checkPropTypes(value, path, propType, componentInfo.name) ? value : undefined;
      };

      const parseReactNode = (data: any, params: any) => {
        if (isEmpty(params)) {
          return checkProps(this.__createVirtualDom(data, scope, ({ schema, Comp } as IInfo)));
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
          args.__proto__ = scope;
          return scope.__createVirtualDom(data, args, { schema, Comp });
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
        props = parseExpression(props, scope);
        // 只有当变量解析出来为模型结构的时候才会继续解析
        if (!isSchema(props) && !isJSSlot(props)) return checkProps(props);
      }

      const handleLegaoI18n = (props: any) => props[props.use || 'zh_CN'];

      // 兼容乐高设计态 i18n 数据
      if (isI18nData(props)) {
        const i18nProp = handleLegaoI18n(props);
        if (i18nProp) {
          props = i18nProp;
        } else {
          return parseI18n(props, scope);
        }
      }

      // 兼容乐高设计态的变量绑定
      if (isVariable(props)) {
        props = props.value;
        if (isI18nData(props)) {
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
        return checkProps(props.map((item, idx) => this.__parseProps(item, scope, path ? `${path}.${idx}` : `${idx}`, info)));
      }
      if (typeof props === 'function') {
        return checkProps(props.bind(scope));
      }
      if (props && typeof props === 'object') {
        if (props.$$typeof) return checkProps(props);
        const res: any = {};
        forEach(props, (val: any, key: string) => {
          if (key.startsWith('__')) {
            res[key] = val;
            return;
          }
          res[key] = this.__parseProps(val, scope, path ? `${path}.${key}` : key, info);
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
      if (!filedId || typeof filedId !== 'string') {
        return this.__instanceMap;
      }
      if (instance) {
        this.__instanceMap[filedId] = instance;
      }
      return this.__instanceMap[filedId];
    }

    __debug = logger.log;

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

    __getHocComp(Comp: any, schema: any, scope: any) {
      this.componentHoc.forEach((ComponentConstruct: IComponentConstruct) => {
        Comp = ComponentConstruct(Comp || Div, {
          schema,
          componentInfo: {},
          baseRenderer: this,
          scope,
        });
      });

      return Comp;
    }

    __renderComp(Comp: any, ctxProps: object) {
      const { __schema } = this.props;
      const { __ctx } = this.props;
      const scope: any = {};
      scope.__proto__ = __ctx || this;
      Comp = this.__getHocComp(Comp, __schema, scope);
      const data = this.__parseProps(__schema?.props, scope, '', {
        schema: __schema,
        Comp,
        componentInfo: {},
      });
      const { className } = data;
      const otherProps: any = {};
      const { engine } = this.context || {};
      if (!engine) {
        return null;
      }

      if (this._designModeIsDesign) {
        otherProps.__tag = Math.random();
      }

      const child = engine.createElement(
        Comp,
        {
          ...data,
          ...this.props,
          ref: this.__getRef,
          className: classnames(getFileCssName(__schema?.fileName), className, this.props.className),
          __id: __schema?.id,
          ...otherProps,
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

    __checkSchema = (schema: NodeSchema | undefined, extraComponents: string | string[] = []) => {
      if (typeof extraComponents === 'string') {
        extraComponents = [extraComponents];
      }

      const buitin = capitalizeFirstLetter(this.__namespace);
      const componentNames = [buitin, ...extraComponents];
      return !isSchema(schema) || !componentNames.includes(schema?.componentName ?? '');
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
