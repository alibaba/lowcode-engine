
const React = require('react');
  const IconBase = require('@ali/vu-icon-base');

  function AlignStretchV(props) {
    return (
      <IconBase viewBox="0 0 24 17" {...props}>
        <g fillRule="evenodd"><path opacity=".5" d="M23 0h1v17h-1zM0 0h1v17H0z"/><path d="M2 9h20v5H2z"/><path opacity=".4" d="M3 4h18v3H3z"/><path d="M3 4v3h18V4H3zM2 3h20v5H2V3z"/></g>
      </IconBase>
    );
  }
  AlignStretchV.displayName = 'AlignStretchV';

  module.exports = AlignStretchV;
