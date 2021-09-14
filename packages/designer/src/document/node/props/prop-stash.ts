import { obx, autorun, untracked, computed, makeObservable, action } from '@ali/lowcode-editor-core';
import { Prop, IPropParent, UNSET } from './prop';
import { Props } from './props';
import { Node } from '../node';

export type PendingItem = Prop[];
export class PropStash implements IPropParent {
  readonly isPropStash = true;

  @obx.shallow private space: Set<Prop> = new Set();

  @computed private get maps(): Map<string | number, Prop> {
    const maps = new Map();
    if (this.space.size > 0) {
      this.space.forEach(prop => {
        maps.set(prop.key, prop);
      });
    }
    return maps;
  }

  private willPurge: () => void;

  readonly owner: Node;

  constructor(readonly props: Props, write: (item: Prop) => void) {
    makeObservable(this);
    this.owner = props.owner;
    this.willPurge = autorun(() => {
      if (this.space.size < 1) {
        return;
      }
      const pending: Prop[] = [];
      for (const prop of this.space) {
        if (!prop.isUnset() && !prop.isVirtual()) {
          this.space.delete(prop);
          pending.push(prop);
        }
      }
      if (pending.length > 0) {
        untracked(() => {
          for (const item of pending) {
            write(item);
          }
        });
      }
    });
  }

  @action
  get(key: string | number): Prop {
    let prop = this.maps.get(key);
    if (!prop) {
      prop = new Prop(this, UNSET, key);
      this.space.add(prop);
    }
    return prop;
  }

  @action
  delete(prop: Prop) {
    this.space.delete(prop);
    prop.purge();
  }

  @action
  clear() {
    this.space.forEach(item => item.purge());
    this.space.clear();
  }

  @action
  purge() {
    this.willPurge();
    this.space.clear();
  }
}
