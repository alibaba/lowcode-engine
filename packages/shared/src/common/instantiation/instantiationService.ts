import { dispose, isDisposable } from '../disposable';
import { Graph, CyclicDependencyError } from '../graph';
import {
  type BeanIdentifier,
  BeanContainer,
  type Constructor,
  getBeanDependecies,
  CtorDescriptor,
} from './container';
import { createDecorator } from './decorators';

export interface InstanceAccessor {
  get<T>(id: BeanIdentifier<T>): T;
}

export interface IInstantiationService {
  createInstance<T extends Constructor>(Ctor: T, ...args: any[]): InstanceType<T>;

  invokeFunction<R, Args extends any[] = []>(
    fn: (accessor: InstanceAccessor, ...args: Args) => R,
    ...args: Args
  ): R;

  createChild(container: BeanContainer): IInstantiationService;

  dispose(): void;
}

export const IInstantiationService = createDecorator<IInstantiationService>('instantiationService');

export class InstantiationService implements IInstantiationService {
  private _activeInstantiations = new Set<BeanIdentifier<any>>();

  private _children = new Set<InstantiationService>();

  private _isDisposed = false;
  private readonly _beansToMaybeDispose = new Set<any>();

  constructor(
    private readonly _container: BeanContainer = new BeanContainer(),
    private readonly _parent?: InstantiationService,
  ) {
    this._container.set(IInstantiationService, this);
  }

  createChild(container: BeanContainer): IInstantiationService {
    this._throwIfDisposed();

    const that = this;
    const result = new (class extends InstantiationService {
      override dispose(): void {
        that._children.delete(result);
        super.dispose();
      }
    })(container, this);
    this._children.add(result);

    return result;
  }

  dispose(): void {
    if (this._isDisposed) return;
    // dispose all child services
    dispose(this._children);
    this._children.clear();

    // dispose all services created by this service
    for (const candidate of this._beansToMaybeDispose) {
      if (isDisposable(candidate)) {
        candidate.dispose();
      }
    }
    this._beansToMaybeDispose.clear();
    this._isDisposed = true;
  }

  /**
   * Calls a function with a service accessor.
   */
  invokeFunction<R, TS extends any[] = []>(
    fn: (accessor: InstanceAccessor, ...args: TS) => R,
    ...args: TS
  ): R {
    this._throwIfDisposed();

    const accessor: InstanceAccessor = {
      get: (id) => {
        const result = this._getOrCreateInstance(id);
        if (!result) {
          throw new Error(`[invokeFunction] unknown service '${id}'`);
        }
        return result;
      },
    };
    return fn(accessor, ...args);
  }

  /**
   * 创建实例
   */
  createInstance<T extends Constructor>(Ctor: T, ...args: any[]): InstanceType<T> {
    this._throwIfDisposed();

    const beanDependencies = getBeanDependecies(Ctor).sort((a, b) => a.index - b.index);
    const beanArgs = [];

    for (const dependency of beanDependencies) {
      const instance = this._getOrCreateInstance(dependency.id);
      if (!instance) {
        throw new Error(`[createInstance] ${Ctor.name} depends on UNKNOWN bean ${dependency.id}.`);
      }

      beanArgs.push(instance);
    }

    // 检查传入参数的个数，进行参数微调
    const firstArgPos = beanDependencies.length > 0 ? beanDependencies[0].index : args.length;
    if (args.length !== firstArgPos) {
      const delta = firstArgPos - args.length;
      if (delta > 0) {
        args = args.concat(new Array(delta));
      } else {
        args = args.slice(0, firstArgPos);
      }
    }

    return Reflect.construct<any, InstanceType<T>>(Ctor, args.concat(beanArgs));
  }

  private _getOrCreateInstance<T>(id: BeanIdentifier<T>): T {
    const thing = this._container.get(id);
    if (thing instanceof CtorDescriptor) {
      return this._safeCreateAndCacheInstance<T>(id, thing);
    } else {
      return thing;
    }
  }

