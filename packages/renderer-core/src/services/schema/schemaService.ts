import {
  type Spec,
  createDecorator,
  Provide,
  type IStore,
  KeyValueStore,
  EventEmitter,
  type EventDisposable,
} from '@alilc/lowcode-shared';
import { isObject } from 'lodash-es';
import { schemaValidation } from './validation';
import { ILifeCycleService, LifecyclePhase } from '../lifeCycleService';
import { ICodeRuntimeService } from '../code-runtime';

export interface NormalizedSchema extends Spec.Project {}

export type NormalizedSchemaKey = keyof NormalizedSchema;

export interface ISchemaService {
  initialize(schema: Spec.Project): void;

  get<K extends NormalizedSchemaKey>(key: K): NormalizedSchema[K];

  set<K extends NormalizedSchemaKey>(key: K, value: NormalizedSchema[K]): Promise<void>;

  onChange<K extends NormalizedSchemaKey>(
    key: K,
    listener: (v: NormalizedSchema[K]) => void,
  ): EventDisposable;
}

export const ISchemaService = createDecorator<ISchemaService>('schemaService');

@Provide(ISchemaService)
export class SchemaService implements ISchemaService {
  private store: IStore<NormalizedSchema, NormalizedSchemaKey> = new KeyValueStore<
    NormalizedSchema,
    NormalizedSchemaKey
  >({
    setterValidation: schemaValidation,
  });

  private notifyEmiiter = new EventEmitter();

  constructor(
    @ILifeCycleService private lifeCycleService: ILifeCycleService,
    @ICodeRuntimeService private codeRuntimeService: ICodeRuntimeService,
  ) {
    this.onChange('constants', (value = {}) => {
      this.codeRuntimeService.getScope().set('constants', value);
    });

    this.lifeCycleService.when(LifecyclePhase.Destroying, () => {
      this.notifyEmiiter.removeAll();
    });
  }

  initialize(schema: unknown): void {
    if (!isObject(schema)) {
      throw Error('schema must a object');
    }

    Object.keys(schema).forEach((key) => {
      // @ts-expect-error: ignore initialization
      this.set(key, schema[key]);
    });
  }

  async set<K extends NormalizedSchemaKey>(key: K, value: NormalizedSchema[K]): Promise<void> {
    if (value !== this.get(key)) {
      this.store.set(key, value);
      await this.notifyEmiiter.emit(key, value);
    }
  }

  get<K extends NormalizedSchemaKey>(key: K): NormalizedSchema[K] {
    return this.store.get(key) as NormalizedSchema[K];
  }

  onChange<K extends keyof NormalizedSchema>(
    key: K,
    listener: (v: NormalizedSchema[K]) => void | Promise<void>,
  ): EventDisposable {
    return this.notifyEmiiter.on(key, listener);
  }
}
