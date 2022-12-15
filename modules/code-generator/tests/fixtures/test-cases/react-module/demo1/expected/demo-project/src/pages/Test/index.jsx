import React from "react";

import { Form, Input, NumberPicker, Select, Button } from "@alifd/next";

import utils, { RefsManager } from "../../utils";

import "./index.css";

class Test$$Page extends React.Component {
  constructor(props, context) {
    super(props);

    this.utils = utils;

    this.state = { text: "outter" };

    this.refsManager = new RefsManager();
  }

  componentDidMount() {

  }

  $(refName) {
    return this.refsManager.get(refName);
  }

  $$(refName) {
    return this.refsManager.getAll(refName);
  }

  render() {
    return (
      <div ref={this.refsManager.linkRef("outterView")} autoLoading={true}>
        <Form
          labelCol={this.state.colNum}
          style={{}}
          ref={this.refsManager.linkRef("testForm")}
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
                { label: "教师", value: "t" },
                { label: "医生", value: "d" },
                { label: "歌手", value: "s" },
              ]}
            />
          </Form.Item>
          <div style={{ textAlign: "center" }}>
            <Button.Group>
              <Button
                type="primary"
                style={{ margin: "0 5px 0 5px" }}
                htmlType="submit"
              >
                提交
              </Button>
              <Button
                type="normal"
                style={{ margin: "0 5px 0 5px" }}
                htmlType="reset"
              >
                重置
              </Button>
            </Button.Group>
          </div>
        </Form>
      </div>
    );
  }
}

export default Test$$Page;
