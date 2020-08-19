import {
  DataSourceOptions,
  IRuntimeDataSource,
  RequestHandler,
  RuntimeDataSourceStatus,
} from '../types';

export class RuntimeDataSource<
  TParams extends Record<string, unknown> = Record<string, unknown>,
  TRequestResult = unknown,
  TResultData = unknown
> implements IRuntimeDataSource<TParams, TResultData> {
  private _status: RuntimeDataSourceStatus = RuntimeDataSourceStatus.Initial;
  private _data?: TResultData;
  private _error?: Error;
  private _latestOptions: DataSourceOptions<TParams>;

  constructor(
    private _id: string,
    private _type: string,
    private _initialOptions: DataSourceOptions<TParams>,
    private _requestHandler: RequestHandler<
      DataSourceOptions<TParams>,
      TRequestResult
    >,
    private _dataHandler:
      | ((
          data: TRequestResult | undefined,
          error: unknown | undefined,
        ) => TResultData | Promise<TResultData>)
      | undefined,
    private _onLoaded: (data: TResultData) => void,
  ) {
    this._latestOptions = _initialOptions;
  }

  public get status() {
    return this._status;
  }

  public get data() {
    return this._data;
  }

  public get error() {
    return this._error;
  }

  public async load(params?: TParams): Promise<TResultData> {
    try {
      this._latestOptions = {
        ...this._latestOptions,
        params: {
          ...this._latestOptions.params,
          ...params,
        } as TParams,
      };

      this._status = RuntimeDataSourceStatus.Loading;

      const data = await this._request(this._latestOptions);

      this._status = RuntimeDataSourceStatus.Loaded;

      this._onLoaded(data);

      this._data = data;
      return data;
    } catch (err) {
      this._error = err;
      this._status = RuntimeDataSourceStatus.Error;
      throw err;
    }
  }

  public setOptions(options: DataSourceOptions<TParams>) {
    this._latestOptions = options;
  }

  private async _request(options: DataSourceOptions<TParams>) {
    try {
      const reqResult = await this._requestHandler(options);

      const data = this._dataHandler
        ? await this._dataHandler(reqResult, undefined)
        : ((reqResult as unknown) as TResultData);

      return data;
    } catch (err) {
      if (this._dataHandler) {
        const data = await this._dataHandler(undefined, err);
        return data;
      }

      throw err;
    }
  }
}
