import '@abraham/reflection';
import { Container, interfaces, injectable } from 'inversify';
import { buildProviderModule } from 'inversify-binding-decorators';
import { ServiceIdentifier, Constructor, createDecorator } from './decorators';

export interface InstanceAccessor {
  get<T>(id: ServiceIdentifier<T>): T;
}

export interface IInstantiationService {
  get<T>(serviceIdentifier: ServiceIdentifier<T>): T;

  bind<T>(serviceIdentifier: ServiceIdentifier<T>, constructor: Constructor<T>): void;

  set<T>(serviceIdentifier: ServiceIdentifier<T>, instance: T): void;

  invokeFunction<R, TS extends any[] = []>(
    fn: (accessor: InstanceAccessor, ...args: TS) => R,
    ...args: TS
  ): R;

  createInstance<T extends Constructor>(App: T): InstanceType<T>;
}

export const IInstantiationService = createDecorator<IInstantiationService>('instantiationService');

export class InstantiationService implements IInstantiationService {
  container: Container;

  constructor(options?: interfaces.ContainerOptions) {
    this.container = new Container(options);
    this.set(IInstantiationService, this);
    this.container.load(buildProviderModule());
  }

  get<T>(serviceIdentifier: ServiceIdentifier<T>) {
    return this.container.get<T>(serviceIdentifier.toString());
  }

  set<T>(serviceIdentifier: ServiceIdentifier<T>, instance: T): void {
    this.container.bind<T>(serviceIdentifier).toConstantValue(instance);
  }

  /**
   * Calls a function with a service accessor.
   */
  invokeFunction<R, TS extends any[] = []>(
    fn: (accessor: InstanceAccessor, ...args: TS) => R,
    ...args: TS
  ): R {
    const accessor: InstanceAccessor = {
      get: (id) => {
        return this.get(id);
      },
    };
    return fn(accessor, ...args);
  }

  bind<T>(serviceIdentifier: ServiceIdentifier<T>, constructor: Constructor<T>) {
    this.container.bind<T>(serviceIdentifier).to(constructor);
  }

  createInstance<T extends Constructor>(App: T) {
    injectable()(App);
    return this.container.resolve<InstanceType<T>>(App);
  }
}
