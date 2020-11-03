
const React = require('react');
  const IconBase = require('@ali/vu-icon-base');

  function AlignCenterV(props) {
    return (
      <IconBase viewBox="0 0 9 17" {...props}>
        <g fillRule="evenodd"><path d="M4 0h1v17H4V0zm0 8.5h1v6H4v-6zm0-6h1v6H4v-6z" opacity=".5"/><path d="M0 9h9v5H0z"/><path opacity=".4" d="M1 4h7v3H1z"/><path d="M1 4v3h7V4H1zM0 3h9v5H0V3z"/></g>
      </IconBase>
    );
  }
  AlignCenterV.displayName = 'AlignCenterV';

  module.exports = AlignCenterV;
