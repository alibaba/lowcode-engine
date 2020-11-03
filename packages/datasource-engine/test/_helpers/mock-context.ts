import {
  IDataSourceRuntimeContext,
  IDataSourceEngine
} from '@ali/lowcode-types';

export class MockContext<TState extends Record<string, unknown> = Record<string, unknown>>
  implements IDataSourceRuntimeContext<TState> {
  private _dataSourceEngine: IDataSourceEngine;

  public constructor(
    private _state: TState,
    private _createDataSourceEngine: (
      context: IDataSourceRuntimeContext<TState>
    ) => IDataSourceEngine,
    private _customMethods: Record<string, () => any> = {}
  ) {
    this._dataSourceEngine = _createDataSourceEngine(this);

    // 自定义方法
    Object.assign(this, _customMethods);
  }

  public get state() {
    return this._state;
  }

  public setState(state: Partial<TState>) {
    this._state = {
      ...this._state,
      ...state,
    };
  }

  public get dataSourceMap() {
    return this._dataSourceEngine.dataSourceMap;
  }

  public async reloadDataSource(): Promise<void> {
    this._dataSourceEngine.reloadDataSource();
  }

  public get page(): any {
    throw new Error('this.page should not be accessed by datasource-engine');
  }

  public get component(): any {
    throw new Error(
      'this.component should not be accessed by datasource-engine'
    );
  }

  [customMethod: string]: any;
}
