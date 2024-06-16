import '@abraham/reflection';
import { Container, inject, interfaces, injectable } from 'inversify';
import { fluentProvide, buildProviderModule } from 'inversify-binding-decorators';

/**
 * Identifies a service of type `T`.
 */
export interface ServiceIdentifier<T> {
  (...args: any[]): void;
  type: T;
}

export type Constructor<T = any> = new (...args: any[]) => T;

export function createDecorator<T>(serviceId: string): ServiceIdentifier<T> {
  const id = <any>(
    function (target: Constructor, targetKey: string, indexOrPropertyDescriptor: any): any {
      return set(serviceId)(target, targetKey, indexOrPropertyDescriptor);
    }
  );
  id.toString = () => serviceId;

  return id;
}

export const Injectable = injectable;

export function Provide<T>(serviceId: ServiceIdentifier<T>, isSingleTon?: boolean) {
  const ret = fluentProvide(serviceId.toString());

  if (isSingleTon) {
    return ret.inSingletonScope().done();
  }
  return ret.done();
}

export class InstantiationService {
  private container: Container;

  constructor(options?: interfaces.ContainerOptions) {
    this.container = new Container(options);
  }

  get<T>(serviceIdentifier: ServiceIdentifier<T>) {
    return this.container.get<T>(serviceIdentifier);
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
