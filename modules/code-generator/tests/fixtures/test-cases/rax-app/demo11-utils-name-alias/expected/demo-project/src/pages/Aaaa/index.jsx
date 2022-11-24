// 注意: 出码引擎注入的临时变量默认都以 "__$$" 开头，禁止在搭建的代码中直接访问。
// 例外：rax 框架的导出名和各种组件名除外。
import { createElement, Component } from 'rax';
import { getSearchParams as __$$getSearchParams } from 'rax-app';

import { Page } from '@alilc/b6-page';

import { Text } from '@alilc/b6-text';

import { createUrlParamsHandler as __$$createUrlParamsRequestHandler } from '@alilc/lowcode-datasource-url-params-handler';

import { create as __$$createDataSourceEngine } from '@alilc/lowcode-datasource-engine/runtime';

import { isMiniApp as __$$isMiniApp } from 'universal-env';

import __$$constants from '../../constants';

import * as __$$i18n from '../../i18n';

import __$$projectUtils from '../../utils';

import './index.css';

class Aaaa$$Page extends Component {
  state = {};

  _methods = this._defineMethods();

  _context = this._createContext();

  _dataSourceConfig = this._defineDataSourceConfig();
  _dataSourceEngine = __$$createDataSourceEngine(this._dataSourceConfig, this._context, {
    runtimeConfig: true,
    requestHandlersMap: {
      urlParams: __$$createUrlParamsRequestHandler(__$$getSearchParams()),
    },
  });

  _utils = this._defineUtils();

  constructor(props, context) {
    super(props);

    __$$i18n._inject2(this);
  } /* end of constructor */

  componentDidMount() {
    this._dataSourceEngine.reloadDataSource();
  } /* end of componentDidMount */

  componentWillUnmount() {} /* end of componentWillUnmount */

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
      <Page title="" backgroundColor="#fff" textColor="#333" style={{}}>
        <Text content="欢迎使用 BuildSuccess！sadsad" style={{}} fieldId="text_kp6ci11t" />
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
          description: 'URL参数',
          options: function () {
            return {
              uri: '',
            };
          },
          isInit: true,
        },
      ],
    };
  }

  _defineUtils() {
    return {
      ...__$$projectUtils,
    };
  }

  _defineMethods() {
    return {};
  }
}

export default Aaaa$$Page;

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
