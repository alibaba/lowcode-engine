// 注意: 出码引擎注入的临时变量默认都以 "__$$" 开头，禁止在搭建的代码中直接访问。
// 例外：rax 框架的导出名和各种组件名除外。
import { createElement, Component } from 'rax';
import { withRouter as __$$withRouter } from 'rax-app';

import View from 'rax-view';

import Card from '@alife/right-design-card';

import Text from 'rax-text';

import { create as __$$createDataSourceEngine } from '@ali/lowcode-datasource-engine/runtime';

import { isMiniApp as __$$isMiniApp } from 'universal-env';

import __$$constants from '../../constants';

import * as __$$i18n from '../../i18n';

import __$$projectUtils from '../../utils';

import './index.css';

class Home$$Page extends Component {
  state = {};

  _methods = this._defineMethods();

  _context = this._createContext();

  _dataSourceConfig = this._defineDataSourceConfig();
  _dataSourceEngine = __$$createDataSourceEngine(this._dataSourceConfig, this._context, {
    runtimeConfig: true,
  });

  _utils = this._defineUtils();

  componentDidMount() {
    this._dataSourceEngine.reloadDataSource();
  }

  componentWillUnmount() {}

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
      <View>
        <Card>
          <Text>This is a demo card.</Text>
        </Card>
      </View>
    );
  }

  _createContext() {
    const self = this;

    // 保存下最新的状态，这样 setState 可以搞成同步一样的了
    self._latestState = self.state;

    const context = {
      get state() {
        // 这里直接获取最新的 state，从而能避免一些 React/Rax 这样的框架因为异步 setState 而导致的一些问题
        return self._latestState;
      },
      setState(newState) {
        self._latestState = { ...self._latestState, ...newState };
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
    return { list: [] };
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
    const __$$methods = {};

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
