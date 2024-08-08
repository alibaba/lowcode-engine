/**
 * Identifies a bean of type `T`.
 * The name Bean comes from Spring(Java)
 */
export interface BeanIdentifier<T> {
  (...args: any[]): void;
  type: T;
}

export class CtorDescriptor<T> {
  constructor(
    readonly ctor: Constructor<T>,
    readonly staticArguments: any[] = [],
  ) {}
}

export class BeanContainer {
  private _entries = new Map<BeanIdentifier<any>, any>();

  constructor(...entries: [BeanIdentifier<any>, any][]) {
    for (const [id, instance] of entries) {
      this.set(id, instance);
    }
  }

  set<T>(id: BeanIdentifier<T>, instance: T | CtorDescriptor<T>): T | CtorDescriptor<T> {
    const result = this._entries.get(id);
    this._entries.set(id, instance);
    return result;
  }

  has(id: BeanIdentifier<any>): boolean {
    return this._entries.has(id);
  }

  get<T>(id: BeanIdentifier<T>): T | CtorDescriptor<T> {
    return this._entries.get(id);
  }
}

export type Constructor<T = any> = new (...args: any[]) => T;

const TARGET = '$TARGET$';
const DEPENDENCIES = '$DEPENDENCIES$';

export function mapDepsToBeanId(beanId: BeanIdentifier<any>, target: Constructor, index: number) {
  if ((target as any)[TARGET] === target) {
    (target as any)[DEPENDENCIES].push({ beanId, index });
  } else {
    (target as any)[DEPENDENCIES] = [{ beanId, index }];
    (target as any)[TARGET] = target;
  }
}

export function getBeanDependecies(target: Constructor): { beanId: BeanIdentifier<any>; index: number }[] {
  return (target as any)[DEPENDENCIES] || [];
}
