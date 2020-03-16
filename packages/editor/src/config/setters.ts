import { Input } from '@alifd/next';
import NumberSetter from '../../../plugin-setters/number-setter';
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
