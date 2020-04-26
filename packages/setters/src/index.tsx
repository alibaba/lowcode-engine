import { registerSetter, isJSSlot } from '@ali/lowcode-globals';
import { DatePicker, Input, Radio, Select, Switch, NumberPicker } from '@alifd/next';
import ExpressionSetter from './expression-setter';
import ColorSetter from './color-setter';
import JsonSetter from './json-setter';
import EventsSetter from './events-setter';
// import StyleSetter from './style-setter';

export const StringSetter = {
  component: Input,
  defaultProps: { placeholder: '请输入' },
  title: 'StringSetter',
  recommend: true,
};
export const NumberSetter = NumberPicker;
export const BoolSetter = Switch;
// suggest: 做成 SelectSetter 一种变体
export const RadioGroupSetter = {
  component: Radio.Group,
  defaultProps: {
    shape: 'button',
  },
};
export const SelectSetter = Select;

// suggest: 做成 StringSetter 的一个参数，
export const TextAreaSetter = Input.TextArea;
export const DateSetter = DatePicker;
export const DateYearSetter = DatePicker.YearPicker;
export const DateMonthSetter = DatePicker.MonthPicker;
export const DateRangeSetter = DatePicker.RangePicker;

export { ExpressionSetter, MixinSetter, EventsSetter }

// todo:
export const ClassNameSetter = () => {
  return <div className="lc-block-setter">这里是类名绑定</div>;
};

export const SlotSetter = () => {
  return <div>这里是 SlotSetter</div>;
};

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
  SlotSetter: {
    component: SlotSetter,
    title: '插槽输入',
    condition: (field: any) => {
      return isJSSlot(field.getValue());
    },
    initialValue: (field: any, value: any) => {
      if (isJSSlot(value)) {
        return value;
      }
      return {
        type: 'JSSlot',
        value: value
      };
    },
    recommend: true,
  },
  RadioGroupSetter,
  TextAreaSetter,
  DateSetter,
  DateYearSetter,
  DateMonthSetter,
  DateRangeSetter,
  EventsSetter,
  // StyleSetter,
  // ColorSetter,
  JsonSetter,
};

export function registerSetters() {
  registerSetter(builtinSetters);
}
