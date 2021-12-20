import React from "react";

import { Switch } from "@alifd/next";

import { createJsonpHandler as __$$createJsonpRequestHandler } from "@ali/lowcode-datasource-jsonp-handler";

import { create as __$$createDataSourceEngine } from "@ali/lowcode-datasource-engine/runtime";

import utils from "../../utils";

import { i18n as _$$i18n } from "../../i18n";

import "./index.css";

class Index$$Page extends React.Component {
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
          id: "todos",
          isInit: function () {
            return true;
          },
          type: "jsonp",
          options: function () {
            return {
              method: "GET",
              uri: "https://a0ee9135-6a7f-4c0f-a215-f0f247ad907d.mock.pstmn.io",
            };
          },
          dataHandler: function dataHandler(data) {
            return data.data;
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
    return (
      <div>
        <div>
          {this.dataSourceMap.todos.data.map((item, index) =>
            ((__$$context) => (
              <div>
                <Switch
                  checkedChildren="开"
                  unCheckedChildren="关"
                  checked={item.done}
                />
              </div>
            ))(__$$createChildContext(__$$context, { item, index }))
          )}
        </div>
      </div>
    );
  }
}

export default Index$$Page;

function __$$createChildContext(oldContext, ext) {
  return Object.assign({}, oldContext, ext);
}
