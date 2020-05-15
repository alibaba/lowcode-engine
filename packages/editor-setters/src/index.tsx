import { registerSetter } from '@ali/lowcode-globals';
import { DatePicker, Input, Radio, Select, Switch, NumberPicker } from '@alifd/next';
import ExpressionSetter from './expression-setter';
import ColorSetter from './color-setter';
import JsonSetter from './json-setter';
import EventsSetter from './events-setter';

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

const builtinSetters: any = {
  StringSetter,
  NumberSetter,
  BoolSetter,
  SelectSetter,
  ExpressionSetter: {
    component: ExpressionSetter,
    defaultProps: { placeholder: '请输入表达式' },
    title: '表达式输入',
    recommend: true,
  },
  RadioGroupSetter,
  TextAreaSetter,
  DateSetter,
  DateYearSetter,
  DateMonthSetter,
  DateRangeSetter,
  EventsSetter,
  ColorSetter,
  JsonSetter,
};

registerSetter(builtinSetters);
