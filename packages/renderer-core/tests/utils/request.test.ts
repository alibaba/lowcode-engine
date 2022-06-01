// @ts-nocheck
const mockSerializeParams = jest.fn();
jest.mock('../../src/utils/common', () => {
    return {
      serializeParams: (params) => { 
        return mockSerializeParams(params);
      },
    };
  });


import { get, post, buildUrl, request, jsonp  } from '../../src/utils/request';

describe('test utils/request.ts ', () => {
  beforeEach(() => {
  })
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
 
});
