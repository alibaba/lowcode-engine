// 注意: 出码引擎注入的临时变量默认都以 "__$$" 开头，禁止在搭建的代码中直接访问。
// 例外：react 框架的导出名和各种组件名除外。
import React from 'react';

import {
  Modal,
  Button,
  Typography,
  Form,
  Select,
  Input,
  ConfigProvider,
  Tooltip,
  Empty,
} from '@alilc/antd-lowcode-materials/dist/antd-lowcode.esm.js';

import {
  AliAutoDiv,
  AliAutoSearchTable,
} from '@alife/mc-assets-1935/build/lowcode/index.js';

import {
  Page as NextPage,
  Block as NextBlock,
  P as NextP,
} from '@alife/container/lib/index.js';

import utils, { RefsManager } from '../../utils';

import * as __$$i18n from '../../i18n';

import __$$constants from '../../constants';

import './index.css';

const AliAutoDivDefault = AliAutoDiv.default;

const AliAutoSearchTableDefault = AliAutoSearchTable.default;

const NextBlockCell = NextBlock.Cell;

class Test$$Page extends React.Component {
  _context = this;

  get constants() {
    return __$$constants || {};
  }

  constructor(props, context) {
    super(props);

    this.utils = utils;

    this._refsManager = new RefsManager();

    __$$i18n._inject2(this);

    this.state = {
      pkgs: [],
      total: 0,
      isSearch: false,
      projects: [],
      results: [],
      resultVisible: false,
    };

    this.__jp__init();
    this.statusDesc = {
      0: '失败',
      1: '成功',
      2: '构建中',
      3: '构建超时',
    };
    this.pageParams = {};
  }

  $ = (refName) => {
    return this._refsManager.get(refName);
  };

  $$ = (refName) => {
    return this._refsManager.getAll(refName);
  };

  componentDidUpdate(prevProps, prevState, snapshot) {}

  componentWillUnmount() {}

  __jp__init() {
    /*...*/
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
    /*...*/
  }

  __jp__initEnv() {
    /*...*/
  }

  __jp__initConfig() {
    /*...*/
  }

  __jp__initUtils() {
    this.$utils = {
      message: window.jianpin.utils.message,
      axios: window.jianpin.utils.axios,
      moment: window.jianpin.utils.moment,
    };
  }

  fetchPkgs() {
    /*...*/
  }

  onPageChange(pageIndex, pageSize) {
    this.pageParams = {
      pageIndex,
      pageSize,
    };
    this.fetchPkgs();
  }

  renderTime(time) {
    return this.$utils.moment(time).format('YYYY-MM-DD HH:mm');
  }

  renderUserName(user) {
    return user.user_name;
  }

  reload() {
    /*...*/
  }

