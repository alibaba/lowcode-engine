import * as React from 'react';

export default function TSDemo(props) {
  const { type, ...others } = props;

  return (
    <div className="TSDemo" {...others}>Hello TSDemo</div>
  );
}

TSDemo.propTypes = {
};

TSDemo.defaultProps = {
};
