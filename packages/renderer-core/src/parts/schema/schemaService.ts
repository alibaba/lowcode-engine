import {
  type Spec,
  createDecorator,
  Provide,
  KeyValueStore,
  type EventDisposable,
} from '@alilc/lowcode-shared';
import { isObject } from 'lodash-es';
import { schemaValidation } from './validation';

export interface NormalizedSchema extends Spec.Project {}

export type NormalizedSchemaKey = keyof NormalizedSchema;

export interface ISchemaService {
  initialize(schema: Spec.Project): void;

  get<K extends NormalizedSchemaKey>(key: K): NormalizedSchema[K];

  set<K extends NormalizedSchemaKey>(key: K, value: NormalizedSchema[K]): void;

  onValueChange<K extends NormalizedSchemaKey>(
    key: K,
    listener: (value: NormalizedSchema[K]) => void,
  ): EventDisposable;
}

export const ISchemaService = createDecorator<ISchemaService>('schemaService');

@Provide(ISchemaService)
export class SchemaService implements ISchemaService {
  private store: KeyValueStore<NormalizedSchema, NormalizedSchemaKey>;

  constructor() {
    this.store = new KeyValueStore<NormalizedSchema, NormalizedSchemaKey>(new Map(), {
      setterValidation: schemaValidation,
    });
  }

  initialize(schema: unknown): void {
    if (!isObject(schema)) {
      throw Error('schema muse a object');
    }

    Object.keys(schema).forEach((key) => {
      // @ts-expect-error: ignore initialization
      this.set(key, schema[key]);
    });
  }

  set<K extends NormalizedSchemaKey>(key: K, value: NormalizedSchema[K]): void {
    this.store.set(key, value);
  }

  get<K extends NormalizedSchemaKey>(key: K): NormalizedSchema[K] {
    return this.store.get(key) as NormalizedSchema[K];
  }

  onValueChange<K extends NormalizedSchemaKey>(
    key: K,
    listener: (value: NormalizedSchema[K]) => void,
  ): EventDisposable {
    return this.store.onValueChange(key, listener);
  }
}
