
const React = require('react');
  const IconBase = require('@ali/vu-icon-base');

  function DirectionColumn(props) {
    return (
      <IconBase viewBox="0 0 9 18" {...props}>
        <g fillRule="evenodd"><path d="M0 6h9v5H0zm5 9v-3H4v3H2l2.5 3L7 15H5z"/><path opacity=".4" d="M1 1h7v3H1z"/><path d="M1 1v3h7V1H1zM0 0h9v5H0V0z"/></g>
      </IconBase>
    );
  }
  DirectionColumn.displayName = 'DirectionColumn';

  module.exports = DirectionColumn;
