
const React = require('react');
  const IconBase = require('@ali/vu-icon-base');

  function WrapBetweenV(props) {
    return (
      <IconBase viewBox="0 0 24 17" {...props}>
        <g fillRule="evenodd"><path opacity=".5" d="M0 0h1v17H0zm23 0h1v17h-1z"/><path d="M17 3h5v5h-5zm0 6h5v5h-5z"/><path opacity=".4" d="M3 4h3v3H3z"/><path d="M3 4v3h3V4H3zM2 3h5v5H2V3z"/><path opacity=".4" d="M3 10h3v3H3z"/><path d="M3 10v3h3v-3H3zM2 9h5v5H2V9z"/></g>
      </IconBase>
    );
  }
  WrapBetweenV.displayName = 'WrapBetweenV';

  module.exports = WrapBetweenV;
