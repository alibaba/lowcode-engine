
const React = require('react');
  const IconBase = require('@ali/vu-icon-base');

  function AlignBaselineV(props) {
    return (
      <IconBase viewBox="0 0 24 17" {...props}>
        <g fillRule="evenodd"><path opacity=".5" d="M0 0h1v17H0z"/><path d="M2 9h9v5H2V9zm1 1h2v3H3v-3z"/><path opacity=".4" d="M5 4h5v3H5z"/><path d="M3 4v3h7V4H3zM2 3h9v5H2V3z"/></g>
      </IconBase>
    );
  }
  AlignBaselineV.displayName = 'AlignBaselineV';

  module.exports = AlignBaselineV;
