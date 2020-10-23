
const React = require('react');
  const IconBase = require('@ali/vu-icon-base');

  function DirectionRow(props) {
    return (
      <IconBase viewBox="0 0 19 9" {...props}>
        <g fillRule="evenodd"><path d="M16 4h-4v1h4v2l3-2.5L16 2v2zM6 0h5v9H6z"/><path opacity=".4" d="M1 1h3v7H1z"/><path d="M1 1v7h3V1H1zM0 0h5v9H0V0z"/></g>
      </IconBase>
    );
  }
  DirectionRow.displayName = 'DirectionRow';

  module.exports = DirectionRow;
