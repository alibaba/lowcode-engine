// @ts-nocheck
import isUseLoop from '../../src/utils/is-use-loop';

describe('base test', () => {
  it('designMode is true', () => {
    expect(isUseLoop([], true)).toBeFalsy();
    expect(isUseLoop([{}], true)).toBeTruthy();
    expect(isUseLoop(null, true)).toBeFalsy();
    expect(isUseLoop(undefined, true)).toBeFalsy();
    expect(isUseLoop(0, true)).toBeFalsy();
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
    expect(isUseLoop(null, false)).toBeTruthy();
    expect(isUseLoop(undefined, false)).toBeTruthy();
    expect(isUseLoop(0, false)).toBeTruthy();
  });
});
