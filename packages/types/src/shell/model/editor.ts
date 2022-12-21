/* eslint-disable max-len */
import { EventEmitter } from 'events';
import StrictEventEmitter from 'strict-event-emitter-types';
import * as GlobalEvent from '../../event';
import { IPublicApiEvent } from '../api';
import { GetOptions, GetReturnType, KeyType, PowerDIRegisterOptions } from '../../editor';


export interface IPublicModelEditor extends StrictEventEmitter<EventEmitter, GlobalEvent.EventConfig> {
  get: <T = undefined, KeyOrType = any>(
    keyOrType: KeyOrType,
    opt?: GetOptions
  ) => GetReturnType<T, KeyOrType> | undefined;

  has: (keyOrType: KeyType) => boolean;

  set: (key: KeyType, data: any) => void | Promise<void>;

  onceGot: <T = undefined, KeyOrType extends KeyType = any>(keyOrType: KeyOrType) => Promise<GetReturnType<T, KeyOrType>>;

  onGot: <T = undefined, KeyOrType extends KeyType = any>(
    keyOrType: KeyOrType,
    fn: (data: GetReturnType<T, KeyOrType>) => void
  ) => () => void;

  register: (data: any, key?: KeyType, options?: PowerDIRegisterOptions) => void;

  get eventBus(): IPublicApiEvent;
}
