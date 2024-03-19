import { type AnyFunction } from './types';
import { createHookStore, type HookStore } from './utils/hook';
import { nonSetterProxy } from './utils/non-setter-proxy';
import { type RuntimeError } from './utils/error';

export interface AppBoosts {
  [key: string]: any;
}

export interface RuntimeHooks {
  'app:error': (error: RuntimeError) => void;

  [key: PropertyKey]: AnyFunction;
}

export interface AppBoostsManager {
  hookStore: HookStore<RuntimeHooks>;

  readonly value: AppBoosts;
  add(name: PropertyKey, value: any, force?: boolean): void;
  remove(name: PropertyKey): void;
}

const boostsValue: AppBoosts = {};
const proxyBoostsValue = nonSetterProxy(boostsValue);

export const appBoosts: AppBoostsManager = {
  hookStore: createHookStore(),

  get value() {
    return proxyBoostsValue;
  },
  add(name: PropertyKey, value: any, force = false) {
    if ((boostsValue as any)[name] && !force) return;
    (boostsValue as any)[name] = value;
  },
  remove(name) {
    if ((boostsValue as any)[name]) {
      delete (boostsValue as any)[name];
    }
  },
};
