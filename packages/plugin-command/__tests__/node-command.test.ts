import { checkPropTypes } from '@alilc/lowcode-utils/src/check-prop-types';
import { nodeSchemaPropType } from '../src/node-command';

describe('nodeSchemaPropType', () => {
  const componentName = 'NodeComponent';
  const getPropType = (name: string) => nodeSchemaPropType.value.find(d => d.name === name)?.propType;

  it('should validate the id as a string', () => {
    const validId = 'node1';
    const invalidId = 123; // Not a string
    expect(checkPropTypes(validId, 'id', getPropType('id'), componentName)).toBe(true);
    expect(checkPropTypes(invalidId, 'id', getPropType('id'), componentName)).toBe(false);
    // is not required
    expect(checkPropTypes(undefined, 'id', getPropType('id'), componentName)).toBe(true);
  });

  it('should validate the componentName as a string', () => {
    const validComponentName = 'Button';
    const invalidComponentName = false; // Not a string
    expect(checkPropTypes(validComponentName, 'componentName', getPropType('componentName'), componentName)).toBe(true);
    expect(checkPropTypes(invalidComponentName, 'componentName', getPropType('componentName'), componentName)).toBe(false);
    // isRequired
    expect(checkPropTypes(undefined, 'componentName', getPropType('componentName'), componentName)).toBe(false);
  });

  it('should validate the props as an object', () => {
    const validProps = { key: 'value' };
    const invalidProps = 'Not an object'; // Not an object
    expect(checkPropTypes(validProps, 'props', getPropType('props'), componentName)).toBe(true);
    expect(checkPropTypes(invalidProps, 'props', getPropType('props'), componentName)).toBe(false);
  });

  it('should validate the props as a JSExpression', () => {
    const validProps = { type: 'JSExpression', value: 'props' };
    expect(checkPropTypes(validProps, 'props', getPropType('props'), componentName)).toBe(true);
  });

  it('should validate the props as a JSFunction', () => {
    const validProps = { type: 'JSFunction', value: 'props' };
    expect(checkPropTypes(validProps, 'props', getPropType('props'), componentName)).toBe(true);
  });

  it('should validate the props as a JSSlot', () => {
    const validProps = { type: 'JSSlot', value: 'props' };
    expect(checkPropTypes(validProps, 'props', getPropType('props'), componentName)).toBe(true);
  });

  it('should validate the condition as a bool', () => {
    const validCondition = true;
    const invalidCondition = 'Not a bool'; // Not a boolean
    expect(checkPropTypes(validCondition, 'condition', getPropType('condition'), componentName)).toBe(true);
    expect(checkPropTypes(invalidCondition, 'condition', getPropType('condition'), componentName)).toBe(false);
  });

  it('should validate the condition as a JSExpression', () => {
    const validCondition = { type: 'JSExpression', value: '1 + 1 === 2' };
    const invalidCondition = { type: 'JSExpression', value: 123 }; // Not a string
    expect(checkPropTypes(validCondition, 'condition', getPropType('condition'), componentName)).toBe(true);
    expect(checkPropTypes(invalidCondition, 'condition', getPropType('condition'), componentName)).toBe(false);
  });

  it('should validate the loop as an array', () => {
    const validLoop = ['item1', 'item2'];
    const invalidLoop = 'Not an array'; // Not an array
    expect(checkPropTypes(validLoop, 'loop', getPropType('loop'), componentName)).toBe(true);
    expect(checkPropTypes(invalidLoop, 'loop', getPropType('loop'), componentName)).toBe(false);
  });

  it('should validate the loop as a JSExpression', () => {
    const validLoop = { type: 'JSExpression', value: 'items' };
    const invalidLoop = { type: 'JSExpression', value: 123 }; // Not a string
    expect(checkPropTypes(validLoop, 'loop', getPropType('loop'), componentName)).toBe(true);
    expect(checkPropTypes(invalidLoop, 'loop', getPropType('loop'), componentName)).toBe(false);
  });

  it('should validate the loopArgs as an array', () => {
    const validLoopArgs = ['item'];
    const invalidLoopArgs = 'Not an array'; // Not an array
    expect(checkPropTypes(validLoopArgs, 'loopArgs', getPropType('loopArgs'), componentName)).toBe(true);
    expect(checkPropTypes(invalidLoopArgs, 'loopArgs', getPropType('loopArgs'), componentName)).toBe(false);
  });

  it('should validate the loopArgs as a JSExpression', () => {
    const validLoopArgs = { type: 'JSExpression', value: 'item' };
    const invalidLoopArgs = { type: 'JSExpression', value: 123 }; // Not a string
    const validLoopArgs2 = [{ type: 'JSExpression', value: 'item' }, { type: 'JSExpression', value: 'index' }];
    expect(checkPropTypes(validLoopArgs, 'loopArgs', getPropType('loopArgs'), componentName)).toBe(true);
    expect(checkPropTypes(invalidLoopArgs, 'loopArgs', getPropType('loopArgs'), componentName)).toBe(false);
    expect(checkPropTypes(validLoopArgs2, 'loopArgs', getPropType('loopArgs'), componentName)).toBe(true);
  });

  it('should validate the children as an array', () => {
    const validChildren = [{
      id: 'child1',
      componentName: 'Button',
    }, {
      id: 'child2',
      componentName: 'Button',
    }];
    const invalidChildren = 'Not an array'; // Not an array
    const invalidChildren2 = [{}]; // Not an valid array
    expect(checkPropTypes(invalidChildren, 'children', getPropType('children'), componentName)).toBe(false);
    expect(checkPropTypes(validChildren, 'children', getPropType('children'), componentName)).toBe(true);
    expect(checkPropTypes(invalidChildren2, 'children', getPropType('children'), componentName)).toBe(false);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
