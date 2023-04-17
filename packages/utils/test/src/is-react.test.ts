import React from "react";
import { isReactComponent, wrapReactClass } from "../../src/is-react";

class reactDemo extends React.Component {

}

const reactMemo = React.memo(reactDemo);

const reactForwardRef = React.forwardRef((props, ref): any => {
  return '';
});

describe('is-react-ut', () => {
  it('isReactComponent', () => {
    expect(isReactComponent(null)).toBeFalsy();
    expect(isReactComponent(() => {})).toBeTruthy();
    expect(isReactComponent({
      $$typeof: Symbol.for('react.memo')
    })).toBeTruthy();
    expect(isReactComponent({
      $$typeof: Symbol.for('react.forward_ref')
    })).toBeTruthy();
    expect(isReactComponent(reactDemo)).toBeTruthy();
    expect(isReactComponent(reactMemo)).toBeTruthy();
    expect(isReactComponent(reactForwardRef)).toBeTruthy();

  });

  it('wrapReactClass', () => {
    const wrap = wrapReactClass(() => {});
    expect(isReactComponent(wrap)).toBeTruthy();

    const fun = () => {};
    fun.displayName = 'mock';
    expect(wrapReactClass(fun).displayName).toBe('mock');
  })
})