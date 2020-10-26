
const React = require('react');
  const IconBase = require('@ali/vu-icon-base');

  function JustifyStart(props) {
    return (
      <IconBase viewBox="0 0 24 17" {...props}>
        <g fillRule="evenodd"><path opacity=".5" d="M0 0h1v17H0z"/><path d="M8 4h5v9H8z"/><path opacity=".4" d="M3 5h3v7H3z"/><path d="M3 5v7h3V5H3zM2 4h5v9H2V4z"/></g>
      </IconBase>
    );
  }
  JustifyStart.displayName = 'JustifyStart';

  module.exports = JustifyStart;
