
const React = require('react');
  const IconBase = require('@ali/vu-icon-base');

  function AlignBaseline(props) {
    return (
      <IconBase viewBox="0 0 21 11" {...props}>
        <g fillRule="evenodd"><path d="M0 5h21v1H0V5zm4.5 0h6v1h-6V5zm6 0h6v1h-6V5z" opacity=".5"/><path d="M11 1h5v9h-5V1zm1 1h3v3h-3V2z"/><path opacity=".4" d="M6 5h3v5H6z"/><path d="M6 3v7h3V3H6zM5 2h5v9H5V2z"/></g>
      </IconBase>
    );
  }
  AlignBaseline.displayName = 'AlignBaseline';

  module.exports = AlignBaseline;
