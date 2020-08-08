import { registerSetter } from '@ali/lowcode-editor-core';
import { isJSExpression } from '@ali/lowcode-types';
import { DatePicker, TimePicker, Input, Radio, Select, Switch, NumberPicker } from '@alifd/next';
import ExpressionSetter from './expression-setter';
import ColorSetter from './color-setter';
import JsonSetter from './json-setter';
import EventsSetter from './events-setter';
import StyleSetter from './style-setter';
import React, { Component } from 'react';
export const StringSetter = {
  component: Input,
  defaultProps: { placeholder: '请输入' },
  title: 'StringSetter',
  recommend: true,
};
export const NumberSetter = NumberPicker;
export const BoolSetter = Switch;
export const SelectSetter = Select;

// suggest: 做成 SelectSetter 一种变体
export const RadioGroupSetter = {
  component: Radio.Group,
  defaultProps: {
    shape: 'button',
  },
};
// suggest: 做成 StringSetter 的一个参数，
export const TextAreaSetter = Input.TextArea;
export const DateSetter = DatePicker;
export const DateYearSetter = DatePicker.YearPicker;
export const DateMonthSetter = DatePicker.MonthPicker;
export const DateRangeSetter = DatePicker.RangePicker;

export { ExpressionSetter, EventsSetter };

class StringDateSetter extends Component {

  render() {
    debugger
    const { onChange, editor } = this.props;
    return <DatePicker onChange={
      val => {
        onChange(val.format())
      }
    }/>;
  }
}
class StringTimePicker extends Component {

  render() {
    debugger
    const { onChange, editor } = this.props;
    return <TimePicker onChange={
      val => {
        onChange(val.format('HH:mm:ss'))
      }
    }/>;
  }
}

const builtinSetters: any = {
  StringSetter,
  NumberSetter,
  BoolSetter,
  SelectSetter,
  ExpressionSetter: {
    component: ExpressionSetter,
    condition: (field: any) => {
      const v = field.getValue();
      return v == null || isJSExpression(v);
    },
    defaultProps: { placeholder: '请输入表达式' },
    title: '表达式输入',
    recommend: true,
  },
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
};

registerSetter(builtinSetters);
