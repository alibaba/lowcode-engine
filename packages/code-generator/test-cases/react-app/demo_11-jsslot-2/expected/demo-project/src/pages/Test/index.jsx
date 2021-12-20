import React from "react";

import Page from "undefined";

import {
  Modal,
  Button,
  Typography,
  Form,
  Select,
  Input,
  Tooltip,
  Icon,
  Empty,
} from "@ali/antd-lowcode-materials/dist/antd-lowcode.esm.js";

import {
  AliAutoDiv,
  AliAutoSearchTable,
} from "@alife/mc-assets-1935/build/lowcode/index.js";

import {
  Page as NextPage,
  Block as NextBlock,
  P as NextP,
} from "@alife/container/lib/index.js";

import utils, { RefsManager } from "../../utils";

import { i18n as _$$i18n } from "../../i18n";

import "./index.css";

const AliAutoDivDefault = AliAutoDiv.default;

const AliAutoSearchTableDefault = AliAutoSearchTable.default;

const NextBlockCell = NextBlock.Cell;

class Test$$Page extends React.Component {
  constructor(props, context) {
    super(props);

    this.utils = utils;

    this._refsManager = new RefsManager();

    this.state = {
      pkgs: [],
      total: 0,
      isSearch: false,
      projects: [],
      results: [],
      resultVisible: false,
      userOptions: [],
      searchValues: { user_id: "", channel_id: "" },
    };

    this.__jp__init();

    this.statusDesc = {
      0: "失败",
      1: "成功",
      2: "构建中",
      3: "构建超时",
    };
    this.pageParams = {};
    this.searchParams = {};
    this.userTimeout = null;
    this.currentUser = null;
    this.notFoundContent = null;
    this.projectTimeout = null;
    this.currentProject = null;
  }

  $ = (refName) => {
    return this._refsManager.get(refName);
  };

  $$ = (refName) => {
    return this._refsManager.getAll(refName);
  };

  i18n = (i18nKey) => {
    return _$$i18n(i18nKey);
  };

  componentDidUpdate(prevProps, prevState, snapshot) {}

  componentWillUnmount() {}

  __jp__init() {
    this.__jp__initEnv && this.__jp__initEnv();
    this.__jp__initConfig && this.__jp__initConfig();
    this.__jp__initDataSource && this.__jp__initDataSource();
    this.__jp__initRouter && this.__jp__initRouter();
    this.__jp__initUtils && this.__jp__initUtils();
  }

  __jp__initRouter() {
    if (window.arsenal) {
      this.$router = new window.jianpin.ArsenalRouter({
        app: this.props.microApp,
      });
    } else {
      this.$router = new window.jianpin.ArsenalRouter();
    }
  }

  __jp__initDataSource() {
    this.$apis = {
      PKG_LIST: {
        name: "打包列表",
        code: "PKG_LIST",
        url: "https://auto-nvwa.amap.com/ws/nvwa/cpp5x/packages/",
        method: "GET",
        dataHandler: (res) => res.data,
      },
      PROJECTS: {
        name: "项目名称/渠道号",
        code: "PROJECTS",
        url: "http://auto-nvwa-staging.alibaba.com/ws/nvwa/cpp/select_projects/",
        method: "GET",
        state: "projects",
        params: {
          size: 5000,
        },
        dataHandler: (res) => {
          return res.data.data.result.map((d) => {
            const { id, channelId, project_name } = d;
            return {
              label: `${project_name} / ${channelId}`,
              value: id,
            };
          });
        },
      },
      RELOAD: {
        name: "重新执行",
        code: "RELOAD",
        url: "https://auto-nvwa.amap.com/cpp/configbuild/rebuild/",
        method: "GET",
      },
      BUILD_RESULT: {
        name: "打包结果",
        code: "BUILD_RESULT",
        url: "https://auto-nvwa.amap.com/cpp/api/configbuild/get_build_result/",
        method: "GET",
        state: "results",
        dataHandler: (res) => {
          return res.data.result;
        },
      },
      BUC_USER: {
        name: "搜索用户",
        code: "BUC_USER",
        url: "https://auto-nvwa.amap.com/ws/nvwa/sso_users/",
        method: "GET",
        dataHandler: (res) => res.data.items,
      },
    };
    this.$ds = new window.jianpin.DataSource(this, {});
  }

