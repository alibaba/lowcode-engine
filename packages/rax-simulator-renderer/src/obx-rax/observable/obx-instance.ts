import { DecoratorTarget } from '../decorators';
import Obx from './obx';

export default class ObxInstance extends Obx<DecoratorTarget> {
  set(key: PropertyKey, val: any) {
    const target = this.target;
    if (key in target) {
      (target as any)[key] = val;
      return;
    }

    super.set(key, val);
  }
}
