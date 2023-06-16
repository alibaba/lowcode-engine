// 注意: 出码引擎注入的临时变量默认都以 "__$$" 开头，禁止在搭建的代码中直接访问。
// 例外：react 框架的导出名和各种组件名除外。
import React from 'react';

import { Form, Input, NumberPicker, Select, Button } from '@alifd/next';

import { createUrlParamsHandler as __$$createUrlParamsRequestHandler } from '@alilc/lowcode-datasource-url-params-handler';

import { createFetchHandler as __$$createFetchRequestHandler } from '@alilc/lowcode-datasource-fetch-handler';

import { create as __$$createDataSourceEngine } from '@alilc/lowcode-datasource-engine/runtime';

import '@alifd/next/lib/form/style';

import '@alifd/next/lib/input/style';

import '@alifd/next/lib/number-picker/style';

import '@alifd/next/lib/select/style';

import '@alifd/next/lib/button/style';

import utils, { RefsManager } from '../../utils';

import * as __$$i18n from '../../i18n';

import __$$constants from '../../constants';

import './index.css';

class Test$$Page extends React.Component {
  _context = this;

  _dataSourceConfig = this._defineDataSourceConfig();
  _dataSourceEngine = __$$createDataSourceEngine(this._dataSourceConfig, this, {
    runtimeConfig: true,
    requestHandlersMap: {
      urlParams: __$$createUrlParamsRequestHandler(window.location.search),
      fetch: __$$createFetchRequestHandler(),
    },
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

    this._refsManager = new RefsManager();

    __$$i18n._inject2(this);

    this.state = { text: 'outter' };
  }

  $ = (refName) => {
    return this._refsManager.get(refName);
  };

  $$ = (refName) => {
    return this._refsManager.getAll(refName);
  };

  _defineDataSourceConfig() {
    const _this = this;
    return {
      list: [
        {
          id: 'urlParams',
          type: 'urlParams',
          isInit: function () {
            return undefined;
          }.bind(_this),
          options: function () {
            return undefined;
          }.bind(_this),
        },
        {
          id: 'user',
          type: 'fetch',
          options: function () {
            return {
              method: 'GET',
              uri: 'https://shs.xxx.com/mock/1458/demo/user',
              isSync: true,
            };
          }.bind(_this),
          dataHandler: function (response) {
            if (!response.data.success) {
              throw new Error(response.data.message);
            }
            return response.data.data;
          },
          isInit: function () {
            return undefined;
          }.bind(_this),
        },
        {
          id: 'orders',
          type: 'fetch',
          options: function () {
            return {
              method: 'GET',
              uri: 'https://shs.xxx.com/mock/1458/demo/orders',
              isSync: true,
            };
          }.bind(_this),
          dataHandler: function (response) {
            if (!response.data.success) {
              throw new Error(response.data.message);
            }
            return response.data.data.result;
          },
          isInit: function () {
            return undefined;
          }.bind(_this),
        },
      ],
      dataHandler: function (dataMap) {
        console.info('All datasources loaded:', dataMap);
      },
    };
  }

  componentDidMount() {
    this._dataSourceEngine.reloadDataSource();

    console.log('componentDidMount');
  }

  render() {
    const __$$context = this._context || this;
    const { state } = __$$context;
    return (
      <div ref={this._refsManager.linkRef('outterView')} autoLoading={true}>
        <Form
          labelCol={__$$eval(() => this.state.colNum)}
          style={{}}
          ref={this._refsManager.linkRef('testForm')}
        >
          <Form.Item label="姓名：" name="name" initValue="李雷">
            <Input placeholder="请输入" size="medium" style={{ width: 320 }} />
          </Form.Item>
          <Form.Item label="年龄：" name="age" initValue="22">
            <NumberPicker size="medium" type="normal" />
          </Form.Item>
          <Form.Item label="职业：" name="profession">
            <Select
              dataSource={[
                { label: '教师', value: 't' },
                { label: '医生', value: 'd' },
                { label: '歌手', value: 's' },
              ]}
            />
          </Form.Item>
          <div style={{ textAlign: 'center' }}>
            <Button.Group>
              {__$$evalArray(() => ['a', 'b', 'c']).map((item, index) =>
                ((__$$context) =>
                  !!__$$eval(() => index >= 1) && (
                    <Button type="primary" style={{ margin: '0 5px 0 5px' }}>
                      {__$$eval(() => item)}
                    </Button>
                  ))(__$$createChildContext(__$$context, { item, index }))
              )}
            </Button.Group>
          </div>
        </Form>
      </div>
    );
  }
}

export default Test$$Page;

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
