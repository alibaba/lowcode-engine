import React, { Component, createElement } from "react";
import {
  isReactComponent,
  wrapReactClass,
  isForwardOrMemoForward,
  isMemoType,
  isForwardRefType,
  acceptsRef,
  isReactClass,
  REACT_MEMO_TYPE,
  REACT_FORWARD_REF_TYPE,
 } from "../../src/is-react";

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

describe('wrapReactClass', () => {
  it('should wrap a FunctionComponent', () => {
    // Create a mock FunctionComponent
    const MockComponent: React.FunctionComponent = (props) => {
      return <div>{props.children}</div>;
    };

    // Wrap the FunctionComponent using wrapReactClass
    const WrappedComponent = wrapReactClass(MockComponent);
    const instance = new WrappedComponent();

    // Check if the WrappedComponent extends Component
    expect(instance instanceof React.Component).toBe(true);
  });

  it('should render the FunctionComponent with props', () => {
    // Create a mock FunctionComponent
    const MockComponent: React.FunctionComponent = (props) => {
      return <div>{props.children}</div>;
    };

    MockComponent.displayName = 'FunctionComponent';

    // Wrap the FunctionComponent using wrapReactClass
    const WrappedComponent = wrapReactClass(MockComponent);

    // Create some test props
    const testProps = { prop1: 'value1', prop2: 'value2' };

    // Render the WrappedComponent with test props
    const rendered = createElement(WrappedComponent, testProps, 'Child Text');

    // Check if the WrappedComponent renders the FunctionComponent with props
    expect(rendered).toMatchSnapshot();
  });
});

describe('isReactComponent', () => {
  it('should identify a class component as a React component', () => {
    class ClassComponent extends React.Component {
      render() {
        return <div>Class Component</div>;
      }
    }

    expect(isReactComponent(ClassComponent)).toBe(true);
  });

  it('should identify a functional component as a React component', () => {
    const FunctionalComponent = () => {
      return <div>Functional Component</div>;
    };

    expect(isReactComponent(FunctionalComponent)).toBe(true);
  });

  it('should identify a forward ref component as a React component', () => {
    const ForwardRefComponent = React.forwardRef((props, ref) => {
      return <div ref={ref}>Forward Ref Component</div>;
    });

    expect(isReactComponent(ForwardRefComponent)).toBe(true);
  });

  it('should identify a memo component as a React component', () => {
    const MemoComponent = React.memo(() => {
      return <div>Memo Component</div>;
    });

    expect(isReactComponent(MemoComponent)).toBe(true);
  });

  it('should return false for non-React components', () => {
    const plainObject = { prop: 'value' };
    const notAComponent = 'Not a component';

    expect(isReactComponent(plainObject)).toBe(false);
    expect(isReactComponent(notAComponent)).toBe(false);
  });

  it('should return false for null or undefined', () => {
    const nullValue = null;
    const undefinedValue = undefined;

    expect(isReactComponent(nullValue)).toBe(false);
    expect(isReactComponent(undefinedValue)).toBe(false);
  });
});

describe('isForwardOrMemoForward', () => {
  it('should return true for a forwardRef component', () => {
    const forwardRefComponent = React.forwardRef(() => {
      return <div>ForwardRef Component</div>;
    });

    expect(isForwardOrMemoForward(forwardRefComponent)).toBe(true);
  });

  it('should return true for a memoized forwardRef component', () => {
    const forwardRefComponent = React.forwardRef(() => {
      return <div>ForwardRef Component</div>;
    });

    const memoizedComponent = React.memo(forwardRefComponent);

    expect(isForwardOrMemoForward(memoizedComponent)).toBe(true);
  });

  it('should return false for a memoized component that is not a forwardRef', () => {
    const memoizedComponent = React.memo(() => {
      return <div>Memoized Component</div>;
    });

    expect(isForwardOrMemoForward(memoizedComponent)).toBe(false);
  });

  it('should return false for a plain object', () => {
    const plainObject = { prop: 'value' };

    expect(isForwardOrMemoForward(plainObject)).toBe(false);
  });

  it('should return false for null or undefined', () => {
    const nullValue = null;
    const undefinedValue = undefined;

    expect(isForwardOrMemoForward(nullValue)).toBe(false);
    expect(isForwardOrMemoForward(undefinedValue)).toBe(false);
  });
});

