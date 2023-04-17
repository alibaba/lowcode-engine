// @ts-nocheck
import {
  isSchema,
  isFileSchema,
  inSameDomain,
  getFileCssName,
  isJSSlot,
  getValue,
  getI18n,
  transformArrayToMap,
  transformStringToFunction,
  isVariable,
  capitalizeFirstLetter,
  forEach,
  isString,
  serializeParams,
  parseExpression,
  parseThisRequiredExpression,
  parseI18n,
  parseData,
} from '../../src/utils/common';
import logger from '../../src/utils/logger';

describe('test isSchema', () => {
  it('should be false when empty value is passed', () => {
    expect(isSchema(null)).toBeFalsy();
    expect(isSchema(undefined)).toBeFalsy();
    expect(isSchema('')).toBeFalsy();
    expect(isSchema({})).toBeFalsy();
  });

  it('should be true when componentName is Leaf or Slot ', () => {
    expect(isSchema({ componentName: 'Leaf' })).toBeTruthy();
    expect(isSchema({ componentName: 'Slot' })).toBeTruthy();
  });

  it('should check each item of an array', () => {
    const validArraySchema = [
      { componentName: 'Button', props: {}},
      { componentName: 'Button', props: { type: 'JSExpression' }},
      { componentName: 'Leaf' },
      { componentName: 'Slot'},
    ];
    const invalidArraySchema = [
      ...validArraySchema,
      { componentName: 'ComponentWithoutProps'},
    ];
    expect(isSchema(validArraySchema)).toBeTruthy();
    expect(isSchema(invalidArraySchema)).toBeFalsy();
  });

  it('normal valid schema should contains componentName, and props of type object or JSExpression', () => {
    expect(isSchema({ componentName: 'Button', props: {}})).toBeTruthy();
    expect(isSchema({ componentName: 'Button', props: { type: 'JSExpression' }})).toBeTruthy();
    expect(isSchema({ xxxName: 'Button'})).toBeFalsy();
    expect(isSchema({ componentName: 'Button', props: null})).toBeFalsy();
    expect(isSchema({ componentName: 'Button', props: []})).toBeFalsy();
    expect(isSchema({ componentName: 'Button', props: 'props string'})).toBeFalsy();
  });
});

describe('test isFileSchema ', () => {
  it('should be false when invalid schema is passed', () => {
    expect(isFileSchema({ xxxName: 'Button'})).toBeFalsy();
    expect(isFileSchema({ componentName: 'Button', props: null})).toBeFalsy();
    expect(isFileSchema({ componentName: 'Button', props: []})).toBeFalsy();
    expect(isFileSchema({ componentName: 'Button', props: 'props string'})).toBeFalsy();
  });
  it('should be true only when schema with root named Page || Block || Component is passed', () => {
    expect(isFileSchema({ componentName: 'Page', props: {}})).toBeTruthy();
    expect(isFileSchema({ componentName: 'Block', props: {}})).toBeTruthy();
    expect(isFileSchema({ componentName: 'Component', props: {}})).toBeTruthy();
    expect(isFileSchema({ componentName: 'Button', props: {}})).toBeFalsy();
  });
});

describe('test inSameDomain ', () => {
  let windowSpy;

  beforeEach(() => {
    windowSpy = jest.spyOn(window, "window", "get");
  });

  afterEach(() => {
    windowSpy.mockRestore();
  });
  it('should work', () => {

    windowSpy.mockImplementation(() => ({
      parent: {
        location: {
          host: "example.com"
        },
      },
      location: {
        host: "example.com"
      }
    }));
    expect(inSameDomain()).toBeTruthy();

    windowSpy.mockImplementation(() => ({
      parent: {
        location: {
          host: "example.com"
        },
      },
      location: {
        host: "another.com"
      }
    }));
    expect(inSameDomain()).toBeFalsy();

    windowSpy.mockImplementation(() => ({
      parent: null,
      location: {
        host: "example.com"
      }
    }));

    expect(inSameDomain()).toBeFalsy();
  });
});


describe('test getFileCssName ', () => {
  it('should work', () => {
    expect(getFileCssName(null)).toBe(undefined);
    expect(getFileCssName(undefined)).toBe(undefined);
    expect(getFileCssName('')).toBe(undefined);
    expect(getFileCssName('FileName')).toBe('lce-file-name');
    expect(getFileCssName('Page1_abc')).toBe('lce-page1_abc');
  });
});


