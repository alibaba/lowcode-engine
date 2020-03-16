import React, { PureComponent, Suspense } from 'react';
export default function SuspenseWrapper(fallback = null) {
  return function(Component) {
    class SuspenseWrapper extends PureComponent {
      render() {
        return (
          <Suspense fallback={fallback}>
            <Component {...this.props} />
          </Suspense>
        );
      }
    }
    return SuspenseWrapper;
  };
}
