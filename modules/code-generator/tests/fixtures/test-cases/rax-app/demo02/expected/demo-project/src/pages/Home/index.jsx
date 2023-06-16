// 注意: 出码引擎注入的临时变量默认都以 "__$$" 开头，禁止在搭建的代码中直接访问。
// 例外：rax 框架的导出名和各种组件名除外。
import { createElement, Component } from 'rax';
import { getSearchParams as __$$getSearchParams } from 'rax-app';

import Page from 'rax-view';

import View from 'rax-view';

import Text from 'rax-text';

import Image from 'rax-image';

import { createUrlParamsHandler as __$$createUrlParamsRequestHandler } from '@alilc/lowcode-datasource-url-params-handler';

import { createFetchHandler as __$$createFetchRequestHandler } from '@alilc/lowcode-datasource-fetch-handler';

import { create as __$$createDataSourceEngine } from '@alilc/lowcode-datasource-engine/runtime';

import { isMiniApp as __$$isMiniApp } from 'universal-env';

import __$$constants from '../../constants';

import * as __$$i18n from '../../i18n';

import __$$projectUtils from '../../utils';

import './index.css';

class Home$$Page extends Component {
  state = {
    clickCount: 0,
    user: {
      name: '张三',
      age: 18,
      avatar: 'https://gw.alicdn.com/tfs/TB1Ui9BMkY2gK0jSZFgXXc5OFXa-50-50.png',
    },
    orders: [
      {
        title: '【小米智能生活】米家扫地机器人家用全自动扫拖一体机拖地吸尘器',
        price: 1799,
        coverUrl: 'https://gw.alicdn.com/tfs/TB1dGVlRfb2gK0jSZK9XXaEgFXa-258-130.png',
      },
      {
        title: '【限时下单立减】Apple/苹果 iPhone 11 4G全网通智能手机正品苏宁易购官方旗舰店苹果11',
        price: 4999,
        coverUrl: 'https://gw.alicdn.com/tfs/TB18gdJddTfau8jSZFwXXX1mVXa-1298-1202.png',
      },
    ],
  };

  _methods = this._defineMethods();

  _context = this._createContext();

  _dataSourceConfig = this._defineDataSourceConfig();
  _dataSourceEngine = __$$createDataSourceEngine(this._dataSourceConfig, this._context, {
    runtimeConfig: true,
    requestHandlersMap: {
      urlParams: __$$createUrlParamsRequestHandler(__$$getSearchParams()),
      fetch: __$$createFetchRequestHandler(),
    },
  });

  _utils = this._defineUtils();

  _lifeCycles = this._defineLifeCycles();

  constructor(props, context) {
    super(props);

    __$$i18n._inject2(this);
  } /* end of constructor */

  componentDidMount() {
    this._dataSourceEngine.reloadDataSource();

    this._lifeCycles.didMount();
  } /* end of componentDidMount */

  componentWillUnmount() {
    this._lifeCycles.willUnmount();
  } /* end of componentWillUnmount */

  render() {
    const __$$context = this._context;
    const {
      state,
      setState,
      dataSourceMap,
      reloadDataSource,
      utils,
      constants,
      i18n,
      i18nFormat,
      getLocale,
      setLocale,
    } = __$$context;

    return (
      <Page>
        <View>
          <Text>Demo data source logic</Text>
        </View>
        <View>
          <Text>=== User Info: ===</Text>
        </View>
        {!!__$$eval(() => __$$context.state.user) && (
          <View style={{ flexDirection: 'row' }}>
            <Image
              source={{ uri: __$$eval(() => __$$context.state.user.avatar) }}
              style={{ width: '32px', height: '32px' }}
            />
            <View onClick={__$$context.hello}>
              <Text>{__$$eval(() => __$$context.state.user.name)}</Text>
              <Text>{__$$eval(() => __$$context.state.user.age)}岁</Text>
            </View>
          </View>
        )}
        <View>
          <Text>=== Orders: ===</Text>
        </View>
        {__$$evalArray(() => __$$eval(() => __$$context.state.orders)).map((order, index) =>
          ((__$$context) => (
            <View
              style={{ flexDirection: 'row' }}
              data-order={order}
              onClick={(...__$$args) => {
                if (__$$isMiniApp) {
                  const __$$event = __$$args[0];
                  const order = __$$event.target.dataset.order;
                  return function () {
                    __$$context.utils.recordEvent(`CLICK_ORDER`, order.title);
                  }.apply(this, __$$args);
                } else {
                  return function () {
                    __$$context.utils.recordEvent(`CLICK_ORDER`, order.title);
                  }.apply(this, __$$args);
                }
              }}
            >
              <View>
                <Image source={{ uri: __$$eval(() => order.coverUrl) }} style={{ width: '80px', height: '60px' }} />
              </View>
              <View>
                <Text>{__$$eval(() => order.title)}</Text>
                <Text>{__$$eval(() => __$$context.utils.formatPrice(order.price, '元'))}</Text>
              </View>
            </View>
          ))(__$$createChildContext(__$$context, { order, index })),
        )}
        <View
          onClick={function () {
            __$$context.setState({
              clickCount: __$$context.state.clickCount + 1,
            });
          }}
        >
          <Text>点击次数：{__$$eval(() => __$$context.state.clickCount)}(点击加 1)</Text>
        </View>
        <View>
          <Text>操作提示：</Text>
          <Text>1. 点击会员名，可以弹出 Toast &#34;Hello xxx!&#34;</Text>
          <Text>2. 点击订单，会记录点击的订单信息，并弹出 Toast 提示</Text>
          <Text>3. 最下面的【点击次数】，点一次应该加 1</Text>
        </View>
      </Page>
    );
  } /* end of render */

