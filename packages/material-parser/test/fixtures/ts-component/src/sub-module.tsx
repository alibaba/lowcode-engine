import * as React from 'react';
import PropTypes from 'prop-types';

export default function SubModule({ name }) {
  return <div>hello, {name}</div>;
}

SubModule.propTypes = {
  name: PropTypes.string,
};
