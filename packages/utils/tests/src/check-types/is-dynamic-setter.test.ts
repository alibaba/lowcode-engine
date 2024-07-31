import { Component } from 'react';
import { isDynamicSetter } from '../../../src/check-types/is-dynamic-setter';

describe('isDynamicSetter', () => {
  it('returns true if input is a dynamic setter function', () => {
    const dynamicSetter = (value: any) => {
      // some implementation
    };

    expect(isDynamicSetter(dynamicSetter)).toBeTruthy();
  });

  it('returns false if input is not a dynamic setter function', () => {
    expect(isDynamicSetter('not a function')).toBeFalsy();
    expect(isDynamicSetter(null)).toBeFalsy();
    expect(isDynamicSetter(undefined)).toBeFalsy();
    expect(isDynamicSetter(2)).toBeFalsy();
    expect(isDynamicSetter(0)).toBeFalsy();
  });

  it('returns false if input is a React class', () => {
    class ReactClass extends Component {
      // some implementation
    }

    expect(isDynamicSetter(ReactClass)).toBeFalsy();
  });
});
