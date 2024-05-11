import '@abraham/reflection';
import { Container, inject } from 'inversify';
import { fluentProvide, buildProviderModule } from 'inversify-binding-decorators';

export const iocContainer = new Container();

/**
 * Identifies a service of type `T`.
 */
export interface ServiceIdentifier<T> {
  (...args: any[]): void;
  type: T;
}

type Constructor<T = any> = new (...args: any[]) => T;

export function createDecorator<T>(serviceId: string): ServiceIdentifier<T> {
  const id = <any>(
    function (target: Constructor, targetKey: string, indexOrPropertyDescriptor: any): any {
      return inject(serviceId)(target, targetKey, indexOrPropertyDescriptor);
    }
  );
  id.toString = () => serviceId;

  return id;
}

export function Provide(serviceId: string, isSingleTon?: boolean) {
  const ret = fluentProvide(serviceId.toString());

  if (isSingleTon) {
    return ret.inSingletonScope().done();
  }
  return ret.done();
}

export function createInstance<T extends Constructor>(App: T) {
  return iocContainer.resolve<InstanceType<T>>(App);
}

export function bootstrapModules() {
  iocContainer.load(buildProviderModule());
}
