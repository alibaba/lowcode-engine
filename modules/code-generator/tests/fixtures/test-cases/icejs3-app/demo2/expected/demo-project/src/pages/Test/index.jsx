// 注意: 出码引擎注入的临时变量默认都以 "__$$" 开头，禁止在搭建的代码中直接访问。
// 例外：react 框架的导出名和各种组件名除外。
import React from 'react';

import { Form, Input, NumberPicker, Select, Button } from '@alifd/next';

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

  componentDidMount() {
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
          <Form.Item
            label={__$$eval(() => this.i18n('i18n-jwg27yo4'))}
            name="name"
            initValue="李雷"
          >
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
              <Button
                type="primary"
                style={{ margin: '0 5px 0 5px' }}
                htmlType="submit"
              >
                提交
              </Button>
              <Button
                type="normal"
                style={{ margin: '0 5px 0 5px' }}
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
