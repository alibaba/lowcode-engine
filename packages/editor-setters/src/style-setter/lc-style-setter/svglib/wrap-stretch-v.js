
const React = require('react');
  const IconBase = require('@ali/vu-icon-base');

  function WrapStretchV(props) {
    return (
      <IconBase viewBox="0 0 25 17" {...props}>
        <g fillRule="evenodd"><path opacity=".5" d="M0 0h1v17H0zm12 0h1v17h-1zm12 0h1v17h-1z"/><path d="M14 3h9v5h-9zm0 6h9v5h-9z"/><path opacity=".4" d="M3 4h7v3H3z"/><path d="M3 4v3h7V4H3zM2 3h9v5H2V3z"/><path opacity=".4" d="M3 10h7v3H3z"/><path d="M3 10v3h7v-3H3zM2 9h9v5H2V9z"/></g>
      </IconBase>
    );
  }
  WrapStretchV.displayName = 'WrapStretchV';

  module.exports = WrapStretchV;
