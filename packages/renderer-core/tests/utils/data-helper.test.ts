// @ts-nocheck
const mockJsonp = jest.fn();
const mockRequest = jest.fn();
const mockGet = jest.fn();
const mockPost = jest.fn();
jest.mock('../../src/utils/request', () => {
    return {
      jsonp: (uri, params, headers, otherProps) => { 
        return new Promise((resolve, reject) => {
          resolve(mockJsonp(uri, params, headers, otherProps));
        });
      },
      request: (uri, params, headers, otherProps) => { 
        return new Promise((resolve, reject) => {
          resolve(mockRequest(uri, params, headers, otherProps));
        });
      },
      get: (uri, params, headers, otherProps) => { 
        return new Promise((resolve, reject) => {
          resolve(mockGet(uri, params, headers, otherProps));
        });
      },
      post: (uri, params, headers, otherProps) => { 
        return new Promise((resolve, reject) => {
          resolve(mockPost(uri, params, headers, otherProps));
        });
      },
    };
  });

import { DataHelper, doRequest } from '../../src/utils/data-helper';
import { parseData } from '../../src/utils/common';

describe('test DataHelper ', () => {
  beforeEach(() => {
    jest.resetModules();
  })
  it('can be inited', () => {
    const mockHost = {};
    let mockDataSourceConfig = {};
    const mockAppHelper = {};
    const mockParser = (config: any) => parseData(config);
    let dataHelper = new DataHelper(mockHost, mockDataSourceConfig, mockAppHelper, mockParser);

    expect(dataHelper).toBeTruthy();
    expect(dataHelper.host).toBe(mockHost);
    expect(dataHelper.config).toBe(mockDataSourceConfig);
    expect(dataHelper.appHelper).toBe(mockAppHelper);
    expect(dataHelper.parser).toBe(mockParser);


    dataHelper = new DataHelper(mockHost, undefined, mockAppHelper, mockParser);
    expect(dataHelper.config).toStrictEqual({});
    expect(dataHelper.ajaxList).toStrictEqual([]);

    mockDataSourceConfig = { 
      list: [ 
        {
          id: 'ds1',
        }, {
          id: 'ds2',
        },
      ]
    };
    dataHelper = new DataHelper(mockHost, mockDataSourceConfig, mockAppHelper, mockParser);
    expect(dataHelper.config).toBe(mockDataSourceConfig);
    expect(dataHelper.ajaxList.length).toBe(2);
    expect(dataHelper.ajaxMap.ds1).toStrictEqual({
      id: 'ds1',
    });
  });
  it('should handle generateDataSourceMap properly in constructor', () => {
    const mockHost = {};
    let mockDataSourceConfig = {};
    const mockAppHelper = {};
    const mockParser = (config: any) => parseData(config);
    let dataHelper = new DataHelper(mockHost, mockDataSourceConfig, mockAppHelper, mockParser);

    // test generateDataSourceMap logic
    mockDataSourceConfig = { 
      list: [ 
        {
          id: 'getInfo',
          isInit: true,
          type: 'fetch',  // fetch/mtop/jsonp/custom
          options: {
            uri: 'mock/info.json',
            method: 'GET',
            params: { a: 1 },
            timeout: 5000,
          },
        }, {
          id: 'postInfo',
          isInit: true,
          type: 'fetch',
          options: {
            uri: 'mock/info.json',
            method: 'POST',
            params: { a: 1 },
            timeout: 5000,
          },
        },
      ]
    };
    dataHelper = new DataHelper(mockHost, mockDataSourceConfig, mockAppHelper, mockParser);
    expect(Object.keys(dataHelper.dataSourceMap).length).toBe(2);
    expect(dataHelper.dataSourceMap.getInfo.status).toBe('init');
    expect(typeof dataHelper.dataSourceMap.getInfo.load).toBe('function');
  });

  it('getInitDataSourseConfigs should work', () => {
    const mockHost = {};
    let mockDataSourceConfig = {};
    const mockAppHelper = {};
    const mockParser = (config: any) => parseData(config);

    // test generateDataSourceMap logic
    mockDataSourceConfig = { 
      list: [ 
        {
          id: 'getInfo',
          isInit: true,
          type: 'fetch',  // fetch/mtop/jsonp/custom
          options: {
            uri: 'mock/info.json',
            method: 'GET',
            params: { a: 1 },
            timeout: 5000,
          },
        }, 
        {
          id: 'postInfo',
          isInit: false,
          type: 'fetch',
          options: {
            uri: 'mock/info.json',
            method: 'POST',
            params: { a: 1 },
            timeout: 5000,
          },
        }, 
        {
          id: 'getInfoLater',
          isInit: false,
          type: 'fetch',
          options: {
            uri: 'mock/info.json',
            method: 'POST',
            params: { a: 1 },
            timeout: 5000,
          },
        },
        {
          id: 'getInfoLater2',
          isInit: 'not a valid boolean',
          type: 'fetch',
          options: {
            uri: 'mock/info.json',
            method: 'POST',
            params: { a: 1 },
            timeout: 5000,
          },
        },
      ],
    };

    const dataHelper = new DataHelper(mockHost, mockDataSourceConfig, mockAppHelper, mockParser);
    expect(dataHelper.getInitDataSourseConfigs().length).toBe(1);
    expect(dataHelper.getInitDataSourseConfigs()[0].id).toBe('getInfo');
  });
  it('util function doRequest should work', () => {
    doRequest('jsonp', {
      uri: 'https://www.baidu.com',
      params: { a: 1 },
      otherStuff1: 'aaa',
    });
    expect(mockJsonp).toBeCalled();

    // test GET
    doRequest('fetch', {
      uri: 'https://www.baidu.com',
      method: 'get',
      params: { a: 1 },
      otherStuff1: 'aaa',
    });
    expect(mockGet).toBeCalled();

    mockGet.mockClear();
    doRequest('fetch', {
      uri: 'https://www.baidu.com',
      method: 'Get',
      params: { a: 1 },
      otherStuff1: 'aaa',
    });
    expect(mockGet).toBeCalled();

    mockGet.mockClear();
    doRequest('fetch', {
      uri: 'https://www.baidu.com',
      method: 'GET',
      params: { a: 1 },
      otherStuff1: 'aaa',
    });
    expect(mockGet).toBeCalled();

    mockGet.mockClear();

    // test POST
    doRequest('fetch', {
      uri: 'https://www.baidu.com',
      method: 'post',
      params: { a: 1 },
      otherStuff1: 'aaa',
    });
    expect(mockPost).toBeCalled();
    mockPost.mockClear();

    doRequest('fetch', {
      uri: 'https://www.baidu.com',
      method: 'POST',
      params: { a: 1 },
      otherStuff1: 'aaa',
    });
    expect(mockPost).toBeCalled();
    mockPost.mockClear();
    doRequest('fetch', {
      uri: 'https://www.baidu.com',
      method: 'Post',
      params: { a: 1 },
      otherStuff1: 'aaa',
    });
    expect(mockPost).toBeCalled();
    mockPost.mockClear();

    // test default
    doRequest('fetch', {
      uri: 'https://www.baidu.com',
      method: 'whatever',
      params: { a: 1 },
      otherStuff1: 'aaa',
    });
    expect(mockRequest).toBeCalled();
    mockRequest.mockClear();
    mockGet.mockClear();
    
    // method will be GET when not provided
    doRequest('fetch', {
      uri: 'https://www.baidu.com',
      params: { a: 1 },
      otherStuff1: 'aaa',
    });
    expect(mockRequest).toBeCalledTimes(0);
    expect(mockGet).toBeCalledTimes(1);

    mockRequest.mockClear();
    mockGet.mockClear();
    mockPost.mockClear();
    mockJsonp.mockClear();

    doRequest('someOtherType', {
      uri: 'https://www.baidu.com',
      params: { a: 1 },
      otherStuff1: 'aaa',
    });
    expect(mockRequest).toBeCalledTimes(0);
    expect(mockGet).toBeCalledTimes(0);
    expect(mockPost).toBeCalledTimes(0);
    expect(mockJsonp).toBeCalledTimes(0);
  });
  it('updateDataSourceMap should work', () => {
    const mockHost = {};
    const mockDataSourceConfig = { 
      list: [ 
        {
          id: 'ds1',
        }, {
          id: 'ds2',
        },
      ]
    };
    const mockAppHelper = {};
    const mockParser = (config: any) => parseData(config);
    const dataHelper = new DataHelper(mockHost, mockDataSourceConfig, mockAppHelper, mockParser);
    dataHelper.updateDataSourceMap('ds1', { a: 1 }, null);
    expect(dataHelper.dataSourceMap['ds1']).toBeTruthy();
    expect(dataHelper.dataSourceMap['ds1'].data).toStrictEqual({ a: 1 });
    expect(dataHelper.dataSourceMap['ds1'].error).toBeUndefined();
    expect(dataHelper.dataSourceMap['ds1'].status).toBe('loaded');
    dataHelper.updateDataSourceMap('ds2', { b: 2 }, new Error());
    expect(dataHelper.dataSourceMap['ds2']).toBeTruthy();
    expect(dataHelper.dataSourceMap['ds2'].data).toStrictEqual({ b: 2 });
    expect(dataHelper.dataSourceMap['ds2'].status).toBe('error');
    expect(dataHelper.dataSourceMap['ds2'].error).toBeTruthy();
  });

  it('handleData should work', () => {
    const mockHost = { stateA: 'aValue'};
    const mockDataSourceConfig = { 
      list: [
        {
          id: 'fullConfigGet',
          isInit: true,
          options: {
            params: {},
            method: 'GET',
            isCors: true,
            timeout: 5000,
            headers: {},
            uri: 'mock/info.json',
          },
          shouldFetch: {
            type: 'JSFunction',
            value: 'function() { return true; }',
          },
          dataHandler: {
            type: 'JSFunction',
            value: 'function(res) { return res.data; }',
          },
          errorHandler: {
            type: 'JSFunction',
            value: 'function(error) {}',
          },
          willFetch: {
            type: 'JSFunction',
            value: 'function(options) { return options; }',
          },
        },
      ]
    };
    const mockAppHelper = {};
    const mockParser = (config: any) => parseData(config);
    const dataHelper = new DataHelper(mockHost, mockDataSourceConfig, mockAppHelper, mockParser);
    // test valid case
    let mockDataHandler = {
      type: 'JSFunction',
      value: 'function(res) { return res.data + \'+\' + this.stateA; }',
    };
    let result = dataHelper.handleData('fullConfigGet', mockDataHandler, { data: 'mockDataValue' }, null);
    expect(result).toBe('mockDataValue+aValue');

    // test invalid datahandler
    mockDataHandler = {
      type: 'not a JSFunction',
      value: 'function(res) { return res.data + \'+\' + this.stateA; }',
    };
    result = dataHelper.handleData('fullConfigGet', mockDataHandler, { data: 'mockDataValue' }, null);
    expect(result).toStrictEqual({ data: 'mockDataValue' });

    // exception with id
    mockDataHandler = {
      type: 'JSFunction',
      value: 'function(res) { return res.data + \'+\' + JSON.parse({a:1}); }',
    };
    result = dataHelper.handleData('fullConfigGet', mockDataHandler, { data: 'mockDataValue' }, null);
    expect(result).toBeUndefined();

    // exception without id
    mockDataHandler = {
      type: 'JSFunction',
      value: 'function(res) { return res.data + \'+\' + JSON.parse({a:1}); }',
    };
    result = dataHelper.handleData(null, mockDataHandler, { data: 'mockDataValue' }, null);
    expect(result).toBeUndefined();
  });

  it('updateConfig should work', () => {
    const mockHost = { stateA: 'aValue'};
    const mockDataSourceConfig = { 
      list: [
        {
          id: 'ds1',
        }, {
          id: 'ds2',
        },
        {
          id: 'fullConfigGet',
          isInit: true,
          options: {
            params: {},
            method: 'GET',
            isCors: true,
            timeout: 5000,
            headers: {},
            uri: 'mock/info.json',
          },
          shouldFetch: {
            type: 'JSFunction',
            value: 'function() { return true; }',
          },
          dataHandler: {
            type: 'JSFunction',
            value: 'function(res) { return res.data; }',
          },
          errorHandler: {
            type: 'JSFunction',
            value: 'function(error) {}',
          },
          willFetch: {
            type: 'JSFunction',
            value: 'function(options) { return options; }',
          },
        },
      ]
    };
    const mockAppHelper = {};
    const mockParser = (config: any) => parseData(config);
    const dataHelper = new DataHelper(mockHost, mockDataSourceConfig, mockAppHelper, mockParser);

    expect(dataHelper.ajaxList.length).toBe(3);

    let updatedConfig = { 
      list: [
        {
          id: 'ds2',
        },
        {
          id: 'fullConfigGet',
        },
      ]
    };
    dataHelper.updateConfig(updatedConfig);

    expect(dataHelper.ajaxList.length).toBe(2);
    expect(dataHelper.dataSourceMap.ds1).toBeUndefined();

    updatedConfig = { 
      list: [
        {
          id: 'ds2',
        },
        {
          id: 'fullConfigGet',
        },
        {
          id: 'ds3',
        },
      ]
    };
    dataHelper.updateConfig(updatedConfig);
    expect(dataHelper.ajaxList.length).toBe(3);
    expect(dataHelper.dataSourceMap.ds3).toBeTruthy();
  });

  it('getInitData should work', () => {
    const mockHost = { stateA: 'aValue'};
    const mockDataSourceConfig = { 
      list: [
        {
          id: 'ds1',
        }, {
          id: 'ds2',
        },
        {
          id: 'fullConfigGet',
          isInit: true,
          type: 'fetch',
          options: {
            params: {},
            method: 'GET',
            isCors: true,
            timeout: 5000,
            headers: {
              headerA: 1,
            },
            uri: 'mock/info.json',
          },
          shouldFetch: {
            type: 'JSFunction',
            value: 'function() { return true; }',
          },
          dataHandler: {
            type: 'JSFunction',
            value: 'function(res) { return 123; }',
          },
          errorHandler: {
            type: 'JSFunction',
            value: 'function(error) {}',
          },
          willFetch: {
            type: 'JSFunction',
            value: 'function(options) { return options; }',
          },
        },
      ]
    };
    const mockAppHelper = {};
    const mockParser = (config: any) => parseData(config);
    const dataHelper = new DataHelper(mockHost, mockDataSourceConfig, mockAppHelper, mockParser);

    expect(dataHelper.ajaxList.length).toBe(3);
    expect(mockGet).toBeCalledTimes(0);
    dataHelper.getInitData().then(res => {
      expect(mockGet).toBeCalledTimes(1);
      expect(mockGet).toBeCalledWith('mock/info.json', {}, {
        headerA: 1,
      }, expect.anything());
      mockGet.mockClear();
    });
  });

  it('getDataSource should work', () => {
    const mockHost = { stateA: 'aValue'};
    const mockDataSourceConfig = { 
      list: [
        {
          id: 'ds1',
        }, {
          id: 'ds2',
        },
        {
          id: 'fullConfigGet',
          isInit: true,
          type: 'fetch',
          options: {
            params: {},
            method: 'GET',
            isCors: true,
            timeout: 5000,
            headers: {
              headerA: 1,
            },
            uri: 'mock/info.json',
          },
          shouldFetch: {
            type: 'JSFunction',
            value: 'function() { return true; }',
          },
          dataHandler: {
            type: 'JSFunction',
            value: 'function(res) { return 123; }',
          },
          errorHandler: {
            type: 'JSFunction',
            value: 'function(error) {}',
          },
          willFetch: {
            type: 'JSFunction',
            value: 'function(options) { return options; }',
          },
        },
      ]
    };
    const mockAppHelper = {};
    const mockParser = (config: any) => parseData(config);
    const dataHelper = new DataHelper(mockHost, mockDataSourceConfig, mockAppHelper, mockParser);

    expect(dataHelper.ajaxList.length).toBe(3);
    expect(mockGet).toBeCalledTimes(0);
    const callbackFn = jest.fn();
    dataHelper.getDataSource('fullConfigGet', { param1: 'value1' }, {}, callbackFn).then(res => {
      expect(mockGet).toBeCalledTimes(1);
      expect(mockGet).toBeCalledWith('mock/info.json', { param1: 'value1' }, {
        headerA: 1,
      }, expect.anything());
      mockGet.mockClear();
      expect(callbackFn).toBeCalledTimes(1);
    });
  });
});
