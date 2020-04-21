import { registerSetter, isPlainObject } from '@ali/lowcode-globals';
import ArraySetter from './array-setter';
import ObjectSetter from './object-setter';
import MixedSetter from './mixed-setter';

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
registerSetter('MixedSetter', MixedSetter);