describe('isMemoType', () => {
  it('should return true for an object with $$typeof matching REACT_MEMO_TYPE', () => {
    const memoTypeObject = { $$typeof: REACT_MEMO_TYPE };

    expect(isMemoType(memoTypeObject)).toBe(true);
  });

  it('should return false for an object with $$typeof not matching REACT_MEMO_TYPE', () => {
    const otherTypeObject = { $$typeof: Symbol.for('other.type') };

    expect(isMemoType(otherTypeObject)).toBe(false);
  });

  it('should return false for an object with no $$typeof property', () => {
    const noTypeObject = { key: 'value' };

    expect(isMemoType(noTypeObject)).toBe(false);
  });

  it('should return false for null or undefined', () => {
    const nullValue = null;
    const undefinedValue = undefined;

    expect(isMemoType(nullValue)).toBe(false);
    expect(isMemoType(undefinedValue)).toBe(false);
  });
});

describe('isForwardRefType', () => {
  it('should return true for an object with $$typeof matching REACT_FORWARD_REF_TYPE', () => {
    const forwardRefTypeObject = { $$typeof: REACT_FORWARD_REF_TYPE };

    expect(isForwardRefType(forwardRefTypeObject)).toBe(true);
  });

  it('should return false for an object with $$typeof not matching REACT_FORWARD_REF_TYPE', () => {
    const otherTypeObject = { $$typeof: Symbol.for('other.type') };

    expect(isForwardRefType(otherTypeObject)).toBe(false);
  });

  it('should return false for an object with no $$typeof property', () => {
    const noTypeObject = { key: 'value' };

    expect(isForwardRefType(noTypeObject)).toBe(false);
  });

  it('should return false for null or undefined', () => {
    const nullValue = null;
    const undefinedValue = undefined;

    expect(isForwardRefType(nullValue)).toBe(false);
    expect(isForwardRefType(undefinedValue)).toBe(false);
  });
});

describe('acceptsRef', () => {
  it('should return true for an object with isReactComponent in its prototype', () => {
    const objWithIsReactComponent = {
      prototype: {
        isReactComponent: true,
      },
    };

    expect(acceptsRef(objWithIsReactComponent)).toBe(true);
  });

  it('should return true for an object that is forwardRef or memoized forwardRef', () => {
    const forwardRefObject = React.forwardRef(() => {
      return null;
    });

    const memoizedForwardRefObject = React.memo(forwardRefObject);

    expect(acceptsRef(forwardRefObject)).toBe(true);
    expect(acceptsRef(memoizedForwardRefObject)).toBe(true);
  });

  it('should return false for an object without isReactComponent in its prototype', () => {
    const objWithoutIsReactComponent = {
      prototype: {
        someOtherProperty: true,
      },
    };

    expect(acceptsRef(objWithoutIsReactComponent)).toBe(false);
  });

  it('should return false for null or undefined', () => {
    const nullValue = null;
    const undefinedValue = undefined;

    expect(acceptsRef(nullValue)).toBe(false);
    expect(acceptsRef(undefinedValue)).toBe(false);
  });
});

describe('isReactClass', () => {
  it('should return true for an object with isReactComponent in its prototype', () => {
    class ReactClassComponent extends Component {
      render() {
        return null;
      }
    }

    expect(isReactClass(ReactClassComponent)).toBe(true);
  });

  it('should return true for an object with Component in its prototype chain', () => {
    class CustomComponent extends Component {
      render() {
        return null;
      }
    }

    expect(isReactClass(CustomComponent)).toBe(true);
  });

  it('should return false for an object without isReactComponent in its prototype', () => {
    class NonReactComponent {
      render() {
        return null;
      }
    }

    expect(isReactClass(NonReactComponent)).toBe(false);
  });

  it('should return false for null or undefined', () => {
    const nullValue = null;
    const undefinedValue = undefined;

    expect(isReactClass(nullValue)).toBe(false);
    expect(isReactClass(undefinedValue)).toBe(false);
  });
});