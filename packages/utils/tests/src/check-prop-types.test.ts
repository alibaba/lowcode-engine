import { checkPropTypes, transformPropTypesRuleToString } from '../../src/check-prop-types';
import PropTypes from 'prop-types';

describe('checkPropTypes', () => {
  it('should validate correctly with valid prop type', () => {
    expect(checkPropTypes(123, 'age', PropTypes.number, 'TestComponent')).toBe(true);
    expect(checkPropTypes('123', 'age', PropTypes.string, 'TestComponent')).toBe(true);
  });

  it('should log a warning and return false with invalid prop type', () => {
    expect(checkPropTypes(123, 'age', PropTypes.string, 'TestComponent')).toBe(false);
    expect(checkPropTypes('123', 'age', PropTypes.number, 'TestComponent')).toBe(false);
  });

  it('should validate correctly with valid object prop type', () => {
    expect(checkPropTypes({ a: 123 }, 'age', PropTypes.object, 'TestComponent')).toBe(true);
    expect(checkPropTypes({ a: '123' }, 'age', PropTypes.object, 'TestComponent')).toBe(true);
  });

  it('should validate correctly with valid object string prop type', () => {
    expect(checkPropTypes({ a: 123 }, 'age', 'object', 'TestComponent')).toBe(true);
    expect(checkPropTypes({ a: '123' }, 'age', 'object', 'TestComponent')).toBe(true);
  });

  it('should validate correctly with valid isRequired prop type', () => {
    const rule = {
      type: 'string',
      isRequired: true,
    };
    expect(transformPropTypesRuleToString(rule)).toBe('PropTypes.string.isRequired');
    expect(checkPropTypes('News', 'type', rule, 'TestComponent')).toBe(true);
    expect(checkPropTypes(undefined, 'type', rule, 'TestComponent')).toBe(false);
  });

  it('should handle custom rule functions correctly', () => {
    const customRule = (props, propName) => {
      if (props[propName] !== 123) {
        return new Error('Invalid value');
      }
    };
    const result = checkPropTypes(123, 'customProp', customRule, 'TestComponent');
    expect(result).toBe(true);
  });


  it('should interpret and validate a rule given as a string', () => {
    const result = checkPropTypes(123, 'age', 'PropTypes.number', 'TestComponent');
    expect(result).toBe(true);
  });

  it('should interpret and validate a rule given as a string', () => {
    expect(checkPropTypes(123, 'age', 'number', 'TestComponent')).toBe(true);
    expect(checkPropTypes('123', 'age', 'string', 'TestComponent')).toBe(true);
  });

  it('should log a warning for invalid rule type', () => {
    const result = checkPropTypes(123, 'age', 123, 'TestComponent');
    expect(result).toBe(true);
  });

  // oneOf
  it('should validate correctly with valid oneOf prop type', () => {
    const rule = {
      type: 'oneOf',
      value: ['News', 'Photos'],
    }
    expect(transformPropTypesRuleToString(rule)).toBe(`PropTypes.oneOf(["News","Photos"])`);
    expect(checkPropTypes('News', 'type', rule, 'TestComponent')).toBe(true);
    expect(checkPropTypes('Others', 'type', rule, 'TestComponent')).toBe(false);
  });

  // oneOfType
  it('should validate correctly with valid oneOfType prop type', () => {
    const rule = {
      type: 'oneOfType',
      value: ['string', 'number', {
        type: 'array',
        isRequired: true,
      }],
    };
    expect(transformPropTypesRuleToString(rule)).toBe('PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array.isRequired])');
    expect(checkPropTypes(['News', 'Photos'], 'type', rule, 'TestComponent')).toBe(true);
    expect(checkPropTypes('News', 'type', rule, 'TestComponent')).toBe(true);
    expect(checkPropTypes(123, 'type', rule, 'TestComponent')).toBe(true);
    expect(checkPropTypes({}, 'type', rule, 'TestComponent')).toBe(false);
  });

  it('should validate correctly with valid oneOfType prop type', () => {
    const rule = {
      type: 'oneOfType',
      value: [
        'bool',
        {
          type: 'shape',
          value: [
            {
              name: 'type',
              propType: {
                type: 'oneOf',
                value: ['JSExpression'],
              }
            },
            {
              name: 'value',
              propType: 'string',
            },
          ],
        },
      ],
    };
    expect(transformPropTypesRuleToString(rule)).toBe('PropTypes.oneOfType([PropTypes.bool, PropTypes.shape({type: PropTypes.oneOf(["JSExpression"]),value: PropTypes.string})])');
    expect(checkPropTypes(true, 'type', rule, 'TestComponent')).toBe(true);
    expect(checkPropTypes({ type: 'JSExpression', value: '1 + 1 === 2' }, 'type', rule, 'TestComponent')).toBe(true);
    expect(checkPropTypes({ type: 'JSExpression' }, 'type', rule, 'TestComponent')).toBe(true);
    expect(checkPropTypes({ type: 'JSExpression', value: 123 }, 'type', rule, 'TestComponent')).toBe(false);
  });

  it('should log a warning for invalid type', () => {
    const rule = {
      type: 'inval',
      value: ['News', 'Photos'],
    }
    expect(transformPropTypesRuleToString(rule)).toBe('PropTypes.any');
    expect(checkPropTypes('News', 'type', rule, 'TestComponent')).toBe(true);
    expect(checkPropTypes('Others', 'type', rule, 'TestComponent')).toBe(true);
  });

  // arrayOf
  it('should validate correctly with valid arrayOf prop type', () => {
    const rule = {
      type: 'arrayOf',
      value: {
        type: 'string',
        isRequired: true,
      },
    };
    expect(transformPropTypesRuleToString(rule)).toBe('PropTypes.arrayOf(PropTypes.string.isRequired)');
    expect(checkPropTypes(['News', 'Photos'], 'type', rule, 'TestComponent')).toBe(true);
    expect(checkPropTypes(['News', 123], 'type', rule, 'TestComponent')).toBe(false);
  });

  // objectOf
  it('should validate correctly with valid objectOf prop type', () => {
    const rule = {
      type: 'objectOf',
      value: {
        type: 'string',
        isRequired: true,
      },
    };
    expect(transformPropTypesRuleToString(rule)).toBe('PropTypes.objectOf(PropTypes.string.isRequired)');
    expect(checkPropTypes({ a: 'News', b: 'Photos' }, 'type', rule, 'TestComponent')).toBe(true);
    expect(checkPropTypes({ a: 'News', b: 123 }, 'type', rule, 'TestComponent')).toBe(false);
  });

  // shape
  it('should validate correctly with valid shape prop type', () => {
    const rule = {
      type: 'shape',
      value: [
        {
          name: 'a',
          propType: {
            type: 'string',
            isRequired: true,
          },
        },
        {
          name: 'b',
          propType: {
            type: 'number',
            isRequired: true,
          },
        },
      ],
    };
    expect(transformPropTypesRuleToString(rule)).toBe('PropTypes.shape({a: PropTypes.string.isRequired,b: PropTypes.number.isRequired})');
    expect(checkPropTypes({ a: 'News', b: 123 }, 'type', rule, 'TestComponent')).toBe(true);
    expect(checkPropTypes({ a: 'News', b: 'Photos' }, 'type', rule, 'TestComponent')).toBe(false);

    // isRequired
    const rule2 = {
      type: 'shape',
      value: [
        {
          name: 'a',
          propType: {
            type: 'string',
            isRequired: true,
          },
        },
        {
          name: 'b',
          propType: {
            type: 'number',
            isRequired: false,
          },
        },
      ],
    };
    expect(transformPropTypesRuleToString(rule2)).toBe('PropTypes.shape({a: PropTypes.string.isRequired,b: PropTypes.number})');
    expect(checkPropTypes({ a: 'News', b: 123 }, 'type', rule2, 'TestComponent')).toBe(true);
    expect(checkPropTypes({ b: 123 }, 'type', rule2, 'TestComponent')).toBe(false);
  });

  // exact
  it('should validate correctly with valid exact prop type', () => {
    const rule = {
      type: 'exact',
      value: [
        {
          name: 'a',
          propType: {
            type: 'string',
            isRequired: true,
          },
        },
        {
          name: 'b',
          propType: {
            type: 'number',
            isRequired: true,
          },
        },
      ],
    };
    expect(transformPropTypesRuleToString(rule)).toBe('PropTypes.exact({a: PropTypes.string.isRequired,b: PropTypes.number.isRequired})');
    expect(checkPropTypes({ a: 'News', b: 123 }, 'type', rule, 'TestComponent')).toBe(true);
    expect(checkPropTypes({ a: 'News', b: 'Photos' }, 'type', rule, 'TestComponent')).toBe(false);

    // isRequired
    const rule2 = {
      type: 'exact',
      value: [
        {
          name: 'a',
          propType: {
            type: 'string',
            isRequired: true,
          },
        },
        {
          name: 'b',
          propType: {
            type: 'number',
            isRequired: false,
          },
        },
      ],
    };
    expect(transformPropTypesRuleToString(rule2)).toBe('PropTypes.exact({a: PropTypes.string.isRequired,b: PropTypes.number})');
    expect(checkPropTypes({ a: 'News', b: 123 }, 'type', rule2, 'TestComponent')).toBe(true);
    expect(checkPropTypes({ b: 123 }, 'type', rule2, 'TestComponent')).toBe(false);
  });
});