  __jp__initEnv() {
    const hostname = window.location.hostname;
    let env = "prod";

    if (window.jianpin && window.jianpin.env === "dev") {
      env = "dev";
    } else if (window.arsenalConfig) {
      env = window.arsenalConfig.env;
    }

    const urlSearchParams = new URLSearchParams(window.location.search);
    const searchParams = {};

    for (const [key, value] of urlSearchParams) {
      searchParams[key] = value;
    }

    this.$env = env;
    this.$searchParams = searchParams;

    if (window.arsenal && window.arsenal.store) {
      this.$user = window.arsenal.store.getState("user");
      this.$store = window.arsenal.store;
      window.arsenal.store.subscribe("user", () => {
        this.$user = window.arsenal.store.getState("user");
      });
    } else {
      this.$store = {
        subscribe: () => {},
        getState: () => {},
      };
      this.$user = this.__jp__mockUser || {};
    }
  }

  __jp__initConfig() {
    const __config = {
      default: {},
      dev: {},
      daily: {},
      pre: {},
      prod: {},
    };
    this.$config = window.jianpin.utils.extend(
      true,
      {},
      __config.default,
      __config[this.$env]
    );
  }

  __jp__initUtils() {
    this.$utils = {
      message: window.jianpin.utils.message,
      axios: window.jianpin.utils.axios,
      moment: window.jianpin.utils.moment,
    };
  }

  setSearchItem(item) {
    const searchState = this.state.searchValues;

    const reducer = (pre, key) => {
      let value = searchState[key];

      if (item.hasOwnProperty(key)) {
        value = item[key];
      }

      return { ...pre, [key]: value || null };
    };

    const searchValues = Object.keys(searchState).reduce(reducer, {});
    this.setState({
      searchValues,
    });
  }

  fetchProject(value, callback) {
    if (this.projectTimeout) {
      clearTimeout(this.projectTimeout);
      this.projectTimeout = null;
    }

    this.currentProject = value;

    const fake = () => {
      this.$ds
        .resolve("PROJECTS", {
          params: {
            search_param: value,
          },
        })
        .then((res) => {
          if (this.currentProject !== value) {
            return;
          }

          callback(res || []);
        });
    };

    this.projectTimeout = setTimeout(fake, 300);
  }

  handleProjectSearch(value) {
    if (value) {
      this.fetchProject(value, (projects) => {
        this.setState({
          projects,
        });
      });
    } else {
      this.setState({
        projects: [],
      });
    }
  }

  handleProjectChange(id) {
    this.setSearchItem({
      channel_id: id,
    });
  }

  fetchUser(value, callback) {
    if (this.userTimeout) {
      clearTimeout(this.userTimeout);
      this.userTimeout = null;
    }

    this.currentUser = value;

    const fake = () => {
      this.$ds
        .resolve("BUC_USER", {
          params: {
            q: value,
          },
        })
        .then((res) => {
          if (this.currentUser !== value) {
            return;
          }

          const data = res.slice(0, 8).map((r) => ({
            label: `${r.id} / ${r.label}`,
            value: r.id,
          }));
          callback(data);
        });
    };

    this.userTimeout = setTimeout(fake, 300);
  }

  handleUserSearch(value) {
    if (value) {
      this.fetchUser(value, (userOptions) => {
        this.setState({
          userOptions,
        });
      });
    } else {
      this.setState({
        userOptions: [],
      });
    }
  }

  handleUserChange(user) {
    console.log("debug user", user);
    this.setSearchItem({
      user_id: user,
    });
  }

  fetchPkgs() {
    const { pageIndex, pageSize } = this.pageParams;
    this.$ds
      .resolve("PKG_LIST", {
        params: { ...this.searchParams, page: pageIndex, size: pageSize },
      })
      .then((res) => {
        const { result, page } = res.data;
        const { count } = page;
        this.setState({
          isSearch: true,
          pkgs: result,
          total: count,
        });
      });
  }

  onPageChange(pageIndex, pageSize) {
    this.pageParams = {
      pageIndex,
      pageSize,
    };
    this.fetchPkgs();
  }

