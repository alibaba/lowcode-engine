
const React = require('react');
  const IconBase = require('@ali/vu-icon-base');

  function AlignEndV(props) {
    return (
      <IconBase viewBox="0 0 24 17" {...props}>
        <g fillRule="evenodd"><path opacity=".5" d="M23 0h1v17h-1z"/><path d="M13 9h9v5h-9z"/><path opacity=".4" d="M14 4h7v3h-7z"/><path d="M14 4v3h7V4h-7zm-1-1h9v5h-9V3z"/></g>
      </IconBase>
    );
  }
  AlignEndV.displayName = 'AlignEndV';

  module.exports = AlignEndV;
