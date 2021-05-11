import { registerSetter } from '@ali/lowcode-editor-core';
import { registerMetadataTransducer } from '@ali/lowcode-designer';
import ArraySetter from './components/array-setter';
import ObjectSetter from './components/object-setter';
import MixedSetter from './components/mixed-setter';
import { isPlainObject } from '@ali/lowcode-utils';
import parseJSFunc from './transducers/parse-func';
import parseProps from './transducers/parse-props';
import addonCombine from './transducers/addon-combine';
import SlotSetter from './components/slot-setter';
import { isJSSlot } from '@ali/lowcode-types';

export const registerDefaults = () => {
  registerSetter('ArraySetter', {
    component: ArraySetter,
    defaultProps: {},
    title: 'ArraySetter', // TODO
    condition: (field: any) => {
      const v = field.getValue();
      return v == null || Array.isArray(v);
    },
    initialValue: [],
    recommend: true,
  });
  registerSetter('ObjectSetter', {
    component: ObjectSetter,
    // todo: defaultProps
    defaultProps: {},
    title: 'ObjectSetter', // TODO
    condition: (field: any) => {
      const v = field.getValue();
      return v == null || isPlainObject(v);
    },
    initialValue: {},
    recommend: true,
  });
  registerSetter('SlotSetter', {
    component: SlotSetter,
    title: {
      type: 'i18n',
      'zh-CN': '插槽输入',
      'en-US': 'Slot Setter',
    },
    condition: (field: any) => {
      return isJSSlot(field.getValue());
    },
    initialValue: (field: any, value: any) => {
      if (isJSSlot(value)) {
        return value;
      }
      return {
        type: 'JSSlot',
        value,
      };
    },
    recommend: true,
  });
  registerSetter('MixedSetter', MixedSetter);

  // parseFunc
  registerMetadataTransducer(parseJSFunc, 9, 'parse-func');

  // parseProps
  registerMetadataTransducer(parseProps, 10, 'parse-props');

  // addon/platform custom
  registerMetadataTransducer(addonCombine, 11, 'combine-props');
};