  renderTime(time) {
    return this.$utils.moment(time).format("YYYY-MM-DD HH:mm");
  }

  renderUserName(user) {
    return user.user_name;
  }

  reload(id) {
    if (!confirm("确实要重新执行？")) {
      return;
    }

    this.$ds
      .resolve("RELOAD", {
        params: {
          build_id: id,
        },
      })
      .then((res) => {
        const { code, message } = res.data.status;

        if (code == 0) {
          this.$utils.message.error(message);
        } else {
          const { pageIndex, pageSize } = this.pageParams;
          this.onPageChange(pageIndex, pageSize);
        }
      })
      .catch((err) => {
        this.$utils.message.error(err.message);
      });
  }

  handleResult(e) {
    // e.persist();
    e.preventDefault();
    e.stopPropagation();
    let href;
    let tagName;
    let target = e.target;

    do {
      tagName = target.tagName.toUpperCase();
      href = target.getAttribute("href");
      target = target.parentNode;
    } while (!href && tagName !== "TD");

    if (!href) {
      return;
    }

    this.$ds
      .resolve("BUILD_RESULT", {
        params: {
          build_id: href,
        },
      })
      .then((res) => {
        this.setState({
          resultVisible: true,
        });
      })
      .catch((err) => {
        this.$utils.message.error(`打包结果获取失败: ${err.message}`);
      });
  }

  handleDetail() {
    // 跳转详情页面 TODO
  }

  onResultCancel() {
    this.setState({
      resultVisible: false,
    });
  }

  formatResult(item) {
    if (!item) {
      return "暂无结果";
    }

    const { channel, plat, version, status } = item;
    return [channel, plat, version, status].join("-");
  }

  handleDownload() {
    const { results } = this.state;

    if (!results || results.length < 1) {
      return;
    }

    let link = document.createElement("a");
    link.style.display = "none";
    document.body.appendChild(link);
    results.forEach((r) => {
      link.href = r.download_link;
      link.click();
    });
    document.body.removeChild(link);
    link = null;
  }

  onFinish(f) {
    const params = Object.keys(f).reduce((pre, key) => {
      const value = f[key];

      if (value === undefined) {
        return pre;
      }

      return { ...pre, [key]: value };
    }, {});
    this.searchParams = params;
    this.fetchPkgs();
  }

  componentDidMount() {
    this.$ds.resolve("PROJECTS");

    if (this.userTimeout) {
      clearTimeout(this.userTimeout);
      this.userTimeout = null;
    }

    if (this.projectTimeout) {
      clearTimeout(this.projectTimeout);
      this.projectTimeout = null;
    }
  }

