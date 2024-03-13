import { type AnyFunction } from '@alilc/runtime-shared';
import { createHooks, type Hooks } from '../helper/hook';
import { type RuntimeError } from './error';

export interface AppBoosts {}

export interface RuntimeHooks {
  'app:error': (error: RuntimeError) => void;

  [key: PropertyKey]: AnyFunction;
}

export interface AppBoostsManager {
  hooks: Hooks<RuntimeHooks>;

  readonly value: AppBoosts;
  add(name: PropertyKey, value: any, force?: boolean): void;
}

const boostsValue: AppBoosts = {};

export const appBoosts: AppBoostsManager = {
  hooks: createHooks(),

  get value() {
    return boostsValue;
  },
  add(name: PropertyKey, value: any, force = false) {
    if ((boostsValue as any)[name] && !force) return;
    (boostsValue as any)[name] = value;
  },
};
