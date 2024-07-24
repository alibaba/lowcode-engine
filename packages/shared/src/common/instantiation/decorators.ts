import { inject, injectable } from 'inversify';
import { fluentProvide } from 'inversify-binding-decorators';

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
      return inject(serviceId)(target, targetKey, indexOrPropertyDescriptor);
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