  render() {
    const __$$context = this;
    return (
      <div
        ref={this._refsManager.linkRef("outterView")}
        style={{ height: "100%" }}
      >
        <Modal
          title="查看结果"
          visible={this.state.resultVisible}
          footer={
            <Button
              type="primary"
              __events={{
                eventDataList: [
                  {
                    type: "componentEvent",
                    name: "onClick",
                    relatedEventName: "onResultCancel",
                  },
                ],
                eventList: [{ name: "onClick", disabled: true }],
              }}
              onClick={function () {
                this.onResultCancel.apply(
                  this,
                  Array.prototype.slice.call(arguments).concat([])
                );
              }.bind(this)}
            >
              确定
            </Button>
          }
          __events={{
            eventDataList: [
              {
                type: "componentEvent",
                name: "onCancel",
                relatedEventName: "onResultCancel",
              },
            ],
            eventList: [
              { name: "onCancel", disabled: true },
              { name: "onOk", disabled: false },
            ],
          }}
          onCancel={function () {
            this.onResultCancel.apply(
              this,
              Array.prototype.slice.call(arguments).concat([])
            );
          }.bind(this)}
          width="720px"
          centered={true}
          closable={true}
          keyboard={true}
          mask={true}
          maskClosable={true}
        >
          <AliAutoDivDefault style={{ width: "100%" }}>
            {!!(this.state.results && this.state.results.length > 0) && (
              <AliAutoDivDefault
                style={{
                  width: "100%",
                  textAlign: "left",
                  marginBottom: "16px",
                }}
              >
                <Button
                  type="primary"
                  size="small"
                  __events={{
                    eventDataList: [
                      {
                        type: "componentEvent",
                        name: "onClick",
                        relatedEventName: "handleDownload",
                      },
                    ],
                    eventList: [{ name: "onClick", disabled: true }],
                  }}
                  onClick={function () {
                    this.handleDownload.apply(
                      this,
                      Array.prototype.slice.call(arguments).concat([])
                    );
                  }.bind(this)}
                >
                  下载全部
                </Button>
              </AliAutoDivDefault>
            )}
            {this.state.results.map((item, index) =>
              ((__$$context) => (
                <AliAutoDivDefault style={{ width: "100%", marginTop: "10px" }}>
                  <Typography.Text>{this.formatResult(item)}</Typography.Text>
                  {!!item.download_link && (
                    <Typography.Link href={item.download_link} target="_blank">
                      {" "}
                      - 点击下载
                    </Typography.Link>
                  )}
                  {!!item.release_notes && (
                    <Typography.Link href={item.release_notes} target="_blank">
                      {" "}
                      - 跳转发布节点
                    </Typography.Link>
                  )}
                </AliAutoDivDefault>
              ))(__$$createChildContext(__$$context, { item, index }))
            )}
          </AliAutoDivDefault>
        </Modal>
        <NextPage
          columns={12}
          headerDivider={true}
          placeholderStyle={{ gridRowEnd: "span 1", gridColumnEnd: "span 12" }}
          placeholder="页面主体内容：拖拽Block布局组件到这里"
          header={null}
          headerProps={{ background: "surface", style: { padding: "" } }}
          footer={null}
          minHeight="100vh"
          contentProps={{ noPadding: false, background: "transparent" }}
        >
          <NextBlock childTotalColumns={12}>
            <NextBlockCell isAutoContainer={true} colSpan={12} rowSpan={1}>
              <NextP
                wrap={false}
                type="body2"
                verAlign="middle"
                textSpacing={true}
                align="left"
                flex={true}
              >
                <AliAutoDivDefault style={{ width: "100%", display: "flex" }}>
                  <AliAutoDivDefault style={{ flex: "1" }}>
                    <Form
                      labelCol={{ span: 10 }}
                      wrapperCol={{ span: 14 }}
                      onFinish={function () {
                        this.onFinish.apply(
                          this,
                          Array.prototype.slice.call(arguments).concat([])
                        );
                      }.bind(this)}
                      name="basic"
                      layout="inline"
                      __events={{
                        eventDataList: [
                          {
                            type: "componentEvent",
                            name: "onFinish",
                            relatedEventName: "onFinish",
                          },
                        ],
                        eventList: [
                          { name: "onFinish", disabled: true },
                          { name: "onFinishFailed", disabled: false },
                          { name: "onFieldsChange", disabled: false },
                          { name: "onValuesChange", disabled: false },
                        ],
                      }}
                      colon={true}
                      labelAlign="right"
                      preserve={true}
                      scrollToFirstError={true}
                      size="middle"
                      values={this.state.searchValues}
                    >
                      <Form.Item
                        label="项目名称/渠道号"
                        name="channel_id"
                        labelAlign="right"
                        colon={true}
                      >
                        <Select
                          style={{ width: "320px" }}
                          options={this.state.projects}
                          showArrow={false}
                          tokenSeparators={[]}
                          showSearch={true}
                          defaultActiveFirstOption={true}
                          size="middle"
                          bordered={true}
                          filterOption={true}
                          optionFilterProp="label"
                          allowClear={true}
                          placeholder="请输入项目名称/渠道号"
                          __events={{
                            eventDataList: [
                              {
                                type: "componentEvent",
                                name: "onChange",
                                relatedEventName: "handleProjectChange",
                              },
                              {
                                type: "componentEvent",
                                name: "onSearch",
                                relatedEventName: "handleProjectSearch",
                              },
                            ],
                            eventList: [
                              { name: "onBlur", disabled: false },
                              { name: "onChange", disabled: true },
                              { name: "onDeselect", disabled: false },
                              { name: "onFocus", disabled: false },
                              { name: "onInputKeyDown", disabled: false },
                              { name: "onMouseEnter", disabled: false },
                              { name: "onMouseLeave", disabled: false },
                              { name: "onPopupScroll", disabled: false },
                              { name: "onSearch", disabled: true },
                              { name: "onSelect", disabled: false },
                              {
                                name: "onDropdownVisibleChange",
                                disabled: false,
                              },
                            ],
                          }}
                          onChange={function () {
                            this.handleProjectChange.apply(
                              this,
                              Array.prototype.slice.call(arguments).concat([])
                            );
                          }.bind(this)}
                          onSearch={function () {
                            this.handleProjectSearch.apply(
                              this,
                              Array.prototype.slice.call(arguments).concat([])
                            );
                          }.bind(this)}
                        />
                      </Form.Item>
                      <Form.Item label="版本号" name="buildId">
                        <Input
                          placeholder="请输入版本号"
                          style={{ width: "180px" }}
                          size="middle"
                          bordered={true}
                        />
                      </Form.Item>
                      <Form.Item label="构建人" name="user_id">
                        <Select
                          style={{ width: "210px" }}
                          options={this.state.userOptions}
                          showSearch={true}
                          defaultActiveFirstOption={false}
                          size="middle"
                          bordered={true}
                          filterOption={true}
                          optionFilterProp="label"
                          notFoundContent={this.userNotFoundContent}
                          showArrow={false}
                          placeholder="请输入构建人"
                          __events={{
                            eventDataList: [
                              {
                                type: "componentEvent",
                                name: "onChange",
                                relatedEventName: "handleUserChange",
                              },
                              {
                                type: "componentEvent",
                                name: "onSearch",
                                relatedEventName: "handleUserSearch",
                              },
                            ],
                            eventList: [
                              { name: "onBlur", disabled: false },
                              { name: "onChange", disabled: true },
                              { name: "onDeselect", disabled: false },
                              { name: "onFocus", disabled: false },
                              { name: "onInputKeyDown", disabled: false },
                              { name: "onMouseEnter", disabled: false },
                              { name: "onMouseLeave", disabled: false },
                              { name: "onPopupScroll", disabled: false },
                              { name: "onSearch", disabled: true },
                              { name: "onSelect", disabled: false },
                              {
                                name: "onDropdownVisibleChange",
                                disabled: false,
                              },
                            ],
                          }}
                          onChange={function () {
                            this.handleUserChange.apply(
                              this,
                              Array.prototype.slice.call(arguments).concat([])
                            );
                          }.bind(this)}
                          onSearch={function () {
                            this.handleUserSearch.apply(
                              this,
                              Array.prototype.slice.call(arguments).concat([])
                            );
                          }.bind(this)}
                          allowClear={true}
                        />
                      </Form.Item>
                      <Form.Item
                        label="ID"
                        name="id"
                        labelAlign="right"
                        colon={true}
                      >
                        <Input
                          placeholder="请输入ID"
                          style={{ width: "180px" }}
                          bordered={true}
                          size="middle"
                        />
                      </Form.Item>
                      <Form.Item
                        wrapperCol={{ offset: 6 }}
                        labelAlign="right"
                        colon={true}
                        style={{ flex: "1", textAlign: "right" }}
                      >
                        <Button
                          type="primary"
                          htmlType="submit"
                          shape="default"
                          size="middle"
                        >
                          查询
                        </Button>
                      </Form.Item>
                    </Form>
                  </AliAutoDivDefault>
                  <AliAutoDivDefault style={{}}>
                    <Button
                      type="link"
                      htmlType="button"
                      shape="default"
                      size="middle"
                    >
                      新增打包
                    </Button>
                  </AliAutoDivDefault>
                </AliAutoDivDefault>
              </NextP>
            </NextBlockCell>
          </NextBlock>
          <NextBlock
            childTotalColumns={12}
            mode="inset"
            layoutmode="O"
            autolayout="(12|1)"
          >
            <NextBlockCell isAutoContainer={true} colSpan={12} rowSpan={1}>
              <NextP
                wrap={false}
                type="body2"
                verAlign="middle"
                textSpacing={true}
                align="left"
                flex={true}
              >
                {!!(
                  !this.state.isSearch ||
                  (this.state.isSearch && this.state.pkgs.length > 0)
                ) && (
                  <AliAutoSearchTableDefault
                    rowKey="key"
                    dataSource={this.state.pkgs}
                    columns={[
                      { title: "ID", dataIndex: "id", key: "name", width: 80 },
                      {
                        title: "渠道号",
                        dataIndex: "channels",
                        key: "age",
                        width: 142,
                        render: (text, record, index) =>
                          ((__$$context) =>
                            text
                              .split(",")
                              .map((item, index) =>
                                ((__$$context) => (
                                  <Typography.Text style={{ display: "block" }}>
                                    {item}
                                  </Typography.Text>
                                ))(
                                  __$$createChildContext(__$$context, {
                                    item,
                                    index,
                                  })
                                )
                              ))(
                            __$$createChildContext(__$$context, {
                              text,
                              record,
                              index,
                            })
                          ),
                      },
                      {
                        title: "版本号",
                        dataIndex: "dic_version",
                        key: "address",
                        render: (text, record, index) =>
                          ((__$$context) => (
                            <Tooltip
                              title={(text || []).map((item, index) =>
                                ((__$$context) => (
                                  <Typography.Text
                                    style={{
                                      display: "block",
                                      color: "#FFFFFF",
                                    }}
                                  >
                                    {item.channelId + " / " + item.version}
                                  </Typography.Text>
                                ))(
                                  __$$createChildContext(__$$context, {
                                    item,
                                    index,
                                  })
                                )
                              )}
                            >
                              <Typography.Text>
                                {text[0].version}
                              </Typography.Text>
                            </Tooltip>
                          ))(
                            __$$createChildContext(__$$context, {
                              text,
                              record,
                              index,
                            })
                          ),
                        width: 120,
                      },
                      { title: "构建Job", dataIndex: "job_name", width: 180 },
                      {
                        title: "构建类型",
                        dataIndex: "packaging_type",
                        width: 94,
                      },
                      {
                        title: "构建状态",
                        dataIndex: "status",
                        render: (text, record, index) =>
                          ((__$$context) => [
                            <Typography.Text>
                              {this.statusDesc[text]}
                            </Typography.Text>,
                            !!(text === 2) && (
                              <Icon
                                type="SyncOutlined"
                                size={16}
                                spin={true}
                                style={{ marginLeft: "10px" }}
                              />
                            ),
                          ])(
                            __$$createChildContext(__$$context, {
                              text,
                              record,
                              index,
                            })
                          ),
                        width: 100,
                      },
                      {
                        title: "构建时间",
                        dataIndex: "start_time",
                        render: function () {
                          return this.renderTime.apply(
                            this,
                            Array.prototype.slice.call(arguments).concat([])
                          );
                        }.bind(this),
                        width: 148,
                      },
                      {
                        title: "构建人",
                        dataIndex: "user",
                        render: function () {
                          return this.renderUserName.apply(
                            this,
                            Array.prototype.slice.call(arguments).concat([])
                          );
                        }.bind(this),
                        width: 80,
                      },
                      {
                        title: "Jenkins 链接",
                        dataIndex: "jenkins_link",
                        render: (text, record, index) =>
                          ((__$$context) => [
                            !!text && (
                              <Typography.Link href={text} target="_blank">
                                查看
                              </Typography.Link>
                            ),
                            !!!text && <Typography.Text>暂无</Typography.Text>,
                          ])(
                            __$$createChildContext(__$$context, {
                              text,
                              record,
                              index,
                            })
                          ),
                        width: 120,
                      },
                      {
                        title: "测试平台链接",
                        dataIndex: "is_run_testing",
                        width: 120,
                        render: (text, record, index) =>
                          ((__$$context) => [
                            !!text && (
                              <Typography.Link
                                href="http://rivermap.alibaba.net/dashboard/testExecute"
                                target="_blank"
                              >
                                查看
                              </Typography.Link>
                            ),
                            !!!text && <Typography.Text>暂无</Typography.Text>,
                          ])(
                            __$$createChildContext(__$$context, {
                              text,
                              record,
                              index,
                            })
                          ),
                      },
                      { title: "触发源", dataIndex: "source", width: 120 },
                      {
                        title: "详情",
                        dataIndex: "id",
                        render: (text, record, index) =>
                          ((__$$context) => (
                            <Button
                              type="link"
                              size="small"
                              style={{ padding: "0px" }}
                              __events={{
                                eventDataList: [
                                  {
                                    type: "componentEvent",
                                    name: "onClick",
                                    relatedEventName: "handleDetail",
                                  },
                                ],
                                eventList: [
                                  { name: "onClick", disabled: true },
                                ],
                              }}
                              onClick={function () {
                                this.handleDetail.apply(
                                  this,
                                  Array.prototype.slice
                                    .call(arguments)
                                    .concat([])
                                );
                              }.bind(this)}
                            >
                              查看
                            </Button>
                          ))(
                            __$$createChildContext(__$$context, {
                              text,
                              record,
                              index,
                            })
                          ),
                        width: 80,
                        fixed: "right",
                      },
                      {
                        title: "结果",
                        dataIndex: "id",
                        render: (text, record, index) =>
                          ((__$$context) => (
                            <Button
                              type="link"
                              size="small"
                              style={{ padding: "0px" }}
                              __events={{
                                eventDataList: [
                                  {
                                    type: "componentEvent",
                                    name: "onClick",
                                    relatedEventName: "handleResult",
                                    paramStr: "this.text",
                                  },
                                ],
                                eventList: [
                                  { name: "onClick", disabled: true },
                                ],
                              }}
                              onClick={function () {
                                this.handleResult.apply(
                                  this,
                                  Array.prototype.slice
                                    .call(arguments)
                                    .concat([])
                                );
                              }.bind(this)}
                              ghost={false}
                              href={text}
                            >
                              查看
                            </Button>
                          ))(
                            __$$createChildContext(__$$context, {
                              text,
                              record,
                              index,
                            })
                          ),
                        width: 80,
                        fixed: "right",
                      },
                      {
                        title: "重新执行",
                        dataIndex: "id",
                        width: 92,
                        render: (text, record, index) =>
                          ((__$$context) => (
                            <Button
                              type="text"
                              children=""
                              icon={
                                <Icon
                                  type="ReloadOutlined"
                                  size={14}
                                  color="#0593d3"
                                  style={{
                                    padding: "3px",
                                    border: "1px solid #0593d3",
                                    borderRadius: "14px",
                                    cursor: "pointer",
                                    height: "22px",
                                  }}
                                  spin={false}
                                />
                              }
                              shape="circle"
                              __events={{
                                eventDataList: [
                                  {
                                    type: "componentEvent",
                                    name: "onClick",
                                    relatedEventName: "reload",
                                  },
                                ],
                                eventList: [
                                  { name: "onClick", disabled: true },
                                ],
                              }}
                              onClick={function () {
                                this.reload.apply(
                                  this,
                                  Array.prototype.slice
                                    .call(arguments)
                                    .concat([])
                                );
                              }.bind(this)}
                            />
                          ))(
                            __$$createChildContext(__$$context, {
                              text,
                              record,
                              index,
                            })
                          ),
                        fixed: "right",
                      },
                    ]}
                    actions={[]}
                    pagination={{
                      total: this.state.total,
                      defaultPageSize: 10,
                      onPageChange: function () {
                        return this.onPageChange.apply(
                          this,
                          Array.prototype.slice.call(arguments).concat([])
                        );
                      }.bind(this),
                      defaultPageIndex: 1,
                    }}
                    scrollX={1200}
                    isPagination={true}
                  />
                )}
              </NextP>
            </NextBlockCell>
          </NextBlock>
          <NextBlock
            childTotalColumns={12}
            mode="inset"
            layoutmode="O"
            autolayout="(12|1)"
          >
            <NextBlockCell isAutoContainer={true} colSpan={12} rowSpan={1}>
              <NextP
                wrap={false}
                type="body2"
                verAlign="middle"
                textSpacing={true}
                align="left"
                flex={true}
              >
                {!!(this.state.pkgs.length < 1 && this.state.isSearch) && (
                  <Empty description="暂无数据" />
                )}
              </NextP>
            </NextBlockCell>
          </NextBlock>
        </NextPage>
      </div>
    );
  }
}

export default Test$$Page;

function __$$createChildContext(oldContext, ext) {
  return Object.assign({}, oldContext, ext);
}
