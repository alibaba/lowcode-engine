import {
  type Spec,
  createDecorator,
  Provide,
  type IStore,
  KeyValueStore,
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

  set<K extends NormalizedSchemaKey>(key: K, value: NormalizedSchema[K]): void;
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

  constructor(
    @ILifeCycleService private lifeCycleService: ILifeCycleService,
    @ICodeRuntimeService private codeRuntimeService: ICodeRuntimeService,
  ) {
    this.lifeCycleService.when(LifecyclePhase.Ready).then(() => {
      const constants = this.get('constants') ?? {};
      this.codeRuntimeService.getScope().set('constants', constants);
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

  set<K extends NormalizedSchemaKey>(key: K, value: NormalizedSchema[K]): void {
    this.store.set(key, value);
  }

  get<K extends NormalizedSchemaKey>(key: K): NormalizedSchema[K] {
    return this.store.get(key) as NormalizedSchema[K];
  }
}
