
const React = require('react');
  const IconBase = require('@ali/vu-icon-base');

  function AlignStretch(props) {
    return (
      <IconBase viewBox="0 0 21 18" {...props}>
        <g fillRule="evenodd"><path opacity=".5" d="M0 17h21v1H0zM0 0h21v1H0z"/><path d="M11 2h5v14h-5z"/><path opacity=".4" d="M6 3h3v12H6z"/><path d="M6 3v12h3V3H6zM5 2h5v14H5V2z"/></g>
      </IconBase>
    );
  }
  AlignStretch.displayName = 'AlignStretch';

  module.exports = AlignStretch;
