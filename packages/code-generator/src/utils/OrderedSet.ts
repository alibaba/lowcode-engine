export class OrderedSet<T> {
  private _set = new Set<T>();
  private _arr: T[] = [];

  constructor(items?: T[]) {
    if (items) {
      this._set = new Set(items);
      this._arr = items.slice(0);
    }
  }

  add(item: T) {
    if (!this._set.has(item)) {
      this._set.add(item);
      this._arr.push(item);
    }
  }

  delete(item: T) {
    if (this._set.has(item)) {
      this._set.delete(item);
      this._arr.splice(this._arr.indexOf(item), 1);
    }
  }

  has(item: T) {
    return this._set.has(item);
  }

  toArray() {
    return this._arr.slice(0);
  }
}
