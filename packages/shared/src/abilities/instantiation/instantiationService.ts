import { Container, interfaces } from 'inversify';
import { buildProviderModule } from 'inversify-binding-decorators';
import { ServiceIdentifier, Constructor } from './decorators';

export interface InstanceAccessor {
  get<T>(id: ServiceIdentifier<T>): T;
}

export class InstantiationService {
  container: Container;

  constructor(options?: interfaces.ContainerOptions) {
    this.container = new Container(options);
  }

  get<T>(serviceIdentifier: ServiceIdentifier<T>) {
    return this.container.get<T>(serviceIdentifier);
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

  set<T>(serviceIdentifier: ServiceIdentifier<T>, constructor: Constructor<T>) {
    this.container.bind<T>(serviceIdentifier).to(constructor);
  }

  createInstance<T extends Constructor>(App: T) {
    return this.container.resolve<InstanceType<T>>(App);
  }

  bootstrapModules() {
    this.container.load(buildProviderModule());
  }
}
