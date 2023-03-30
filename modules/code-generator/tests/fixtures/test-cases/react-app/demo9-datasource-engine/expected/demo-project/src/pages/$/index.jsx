// 注意: 出码引擎注入的临时变量默认都以 "__$$" 开头，禁止在搭建的代码中直接访问。
// 例外：react 框架的导出名和各种组件名除外。
import React from 'react';

import { Switch } from '@alifd/next';

import { createJsonpHandler as __$$createJsonpRequestHandler } from '@alilc/lowcode-datasource-jsonp-handler';

import { create as __$$createDataSourceEngine } from '@alilc/lowcode-datasource-engine/runtime';

import '@alifd/next/lib/switch/style';

import utils from '../../utils';

import * as __$$i18n from '../../i18n';

import __$$constants from '../../constants';

import './index.css';

class $$Page extends React.Component {
  _context = this;

  _dataSourceConfig = this._defineDataSourceConfig();
  _dataSourceEngine = __$$createDataSourceEngine(this._dataSourceConfig, this, {
    runtimeConfig: true,
    requestHandlersMap: { jsonp: __$$createJsonpRequestHandler() },
  });

  get dataSourceMap() {
    return this._dataSourceEngine.dataSourceMap || {};
  }

  reloadDataSource = async () => {
    await this._dataSourceEngine.reloadDataSource();
  };

  get constants() {
    return __$$constants || {};
  }

  constructor(props, context) {
    super(props);

    this.utils = utils;

    __$$i18n._inject2(this);

    this.state = {};
  }

  $ = () => null;

  $$ = () => [];

  _defineDataSourceConfig() {
    const _this = this;
    return {
      list: [
        {
          id: 'todos',
          isInit: function () {
            return true;
          }.bind(_this),
          type: 'jsonp',
          options: function () {
            return {
              method: 'GET',
              uri: 'https://a0ee9135-6a7f-4c0f-a215-f0f247ad907d.mock.pstmn.io',
            };
          }.bind(_this),
          dataHandler: function dataHandler(data) {
            return data.data;
          },
        },
      ],
    };
  }

  componentDidMount() {
    this._dataSourceEngine.reloadDataSource();
  }

  render() {
    const __$$context = this._context || this;
    const { state } = __$$context;
    return (
      <div>
        {__$$evalArray(() => this.dataSourceMap.todos.data).map((item, index) =>
          ((__$$context) => (
            <div>
              <Switch
                checkedChildren="开"
                unCheckedChildren="关"
                checked={__$$eval(() => item.done)}
              />
            </div>
          ))(__$$createChildContext(__$$context, { item, index }))
        )}
      </div>
    );
  }
}

export default $$Page;

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
  const childContext = {
    ...oldContext,
    ...ext,
  };
  childContext.__proto__ = oldContext;
  return childContext;
}
