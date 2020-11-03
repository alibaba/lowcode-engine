
const React = require('react');
  const IconBase = require('@ali/vu-icon-base');

  function WrapAroundV(props) {
    return (
      <IconBase viewBox="0 0 16 17" {...props}>
        <g fillRule="evenodd"><path d="M11 3h5v5h-5zm0 6h5v5h-5z"/><path opacity=".4" d="M1 4h3v3H1z"/><path d="M1 4v3h3V4H1zM0 3h5v5H0V3z"/><path opacity=".4" d="M1 10h3v3H1z"/><path d="M1 10v3h3v-3H1zM0 9h5v5H0V9z"/><path d="M2 0h1v17H2V0zm0 8.5h1v6H2v-6zm0-6h1v6H2v-6zM13 0h1v17h-1V0zm0 8.5h1v6h-1v-6zm0-6h1v6h-1v-6z" opacity=".5"/></g>
      </IconBase>
    );
  }
  WrapAroundV.displayName = 'WrapAroundV';

  module.exports = WrapAroundV;
