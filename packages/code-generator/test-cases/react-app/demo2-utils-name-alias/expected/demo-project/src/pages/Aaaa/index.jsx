import React from "react";

import { Page } from "@ali/b6-page";

import { Text } from "@ali/b6-text";

import { createUrlParamsHandler as __$$createUrlParamsRequestHandler } from "@ali/lowcode-datasource-url-params-handler";

import { create as __$$createDataSourceEngine } from "@ali/lowcode-datasource-engine/runtime";

import utils from "../../utils";

import { i18n as _$$i18n } from "../../i18n";

import "./index.css";

class Aaaa$$Page extends React.Component {
  _dataSourceConfig = this._defineDataSourceConfig();
  _dataSourceEngine = __$$createDataSourceEngine(this._dataSourceConfig, this, {
    runtimeConfig: true,
    requestHandlersMap: {
      urlParams: __$$createUrlParamsRequestHandler(window.location.search),
    },
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
          id: "urlParams",
          type: "urlParams",
          description: "URL参数",
          options: function () {
            return {
              uri: "",
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
    return (
      <div title="" backgroundColor="#fff" textColor="#333" style={{}}>
        <Text
          content="欢迎使用 BuildSuccess！sadsad"
          style={{}}
          fieldId="text_kp6ci11t"
        />
      </div>
    );
  }
}

export default Aaaa$$Page;

function __$$createChildContext(oldContext, ext) {
  return Object.assign({}, oldContext, ext);
}