describe('test isJSSlot ', () => {
  it('should work', () => {
    expect(isJSSlot(null)).toBeFalsy();
    expect(isJSSlot(undefined)).toBeFalsy();
    expect(isJSSlot('stringValue')).toBeFalsy();
    expect(isJSSlot([1, 2, 3])).toBeFalsy();
    expect(isJSSlot({ type: 'JSSlot' })).toBeTruthy();
    expect(isJSSlot({ type: 'JSBlock' })).toBeTruthy();
    expect(isJSSlot({ type: 'anyOtherType' })).toBeFalsy();
  });
});

describe('test getValue ', () => {
  it('should check params', () => {
    expect(getValue(null, 'somePath')).toStrictEqual({});
    expect(getValue(undefined, 'somePath')).toStrictEqual({});
    // array is not valid input, return default
    expect(getValue([], 'somePath')).toStrictEqual({});
    expect(getValue([], 'somePath', 'aaa')).toStrictEqual('aaa');
    expect(getValue([1, 2, 3], 'somePath', 'aaa')).toStrictEqual('aaa');

    expect(getValue({}, 'somePath')).toStrictEqual({});
    expect(getValue({}, 'somePath', 'default')).toStrictEqual('default');
  });
  it('should work normally', () => {
    // single segment path
    expect(getValue({ a: 'aValue' }, 'a')).toStrictEqual('aValue');
    expect(getValue({ a: 'aValue', f:null }, 'f')).toBeNull();
    expect(getValue({ a: { b: 'bValue' } }, 'a.b')).toStrictEqual('bValue');
    expect(getValue({ a: { b: 'bValue', c: { d: 'dValue' } } }, 'a.c.d')).toStrictEqual('dValue');
    expect(getValue({ a: { b: 'bValue', c: { d: 'dValue' } } }, 'e')).toStrictEqual({});
  });
});

describe('test getI18n ', () => {
  it('should work', () => {
    const messages = {
      'zh-CN': {
        'key1': '啊啊啊',
        'key2': '哈哈哈',
      },
    };
    expect(getI18n('keyString', {}, 'zh-CN')).toStrictEqual('');
    expect(getI18n('keyString', {}, 'zh-CN', null)).toStrictEqual('');
    expect(getI18n('keyString', {}, 'en-US', messages)).toStrictEqual('');
    expect(getI18n('key3', {}, 'zh-CN', messages)).toStrictEqual('');
  });
});


describe('test transformArrayToMap ', () => {
  it('should work', () => {
    expect(transformArrayToMap([])).toStrictEqual({});
    expect(transformArrayToMap('not a array')).toStrictEqual({});
    expect(transformArrayToMap({'not Array': 1})).toStrictEqual({});

    let mockArray = [
      {
        name: 'jack', 
        age: 2,
      },
      {
        name: 'jack', 
        age: 20,
      }
    ];
    // test override
    expect(transformArrayToMap(mockArray, 'name', true).jack.age).toBe(20);
    expect(transformArrayToMap(mockArray, 'name').jack.age).toBe(20);
    expect(transformArrayToMap(mockArray, 'name', false).jack.age).toBe(2);

    mockArray = [
      {
        name: 'jack', 
        age: 2,
      },
      {
        name: 'rose', 
        age: 20,
      }
    ];
    // normal case
    expect(transformArrayToMap(mockArray, 'name').jack.age).toBe(2);
    expect(transformArrayToMap(mockArray, 'name').jack.name).toBe('jack');
    expect(transformArrayToMap(mockArray, 'name').rose.age).toBe(20);
    // key not exists
    expect(transformArrayToMap(mockArray, 'nameEn')).toStrictEqual({});
  });
});



