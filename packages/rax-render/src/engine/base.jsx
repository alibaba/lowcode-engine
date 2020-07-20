import { Component, createElement } from 'rax';
import PropTypes from 'prop-types';
import Debug from 'debug';
import View from 'rax-view';
import DataHelper from '../utils/dataHelper';
import {
  forEach,
  getValue,
  parseData,
  parseExpression,
  isEmpty,
  isSchema,
  isFileSchema,
  isJSExpression,
  isJSSlot,
  isJSFunction,
  transformArrayToMap,
  checkPropTypes,
  generateI18n,
  acceptsRef,
} from '../utils';
import VisualDom from '../comp/visualDom';
import AppContext from '../context/appContext';
import CompWrapper from '../hoc/compWrapper';

const debug = Debug('engine:base');
const DESIGN_MODE = {
  EXTEND: 'extend',
  BORDER: 'border',
  PREVIEW: 'preview',
};
const OVERLAY_LIST = ['Dialog', 'Overlay'];
let scopeIdx = 0;

export default class BaseEngine extends Component {
  static dislayName = 'base-engine';
  static propTypes = {
    locale: PropTypes.string,
    messages: PropTypes.object,
    __appHelper: PropTypes.object,
    __components: PropTypes.object,
    __componentsMap: PropTypes.object,
    __ctx: PropTypes.object,
    __schema: PropTypes.object
  };
  static defaultProps = {
    __schema: {}
  };
  static contextType = AppContext;

  constructor(props, context) {
    super(props, context);
    this.appHelper = props.__appHelper;
    this.__compScopes = {};
    const { locale, messages } = props;
    this.i18n = generateI18n(locale, messages);
    this.__bindCustomMethods(props);
  }

  async getSnapshotBeforeUpdate() {
    this.__setLifeCycleMethods('getSnapshotBeforeUpdate', arguments);
  }

  async componentDidMount() {
    this.reloadDataSource();
    this.__setLifeCycleMethods('componentDidMount', arguments);
  }

  async componentDidUpdate() {
    this.__setLifeCycleMethods('componentDidUpdate', arguments);
  }

  async componentWillUnmount() {
    this.__setLifeCycleMethods('componentWillUnmount', arguments);
  }

  async componentDidCatch(e) {
    this.__setLifeCycleMethods('componentDidCatch', arguments);
    console.warn(e);
  }

  reloadDataSource = () => {
    return new Promise((resolve, reject) => {
      debug('reload data source');
      if (!this.__dataHelper) {
        this.__showPlaceholder = false;
        return resolve();
      }
      this.__dataHelper
        .getInitData()
        .then(res => {
          this.__showPlaceholder = false;
          if (isEmpty(res)) {
            this.forceUpdate();
            return resolve();
          }
          this.setState(res, resolve);
        })
        .catch(err => {
          if (this.__showPlaceholder) {
            this.__showPlaceholder = false;
            this.forceUpdate();
          }
          reject(err);
        });
    });
  };

  __setLifeCycleMethods = (method, args) => {
    const lifeCycleMethods = getValue(this.props.__schema, 'lifeCycles', {});
    if (lifeCycleMethods[method]) {
      try {
        return lifeCycleMethods[method].apply(this, args);
      } catch (e) {
        console.error(`[${this.props.__schema.componentName}]生命周期${method}出错`, e);
      }
    }
  };

  __bindCustomMethods = (props = this.props) => {
    const { __schema } = props;
    const customMethodsList = Object.keys(__schema.methods || {}) || [];
    this.__customMethodsList &&
      this.__customMethodsList.forEach(item => {
        if (!customMethodsList.includes(item)) {
          delete this[item];
        }
      });
    this.__customMethodsList = customMethodsList;
    forEach(__schema.methods, (val, key) => {
      this[key] = val.bind(this);
    });
  };

  __generateCtx = ctx => {
    const { pageContext, compContext } = this.context;
    const obj = {
      page: pageContext,
      component: compContext,
      ...ctx
    };
    forEach(obj, (val, key) => {
      this[key] = val;
    });
  };

  __parseData = (data, ctx) => {
    const { __ctx } = this.props;
    return parseData(data, ctx || __ctx || this);
  };

  __initDataSource = (props = this.props) => {
    const schema = props.__schema || {};
    const appHelper = props.__appHelper;
    const dataSource = (schema && schema.dataSource) || {};
    this.__dataHelper = new DataHelper(this, dataSource, appHelper, config => this.__parseData(config));
    this.dataSourceMap = this.__dataHelper.dataSourceMap;
    // 设置容器组件占位，若设置占位则在初始异步请求完成之前用loading占位且不渲染容器组件内部内容
    this.__showPlaceholder =
      this.__parseData(schema.props && schema.props.autoLoading) &&
      (dataSource.list || []).some(item => !!this.__parseData(item.isInit));
  };

