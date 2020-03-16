import { DatePicker, Input, Radio, Select, Switch } from '@alifd/next';
import NumberSetter from '../../../plugin-setters/src/number-setter';
import ExpressionSetter from '../../../plugin-setters/src/expression-setter';
import MixinSetter from '../../../plugin-setters/src/mixin-setter';
import EventsSetter from '../../../plugin-settings/src/builtin-setters/events-setter'
import { registerSetter } from '../../../plugin-settings/src';
import { createElement } from 'react';

registerSetter('ClassNameSetter', () => {
  return createElement(
    'div',
    {
      className: 'lc-block-setter'
    },
    '这里是类名绑定'
  );
});

registerSetter('EventsSetter', EventsSetter);

registerSetter('StringSetter', { component: Input, props: { placeholder: '请输入' } });

registerSetter('NumberSetter', NumberSetter as any);

registerSetter('StringSetter', { component: Input, props: { placeholder: '请输入' } });
registerSetter('ExpressionSetter', ExpressionSetter);
registerSetter('MixinSetter', MixinSetter);
registerSetter('BoolSetter', Switch);
registerSetter('RadioGroupSetter', Radio.RadioGroup);
registerSetter('SelectSetter', Select);
registerSetter('TextAreaSetter', Input.TextArea);
registerSetter('DateSetter', DatePicker);
registerSetter('DateYearSetter', DatePicker.YearPicker);
registerSetter('DateMonthSetter', DatePicker.MonthPicker);
registerSetter('DateRangeSetter', DatePicker.RangePicker);
