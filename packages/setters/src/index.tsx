import { registerSetter } from '@ali/lowcode-globals';
import {
  DatePicker,
  Input,
  Radio,
  Select,
  Switch,
  NumberPicker,
} from '@alifd/next';
import ExpressionSetter from './expression-setter';
import MixinSetter from './mixin-setter';
import EventsSetter from './events-setter';
import StyleSetter from './style-setter';

registerSetter('ClassNameSetter', () => {
  return <div className="lc-block-setter">这里是类名绑定</div>;
});

registerSetter('EventsSetter', EventsSetter);
registerSetter('StringSetter', {
  component: Input,
  defaultProps: { placeholder: '请输入' },
});
registerSetter('NumberSetter', NumberPicker);
registerSetter('ExpressionSetter', ExpressionSetter);
registerSetter('MixinSetter', MixinSetter);
registerSetter('BoolSetter', Switch);
registerSetter('RadioGroupSetter', {
  component: Radio.Group,
  defaultProps: {
    shape: 'button',
  },
});
registerSetter('SelectSetter', Select);

// suggest: 做成 StringSetter 的一个参数，
registerSetter('TextAreaSetter', Input.TextArea);
registerSetter('DateSetter', DatePicker);
registerSetter('DateYearSetter', DatePicker.YearPicker);
registerSetter('DateMonthSetter', DatePicker.MonthPicker);
registerSetter('DateRangeSetter', DatePicker.RangePicker);

registerSetter('StyleSetter', StyleSetter);
