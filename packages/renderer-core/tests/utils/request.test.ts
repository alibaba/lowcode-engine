// @ts-nocheck
const mockSerializeParams = jest.fn();
jest.mock('../../src/utils/common', () => {
    return {
      serializeParams: (params) => { 
        return mockSerializeParams(params);
      },
    };
  });
const mockFetchJsonp = jest.fn();
jest.mock('fetch-jsonp', () => {
  return (uri, otherProps) => { 
    mockFetchJsonp(uri, otherProps);
    return Promise.resolve({ 
      json: () => { 
        return Promise.resolve({ data: [1, 2, 3]});
      } ,
      ok: true,
    });
  }
});

import { get, post, buildUrl, request, jsonp  } from '../../src/utils/request';


describe('test utils/request.ts ', () => {

  it('buildUrl should be working properly', () => {
    mockSerializeParams.mockImplementation((params) => {
      return 'serializedParams=serializedParams';
    });
    expect(buildUrl('mockDataApi', { a: 1, b: 'a', c: []})).toBe('mockDataApi?serializedParams=serializedParams');
    expect(buildUrl('mockDataApi?existingParamA=valueA', { a: 1, b: 'a', c: []})).toBe('mockDataApi?existingParamA=valueA&serializedParams=serializedParams');
    mockSerializeParams.mockClear();

    mockSerializeParams.mockImplementation((params) => {
      return undefined;
    });
    expect(buildUrl('mockDataApi', { a: 1, b: 'a', c: []})).toBe('mockDataApi');
    mockSerializeParams.mockClear();
  });
 
  it('request should be working properly', () => {
    const fetchMock = jest
      .spyOn(global, 'fetch')
      .mockImplementation(() =>
        Promise.resolve({ 
          json: () => Promise.resolve([]) ,
          status: 200,
        })
      );

    request('https://someradomurl/api/list', 'GET', {}, {}, {}).then((response) => {
      expect(fetchMock).toBeCalledWith('https://someradomurl/api/list', { body: {}, credentials: 'include', headers: {}, method: 'GET'});
    }).catch((error) => {
      console.error(error);
    });

  });

  it('get should be working properly', () => {
    const fetchMock = jest
      .spyOn(global, 'fetch')
      .mockImplementation(() =>
        Promise.resolve({ 
          json: () => Promise.resolve([]) ,
          status: 200,
        })
      );

    get('https://someradomurl/api/list', {}, {}, {}).then((response) => {
      expect(fetchMock).toBeCalledWith(
        'https://someradomurl/api/list', 
        { 
          body: null, 
          headers: { Accept: 'application/json' }, 
          method: 'GET', 
          credentials: 'include',
        });
    }).catch((error) => {
      console.error(error);
    });

  });

  it('post should be working properly', () => {
    const fetchMock = jest
      .spyOn(global, 'fetch')
      .mockImplementation(() =>
        Promise.resolve({ 
          json: () => Promise.resolve([]) ,
          status: 200,
        })
      );
    
    post('https://someradomurl/api/list', { a: 1, b: 'a', c: [] }, { 'Content-Type': 'application/json' }, {}).then((response) => {
      expect(fetchMock).toBeCalledWith(
        'https://someradomurl/api/list', 
        {
          body: '{"a":1,"b":"a","c":[]}', 
          headers: { 
            Accept: 'application/json',
            'Content-Type': 'application/json',
          }, 
          method: 'POST', 
          credentials: 'include',
        });
    }).catch((error) => {
      console.error(error);
    });


    post('https://someradomurl/api/list', [ 1, 2, 3, 4 ], {}, {}).then((response) => {
      expect(fetchMock).toBeCalledWith(
        'https://someradomurl/api/list', 
        {
          body: '[1,2,3,4]', 
          headers: { 
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
          }, 
          method: 'POST', 
          credentials: 'include',
        });
    }).catch((error) => {
      console.error(error);
    });

    mockSerializeParams.mockImplementation((params) => {
      return 'serializedParams=serializedParams';
    });
    post('https://someradomurl/api/list', { a: 1, b: 'a', c: [] }, {}, {}).then((response) => {
      expect(fetchMock).toBeCalledWith(
        'https://someradomurl/api/list', 
        {
          body: 'serializedParams=serializedParams', 
          headers: { 
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
          }, 
          method: 'POST', 
          credentials: 'include',
        });
      mockSerializeParams.mockClear();
    }).catch((error) => {
      console.error(error);
    });

  });
  it('jsonp should be working properly', () => {
    mockSerializeParams.mockImplementation((params) => {
      return 'params';
    });
    jsonp('https://someradomurl/api/list', {}, { otherParam1: '123'}).catch(() => {
      expect(mockFetchJsonp).toBeCalledWith('https://someradomurl/api/list?params', { timeout: 5000,  otherParam1: '123' });
      mockSerializeParams.mockClear();
    });
  });
});
