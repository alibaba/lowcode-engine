import '../../fixtures/window';
import PropTypes from 'prop-types';
import { LowcodeTypes, parseMetadata, parseProps } from '../../../src/builtin-simulator/utils/parse-metadata';
import { default as ReactPropTypesSecret } from 'prop-types/lib/ReactPropTypesSecret';

describe('parseMetadata', () => {
  it('parseMetadata', async () => {
    const md1 = parseMetadata('Div');
    const md2 = parseMetadata({ componentName: 'Div' });
  });
  it('LowcodeTypes.shape', async () => {
    const result = (window as any).PropTypes.shape()
    expect(result).toBeDefined();
  });
});

describe('LowcodeTypes basic type validators', () => {
  it('should validate string types', () => {
    const stringValidator = LowcodeTypes.string;
    // 对 stringValidator 进行测试
    const props = { testProp: 'This is a string' };
    const propName = 'testProp';
    const componentName = 'TestComponent';

    const result = stringValidator(props, propName, componentName, 'prop', null, ReactPropTypesSecret);
    expect(result).toBeNull(); // No error for valid string
  });

  it('should fail with a non-string type', () => {
    const stringValidator = LowcodeTypes.string;
    const props = { testProp: 42 };
    const propName = 'testProp';
    const componentName = 'TestComponent';

    const result = stringValidator(props, propName, componentName, 'prop', null, ReactPropTypesSecret);
    expect(result).toBeInstanceOf(Error); // Error for non-string type
    expect(result.message).toContain('Invalid prop `testProp` of type `number` supplied to `TestComponent`, expected `string`.');
  });

  it('should pass with a valid number', () => {
    const numberValidator = LowcodeTypes.number;
    const props = { testProp: 42 };
    const propName = 'testProp';
    const componentName = 'TestComponent';

    const result = numberValidator(props, propName, componentName, 'prop', null, ReactPropTypesSecret);
    expect(result).toBeNull(); // No error for valid number
  });

  it('should fail with a non-number type', () => {
    const numberValidator = LowcodeTypes.number;
    const props = { testProp: 'Not a number' };
    const propName = 'testProp';
    const componentName = 'TestComponent';

    const result = numberValidator(props, propName, componentName, 'prop', null, ReactPropTypesSecret);
    expect(result).toBeInstanceOf(Error); // Error for non-number type
    expect(result.message).toContain('Invalid prop `testProp` of type `string` supplied to `TestComponent`, expected `number`.');
  });
});

describe('Custom type constructors', () => {
  it('should create a custom type validator using define', () => {
    const customType = LowcodeTypes.define(PropTypes.string, 'customType');
    const props = { testProp: 'This is a string' };
    const propName = 'testProp';
    const componentName = 'TestComponent';

    // 测试有效值
    const validResult = customType(props, propName, componentName, 'prop', null, ReactPropTypesSecret);
    expect(validResult).toBeNull(); // No error for valid string

    // 测试无效值
    const invalidProps = { testProp: 42 };
    const invalidResult = customType(invalidProps, propName, componentName, 'prop', null, ReactPropTypesSecret);
    expect(invalidResult).toBeInstanceOf(Error); // Error for non-string type

    // 验证 lowcodeType 属性
    expect(customType.lowcodeType).toEqual('customType');

    // 验证 isRequired 属性
    const requiredResult = customType.isRequired(invalidProps, propName, componentName, 'prop', null, ReactPropTypesSecret);
    expect(requiredResult).toBeInstanceOf(Error); // Error for non-string type
  });
});


describe('Advanced type constructors', () => {
  describe('oneOf Type Validator', () => {
    const oneOfValidator = LowcodeTypes.oneOf(['red', 'green', 'blue']);
    const propName = 'color';
    const componentName = 'ColorPicker';

    it('should pass with a valid value', () => {
      const props = { color: 'red' };
      const result = oneOfValidator(props, propName, componentName, 'prop', null, ReactPropTypesSecret);
      expect(result).toBeNull(); // No error for valid value
    });

    it('should fail with an invalid value', () => {
      const props = { color: 'yellow' };
      const result = oneOfValidator(props, propName, componentName, 'prop', null, ReactPropTypesSecret);
      expect(result).toBeInstanceOf(Error); // Error for invalid value
      expect(result.message).toContain(`Invalid prop \`${propName}\` of value \`yellow\` supplied to \`${componentName}\`, expected one of ["red","green","blue"].`);
    });

    it('should fail with a non-existing value', () => {
      const props = { color: 'others' };
      const result = oneOfValidator(props, propName, componentName, 'prop', null, ReactPropTypesSecret);
      expect(result).toBeInstanceOf(Error); // Error for non-existing value
      expect(result.message).toContain(`Invalid prop \`${propName}\` of value \`others\` supplied to \`${componentName}\`, expected one of ["red","green","blue"].`);
    });
  });
});


describe('parseProps function', () => {
  it('should correctly parse propTypes and defaultProps', () => {
    const component = {
      propTypes: {
        name: LowcodeTypes.string,
        age: LowcodeTypes.number,
      },
      defaultProps: {
        name: 'John Doe',
        age: 30,
      },
    };
    const parsedProps = parseProps(component);

    // 测试结果长度
    expect(parsedProps.length).toBe(2);

    // 测试 name 属性
    const nameProp: any = parsedProps.find(prop => prop.name === 'name');
    expect(nameProp).toBeDefined();
    expect(nameProp.propType).toEqual('string');
    expect(nameProp.defaultValue).toEqual('John Doe');

    // 测试 age 属性
    const ageProp: any = parsedProps.find(prop => prop.name === 'age');
    expect(ageProp).toBeDefined();
    expect(ageProp.propType).toEqual('number');
    expect(ageProp.defaultValue).toEqual(30);
  });
});

describe('parseProps function', () => {
  it('should correctly parse propTypes and defaultProps', () => {
    const component = {
      propTypes: {
        name: LowcodeTypes.string,
        age: LowcodeTypes.number,
      },
      defaultProps: {
        name: 'John Doe',
        age: 30,
      },
    };
    const parsedProps = parseProps(component);

    // 测试结果长度
    expect(parsedProps.length).toBe(2);

    // 测试 name 属性
    const nameProp: any = parsedProps.find(prop => prop.name === 'name');
    expect(nameProp).toBeDefined();
    expect(nameProp.propType).toEqual('string');
    expect(nameProp.defaultValue).toEqual('John Doe');

    // 测试 age 属性
    const ageProp: any = parsedProps.find(prop => prop.name === 'age');
    expect(ageProp).toBeDefined();
    expect(ageProp.propType).toEqual('number');
    expect(ageProp.defaultValue).toEqual(30);
  });
});
