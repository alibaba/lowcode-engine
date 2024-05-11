import { it, describe, expect } from 'vitest';
import { lazyInject, provide, initInstantiation } from '../src/instantiation';

interface Warrior {
  fight(): string;
}

interface Weapon {
  hit(): string;
}

@provide(Katana)
class Katana implements Weapon {
  public hit() {
    return 'cut!';
  }
}

@provide(Ninja)
class Ninja implements Warrior {
  @lazyInject(Katana)
  private _katana: Weapon;

  public fight() {
    return this._katana.hit();
  }
}

initInstantiation();

describe('', () => {
  it('works', () => {
    const n = new Ninja();
    expect(n.fight()).toBe('cut!');
  });
});
