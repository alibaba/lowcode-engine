import { registerSetter } from '@ali/lowcode-globals';
import ArraySetter from './array-setter';
import ObjectSetter from './object-setter';

registerSetter('ArraySetter', ArraySetter);
registerSetter('ObjectSetter', ObjectSetter);
