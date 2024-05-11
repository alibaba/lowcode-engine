import { createStore } from 'store';

export type StorageValue = string | boolean | number | undefined | null | object;

export interface IPersistence {
  get(key: string, fallbackValue: string): string;
  get(key: string, fallbackValue?: string): string | undefined;

  set(key: string, value: StorageValue): void;

  delete(key: string): void;

  clear(): void;
}

export class PersistenceStore implements IPersistence {
  #store: ReturnType<typeof createStore>;

  constructor(namespace?: string) {
    this.#store = store.createStore([], namespace);
  }

  get(key: string, fallbackValue: string): string;
  get(key: string, fallbackValue?: string | undefined): string | undefined;
  get(key: string, fallbackValue?: unknown): string | undefined {
    const value = store.get(key, fallbackValue);
    return value;
  }

  set(key: string, value: StorageValue): void {
    this.#store.set(key, value);
  }

  delete(key: string): void {
    this.#store.remove(key);
  }

  clear(): void {
    this.#store.clearAll();
  }
}