  private _safeCreateAndCacheInstance<T>(id: BeanIdentifier<T>, desc: CtorDescriptor<T>): T {
    if (this._activeInstantiations.has(id)) {
      throw new Error(`[createInstance] illegal state - RECURSIVELY instantiating ${id}`);
    }
    this._activeInstantiations.add(id);
    try {
      return this._createAndCacheServiceInstance(id, desc);
    } finally {
      this._activeInstantiations.delete(id);
    }
  }

  private _createAndCacheServiceInstance<T>(id: BeanIdentifier<T>, desc: CtorDescriptor<T>): T {
    const graph = new Graph<{ id: BeanIdentifier<T>; desc: CtorDescriptor<T> }>((data) =>
      data.id.toString(),
    );

    let cycleCount = 0;
    const stack = [{ id, desc }];
    const seen = new Set<string>();

    while (stack.length > 0) {
      const item = stack.pop()!;

      if (seen.has(item.id.toString())) {
        continue;
      }
      seen.add(item.id.toString());

      graph.lookupOrInsertNode(item);

      // 一个较弱但有效的循环检查启发式方法
      if (cycleCount++ > 1000) {
        throw new CyclicDependencyError(graph);
      }

      // check all dependencies for existence and if they need to be created first
      for (const dependency of getBeanDependecies(item.desc.ctor)) {
        const instanceOrDesc = this._container.get(dependency.id);
        if (!instanceOrDesc) {
          throw new Error(
            `[createInstance] ${id} depends on ${dependency.id} which is NOT registered.`,
          );
        }

        if (instanceOrDesc instanceof CtorDescriptor) {
          const d = {
            id: dependency.id,
            desc: instanceOrDesc,
          };
          graph.insertEdge(item, d);
          stack.push(d);
        }
      }

      while (true) {
        const roots = graph.roots();

        // if there is no more roots but still
        // nodes in the graph we have a cycle
        if (roots.length === 0) {
          if (!graph.isEmpty()) {
            throw new CyclicDependencyError(graph);
          }
          break;
        }

        for (const { data } of roots) {
          // Repeat the check for this still being a service sync descriptor. That's because
          // instantiating a dependency might have side-effect and recursively trigger instantiation
          // so that some dependencies are now fullfilled already.
          const instanceOrDesc = this._container.get(data.id);
          if (instanceOrDesc instanceof CtorDescriptor) {
            // create instance and overwrite the service collections
            const instance = this._createServiceInstanceWithOwner(
              data.id,
              data.desc.ctor,
              data.desc.staticArguments,
            );
            this._setCreatedServiceInstance(data.id, instance);
          }
          graph.removeNode(data);
        }
      }
    }

    return this._container.get(id) as T;
  }

  private _createServiceInstanceWithOwner<T>(id: BeanIdentifier<T>, ctor: any, args: any[]): T {
    if (this._container.get(id) instanceof CtorDescriptor) {
      const instance = this.createInstance(ctor, args);
      this._beansToMaybeDispose.add(instance);

      return instance;
    } else if (this._parent) {
      return this._parent._createServiceInstanceWithOwner(id, ctor, args);
    } else {
      throw new Error(`illegalState - creating UNKNOWN service instance ${ctor.name}`);
    }
  }

  private _setCreatedServiceInstance<T>(id: BeanIdentifier<T>, instance: T): void {
    if (this._container.get(id) instanceof CtorDescriptor) {
      this._container.set(id, instance);
    } else if (this._parent) {
      this._parent._setCreatedServiceInstance(id, instance);
    } else {
      throw new Error('illegalState - setting UNKNOWN service instance');
    }
  }

  private _throwIfDisposed(): void {
    if (this._isDisposed) {
      throw new Error('InstantiationService has been disposed');
    }
  }
}