describe('test transformStringToFunction ', () => {
  it('should work', () => {
    const mockFun = jest.fn();
    expect(transformStringToFunction(mockFun)).toBe(mockFun);
    expect(transformStringToFunction(111)).toBe(111);

    let mockFnStr = 'function(){return 111;}';
    let fn = transformStringToFunction(mockFnStr);
    expect(fn()).toBe(111);

    mockFnStr = '() => { return 222; }';
    fn = transformStringToFunction(mockFnStr);
    expect(fn()).toBe(222);

    mockFnStr = 'function getValue() { return 333; }';
    fn = transformStringToFunction(mockFnStr);
    expect(fn()).toBe(333);

    mockFnStr = 'function getValue(aaa) {\
       return aaa; \
    }';
    fn = transformStringToFunction(mockFnStr);
    expect(fn(123)).toBe(123);
  });
});


describe('test isVariable ', () => {
  it('should work', () => {
    expect(isVariable(null)).toBeFalsy();
    expect(isVariable(undefined)).toBeFalsy();
    expect(isVariable([1, 2, 3])).toBeFalsy();
    expect(isVariable({})).toBeFalsy();
    expect(isVariable({ type: 'any other type' })).toBeFalsy();
    expect(isVariable({ type: 'variable' })).toBeTruthy();
  });
});

describe('test capitalizeFirstLetter ', () => {
  it('should work', () => {
    expect(capitalizeFirstLetter(null)).toBeNull();
    expect(capitalizeFirstLetter()).toBeUndefined();
    expect(capitalizeFirstLetter([1, 2, 3])).toStrictEqual([1, 2, 3]);
    expect(capitalizeFirstLetter({ a: 1 })).toStrictEqual({ a: 1 });
    expect(capitalizeFirstLetter('')).toStrictEqual('');
    expect(capitalizeFirstLetter('a')).toStrictEqual('A');
    expect(capitalizeFirstLetter('abcd')).toStrictEqual('Abcd');
  });
});

describe('test forEach ', () => {
  it('should work', () => {
    const mockFn = jest.fn();
    
    forEach(null, mockFn);
    expect(mockFn).toBeCalledTimes(0);

    forEach(undefined, mockFn);
    expect(mockFn).toBeCalledTimes(0);

    forEach([1, 2, 3], mockFn);
    expect(mockFn).toBeCalledTimes(0);

    forEach('stringValue', mockFn);
    expect(mockFn).toBeCalledTimes(0);

    forEach({ a: 1, b: 2, c: 3 }, mockFn);
    expect(mockFn).toBeCalledTimes(3);
    
    const mockFn2 = jest.fn();
    forEach({ a: 1 }, mockFn2, { b: 'bbb' });
    expect(mockFn2).toHaveBeenCalledWith(1, 'a');

    let sum = 0;
    const mockFn3 = function(value, key) { sum = value + this.b;  };
    forEach({ a: 1 }, mockFn3, { b: 10 });
    expect(sum).toEqual(11);
  });
});

describe('test isString ', () => {
  it('should work', () => {
    expect(isString(123)).toBeFalsy();
    expect(isString([])).toBeFalsy();
    expect(isString({})).toBeFalsy();
    expect(isString(null)).toBeFalsy();
    expect(isString(undefined)).toBeFalsy();
    expect(isString(true)).toBeFalsy();
    expect(isString('111')).toBeTruthy();
    expect(isString(new String('111'))).toBeTruthy();
  });
});

describe('test serializeParams ', () => {
  it('should work', () => {
    const mockParams = { a: 1, b: 2, c: 'cvalue', d:[1, 'a', {}], e: {e1: 'value1', e2: 'value2'}};
    const result = serializeParams(mockParams);
    const decodedParams = decodeURIComponent(result);
    expect(result).toBe('a=1&b=2&c=cvalue&d=%5B1%2C%22a%22%2C%7B%7D%5D&e=%7B%22e1%22%3A%22value1%22%2C%22e2%22%3A%22value2%22%7D');
    expect(decodedParams).toBe('a=1&b=2&c=cvalue&d=[1,"a",{}]&e={"e1":"value1","e2":"value2"}');
  });
});

describe('test parseExpression ', () => {
  it('can handle JSExpression', () => {
    const mockExpression = {
      "type": "JSExpression",
      "value": "function (params) { return this.scopeValue + params.param1 + 5;}"
    };
    const result = parseExpression(mockExpression, { scopeValue: 1 });
    expect(result({ param1: 2 })).toBe((1 + 2 + 5));
  });

  it('[success] JSExpression handle without this use scopeValue', () => {
    const mockExpression = {
      "type": "JSExpression",
      "value": "state"
    };
    const result = parseExpression(mockExpression, { state: 1 });
    expect(result).toBe((1));
  });

  it('[success] JSExpression handle without this use scopeValue', () => {
    const mockExpression = {
      "type": "JSExpression",
      "value": "this.state"
    };
    const result = parseExpression(mockExpression, { state: 1 });
    expect(result).toBe((1));
  });
});

