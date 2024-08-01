import { Disposable, type Project, createDecorator, Events } from '@alilc/lowcode-shared';
import { isObject, isEqual, get as lodashGet, set as lodashSet } from 'lodash-es';
import { schemaValidation } from './validation';

export interface NormalizedSchema extends Project {}

export type NormalizedSchemaKey = keyof NormalizedSchema;

export type SchemaUpdateEvent = { key: string; previous: any; data: any };

export interface ISchemaService {
  readonly onSchemaUpdate: Events.Event<SchemaUpdateEvent>;

  initialize(schema: unknown): void;

  get<T>(key: string): T | undefined;
  get<T>(key: string, defaultValue?: T): T;

  set(key: string, value: any): void;
}

export const ISchemaService = createDecorator<ISchemaService>('schemaService');

export class SchemaService extends Disposable implements ISchemaService {
  private _schema: NormalizedSchema;

  private _onSchemaUpdate = this._addDispose(new Events.Emitter<SchemaUpdateEvent>());

  readonly onSchemaUpdate = this._onSchemaUpdate.event;

  constructor() {
    super();
  }

  initialize(schema: unknown) {
    if (!isObject(schema)) {
      throw Error('schema must a object');
    }

    this._schema = {} as any;
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
      lodashSet(this._schema, key, value);
      this._onSchemaUpdate.notify({ key, previous, data: value });
    }
  }

  get<T>(key: string, defaultValue?: T): T {
    return (lodashGet(this._schema, key) ?? defaultValue) as T;
  }
}
