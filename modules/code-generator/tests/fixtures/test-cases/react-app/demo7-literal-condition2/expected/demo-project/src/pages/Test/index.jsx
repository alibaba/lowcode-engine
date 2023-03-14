// 注意: 出码引擎注入的临时变量默认都以 "__$$" 开头，禁止在搭建的代码中直接访问。
// 例外：react 框架的导出名和各种组件名除外。
import React from 'react';

import {
  Modal,
  Steps,
  Form,
  Input,
  Checkbox,
  Select,
  DatePicker,
  InputNumber,
  Button,
} from '@alilc/antd-lowcode/dist/antd-lowcode.esm.js';

import {
  Text as NextText,
  Page as NextPage,
  Block as NextBlock,
  P as NextP,
} from '@alife/container/lib/index.js';

import utils, { RefsManager } from '../../utils';

import * as __$$i18n from '../../i18n';

import __$$constants from '../../constants';

import './index.css';

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
      books: [],
      currentStep: 0,
      isModifyDialogVisible: false,
      isModifyStatus: false,
      secondCommitText: '完成并提交',
      thirdAuditText: '审核中',
      thirdButtonText: '修改',
      customerProjectInfo: {
        id: null,
        systemProjectName: null,
        projectVersionTypeArray: null,
        projectVersionType: null,
        versionLine: 2,
        expectedTime: null,
        expectedNum: null,
        projectModal: null,
        displayWidth: null,
        displayHeight: null,
        displayInch: null,
        displayDpi: null,
        mainSoc: null,
        cpuCoreNum: null,
        instructions: null,
        osVersion: null,
        status: null,
      },
      versionLinesArray: [
        { label: 'AmapAuto 485', value: 1 },
        { label: 'AmapAuto 505', value: 2 },
      ],
      projectModalsArray: [
        { label: '车机', value: 1 },
        { label: '车镜', value: 2 },
        { label: '记录仪', value: 3 },
        { label: '其他', value: 4 },
      ],
      osVersionsArray: [
        { label: '安卓5', value: 1 },
        { label: '安卓6', value: 2 },
        { label: '安卓7', value: 3 },
        { label: '安卓8', value: 4 },
        { label: '安卓9', value: 5 },
        { label: '安卓10', value: 6 },
      ],
      instructionsArray: [
        { label: 'ARM64-V8', value: 'ARM64-V8' },
        { label: 'ARM32-V7', value: 'ARM32-V7' },
        { label: 'X86', value: 'X86' },
        { label: 'X64', value: 'X64' },
      ],
    };
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
    /*...*/
  }

  __jp__initDataSource() {
    /*...*/
  }

  __jp__initEnv() {
    /*...*/
  }

  __jp__initUtils() {
    /*...*/
  }

  onFinishFirst() {
    /*...*/
  }

  onClickPreSecond() {
    /*...*/
  }

  onFinishSecond() {
    /*...*/
  }

  onClickModifyThird() {
    /*...*/
  }

  onOkModifyDialogThird() {
    //第三步 修改 对话框 确定

    this.setState({
      currentStep: 0,
      isModifyDialogVisible: false,
    });
  }

  onCancelModifyDialogThird() {
    //第三步 修改 对话框 取消

    this.setState({
      isModifyDialogVisible: false,
    });
  }

  onFinishFailed() {}

  onClickPreThird() {
    // 第三步 上一步
    this.setState({
      currentStep: 1,
    });
  }

  onClickFirstBack() {
    // 第一步 返回按钮
    this.$router.push('/myProjectList');
  }

  onClickSecondBack() {
    // 第二步 返回按钮
    this.$router.push('/myProjectList');
  }

  onClickThirdBack() {
    // 第三步 返回按钮
    this.$router.push('/myProjectList');
  }

  onValuesChange(_, values) {
    this.setState({
      customerProjectInfo: {
        ...this.state.customerProjectInfo,
        ...values,
      },
    });
  }

  componentDidMount() {}

  render() {
    const __$$context = this._context || this;
    const { state } = __$$context;
    return (
      <div
        ref={this._refsManager.linkRef('outterView')}
        style={{ height: '100%' }}
      >
        <Modal
          title="是否修改"
          visible={__$$eval(() => this.state.isModifyDialogVisible)}
          okText="确认"
          okType=""
          forceRender={false}
          cancelText="取消"
          zIndex={2000}
          destroyOnClose={false}
          confirmLoading={false}
          __events={{
            eventDataList: [
              {
                type: 'componentEvent',
                name: 'onOk',
                relatedEventName: 'onOkModifyDialogThird',
              },
              {
                type: 'componentEvent',
                name: 'onCancel',
                relatedEventName: 'onCancelModifyDialogThird',
              },
            ],
            eventList: [
              { name: 'onCancel', disabled: true },
              { name: 'onOk', disabled: true },
            ],
          }}
          onOk={function () {
            this.onOkModifyDialogThird.apply(
              this,
              Array.prototype.slice.call(arguments).concat([])
            );
          }.bind(this)}
          onCancel={function () {
            this.onCancelModifyDialogThird.apply(
              this,
              Array.prototype.slice.call(arguments).concat([])
            );
          }.bind(this)}
        >
          <NextText
            type="inherit"
            style={{
              fontStyle: 'normal',
              textAlign: 'left',
              display: 'block',
              fontFamily: 'arial, helvetica, microsoft yahei',
              fontWeight: 'normal',
            }}
          >
            修改将撤回此前填写的信息
          </NextText>
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
          style={{}}
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
                flex={true}
                style={{ marginBottom: '24px' }}
              >
                <Steps current={__$$eval(() => this.state.currentStep)}>
                  <Steps.Step title="版本申请" description="" />
                  <Steps.Step title="机器配置" subTitle="" description="" />
                  <Steps.Step title="项目审批" description="" />
                </Steps>
              </NextP>
              {!!__$$eval(() => this.state.currentStep === 0) && (
                <NextP
                  wrap={false}
                  type="body2"
                  verAlign="middle"
                  textSpacing={true}
                  align="left"
                  full={true}
                  flex={true}
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <Form
                    labelCol={{ span: 10 }}
                    wrapperCol={{ span: 10 }}
                    onFinish={function () {
                      this.onFinishFirst.apply(
                        this,
                        Array.prototype.slice.call(arguments).concat([])
                      );
                    }.bind(this)}
                    name="basic"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      width: '600px',
                      justifyContent: 'center',
                    }}
                    layout="vertical"
                    __events={{
                      eventDataList: [
                        {
                          type: 'componentEvent',
                          name: 'onFinish',
                          relatedEventName: 'onFinishFirst',
                        },
                        {
                          type: 'componentEvent',
                          name: 'onValuesChange',
                          relatedEventName: 'onValuesChange',
                        },
                      ],
                      eventList: [
                        { name: 'onFinish', disabled: true },
                        { name: 'onFinishFailed', disabled: false },
                        { name: 'onFieldsChange', disabled: false },
                        { name: 'onValuesChange', disabled: true },
                      ],
                    }}
                    initialValues={__$$eval(
                      () => this.state.customerProjectInfo
                    )}
                    onValuesChange={function () {
                      this.onValuesChange.apply(
                        this,
                        Array.prototype.slice.call(arguments).concat([])
                      );
                    }.bind(this)}
                  >
                    {!!false && (
                      <Form.Item
                        label=""
                        style={{ width: '600px' }}
                        colon={false}
                        name="id"
                      >
                        <Input
                          placeholder=""
                          style={{ width: '600px' }}
                          bordered={false}
                          disabled={true}
                        />
                      </Form.Item>
                    )}
                    <Form.Item
                      label="版本类型选择"
                      name="projectVersionTypeArray"
                      initialValue=""
                      labelAlign="left"
                      colon={false}
                      required={true}
                      style={{ flexDirection: 'column', width: '600px' }}
                      requiredobj={{
                        required: true,
                        message: '请选择版本类型',
                      }}
                    >
                      <Checkbox.Group
                        options={[
                          { label: '基础版本', value: '3' },
                          { label: 'AR导航', value: '1' },
                          { label: '货车导航', value: '2' },
                          { label: 'UI定制', value: '4', disabled: false },
                        ]}
                        style={{ width: '600px' }}
                        disabled={__$$eval(
                          () =>
                            this.state.customerProjectInfo.id > 0 &&
                            !this.state.isModifyStatus
                        )}
                      />
                    </Form.Item>
                    <Form.Item
                      label="版本线选择"
                      labelAlign="left"
                      colon={false}
                      required={true}
                      style={{ width: '600px' }}
                      name="versionLine"
                      requiredobj={{ required: true, message: '请选择版本线' }}
                      extra=""
                    >
                      <Select
                        style={{ width: '600px' }}
                        options={__$$eval(() => this.state.versionLinesArray)}
                        disabled={__$$eval(
                          () =>
                            this.state.customerProjectInfo.id > 0 &&
                            !this.state.isModifyStatus
                        )}
                        placeholder="请选择版本线"
                      />
                    </Form.Item>
                    <Form.Item
                      label="项目名称"
                      colon={false}
                      required={true}
                      style={{ display: 'flex' }}
                      labelAlign="left"
                      extra=""
                      name="systemProjectName"
                      requiredobj={{
                        required: true,
                        message: '请按格式填写项目名称',
                      }}
                      typeobj={{
                        type: 'string',
                        message:
                          '请输入项目名称，格式：公司简称-产品名称-版本类型',
                      }}
                      lenobj={{
                        max: 100,
                        message: '项目名称不能超过100个字符',
                      }}
                    >
                      <Input
                        placeholder="公司简称-产品名称-版本类型"
                        style={{ width: '600px' }}
                        disabled={__$$eval(
                          () =>
                            this.state.customerProjectInfo.id > 0 &&
                            !this.state.isModifyStatus
                        )}
                      />
                    </Form.Item>
                    <Form.Item
                      label="预期交付时间"
                      style={{ width: '600px' }}
                      colon={false}
                      required={true}
                      name="expectedTime"
                      labelAlign="left"
                      requiredobj={{
                        required: true,
                        message: '请填写预期交付时间',
                      }}
                    >
                      <DatePicker
                        style={{ width: '600px' }}
                        disabled={__$$eval(
                          () =>
                            this.state.customerProjectInfo.id > 0 &&
                            !this.state.isModifyStatus
                        )}
                      />
                    </Form.Item>
                    <Form.Item
                      label="预期出货量"
                      style={{ width: '600px' }}
                      required={true}
                      requiredobj={{
                        required: true,
                        message: '请填写预期出货量',
                      }}
                      name="expectedNum"
                      labelAlign="left"
                      colon={false}
                    >
                      <InputNumber
                        value={3}
                        style={{ width: '600px' }}
                        placeholder="单位（台）使用该版本的机器数量+预计出货量，请如实填写"
                        disabled={__$$eval(
                          () =>
                            this.state.customerProjectInfo.id > 0 &&
                            !this.state.isModifyStatus
                        )}
                        min={0}
                        size="middle"
                      />
                    </Form.Item>
                    <Form.Item
                      wrapperCol={{ offset: '' }}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'baseline',
                        justifyContent: 'space-between',
                        width: '600px',
                        display: 'block',
                      }}
                      labelAlign="left"
                      colon={false}
                    >
                      <Button
                        style={{ margin: '0px' }}
                        __events={{
                          eventDataList: [
                            {
                              type: 'componentEvent',
                              name: 'onClick',
                              relatedEventName: 'onClickFirstBack',
                            },
                          ],
                          eventList: [{ name: 'onClick', disabled: true }],
                        }}
                        onClick={function () {
                          this.onClickFirstBack.apply(
                            this,
                            Array.prototype.slice.call(arguments).concat([])
                          );
                        }.bind(this)}
                      >
                        返回
                      </Button>
                      <Button
                        type="primary"
                        htmlType="submit"
                        style={{
                          boxShadow: 'rgba(31, 56, 88, 0.2) 0px 0px 0px 0px',
                          float: 'right',
                        }}
                        __events={{
                          eventDataList: [],
                          eventList: [{ name: 'onClick', disabled: false }],
                        }}
                      >
                        下一步
                      </Button>
                    </Form.Item>
                  </Form>
                </NextP>
              )}
              {!!__$$eval(() => this.state.currentStep === 1) && (
                <NextP
                  wrap={false}
                  type="body2"
                  verAlign="middle"
                  textSpacing={true}
                  align="left"
                  full={true}
                  flex={true}
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <Form
                    labelCol={{ span: 10 }}
                    wrapperCol={{ span: 10 }}
                    onFinish={function () {
                      this.onFinishSecond.apply(
                        this,
                        Array.prototype.slice.call(arguments).concat([])
                      );
                    }.bind(this)}
                    name="basic"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      width: '600px',
                      justifyContent: 'center',
                      height: '800px',
                    }}
                    layout="vertical"
                    __events={{
                      eventDataList: [
                        {
                          type: 'componentEvent',
                          name: 'onFinish',
                          relatedEventName: 'onFinishSecond',
                        },
                        {
                          type: 'componentEvent',
                          name: 'onValuesChange',
                          relatedEventName: 'onValuesChange',
                        },
                      ],
                      eventList: [
                        { name: 'onFinish', disabled: true },
                        { name: 'onFinishFailed', disabled: false },
                        { name: 'onFieldsChange', disabled: false },
                        { name: 'onValuesChange', disabled: true },
                      ],
                    }}
                    initialValues={__$$eval(
                      () => this.state.customerProjectInfo
                    )}
                    onValuesChange={function () {
                      this.onValuesChange.apply(
                        this,
                        Array.prototype.slice.call(arguments).concat([])
                      );
                    }.bind(this)}
                  >
                    <Form.Item
                      label="设备类型选择"
                      labelAlign="left"
                      colon={false}
                      required={true}
                      style={{ width: '600px' }}
                      name="projectModal"
                      requiredobj={{
                        required: true,
                        message: '请选择设备类型',
                      }}
                    >
                      <Select
                        style={{ width: '600px' }}
                        options={__$$eval(() => this.state.projectModalsArray)}
                        disabled={__$$eval(
                          () =>
                            this.state.customerProjectInfo.id > 0 &&
                            !this.state.isModifyStatus
                        )}
                        placeholder="请选择设备类型"
                      />
                    </Form.Item>
                    <Form.Item
                      label="屏幕分辨率宽"
                      style={{ width: '600px' }}
                      name="displayWidth"
                      colon={false}
                      required={true}
                      requiredobj={{
                        required: true,
                        message: '请输入屏幕分辨率宽',
                      }}
                      labelAlign="left"
                    >
                      <InputNumber
                        value={3}
                        style={{ width: '600px' }}
                        placeholder="例如1280"
                        disabled={__$$eval(
                          () =>
                            this.state.customerProjectInfo.id > 0 &&
                            !this.state.isModifyStatus
                        )}
                        min={0}
                      />
                    </Form.Item>
                    <Form.Item
                      label="屏幕分辨率高"
                      style={{ width: '600px' }}
                      labelAlign="left"
                      colon={false}
                      name="displayHeight"
                      required={true}
                      requiredobj={{
                        required: true,
                        message: '请输入屏幕分辨率高',
                      }}
                    >
                      <InputNumber
                        value={3}
                        style={{ width: '600px' }}
                        placeholder="例如720"
                        disabled={__$$eval(
                          () =>
                            this.state.customerProjectInfo.id > 0 &&
                            !this.state.isModifyStatus
                        )}
                        min={0}
                      />
                    </Form.Item>
                    <Form.Item
                      label="屏幕尺寸（inch）"
                      style={{ width: '600px' }}
                      name="displayInch"
                      labelAlign="left"
                      required={true}
                      colon={false}
                      requiredobj={{
                        required: true,
                        message: '请输入屏幕尺寸',
                      }}
                    >
                      <InputNumber
                        value={3}
                        style={{ width: '600px' }}
                        placeholder="请输入尺寸"
                        disabled={__$$eval(
                          () =>
                            this.state.customerProjectInfo.id > 0 &&
                            !this.state.isModifyStatus
                        )}
                        min={0}
                      />
                    </Form.Item>
                    <Form.Item
                      label="屏幕DPI"
                      style={{ width: '600px' }}
                      labelAlign="left"
                      colon={false}
                      required={false}
                      name="displayDpi"
                    >
                      <InputNumber
                        value={3}
                        style={{ width: '600px' }}
                        placeholder="UI定制项目必填"
                        disabled={__$$eval(
                          () =>
                            this.state.customerProjectInfo.id > 0 &&
                            !this.state.isModifyStatus
                        )}
                        min={0}
                      />
                    </Form.Item>
                    <Form.Item
                      label="芯片名称"
                      colon={false}
                      required={true}
                      style={{ display: 'flex' }}
                      labelAlign="left"
                      extra=""
                      name="mainSoc"
                      requiredobj={{
                        required: true,
                        message: '请输入芯片名称',
                      }}
                      lenobj={{ max: 50, message: '芯片名称不能超过50个字符' }}
                    >
                      <Input
                        placeholder="请输入芯片名称"
                        style={{ width: '600px' }}
                        disabled={__$$eval(
                          () =>
                            this.state.customerProjectInfo.id > 0 &&
                            !this.state.isModifyStatus
                        )}
                      />
                    </Form.Item>
                    <Form.Item
                      label="芯片核数"
                      style={{ width: '600px' }}
                      required={true}
                      requiredobj={{
                        required: true,
                        message: '请输入芯片核数',
                      }}
                      name="cpuCoreNum"
                      labelAlign="left"
                      colon={false}
                    >
                      <InputNumber
                        value={3}
                        style={{ width: '600px' }}
                        placeholder="请输入芯片核数"
                        disabled={__$$eval(
                          () =>
                            this.state.customerProjectInfo.id > 0 &&
                            !this.state.isModifyStatus
                        )}
                        defaultValue=""
                        min={0}
                      />
                    </Form.Item>
                    <Form.Item
                      label="指令集"
                      style={{ width: '600px' }}
                      required={true}
                      requiredobj={{ required: true, message: '请选择指令集' }}
                      name="instructions"
                      colon={false}
                    >
                      <Select
                        style={{ width: '600px' }}
                        options={__$$eval(() => this.state.instructionsArray)}
                        disabled={__$$eval(
                          () =>
                            this.state.customerProjectInfo.id > 0 &&
                            !this.state.isModifyStatus
                        )}
                      />
                    </Form.Item>
                    <Form.Item
                      label="系统版本"
                      labelAlign="left"
                      colon={false}
                      required={true}
                      style={{ width: '600px' }}
                      name="osVersion"
                      requiredobj={{
                        required: true,
                        message: '请选择系统版本',
                      }}
                    >
                      <Select
                        style={{ width: '600px' }}
                        options={__$$eval(() => this.state.osVersionsArray)}
                        disabled={__$$eval(
                          () =>
                            this.state.customerProjectInfo.id > 0 &&
                            !this.state.isModifyStatus
                        )}
                        placeholder="请选择系统版本"
                      />
                    </Form.Item>
                    <Form.Item
                      wrapperCol={{ offset: '' }}
                      style={{
                        flexDirection: 'row',
                        width: '600px',
                        display: 'flex',
                      }}
                    >
                      <Button
                        style={{ marginLeft: '0' }}
                        __events={{
                          eventDataList: [
                            {
                              type: 'componentEvent',
                              name: 'onClick',
                              relatedEventName: 'onClickSecondBack',
                            },
                          ],
                          eventList: [{ name: 'onClick', disabled: true }],
                        }}
                        onClick={function () {
                          this.onClickSecondBack.apply(
                            this,
                            Array.prototype.slice.call(arguments).concat([])
                          );
                        }.bind(this)}
                      >
                        返回
                      </Button>
                      <Button
                        type="primary"
                        htmlType="submit"
                        style={{ float: 'right', marginLeft: '20px' }}
                        loading={__$$eval(
                          () =>
                            this.state.LOADING_ADD_OR_UPDATE_CUSTOMER_PROJECT
                        )}
                      >
                        {__$$eval(() => this.state.secondCommitText)}
                      </Button>
                      <Button
                        type="primary"
                        htmlType="submit"
                        style={{ marginLeft: '0px', float: 'right' }}
                        __events={{
                          eventDataList: [
                            {
                              type: 'componentEvent',
                              name: 'onClick',
                              relatedEventName: 'onClickPreSecond',
                            },
                          ],
                          eventList: [{ name: 'onClick', disabled: true }],
                        }}
                        onClick={function () {
                          this.onClickPreSecond.apply(
                            this,
                            Array.prototype.slice.call(arguments).concat([])
                          );
                        }.bind(this)}
                      >
                        上一步
                      </Button>
                    </Form.Item>
                  </Form>
                </NextP>
              )}
              {!!__$$eval(() => this.state.currentStep === 2) && (
                <NextP
                  wrap={false}
                  type="body2"
                  verAlign="middle"
                  textSpacing={true}
                  align="left"
                  full={true}
                  flex={true}
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <Form
                    labelCol={{ span: 10 }}
                    wrapperCol={{ span: 10 }}
                    onFinishFailed={function () {
                      this.onFinishFailed.apply(
                        this,
                        Array.prototype.slice.call(arguments).concat([])
                      );
                    }.bind(this)}
                    name="basic"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      width: '600px',
                      justifyContent: 'center',
                    }}
                    layout="vertical"
                    __events={{
                      eventDataList: [
                        {
                          type: 'componentEvent',
                          name: 'onFinishFailed',
                          relatedEventName: 'onFinishFailed',
                        },
                      ],
                      eventList: [
                        { name: 'onFinish', disabled: false },
                        { name: 'onFinishFailed', disabled: true },
                        { name: 'onFieldsChange', disabled: false },
                        { name: 'onValuesChange', disabled: false },
                      ],
                    }}
                  >
                    <Form.Item label="">
                      <Steps
                        current={1}
                        style={{
                          width: '600px',
                          display: 'flex',
                          justifyContent: 'space-around',
                          alignItems: 'center',
                          height: '300px',
                        }}
                        labelPlacement="horizontal"
                        direction="vertical"
                      >
                        <Steps.Step
                          title="提交完成"
                          description=""
                          style={{ width: '200px' }}
                        />
                        <Steps.Step
                          title={__$$eval(() => this.state.thirdAuditText)}
                          subTitle=""
                          description=""
                          style={{ width: '200px' }}
                        />
                      </Steps>
                    </Form.Item>
                    <Form.Item
                      wrapperCol={{ offset: '' }}
                      style={{
                        flexDirection: 'row',
                        width: '600px',
                        display: 'flex',
                      }}
                    >
                      <Button
                        style={{ marginLeft: '0' }}
                        __events={{
                          eventDataList: [
                            {
                              type: 'componentEvent',
                              name: 'onClick',
                              relatedEventName: 'onClickThirdBack',
                            },
                          ],
                          eventList: [{ name: 'onClick', disabled: true }],
                        }}
                        onClick={function () {
                          this.onClickThirdBack.apply(
                            this,
                            Array.prototype.slice.call(arguments).concat([])
                          );
                        }.bind(this)}
                      >
                        返回
                      </Button>
                      <Button
                        type="primary"
                        htmlType="submit"
                        style={{ float: 'right', marginLeft: '20px' }}
                        __events={{
                          eventDataList: [
                            {
                              type: 'componentEvent',
                              name: 'onClick',
                              relatedEventName: 'onClickModifyThird',
                            },
                          ],
                          eventList: [{ name: 'onClick', disabled: true }],
                        }}
                        onClick={function () {
                          this.onClickModifyThird.apply(
                            this,
                            Array.prototype.slice.call(arguments).concat([])
                          );
                        }.bind(this)}
                      >
                        {__$$eval(() => this.state.thirdButtonText)}
                      </Button>
                      {!!__$$eval(
                        () => this.state.customerProjectInfo.status > 2
                      ) && (
                        <Button
                          type="primary"
                          htmlType="submit"
                          style={{ marginLeft: '0px', float: 'right' }}
                          __events={{
                            eventDataList: [
                              {
                                type: 'componentEvent',
                                name: 'onClick',
                                relatedEventName: 'onClickPreThird',
                              },
                            ],
                            eventList: [{ name: 'onClick', disabled: true }],
                          }}
                          onClick={function () {
                            this.onClickPreThird.apply(
                              this,
                              Array.prototype.slice.call(arguments).concat([])
                            );
                          }.bind(this)}
                        >
                          上一步
                        </Button>
                      )}
                    </Form.Item>
                  </Form>
                </NextP>
              )}
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