  _createContext() {
    const self = this;
    const context = {
      get state() {
        return self.state;
      },
      setState(newState, callback) {
        self.setState(newState, callback);
      },
      get dataSourceMap() {
        return self._dataSourceEngine.dataSourceMap || {};
      },
      async reloadDataSource() {
        await self._dataSourceEngine.reloadDataSource();
      },
      get utils() {
        return self._utils;
      },
      get page() {
        return context;
      },
      get component() {
        return context;
      },
      get props() {
        return self.props;
      },
      get constants() {
        return __$$constants;
      },
      i18n: __$$i18n.i18n,
      i18nFormat: __$$i18n.i18nFormat,
      getLocale: __$$i18n.getLocale,
      setLocale(locale) {
        __$$i18n.setLocale(locale);
        self.forceUpdate();
      },
      ...this._methods,
    };

    return context;
  }

  _defineDataSourceConfig() {
    const __$$context = this._context;
    return {
      list: [
        {
          errorHandler: function (err) {
            setTimeout(() => {
              __$$context.setState({
                __refresh: Date.now() + Math.random(),
              });
            }, 0);
            throw err;
          },
          id: 'urlParams',
          type: 'urlParams',
          isInit: true,
          options: function () {
            return undefined;
          },
        },
        {
          errorHandler: function (err) {
            setTimeout(() => {
              __$$context.setState({
                __refresh: Date.now() + Math.random(),
              });
            }, 0);
            throw err;
          },
          id: 'user',
          type: 'fetch',
          options: function () {
            return {
              method: 'GET',
              uri: 'https://shs.xxx.com/mock/1458/demo/user',
              isSync: true,
            };
          },
          dataHandler: function (response) {
            if (!response.success) {
              throw new Error(response.message);
            }
            return response.data;
          },
          isInit: true,
        },
        {
          errorHandler: function (err) {
            setTimeout(() => {
              __$$context.setState({
                __refresh: Date.now() + Math.random(),
              });
            }, 0);
            throw err;
          },
          id: 'orders',
          type: 'fetch',
          options: function () {
            return {
              method: 'GET',
              uri: __$$context.state.user.ordersApiUri,
              isSync: true,
            };
          },
          dataHandler: function (response) {
            if (!response.success) {
              throw new Error(response.message);
            }
            return response.data.result;
          },
          isInit: true,
        },
      ],
      dataHandler: function (dataMap) {
        console.info('All datasources loaded:', dataMap);
      },
    };
  }

  _defineUtils() {
    return {
      ...__$$projectUtils,
    };
  }

  _defineLifeCycles() {
    const __$$lifeCycles = {
      didMount: function didMount() {
        this.utils.Toast.show(`Hello ${this.state.user.name}!`);
      },

      willUnmount: function didMount() {
        this.utils.Toast.show(`Bye, ${this.state.user.name}!`);
      },
    };

    // 为所有的方法绑定上下文
    Object.entries(__$$lifeCycles).forEach(([lifeCycleName, lifeCycleMethod]) => {
      if (typeof lifeCycleMethod === 'function') {
        __$$lifeCycles[lifeCycleName] = (...args) => {
          return lifeCycleMethod.apply(this._context, args);
        };
      }
    });

    return __$$lifeCycles;
  }

  _defineMethods() {
    return {
      hello: function hello() {
        this.utils.Toast.show(`Hello ${this.state.user.name}!`);
        console.log(`Hello ${this.state.user.name}!`);
      },
    };
  }
}

export default Home$$Page;

function __$$eval(expr) {
  try {
    return expr();
  } catch (error) {}
}

function __$$evalArray(expr) {
  const res = __$$eval(expr);
  return Array.isArray(res) ? res : [];
}

function __$$createChildContext(oldContext, ext) {
  return Object.assign({}, oldContext, ext);
}
