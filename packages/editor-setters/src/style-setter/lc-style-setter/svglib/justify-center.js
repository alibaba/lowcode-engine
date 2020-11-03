
const React = require('react');
  const IconBase = require('@ali/vu-icon-base');

  function JustifyCenter(props) {
    return (
      <IconBase viewBox="0 0 13 17" {...props}>
        <g fillRule="evenodd"><path opacity=".5" d="M6 0h1v17H6z"/><path d="M8 4h5v9H8z"/><path opacity=".4" d="M1 5h3v7H1z"/><path d="M1 5v7h3V5H1zM0 4h5v9H0V4z"/></g>
      </IconBase>
    );
  }
  JustifyCenter.displayName = 'JustifyCenter';

  module.exports = JustifyCenter;
