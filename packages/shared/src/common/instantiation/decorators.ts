import { type BeanIdentifier, type Constructor, mapDepsToBeanId } from './container';

const idsMap = new Map<string, BeanIdentifier<any>>();

export function createDecorator<T>(beanId: string): BeanIdentifier<T> {
  if (idsMap.has(beanId)) {
    return idsMap.get(beanId)!;
  }

  const id = <any>function (target: Constructor, _: string, indexOrPropertyDescriptor: any): any {
    return mapDepsToBeanId(id, target, indexOrPropertyDescriptor);
  };
  id.toString = () => beanId;

  idsMap.set(beanId, id);
  return id;
}
