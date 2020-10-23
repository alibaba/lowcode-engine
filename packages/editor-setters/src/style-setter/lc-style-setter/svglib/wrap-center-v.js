
const React = require('react');
  const IconBase = require('@ali/vu-icon-base');

  function WrapCenterV(props) {
    return (
      <IconBase viewBox="0 0 13 17" {...props}>
        <g fillRule="evenodd"><path opacity=".5" d="M6 0h1v17H6z"/><path d="M8 3h5v5H8zm0 6h5v5H8z"/><path opacity=".4" d="M1 4h3v3H1z"/><path d="M1 4v3h3V4H1zM0 3h5v5H0V3z"/><path opacity=".4" d="M1 10h3v3H1z"/><path d="M1 10v3h3v-3H1zM0 9h5v5H0V9z"/></g>
      </IconBase>
    );
  }
  WrapCenterV.displayName = 'WrapCenterV';

  module.exports = WrapCenterV;
