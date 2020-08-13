// 注意: 出码引擎注入的临时变量默认都以 "__$$" 开头，禁止在搭建的代码中直接访问。
// 例外：rax 框架的导出名和各种组件名除外。
import { createElement, Component } from 'rax';

import View from 'rax-view';

import Text from 'rax-text';

import Image from 'rax-image';

import { create as __$$createDataSourceEngine } from '@ali/lowcode-datasource-engine';

import __$$projectUtils from '../../utils';

import './index.css';

class Home$$Page extends Component {
  state = {
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

  _dataSourceList = this._defineDataSourceList();
  _dataSourceEngine = __$$createDataSourceEngine(this._dataSourceList, this._context);

  _utils = this._defineUtils();

  componentDidMount() {
    this._dataSourceEngine.reloadDataSource();
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
            <View onClick={__$$eval(() => __$$context.hello)}>
              <Text>{__$$eval(() => __$$context.state.user.name)}</Text>
              <Text>{__$$eval(() => __$$context.state.user.age)}岁</Text>
            </View>
          </View>
        )}
        <View>
          <Text>=== Orders: ===</Text>
        </View>
        {__$$evalArray(() => __$$context.state.orders).map((item, index) => (
          <View
            style={{ flexDirection: 'row' }}
            onClick={__$$eval(
              () =>
                function () {
                  __$$context.utils.recordEvent(`CLICK_ORDER`, item.title);
                },
            )}
          >
            <View>
              <Image source={{ uri: __$$eval(() => item.coverUrl) }} style={{ width: '80px', height: '60px' }} />
            </View>
            <View>
              <Text>{__$$eval(() => item.title)}</Text>
              <Text>{__$$eval(() => __$$context.utils.formatPrice(item.price, '元'))}</Text>
            </View>
          </View>
        ))}
        <View>
          <Text>操作提示：</Text>
          <Text>1. 点击会员名，可以弹出 Toast "Hello xxx!"</Text>
          <Text>2. 点击订单，会记录点击的订单信息，并弹出 Toast 提示</Text>
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
        self._dataSourceEngine.reloadDataSource();
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
      ...this._methods,
    };

    return context;
  }

  _defineDataSourceList() {
    return [
      { id: 'urlParams', type: 'urlParams' },
      { id: 'user', type: 'fetch', options: { method: 'GET', uri: 'https://shs.alibaba-inc.com/mock/1458/demo/user' } },
      {
        id: 'orders',
        type: 'fetch',
        options: { method: 'GET', uri: 'https://shs.alibaba-inc.com/mock/1458/demo/orders' },
      },
    ];
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

export default Home$$Page;

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