  __render = () => {
    const schema = this.props.__schema;
    this.__setLifeCycleMethods('render');

    const engine = this.context.engine;
    if (engine) {
      engine.props.onCompGetCtx(schema, this);
      // 画布场景才需要每次渲染bind自定义方法
      if (engine.props.designMode) {
        this.__bindCustomMethods();
        this.dataSourceMap = this.__dataHelper && this.__dataHelper.updateConfig(schema.dataSource);
      }
    }
  };

  __getRef = ref => {
    this.__ref = ref;
  };

  __createDom = () => {
    const { __schema, __ctx, __components = {} } = this.props;
    const self = {};
    self.__proto__ = __ctx || this;
    return this.__createVirtualDom(__schema.children, self, {
      schema: __schema,
      Comp: __components[__schema.componentName]
    });
  };

  // 将模型结构转换成react Element
  // schema 模型结构
  // self 为每个渲染组件构造的上下文，self是自上而下继承的
  // parentInfo 父组件的信息，包含schema和Comp
  // idx 若为循环渲染的循环Index
  __createVirtualDom = (schema, self, parentInfo, idx) => {
    if (!schema) return null;
    // rax text prop 兼容处理
    if (schema.componentName === 'Text') {
      if (typeof schema.props.text === 'string') {
        schema = Object.assign({}, schema);
        schema.children = [schema.props.text];
      }
    }

    const { __appHelper: appHelper, __components: components = {}, __componentsMap: componentsMap = {} } =
      this.props || {};
    const { engine } = this.context || {};
    if (isJSExpression(schema)) {
      return parseExpression(schema, self);
    }
    if (typeof schema === 'string') return schema;
    if (typeof schema === 'number' || typeof schema === 'boolean') {
      return schema.toString();
    }
    if (Array.isArray(schema)) {
      if (schema.length === 1) return this.__createVirtualDom(schema[0], self, parentInfo);
      return schema.map((item, idx) =>
        this.__createVirtualDom(item, self, parentInfo, item && item.__ctx && item.__ctx.lunaKey ? '' : idx)
      );
    }

    //解析占位组件
    if (schema.componentName === 'Flagment' && schema.children) {
      let tarChildren = isJSExpression(schema.children) ? parseExpression(schema.children, self) : schema.children;
      return this.__createVirtualDom(tarChildren, self, parentInfo);
    }

    if (schema.$$typeof) {
      return schema;
    }
    if (!isSchema(schema)) return null;
    let Comp = components[schema.componentName] || View;

    if (schema.loop !== undefined) {
      return this.__createLoopVirtualDom(
        {
          ...schema,
          loop: parseData(schema.loop, self)
        },
        self,
        parentInfo,
        idx
      );
    }
    const condition = schema.condition === undefined ? true : parseData(schema.condition, self);
    if (!condition) return null;

    let scopeKey = '';
    // 判断组件是否需要生成scope，且只生成一次，挂在this.__compScopes上
    if (Comp.generateScope) {
      const key = parseExpression(schema.props.key, self);
      if (key) {
        // 如果组件自己设置key则使用组件自己的key
        scopeKey = key;
      } else if (!schema.__ctx) {
        // 在生产环境schema没有__ctx上下文，需要手动生成一个lunaKey
        schema.__ctx = {
          lunaKey: `luna${++scopeIdx}`
        };
        scopeKey = schema.__ctx.lunaKey;
      } else {
        // 需要判断循环的情况
        scopeKey = schema.__ctx.lunaKey + (idx !== undefined ? `_${idx}` : '');
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
    const otherProps = isFileSchema(schema)
      ? {
          __schema: schema,
          __appHelper: appHelper,
          __components: components,
          __componentsMap: componentsMap
        }
      : {};
    if (engine && engine.props.designMode) {
      otherProps.__designMode = engine.props.designMode;
    }
    const componentInfo = componentsMap[schema.componentName] || {};
    const props = this.__parseProps(schema.props, self, '', {
      schema,
      Comp,
      componentInfo: {
        ...componentInfo,
        props: transformArrayToMap(componentInfo.props, 'name')
      }
    });
    // 对于可以获取到ref的组件做特殊处理
    if (!acceptsRef(Comp)) {
      Comp = CompWrapper(Comp);
    }
    otherProps.ref = ref => {
      const refProps = props.ref;
      if (refProps && typeof refProps === 'string') {
        this[refProps] = ref;
      }
      engine && engine.props.onCompGetRef(schema, ref);
    };
    // scope需要传入到组件上
    if (scopeKey && this.__compScopes[scopeKey]) {
      props.__scope = this.__compScopes[scopeKey];
    }
    if (schema.__ctx && schema.__ctx.lunaKey) {
      if (!isFileSchema(schema)) {
        engine && engine.props.onCompGetCtx(schema, self);
      }
      props.key = props.key || `${schema.__ctx.lunaKey}_${schema.__ctx.idx || 0}_${idx !== undefined ? idx : ''}`;
    } else if (typeof idx === 'number' && !props.key) {
      props.key = idx;
    }
    const renderComp = props => (
      <Comp {...props}>
        {(!isFileSchema(schema) &&
          !!schema.children &&
          this.__createVirtualDom(
            isJSExpression(schema.children) ? parseExpression(schema.children, self) : schema.children,
            self,
            {
              schema,
              Comp
            }
          )) ||
          null}
      </Comp>
    );
    //设计模式下的特殊处理
    if (engine && [DESIGN_MODE.EXTEND, DESIGN_MODE.BORDER].includes(engine.props.designMode)) {
      //对于overlay,dialog等组件为了使其在设计模式下显示，外层需要增加一个div容器
      if (OVERLAY_LIST.includes(schema.componentName)) {
        const { ref, ...overlayProps } = otherProps;
        return (
          <Div ref={ref} __designMode={engine.props.designMode}>
            {renderComp({ ...props, ...overlayProps })}
          </Div>
        );
      }
      // 虚拟dom显示
      if (componentInfo && componentInfo.parentRule) {
        const parentList = componentInfo.parentRule.split(',');
        const { schema: parentSchema, Comp: parentComp } = parentInfo;
        if (!parentList.includes(parentSchema.componentName) || parentComp !== components[parentSchema.componentName]) {
          props.__componentName = schema.componentName;
          Comp = VisualDom;
        } else {
          // 若虚拟dom在正常的渲染上下文中，就不显示设计模式了
          props.__disableDesignMode = true;
        }
      }
    }
    return renderComp({ ...props, ...otherProps });
  };

  __createLoopVirtualDom = (schema, self, parentInfo, idx) => {
    if (isFileSchema(schema)) {
      console.warn('file type not support Loop');
      return null;
    }
    if (!Array.isArray(schema.loop)) return null;
    const itemArg = (schema.loopArgs && schema.loopArgs[0]) || 'item';
    const indexArg = (schema.loopArgs && schema.loopArgs[1]) || 'index';
    return schema.loop.map((item, i) => {
      const loopSelf = {
        [itemArg]: item,
        [indexArg]: i
      };
      loopSelf.__proto__ = self;
      return this.__createVirtualDom(
        {
          ...schema,
          loop: undefined
        },
        loopSelf,
        parentInfo,
        idx ? `${idx}_${i}` : i
      );
    });
  };

  __createContextDom = (childCtx, currCtx) => {
    return (
      <AppContext.Consumer>
        {context => {
          this.context = context;
          this.__generateCtx(currCtx);
          this.__render();
          return (
            <AppContext.Provider
              value={{
                ...this.context,
                ...childCtx
              }}
            >
              {this.__createDom()}
            </AppContext.Provider>
          );
        }}
      </AppContext.Consumer>
    );
  };

  __parseProps = (props, self, path, info) => {
    const { schema, Comp, componentInfo = {} } = info;
    const propInfo = getValue(componentInfo.props, path);
    const propType = propInfo && propInfo.extra && propInfo.extra.propType;
    const ignoreParse = schema.__ignoreParse || [];
    const checkProps = value => {
      if (!propType) return value;
      return checkPropTypes(value, path, propType, componentInfo.name) ? value : undefined;
    };

    const parseReactNode = (data, params) => {
      if (isEmpty(params)) {
        return checkProps(this.__createVirtualDom(data, self, { schema, Comp }));
      } else {
        return checkProps(function() {
          const args = {};
          if (Array.isArray(params) && params.length) {
            params.map((item, idx) => {
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
      }
    };

    // 判断是否需要解析变量
    if (
      ignoreParse.some(item => {
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

    if (isJSFunction(props)) {
      props = props.value;
    }
    if (isJSSlot(props)) {
      const { params, value } = props;
      if (!isSchema(value) || isEmpty(value)) return undefined;
      return parseReactNode(value, params);
    }
    // 兼容通过componentInfo判断的情况
    if (isSchema(props)) {
      return parseReactNode(props);
    } else if (Array.isArray(props)) {
      return checkProps(props.map((item, idx) => this.__parseProps(item, self, path ? `${path}.${idx}` : idx, info)));
    } else if (typeof props === 'function') {
      return checkProps(props.bind(self));
    } else if (props && typeof props === 'object') {
      if (props.$$typeof) return checkProps(props);
      const res = {};
      forEach(props, (val, key) => {
        if (key.startsWith('__')) {
          res[key] = val;
          return;
        }
        res[key] = this.__parseProps(val, self, path ? `${path}.${key}` : key, info);
      });
      return checkProps(res);
    } else if (typeof props === 'string') {
      return checkProps(props.trim());
    }
    return checkProps(props);
  };

  get utils() {
    return this.appHelper && this.appHelper.utils;
  }
  get constants() {
    return this.appHelper && this.appHelper.constants;
  }
  get history() {
    return this.appHelper && this.appHelper.history;
  }
  get location() {
    return this.appHelper && this.appHelper.location;
  }
  get match() {
    return this.appHelper && this.appHelper.match;
  }

  render() {
    return null;
  }
}
