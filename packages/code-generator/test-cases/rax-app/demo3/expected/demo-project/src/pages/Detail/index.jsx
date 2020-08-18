// 注意: 出码引擎注入的临时变量默认都以 "__$$" 开头，禁止在搭建的代码中直接访问。
// 例外：rax 框架的导出名和各种组件名除外。
import { createElement, Component } from 'rax';
import { withRouter as __$$withRouter } from 'rax-app';

import View from 'rax-view';

import Text from 'rax-text';

import Link from 'rax-link';

import Image from 'rax-image';

import { create as __$$createDataSourceEngine } from '@ali/lowcode-datasource-engine';

import { isMiniApp as __$$isMiniApp } from 'universal-env';

import __$$constants from '../../constants';

import __$$projectUtils from '../../utils';

import './index.css';

class Detail$$Page extends Component {
  state = {};

  _methods = this._defineMethods();

  _context = this._createContext();

  _dataSourceConfig = this._defineDataSourceConfig();
  _dataSourceEngine = __$$createDataSourceEngine(this._dataSourceConfig, this._context, { runtimeConfig: true });

  _utils = this._defineUtils();

  componentDidMount() {
    this._dataSourceEngine.reloadDataSource();
  }

  componentWillUnmount() {}

  render() {
    const __$$context = this._context;

    return (
      <View>
        <View>
          <Text>This is the Detail Page</Text>
        </View>
        <Link href="javascript:history.back();" miniappHref="navigateBack:">
          <Text>Go back</Text>
        </Link>
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

export default __$$withRouter(Detail$$Page);

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
