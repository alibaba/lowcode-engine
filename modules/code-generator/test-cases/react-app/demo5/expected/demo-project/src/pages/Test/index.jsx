import React from "react";

import {
  Page as NextPage,
  Block as NextBlock,
  P as NextP,
} from "@alife/container/lib/index.js";

import {
  Card,
  Space,
  Typography,
  Select,
  Button,
  Modal,
  Form,
  InputNumber,
  Input,
} from "@alilc/antd-lowcode/dist/antd-lowcode.esm.js";

import { AliAutoSearchTable } from "@alife/mc-assets-1935/build/lowcode/index.js";

import utils, { RefsManager } from "../../utils";

import { i18n as _$$i18n } from "../../i18n";

import "./index.css";

const NextBlockCell = NextBlock.Cell;

const AliAutoSearchTableDefault = AliAutoSearchTable.default;

class Test$$Page extends React.Component {
  constructor(props, context) {
    super(props);

    this.utils = utils;

    this._refsManager = new RefsManager();

    this.state = {
      name: "nongzhou",
      gateways: [],
      selectedGateway: null,
      records: [],
      modalVisible: false,
    };
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

  componentWillUnmount() {
    console.log("will umount");
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log(this.state);
  }

  onChange(optionItem, data) {
    this.setState({
      selectedGateway: optionItem.value,
    });
    fetch(
      "https://oneapi.alibaba-inc.com/mock/knk1s2w7/ws/tconf/gate/publish/list/" +
        optionItem.value
    )
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        this.setState({
          records: resData.data,
        });
      });
  }

  getActions(item) {
    const actions = [];

    if (item.show_detail) {
      actions.push({
        text: "详情",
        needConfirm: false,
        handler: () => {
          console.log("详情");
        },
      });
    }

    if (item.show_roll_back) {
      actions.push({
        text: "回滚到此版本",
        needConfirm: false,
        handler: () => {
          console.log("回滚到此版本");
        },
      });
    }

    if (item.show_continue) {
      actions.push({
        text: "继续",
        needConfirm: false,
        handler: () => {
          console.log("继续");
        },
      });
    }

    return actions;
  }

  onCreateOrder() {
    if (!this.state.selectedGateway) {
      alert("请先选择网关");
      return;
    }

    this.setState({
      modalVisible: true,
    });
  }

  onCancelModal() {
    this.setState({
      modalVisible: false,
    });
  }

  onConfirmCreateOrder() {
    fetch(
      `https://oneapi.alibaba-inc.com/mock/knk1s2w7/ws/tconf/gate/publish/app/${this.state.selectedGateway}`,
      {
        method: "POST",
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((resJson) => {
        console.log("create result: ", resJson);

        if (resJson.result !== true) {
          throw new Error(resJson.message + resJson.errdetail);
        }
      })
      .then(() => {
        console.log("创建发布单成功");
        this.onCancelModal();
      })
      .catch((err) => {
        console.error(err);
        alert("创建失败");
      });
  }

  componentDidMount() {
    this.setState({
      gateways: [
        {
          domain: "uniproxy.amap.com:7001",
          gate_code: "auto-edd-uniproxy",
          gate_status_desc: "解锁",
          label: "auto-edd-uniproxy",
          value: "auto-edd-uniproxy",
        },
      ],
    });
    console.log("-----------", this, this.page);
    setTimeout(() => {
      console.log(this.state.gateways);
    }, 1000);
  }

  render() {
    const __$$context = this;
    const { state } = this;
    return (
      <div
        ref={this._refsManager.linkRef("outterView")}
        style={{ height: "100%" }}
      >
        <NextPage
          columns={12}
          headerDivider={true}
          placeholderStyle={{ gridRowEnd: "span 1", gridColumnEnd: "span 12" }}
          placeholder="页面主体内容：拖拽Block布局组件到这里"
          header={null}
          headerProps={{ background: "surface" }}
          footer={null}
          minHeight="100vh"
          style={{ cursor: "pointer" }}
        >
          <NextBlock
            prefix="next-"
            placeholderStyle={{ height: "100%" }}
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
              placeholderStyle={{ height: "100%" }}
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
                <Card title="">
                  <Space size={0} align="center" direction="horizontal">
                    <Typography.Text>所在网关：</Typography.Text>
                    <Select
                      style={{
                        marginTop: "16px",
                        marginRight: "16px",
                        marginBottom: "16px",
                        marginLeft: "16px",
                        width: "400px",
                        display: "inline-block",
                      }}
                      options={this.state.gateways}
                      mode="single"
                      defaultValue={["auto-edd-uniproxy"]}
                      labelInValue={true}
                      showSearch={true}
                      allowClear={false}
                      placeholder="请选取网关"
                      showArrow={true}
                      loading={false}
                      tokenSeparators={[]}
                      __events={{
                        eventDataList: [
                          {
                            type: "componentEvent",
                            name: "onChange",
                            relatedEventName: "onChange",
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
                          { name: "onSearch", disabled: false },
                          { name: "onSelect", disabled: false },
                          { name: "onDropdownVisibleChange", disabled: false },
                        ],
                      }}
                      onChange={function () {
                        this.onChange.apply(
                          this,
                          Array.prototype.slice.call(arguments).concat([])
                        );
                      }.bind(this)}
                    />
                  </Space>
                  <Button
                    type="primary"
                    style={{
                      display: "block",
                      marginTop: "20px",
                      marginBottom: "20px",
                    }}
                    __events={{
                      eventDataList: [
                        {
                          type: "componentEvent",
                          name: "onClick",
                          relatedEventName: "onCreateOrder",
                        },
                      ],
                      eventList: [{ name: "onClick", disabled: true }],
                    }}
                    onClick={function () {
                      this.onCreateOrder.apply(
                        this,
                        Array.prototype.slice.call(arguments).concat([])
                      );
                    }.bind(this)}
                  >
                    创建发布单
                  </Button>
                  <Modal
                    title="创建发布单"
                    visible={this.state.modalVisible}
                    footer=""
                    __events={{
                      eventDataList: [
                        {
                          type: "componentEvent",
                          name: "onCancel",
                          relatedEventName: "onCancelModal",
                        },
                      ],
                      eventList: [
                        { name: "onCancel", disabled: true },
                        { name: "onOk", disabled: false },
                      ],
                    }}
                    onCancel={function () {
                      this.onCancelModal.apply(
                        this,
                        Array.prototype.slice.call(arguments).concat([])
                      );
                    }.bind(this)}
                    zIndex={2000}
                  >
                    <Form
                      labelCol={{ span: 6 }}
                      wrapperCol={{ span: 14 }}
                      onFinish={function () {
                        this.onConfirmCreateOrder.apply(
                          this,
                          Array.prototype.slice.call(arguments).concat([])
                        );
                      }.bind(this)}
                      name="basic"
                      __events={{
                        eventDataList: [
                          {
                            type: "componentEvent",
                            name: "onFinish",
                            relatedEventName: "onConfirmCreateOrder",
                          },
                        ],
                        eventList: [
                          { name: "onFinish", disabled: true },
                          { name: "onFinishFailed", disabled: false },
                          { name: "onFieldsChange", disabled: false },
                          { name: "onValuesChange", disabled: false },
                        ],
                      }}
                    >
                      <Form.Item label="发布批次">
                        <InputNumber value={3} min={1} />
                      </Form.Item>
                      <Form.Item label="批次间隔时间">
                        <InputNumber value={3} />
                      </Form.Item>
                      <Form.Item label="备注 ">
                        <Input.TextArea rows={3} placeholder="请输入" />
                      </Form.Item>
                      <Form.Item
                        wrapperCol={{ offset: 6 }}
                        style={{
                          flexDirection: "row",
                          alignItems: "flex-end",
                          justifyContent: "center",
                          display: "flex",
                        }}
                        labelAlign="right"
                      >
                        <Button type="primary" htmlType="submit">
                          提交
                        </Button>
                        <Button
                          style={{ marginLeft: 20 }}
                          __events={{
                            eventDataList: [
                              {
                                type: "componentEvent",
                                name: "onClick",
                                relatedEventName: "onCancelModal",
                              },
                            ],
                            eventList: [{ name: "onClick", disabled: true }],
                          }}
                          onClick={function () {
                            this.onCancelModal.apply(
                              this,
                              Array.prototype.slice.call(arguments).concat([])
                            );
                          }.bind(this)}
                        >
                          取消
                        </Button>
                      </Form.Item>
                    </Form>
                  </Modal>
                  <AliAutoSearchTableDefault
                    rowKey="key"
                    dataSource={this.state.records}
                    columns={[
                      {
                        title: "发布名称",
                        dataIndex: "order_name",
                        key: "name",
                      },
                      {
                        title: "类型",
                        dataIndex: "order_type_desc",
                        key: "age",
                      },
                      {
                        title: "发布状态",
                        dataIndex: "order_status_desc",
                        key: "address",
                      },
                      { title: "发布人", dataIndex: "creator_name" },
                      { title: "当前批次/总批次", dataIndex: "cur_batch_no" },
                      {
                        title: "发布机器/总机器",
                        dataIndex: "pubblish_ip_finish_num",
                      },
                      { title: "发布时间", dataIndex: "publish_id" },
                    ]}
                    actions={this.actions || []}
                    getActions={function () {
                      return this.getActions.apply(
                        this,
                        Array.prototype.slice.call(arguments).concat([])
                      );
                    }.bind(this)}
                  />
                </Card>
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
  const childContext = {
    ...oldContext,
    ...ext,
  };
  childContext.__proto__ = oldContext;
  return childContext;
}
