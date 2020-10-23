
const React = require('react');
  const IconBase = require('@ali/vu-icon-base');

  function JustifyBetween(props) {
    return (
      <IconBase viewBox="0 0 24 17" {...props}>
        <g fillRule="evenodd"><path opacity=".5" d="M0 0h1v17H0zm23 0h1v17h-1z"/><path d="M17 4h5v9h-5z"/><path opacity=".4" d="M3 5h3v7H3z"/><path d="M3 5v7h3V5H3zM2 4h5v9H2V4z"/></g>
      </IconBase>
    );
  }
  JustifyBetween.displayName = 'JustifyBetween';

  module.exports = JustifyBetween;
