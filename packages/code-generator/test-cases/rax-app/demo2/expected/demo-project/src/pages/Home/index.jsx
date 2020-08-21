// 注意: 出码引擎注入的临时变量默认都以 "__$$" 开头，禁止在搭建的代码中直接访问。
// 例外：rax 框架的导出名和各种组件名除外。
import { createElement, Component } from 'rax';
import { withRouter as __$$withRouter } from 'rax-app';

import View from 'rax-view';

import Text from 'rax-text';

import Image from 'rax-image';

import __$$urlParamsRequestHandler from '@ali/lowcode-datasource-engine/handlers/url-params';

import __$$fetchRequestHandler from '@ali/lowcode-datasource-engine/handlers/fetch';

import { create as __$$createDataSourceEngine } from '@ali/lowcode-datasource-engine';

import { isMiniApp as __$$isMiniApp } from 'universal-env';

import __$$constants from '../../constants';

import * as __$$i18n from '../../i18n';

import __$$projectUtils from '../../utils';

import './index.css';

class Home$$Page extends Component {
  state = {
    clickCount: 0,
    user: { name: '张三', age: 18, avatar: 'https://gw.alicdn.com/tfs/TB1Ui9BMkY2gK0jSZFgXXc5OFXa-50-50.png' },
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

  _i18n = this._createI18nDelegate();

  _dataSourceConfig = this._defineDataSourceConfig();
  _dataSourceEngine = __$$createDataSourceEngine(this._dataSourceConfig, this._context, {
    runtimeConfig: true,
    requestHandlersMap: {
      urlParams: __$$urlParamsRequestHandler({ search: this.props.location.search }),
      fetch: __$$fetchRequestHandler,
    },
  });

  _utils = this._defineUtils();

  _lifeCycles = this._defineLifeCycles();

  componentDidMount() {
    this._dataSourceEngine.reloadDataSource();

    this._lifeCycles.didMount();
  }

  componentWillUnmount() {
    this._lifeCycles.willUnmount();
  }

  render() {
    const __$$context = this._context;

    return (
      <View>
        <View>
          <Text>Demo data source logic</Text>
        </View>
        <View>
          <Text>=== User Info: ===</Text>
        </View>
        {__$$eval(() => __$$context.state.user) && (
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
        {__$$evalArray(() => __$$context.state.orders).map((order, index) => (
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
        ))}
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
          <Text>1. 点击会员名，可以弹出 Toast "Hello xxx!"</Text>
          <Text>2. 点击订单，会记录点击的订单信息，并弹出 Toast 提示</Text>
          <Text>3. 最下面的【点击次数】，点一次应该加 1</Text>
        </View>
      </View>
    );
  }

  _createContext() {
    const self = this;

    const context = {
      get state() {
        return self.state;
      },
      setState(newState) {
        self.setState(newState);
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
      get i18n() {
        return self._i18n;
      },
      getLocale() {
        return __$$i18n.getLocale();
      },
      setLocale(locale) {
        __$$i18n.setLocale(locale);
        self.forceUpdate();
      },
      ...this._methods,
    };

    return context;
  }

  _createI18nDelegate() {
    return new Proxy(
      {},
      {
        get(target, prop) {
          return __$$i18n.i18n(prop);
        },
      },
    );
  }

  _defineDataSourceConfig() {
    const __$$context = this._context;
    return {
      list: [
        {
          id: 'urlParams',
          type: 'urlParams',
          isInit: function () {
            return undefined;
          },
          options: function () {
            return undefined;
          },
        },
        {
          id: 'user',
          type: 'fetch',
          options: function () {
            return {
              method: 'GET',
              uri: 'https://shs.alibaba-inc.com/mock/1458/demo/user',
              isSync: true,
            };
          },
          dataHandler: function (response) {
            if (!response.success) {
              throw new Error(response.message);
            }

            return response.data;
          },
          isInit: function () {
            return undefined;
          },
        },
        {
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
          isInit: function () {
            return undefined;
          },
        },
      ],
      dataHandler: function (dataMap) {
        console.info('All datasources loaded:', dataMap);
      },
    };
  }

  _defineUtils() {
    const utils = {
      ...__$$projectUtils,
    };

    Object.entries(utils).forEach(([name, util]) => {
      if (typeof util === 'function') {
        utils[name] = util.bind(this._context);
      }
    });

    return utils;
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
    const __$$methods = {
      hello: function hello() {
        this.utils.Toast.show(`Hello ${this.state.user.name}!`);
        console.log(`Hello ${this.state.user.name}!`);
      },
    };

    // 为所有的方法绑定上下文
    Object.entries(__$$methods).forEach(([methodName, method]) => {
      if (typeof method === 'function') {
        __$$methods[methodName] = (...args) => {
          return method.apply(this._context, args);
        };
      }
    });

    return __$$methods;
  }
}

export default __$$withRouter(Home$$Page);

function __$$eval(expr) {
  try {
    return expr();
  } catch (err) {
    console.warn('Failed to evaluate: ', expr, err);
  }
}

function __$$evalArray(expr) {
  const res = __$$eval(expr);
  return Array.isArray(res) ? res : [];
}
