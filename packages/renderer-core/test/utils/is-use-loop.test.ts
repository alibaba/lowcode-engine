// @ts-nocheck
import isUseLoop from '../../src/utils/is-use-loop';

describe('base test', () => {
  it('designMode is true', () => {
    expect(isUseLoop([], true)).toBeFalsy();
    expect(isUseLoop([{}], true)).toBeTruthy();
  });

  it('loop is expression', () => {
    expect(isUseLoop({
      "type": "JSExpression",
      "value": "function() { console.log('componentDidMount'); }"
    }, true)).toBeTruthy();
    expect(isUseLoop({
      "type": "JSExpression",
      "value": "function() { console.log('componentDidMount'); }"
    }, false)).toBeTruthy();
  });

  it('designMode is false', () => {
    expect(isUseLoop([], false)).toBeTruthy();
    expect(isUseLoop([{}], false)).toBeTruthy();
  });
});