  handleResult() {
    /*...*/
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
      return '暂无结果';
    }
    const { channel, plat, version, status } = item;
    return [channel, plat, version, status].join('-');
  }

  handleDownload() {
    /*...*/
  }

  onFinish() {
    /*...*/
  }

  componentDidMount() {
    this.$ds.resolve('PROJECTS', {
      params: {
        size: 5000,
      },
    });
    // if (this.state.init === false) {
    //   this.setState({
    //     init: true,
    //   });
    // }
  }

  render() {
    const __$$context = this._context || this;
    const { state } = __$$context;
    return (
      <div
        ref={this._refsManager.linkRef('outterView')}
        style={{ height: '100%' }}
      >
        <Modal
          title="查看结果"
          visible={__$$eval(() => this.state.resultVisible)}
          footer={
            <Button
              type="primary"
              __events={{
                eventDataList: [
                  {
                    type: 'componentEvent',
                    name: 'onClick',
                    relatedEventName: 'onResultCancel',
                  },
                ],
                eventList: [{ name: 'onClick', disabled: true }],
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
                type: 'componentEvent',
                name: 'onCancel',
                relatedEventName: 'onResultCancel',
              },
            ],
            eventList: [
              { name: 'onCancel', disabled: true },
              { name: 'onOk', disabled: false },
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
        >
          {__$$evalArray(() => this.state.results).map((item, index) =>
            ((__$$context) => (
              <AliAutoDivDefault style={{ width: '100%' }}>
                {!!__$$eval(
                  () =>
                    __$$context.state.results &&
                    __$$context.state.results.length > 0
                ) && (
                  <AliAutoDivDefault
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      marginBottom: '10px',
                    }}
                  >
                    <Button
                      type="primary"
                      size="small"
                      __events={{
                        eventDataList: [
                          {
                            type: 'componentEvent',
                            name: 'onClick',
                            relatedEventName: 'handleDownload',
                          },
                        ],
                        eventList: [{ name: 'onClick', disabled: true }],
                      }}
                      onClick={function () {
                        this.handleDownload.apply(
                          this,
                          Array.prototype.slice.call(arguments).concat([])
                        );
                      }.bind(__$$context)}
                    >
                      下载全部
                    </Button>
                  </AliAutoDivDefault>
                )}
                <Typography.Text>
                  {__$$eval(() => __$$context.formatResult(item))}
                </Typography.Text>
                {!!__$$eval(() => item.download_link) && (
                  <Typography.Link
                    href={__$$eval(() => item.download_link)}
                    target="_blank"
                  >
                    {' '}
                    - 点击下载
                  </Typography.Link>
                )}
                {!!__$$eval(() => item.release_notes) && (
                  <Typography.Link
                    href={__$$eval(() => item.release_notes)}
                    target="_blank"
                  >
                    {' '}
                    - 跳转发布节点
                  </Typography.Link>
                )}
              </AliAutoDivDefault>
            ))(__$$createChildContext(__$$context, { item, index }))
          )}
        </Modal>
        <NextPage
          columns={12}
          headerDivider={true}
          placeholderStyle={{ gridRowEnd: 'span 1', gridColumnEnd: 'span 12' }}
          placeholder="页面主体内容：拖拽Block布局组件到这里"
          header={null}
          headerProps={{ background: 'surface' }}
          footer={null}
          minHeight="100vh"
        >
          <NextBlock
            prefix="next-"
            placeholderStyle={{ height: '100%' }}
            noPadding={false}
            noBorder={false}
            background="surface"
            layoutmode="O"
            colSpan={12}
            rowSpan={1}
            childTotalColumns={12}
          >
            <NextBlockCell
              title=""
              prefix="next-"
              placeholderStyle={{ height: '100%' }}
              layoutmode="O"
              childTotalColumns={12}
              isAutoContainer={true}
              colSpan={12}
              rowSpan={1}
            >
              <NextP
                wrap={false}
                type="body2"
                verAlign="middle"
                textSpacing={true}
                align="left"
                full={true}
                flex={true}
              >
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
                        type: 'componentEvent',
                        name: 'onFinish',
                        relatedEventName: 'onFinish',
                      },
                    ],
                    eventList: [
                      { name: 'onFinish', disabled: true },
                      { name: 'onFinishFailed', disabled: false },
                      { name: 'onFieldsChange', disabled: false },
                      { name: 'onValuesChange', disabled: false },
                    ],
                  }}
                >
                  <Form.Item label="项目名称/渠道号" name="channel_id">
                    <Select
                      style={{ width: '280px' }}
                      options={__$$eval(() => this.state.projects)}
                      showArrow={true}
                      tokenSeparators={[]}
                      showSearch={true}
                    />
                  </Form.Item>
                  <Form.Item label="版本号" name="buildId">
                    <Input
                      placeholder="请输入"
                      style={{ width: '280px' }}
                      size="middle"
                    />
                  </Form.Item>
                  <Form.Item label="构建人" name="user_id">
                    <Select
                      style={{ width: 200 }}
                      options={[
                        { label: 'A', value: 'A' },
                        { label: 'B', value: 'B' },
                        { label: 'C', value: 'C' },
                      ]}
                      showSearch={true}
                    />
                  </Form.Item>
                  <Form.Item label="ID" name="id">
                    <Input placeholder="请输入" style={{ width: '160px' }} />
                  </Form.Item>
                  <Form.Item wrapperCol={{ offset: 6 }}>
                    <Button type="primary" htmlType="submit">
                      查询
                    </Button>
                  </Form.Item>
                </Form>
              </NextP>
            </NextBlockCell>
          </NextBlock>
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
                <ConfigProvider locale="zh-CN">
                  {!!__$$eval(
                    () =>
                      !this.state.isSearch ||
                      (this.state.isSearch && this.state.pkgs.length > 0)
                  ) && (
                    <AliAutoSearchTableDefault
                      rowKey="key"
                      dataSource={__$$eval(() => this.state.pkgs)}
                      columns={[
                        {
                          title: 'ID',
                          dataIndex: 'id',
                          key: 'name',
                          width: 80,
                        },
                        {
                          title: '渠道号',
                          dataIndex: 'channels',
                          key: 'age',
                          width: 142,
                          render: (text, record, index) =>
                            ((__$$context) =>
                              __$$evalArray(() => text.split(',')).map(
                                (item, index) =>
                                  ((__$$context) => (
                                    <Typography.Text
                                      style={{ display: 'block' }}
                                    >
                                      {__$$eval(() => item)}
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
                          title: '版本号',
                          dataIndex: 'dic_version',
                          key: 'address',
                          render: (text, record, index) =>
                            ((__$$context) => (
                              <Tooltip
                                title={__$$evalArray(() => text || []).map(
                                  (item, index) =>
                                    ((__$$context) => (
                                      <Typography.Text
                                        style={{
                                          display: 'block',
                                          color: '#FFFFFF',
                                        }}
                                      >
                                        {__$$eval(
                                          () =>
                                            item.channelId +
                                            ' / ' +
                                            item.version
                                        )}
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
                                  {__$$eval(() => text[0].version)}
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
                        { title: '构建Job', dataIndex: 'job_name', width: 180 },
                        {
                          title: '构建类型',
                          dataIndex: 'packaging_type',
                          width: 94,
                        },
                        {
                          title: '构建状态',
                          dataIndex: 'status',
                          render: (text, record, index) =>
                            ((__$$context) => [
                              <Typography.Text>
                                {__$$eval(() => __$$context.statusDesc[text])}
                              </Typography.Text>,
                              !!__$$eval(() => text === 2) && (
                                <Icon
                                  type="SyncOutlined"
                                  size={16}
                                  spin={true}
                                  style={{ marginLeft: '10px' }}
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
                          title: '构建时间',
                          dataIndex: 'start_time',
                          render: function () {
                            return this.renderTime.apply(
                              this,
                              Array.prototype.slice.call(arguments).concat([])
                            );
                          }.bind(this),
                          width: 148,
                        },
                        {
                          title: '构建人',
                          dataIndex: 'user',
                          render: function () {
                            return this.renderUserName.apply(
                              this,
                              Array.prototype.slice.call(arguments).concat([])
                            );
                          }.bind(this),
                          width: 80,
                        },
                        {
                          title: 'Jenkins 链接',
                          dataIndex: 'jenkins_link',
                          render: (text, record, index) =>
                            ((__$$context) => [
                              !!__$$eval(() => text) && (
                                <Typography.Link
                                  href={__$$eval(() => text)}
                                  target="_blank"
                                >
                                  查看
                                </Typography.Link>
                              ),
                              !!__$$eval(() => !text) && (
                                <Typography.Text>暂无</Typography.Text>
                              ),
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
                          title: '测试平台链接',
                          dataIndex: 'is_run_testing',
                          width: 120,
                          render: (text, record, index) =>
                            ((__$$context) => [
                              !!__$$eval(() => text) && (
                                <Typography.Link
                                  href="http://rivermap.alibaba.net/dashboard/testExecute"
                                  target="_blank"
                                >
                                  查看
                                </Typography.Link>
                              ),
                              !!__$$eval(() => !text) && (
                                <Typography.Text>暂无</Typography.Text>
                              ),
                            ])(
                              __$$createChildContext(__$$context, {
                                text,
                                record,
                                index,
                              })
                            ),
                        },
                        { title: '触发源', dataIndex: 'source', width: 120 },
                        {
                          title: '详情',
                          dataIndex: 'id',
                          render: (text, record, index) =>
                            ((__$$context) => (
                              <Button
                                type="link"
                                size="small"
                                style={{ padding: '0px' }}
                                __events={{
                                  eventDataList: [
                                    {
                                      type: 'componentEvent',
                                      name: 'onClick',
                                      relatedEventName: 'handleDetail',
                                    },
                                  ],
                                  eventList: [
                                    { name: 'onClick', disabled: true },
                                  ],
                                }}
                                onClick={function () {
                                  this.handleDetail.apply(
                                    this,
                                    Array.prototype.slice
                                      .call(arguments)
                                      .concat([])
                                  );
                                }.bind(__$$context)}
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
                          fixed: 'right',
                        },
                        {
                          title: '结果',
                          dataIndex: 'id',
                          render: (text, record, index) =>
                            ((__$$context) => (
                              <Button
                                type="link"
                                size="small"
                                style={{ padding: '0px' }}
                                __events={{
                                  eventDataList: [
                                    {
                                      type: 'componentEvent',
                                      name: 'onClick',
                                      relatedEventName: 'handleResult',
                                      paramStr: 'this.text',
                                    },
                                  ],
                                  eventList: [
                                    { name: 'onClick', disabled: true },
                                  ],
                                }}
                                onClick={function () {
                                  this.handleResult.apply(
                                    this,
                                    Array.prototype.slice
                                      .call(arguments)
                                      .concat([])
                                  );
                                }.bind(__$$context)}
                                ghost={false}
                                href={__$$eval(() => text)}
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
                          fixed: 'right',
                        },
                        {
                          title: '重新执行',
                          dataIndex: 'id',
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
                                      padding: '3px',
                                      border: '1px solid #0593d3',
                                      borderRadius: '14px',
                                      cursor: 'pointer',
                                      height: '22px',
                                    }}
                                    spin={false}
                                  />
                                }
                                shape="circle"
                                __events={{
                                  eventDataList: [
                                    {
                                      type: 'componentEvent',
                                      name: 'onClick',
                                      relatedEventName: 'reload',
                                    },
                                  ],
                                  eventList: [
                                    { name: 'onClick', disabled: true },
                                  ],
                                }}
                                onClick={function () {
                                  this.reload.apply(
                                    this,
                                    Array.prototype.slice
                                      .call(arguments)
                                      .concat([])
                                  );
                                }.bind(__$$context)}
                              />
                            ))(
                              __$$createChildContext(__$$context, {
                                text,
                                record,
                                index,
                              })
                            ),
                          fixed: 'right',
                        },
                      ]}
                      actions={[]}
                      pagination={{
                        total: __$$eval(() => this.state.total),
                        defaultPageSize: 8,
                        onPageChange: function () {
                          return this.onPageChange.apply(
                            this,
                            Array.prototype.slice.call(arguments).concat([])
                          );
                        }.bind(this),
                      }}
                      scrollX={1200}
                    />
                  )}
                </ConfigProvider>
              </NextP>
            </NextBlockCell>
          </NextBlock>
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
                {!!__$$eval(
                  () => this.state.pkgs.length < 1 && this.state.isSearch
                ) && <Empty description="暂无数据" />}
              </NextP>
            </NextBlockCell>
          </NextBlock>
        </NextPage>
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
