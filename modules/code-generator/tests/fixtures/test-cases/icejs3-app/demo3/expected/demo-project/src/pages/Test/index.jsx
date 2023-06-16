// 注意: 出码引擎注入的临时变量默认都以 "__$$" 开头，禁止在搭建的代码中直接访问。
// 例外：react 框架的导出名和各种组件名除外。
import React from 'react';

import Super, {
  Button,
  Input as CustomInput,
  Form,
  NumberPicker,
  Select,
  SearchTable as SearchTableExport,
} from '@alifd/next';

import SuperOther from '@alifd/next';

import '@alifd/next/lib/super/style';

import '@alifd/next/lib/button/style';

import '@alifd/next/lib/input/style';

import '@alifd/next/lib/form/style';

import '@alifd/next/lib/number-picker/style';

import '@alifd/next/lib/select/style';

import '@alifd/next/lib/search-table/style';

import utils from '../../utils';

import * as __$$i18n from '../../i18n';

import __$$constants from '../../constants';

import './index.css';

const SuperSub = Super.Sub;

const SelectOption = Select.Option;

const SearchTable = SearchTableExport.default;

class Test$$Page extends React.Component {
  _context = this;

  get constants() {
    return __$$constants || {};
  }

  constructor(props, context) {
    super(props);

    this.utils = utils;

    __$$i18n._inject2(this);

    this.state = {};
  }

  $ = () => null;

  $$ = () => [];

  componentDidMount() {}

  render() {
    const __$$context = this._context || this;
    const { state } = __$$context;
    return (
      <div>
        <Super title={__$$eval(() => this.state.title)} />
        <SuperSub />
        <SuperOther />
        <Button />
        <Button.Group />
        <CustomInput />
        <Form.Item />
        <NumberPicker />
        <SelectOption />
        <SearchTable />
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
