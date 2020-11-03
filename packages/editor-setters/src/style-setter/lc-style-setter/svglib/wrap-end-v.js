
const React = require('react');
  const IconBase = require('@ali/vu-icon-base');

  function WrapEndV(props) {
    return (
      <IconBase viewBox="0 0 24 17" {...props}>
        <g fillRule="evenodd"><path d="M17 3h5v5h-5zm0 6h5v5h-5z"/><path opacity=".4" d="M12 4h3v3h-3z"/><path d="M12 4v3h3V4h-3zm-1-1h5v5h-5V3z"/><path opacity=".4" d="M12 10h3v3h-3z"/><path d="M12 10v3h3v-3h-3zm-1-1h5v5h-5V9z"/><path opacity=".5" d="M23 0h1v17h-1z"/></g>
      </IconBase>
    );
  }
  WrapEndV.displayName = 'WrapEndV';

  module.exports = WrapEndV;
