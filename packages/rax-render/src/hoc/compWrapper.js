import { Component, createElement, forwardRef } from 'rax';

function enhanced(Comp) {
  class WrappedComponent extends Component {
    render() {
      const { forwardedRef, ...rest} = this.props;
      console.log('forwardedRef', forwardedRef)
      return <Comp { ...rest } ref={forwardedRef}></Comp>
    }
  }

  function forwardedRef(props, ref) {
    return createElement(
      WrappedComponent,
      {
        ...props,
        forwardedRef: ref
      }
    )
  }

  forwardedRef.displayName = Comp.displayName;

  return forwardRef(forwardedRef);

};

export default enhanced;
