
const React = require('react');
  const IconBase = require('@ali/vu-icon-base');

  function JustifyEnd(props) {
    return (
      <IconBase viewBox="0 0 24 17" {...props}>
        <g fillRule="evenodd"><path opacity=".5" d="M23 0h1v17h-1z"/><path d="M17 4h5v9h-5z"/><path opacity=".4" d="M12 5h3v7h-3z"/><path d="M12 5v7h3V5h-3zm-1-1h5v9h-5V4z"/></g>
      </IconBase>
    );
  }
  JustifyEnd.displayName = 'JustifyEnd';

  module.exports = JustifyEnd;
