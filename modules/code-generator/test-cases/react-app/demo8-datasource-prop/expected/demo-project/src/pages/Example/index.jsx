import React from "react";

import { Page, Table } from "@alilc/lowcode-components";

import { createHttpHandler as __$$createHttpRequestHandler } from "@alilc/lowcode-datasource-http-handler";

import { create as __$$createDataSourceEngine } from "@alilc/lowcode-datasource-engine/runtime";

import utils from "../../utils";

import { i18n as _$$i18n } from "../../i18n";

import "./index.css";

class Example$$Page extends React.Component {
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

  constructor(props, context) {
    super(props);

    this.utils = utils;

    this.state = {};
  }

  _defineDataSourceConfig() {
    const _this = this;
    return {
      list: [
        {
          id: "userList",
          type: "http",
          description: "用户列表",
          options: function () {
            return {
              uri: "https://api.example.com/user/list",
            };
          },
          isInit: function () {
            return undefined;
          },
        },
      ],
    };
  }

  i18n = (i18nKey) => {
    return _$$i18n(i18nKey);
  };

  componentDidMount() {
    this._dataSourceEngine.reloadDataSource();
  }

  render() {
    const __$$context = this;
    const { state } = this;
    return (
      <div>
        <Table
          dataSource={this.dataSourceMap["userList"]}
          columns={[
            { dataIndex: "name", title: "姓名" },
            { dataIndex: "age", title: "年龄" },
          ]}
        />
      </div>
    );
  }
}

export default Example$$Page;

function __$$createChildContext(oldContext, ext) {
  const childContext = {
    ...oldContext,
    ...ext,
  };
  childContext.__proto__ = oldContext;
  return childContext;
}
