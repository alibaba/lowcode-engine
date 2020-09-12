import { IRuntimeDataSource } from './IRuntimeDataSource';

/** 运行时上下文 */
export interface IRuntimeContext<
  TState extends object = Record<string, unknown>
> {
  /** 当前容器的状态 */
  readonly state: TState;

  /** 设置状态(浅合并) */
  setState(state: Partial<TState>): void;

  /** 数据源, key 是数据源的 ID */
  dataSourceMap: Record<string, IRuntimeDataSource>;

  /** 重新加载所有的数据源 */
  reloadDataSource(): Promise<void>;

  /** 页面容器 */
  readonly page: IRuntimeContext & { props: Record<string, unknown> };

  /** 低代码业务组件容器 */
  readonly component: IRuntimeContext & { props: Record<string, unknown> };
}
