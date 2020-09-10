import React, { Component } from 'react';
import { registerSetter } from '@ali/lowcode-editor-core';
import { isJSExpression, isJSFunction } from '@ali/lowcode-types';
import { DatePicker, TimePicker, Input, Radio, Select, Switch, NumberPicker } from '@alifd/next';
import ExpressionSetter from './expression-setter';
import ColorSetter from './color-setter';
import JsonSetter from './json-setter';
import EventsSetter from './events-setter';
import StyleSetter from './style-setter';
import IconSetter from './icon-setter';
import FunctionSetter from './function-setter';
// import MixedSetter from './mixed-setter';

export const StringSetter = {
  component: Input,
  defaultProps: { placeholder: '请输入', style: { maxWidth: 180 } },
  title: 'StringSetter',
  recommend: true,
  condition: (field: any) => {
    const v = field.getValue();
    return typeof v === 'string';
  },
};
export const NumberSetter = NumberPicker;
export class BoolSetter extends Component {
  render() {
    const { onChange, value, defaultValue } = this.props;
    return <Switch checked={value} defaultChecked={defaultValue} onChange={onChange} />;
  }
}
export const SelectSetter = Select;

// suggest: 做成 SelectSetter 一种变体
export const RadioGroupSetter = {
  component: Radio.Group,
  defaultProps: {
    shape: 'button',
  },
};
// suggest: 做成 StringSetter 的一个参数，
export const TextAreaSetter = {
  component: Input.TextArea,
  defaultProps: { placeholder: '请输入', style: { maxWidth: 180 } },
  title: 'TextAreaSetter',
  recommend: true,
  condition: (field: any) => {
    const v = field.getValue();
    return typeof v === 'string';
  },
};
export const DateSetter = DatePicker;
export const DateYearSetter = DatePicker.YearPicker;
export const DateMonthSetter = DatePicker.MonthPicker;
export const DateRangeSetter = DatePicker.RangePicker;

export { ExpressionSetter, EventsSetter, JsonSetter, IconSetter };

// eslint-disable-next-line react/no-multi-comp
class StringDateSetter extends Component {
  render() {
    const { onChange } = this.props;
    return (
      <DatePicker
        onChange={(val) => {
          onChange(val.format());
        }}
      />
    );
  }
}

// eslint-disable-next-line react/no-multi-comp
class StringTimePicker extends Component {
  render() {
    const { onChange } = this.props;
    return (
      <TimePicker
        onChange={(val) => {
          onChange(val.format('HH:mm:ss'));
        }}
      />
    );
  }
}

const VariableSetter = {
  component: ExpressionSetter,
  condition: (field: any) => {
    const v = field.getValue();
    return v == null || isJSExpression(v);
  },
  defaultProps: { placeholder: '请输入表达式' },
  title: '表达式输入',
  recommend: true,
};


const FunctionBindSetter = {
  component: FunctionSetter,
  title: '函数绑定',
  condition: (field: any) => {
    const v = field.getValue();
    return v == isJSFunction(v);
  },
};

const builtinSetters: any = {
  StringSetter,
  NumberSetter,
  BoolSetter,
  SelectSetter,
  VariableSetter,
  ExpressionSetter: VariableSetter,
  RadioGroupSetter,
  TextAreaSetter,
  DateSetter: StringDateSetter,
  TimePicker: StringTimePicker,
  DateYearSetter,
  DateMonthSetter,
  DateRangeSetter,
  EventsSetter,
  ColorSetter,
  JsonSetter,
  StyleSetter,
  IconSetter,
  FunctionSetter: FunctionBindSetter,
};

registerSetter(builtinSetters);
