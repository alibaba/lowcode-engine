import { obx, autorun, untracked } from '@recore/obx';
import Prop, { IPropParent } from './prop';

export type PendingItem = Prop[];
export default class StashSpace implements IPropParent {
  @obx.val private space: Set<Prop> = new Set();
  @obx.ref private get maps(): Map<string, Prop> {
    const maps = new Map();
    if (this.space.size > 0) {
      this.space.forEach(prop => {
        maps.set(prop.key, prop);
      });
    }
    return maps;
  }
  private willPurge: () => void;

  constructor(write: (item: Prop) => void, before: () => boolean) {
    this.willPurge = autorun(() => {
      if (this.space.size < 1) {
        return;
      }
      const pending: Prop[] = [];
      for (const prop of this.space) {
        if (!prop.isUnset()) {
          this.space.delete(prop);
          pending.push(prop);
        }
      }
      if (pending.length > 0) {
        untracked(() => {
          if (before()) {
            for (const item of pending) {
              write(item);
            }
          }
        });
      }
    });
  }

  get(key: string): Prop {
    let prop = this.maps.get(key);
    if (!prop) {
      prop = new Prop(this, null, key);
      this.space.add(prop);
    }
    return prop;
  }

  delete(prop: Prop) {
    this.space.delete(prop);
    prop.purge();
  }

  clear() {
    this.space.forEach(item => item.purge());
    this.space.clear();
  }

  purge() {
    this.willPurge();
    this.space.clear();
  }
}
