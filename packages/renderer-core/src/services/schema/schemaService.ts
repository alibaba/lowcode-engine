import { Disposable, type Project, createDecorator, Events } from '@alilc/lowcode-shared';
import { isObject, isEqual, get as lodashGet, set as lodashSet } from 'lodash-es';
import { schemaValidation } from './validation';

export interface NormalizedSchema extends Project {}

export type NormalizedSchemaKey = keyof NormalizedSchema;

export type SchemaUpdateEvent = { key: string; previous: any; data: any };

export interface ISchemaService {
  readonly onSchemaUpdate: Events.Event<SchemaUpdateEvent>;

  get<T>(key: string): T | undefined;
  get<T>(key: string, defaultValue?: T): T;

  set(key: string, value: any): void;
}

export const ISchemaService = createDecorator<ISchemaService>('schemaService');

export class SchemaService extends Disposable implements ISchemaService {
  private store: NormalizedSchema;

  private _observer = this.addDispose(new Events.Emitter<SchemaUpdateEvent>());

  readonly onSchemaUpdate = this._observer.event;

  constructor(schema: unknown) {
    super();

    if (!isObject(schema)) {
      throw Error('schema must a object');
    }

    this.store = {} as any;
    for (const key of Object.keys(schema)) {
      const value = (schema as any)[key];

      // todo： schemas validate
      const valid = schemaValidation(key as any, value);
      if (valid !== true) {
        throw new Error(
          `failed to config ${key.toString()}, validation error: ${valid ? valid : ''}`,
        );
      }

      this.set(key, value);
    }
  }

  set(key: string, value: any): void {
    const previous = this.get(key);
    if (!isEqual(previous, value)) {
      lodashSet(this.store, key, value);
      this._observer.notify({ key, previous, data: value });
    }
  }

  get<T>(key: string, defaultValue?: T): T {
    return (lodashGet(this.store, key) ?? defaultValue) as T;
  }
}
