import { Input } from '@alifd/next';
import NumberSetter from '../../../plugin-setters/number-setter';
import { registerSetter } from '../../../plugin-settings/src';
import { createElement } from 'react';

registerSetter('ClassNameSetter', () => {
  return createElement('div', {
    className: 'lc-block-setter'
  }, '这里是类名绑定');
});

registerSetter('EventsSetter', Input);

registerSetter('StringSetter', { component: Input, props: { placeholder: "请输入" } });

registerSetter('NumberSetter', NumberSetter as any);