describe('test parseThisRequiredExpression', () => {
  it('can handle JSExpression', () => {
    const mockExpression = {
      "type": "JSExpression",
      "value": "function (params) { return this.scopeValue + params.param1 + 5;}"
    };
    const result = parseThisRequiredExpression(mockExpression, { scopeValue: 1 });
    expect(result({ param1: 2 })).toBe((1 + 2 + 5));
  });

  it('[error] JSExpression handle without this use scopeValue', () => {
    const mockExpression = {
      "type": "JSExpression",
      "value": "state.text"
    };
    const fn = logger.error = jest.fn();
    parseThisRequiredExpression(mockExpression, { state: { text: 'text' } });
    expect(fn).toBeCalledWith(' parseExpression.error', new ReferenceError('state is not defined'), {"type": "JSExpression", "value": "state.text"}, {"state": {"text": "text"}});
  });

  it('[success] JSExpression handle without this use scopeValue', () => {
    const mockExpression = {
      "type": "JSExpression",
      "value": "this.state"
    };
    const result = parseThisRequiredExpression(mockExpression, { state: 1 });
    expect(result).toBe((1));
  });
})

describe('test parseI18n ', () => {
  it('can handle normal parseI18n', () => {
    const mockI18n = {
      "type": "i18n",
      "key": "keyA"
    };
    const mockI18nFun = (key) => { return 'hahaha' + key;};
    const result = parseI18n(mockI18n, { i18n: mockI18nFun });
    expect(result).toBe('hahahakeyA');
  });
});

describe('test parseData ', () => {
  it('should work when isJSExpression === true', () => {
    const mockExpression = {
      "type": "JSExpression",
      "value": "function (params) { return this.scopeValue + params.param1 + 5;}"
    };
    const result = parseData(mockExpression, { scopeValue: 1 });
    expect(result({ param1: 2 })).toBe((1 + 2 + 5));
  });
  it('should work when isI18nData === true', () => {
    const mockI18n = {
      "type": "i18n",
      "key": "keyA"
    };
    const mockI18nFun = (key) => { return 'hahaha' + key;};
    const result = parseData(mockI18n, { i18n: mockI18nFun });
    expect(result).toBe('hahahakeyA');
  });
  it('should work when schema is string', () => {
    expect(parseData(' this is a normal string, will be trimmed only ')).toStrictEqual('this is a normal string, will be trimmed only');
  });

  it('should work when schema is array', () => {
    const mockData = [
      {
        "type": "i18n",
        "key": "keyA"
      },
      ' this is a normal string, will be trimmed only ',
    ];

    const mockI18nFun = (key) => { return 'hahaha' + key;};
    const result = parseData(mockData, { i18n: mockI18nFun });

    expect(result[0]).toStrictEqual('hahahakeyA');
    expect(result[1]).toStrictEqual('this is a normal string, will be trimmed only');
  });
  it('should work when schema is function', () => {
    const mockFn = function() { return this.a; };
    const result = parseData(mockFn, { a: 111 });
    expect(result()).toBe(111);
  });
  it('should work when schema is null or undefined', () => {
    expect(parseData(null)).toBe(null);
    expect(parseData(undefined)).toBe(undefined);
  });
  it('should work when schema is normal object', () => {
    expect(parseData({})).toStrictEqual({});
    const mockI18nFun = (key) => { return 'hahaha' + key;};
    const result = parseData({
      key1: {
        "type": "i18n",
        "key": "keyA"
      },
      key2: ' this is a normal string, will be trimmed only ',
      __privateKey: 'any value',
    }, { i18n: mockI18nFun });
    expect(result.key1).toStrictEqual('hahahakeyA');
    expect(result.key2).toStrictEqual('this is a normal string, will be trimmed only');
    expect(result.__privateKey).toBeUndefined();

  });
});