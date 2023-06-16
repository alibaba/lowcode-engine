// 注意: 出码引擎注入的临时变量默认都以 "__$$" 开头，禁止在搭建的代码中直接访问。
// 例外：react 框架的导出名和各种组件名除外。
import React from 'react';

import { Page, Table } from '@alilc/lowcode-components';

import { createHttpHandler as __$$createHttpRequestHandler } from '@alilc/lowcode-datasource-http-handler';

import { create as __$$createDataSourceEngine } from '@alilc/lowcode-datasource-engine/runtime';

import utils from '../../utils';

import * as __$$i18n from '../../i18n';

import __$$constants from '../../constants';

import './index.css';

class Example$$Page extends React.Component {
  _context = this;

  _dataSourceConfig = this._defineDataSourceConfig();
  _dataSourceEngine = __$$createDataSourceEngine(this._dataSourceConfig, this, {
    runtimeConfig: true,
    requestHandlersMap: { http: __$$createHttpRequestHandler() },
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
          id: 'userList',
          type: 'http',
          description: '用户列表',
          options: function () {
            return {
              uri: 'https://api.example.com/user/list',
            };
          }.bind(_this),
          isInit: function () {
            return undefined;
          }.bind(_this),
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
        <Table
          dataSource={__$$eval(() => this.dataSourceMap['userList'])}
          columns={[
            { dataIndex: 'name', title: '姓名' },
            { dataIndex: 'age', title: '年龄' },
          ]}
        />
      </div>
    );
  }
}

export default Example$$Page;

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
