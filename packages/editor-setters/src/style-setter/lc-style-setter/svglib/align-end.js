
const React = require('react');
  const IconBase = require('@ali/vu-icon-base');

  function AlignEnd(props) {
    return (
      <IconBase viewBox="0 0 21 18" {...props}>
        <g fillRule="evenodd"><path opacity=".5" d="M0 17h21v1H0z"/><path d="M11 7h5v9h-5z"/><path opacity=".4" d="M6 8h3v7H6z"/><path d="M6 8v7h3V8H6zM5 7h5v9H5V7z"/></g>
      </IconBase>
    );
  }
  AlignEnd.displayName = 'AlignEnd';

  module.exports = AlignEnd;
