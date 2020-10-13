/* eslint-disable @typescript-eslint/indent */
import {
  IDataSourceRuntimeContext,
  IRuntimeDataSource,
  RequestHandler,
  RuntimeDataSourceConfig,
  RuntimeDataSourceStatus,
  RuntimeOptionsConfig,
  UrlParamsHandler,
} from '@ali/lowcode-types';

class RuntimeDataSourceItem<
  TParams extends Record<string, unknown> = Record<string, unknown>,
  TResultData = unknown
> implements IRuntimeDataSource<TParams, TResultData> {
  private _data?: TResultData;

  private _error?: Error;

  private _status = RuntimeDataSourceStatus.Initial;

  private _dataSourceConfig: RuntimeDataSourceConfig;

  private _request:
    | RequestHandler<{ data: TResultData }>
    | UrlParamsHandler<TResultData>;

  private _context: IDataSourceRuntimeContext;

  private _options?: RuntimeOptionsConfig;

  constructor(
    dataSourceConfig: RuntimeDataSourceConfig,
    request:
      | RequestHandler<{ data: TResultData }>
      | UrlParamsHandler<TResultData>,
    context: IDataSourceRuntimeContext,
  ) {
    this._dataSourceConfig = dataSourceConfig;
    this._request = request;
    this._context = context;
  }

  get data() {
    return this._data;
  }

  get error() {
    return this._error;
  }

  get status() {
    return this._status;
  }

  async load(params?: TParams) {
    if (!this._dataSourceConfig) return;
    // 考虑没有绑定对应的 handler 的情况
    if (!this._request) {
      throw new Error(`no ${this._dataSourceConfig.type} handler provide`);
    }

    // TODO: urlParams  有没有更好的处理方式
    if (this._dataSourceConfig.type === 'urlParams') {
      const response = await (this._request as UrlParamsHandler<TResultData>)(
        this._context,
      );
      this._context.setState({
        [this._dataSourceConfig.id]: response,
      });

      this._data = response;
      this._status = RuntimeDataSourceStatus.Loaded;
      return response;
    }

    if (!this._dataSourceConfig.options) {
      throw new Error(`${this._dataSourceConfig.id} has no options`);
    }

    if (typeof this._dataSourceConfig.options === 'function') {
      this._options = this._dataSourceConfig.options();
    }

    // 考虑转换之后是 null 的场景
    if (!this._options) {
      throw new Error(`${this._dataSourceConfig.id} options transform error`);
    }

    // 临时变量存，每次可能结果不一致，不做缓存
    let shouldFetch = true;

    if (this._dataSourceConfig.shouldFetch) {
      if (typeof this._dataSourceConfig.shouldFetch === 'function') {
        shouldFetch = this._dataSourceConfig.shouldFetch();
      } else if (typeof this._dataSourceConfig.shouldFetch === 'boolean') {
        shouldFetch = this._dataSourceConfig.shouldFetch;
      }
    }

    if (!shouldFetch) {
      this._status = RuntimeDataSourceStatus.Error;
      this._error = new Error(
        `the ${this._dataSourceConfig.id} request should not fetch, please check the condition`,
      );
      return;
    }

    // willFetch
    this._dataSourceConfig.willFetch!();

    // 约定如果 params 有内容，直接做替换，如果没有就用默认的 options 的
    if (params && this._options) {
      this._options.params = params;
    }

    const dataHandler = this._dataSourceConfig.dataHandler!;
    const { errorHandler } = this._dataSourceConfig;

    // 调用实际的请求，获取到对应的数据和状态后赋值给当前的 dataSource
    try {
      this._status = RuntimeDataSourceStatus.Loading;

      // _context 会给传，但是用不用由 handler 说了算
      const result = await (this._request as RequestHandler<{
        data: TResultData;
      }>)(this._options, this._context).then(dataHandler, errorHandler);

      // setState
      this._context.setState({
        [this._dataSourceConfig.id]: result,
      });
      // 结果赋值
      this._data = result;
      this._status = RuntimeDataSourceStatus.Loaded;
      return this._data;
    } catch (error) {
      this._error = error;
      this._status = RuntimeDataSourceStatus.Error;
      throw error;
    }
  }
}

export { RuntimeDataSourceItem };
