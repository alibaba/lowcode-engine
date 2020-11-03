
const React = require('react');
  const IconBase = require('@ali/vu-icon-base');

  function WrapStretch(props) {
    return (
      <IconBase viewBox="0 0 21 19" {...props}>
        <g fillRule="evenodd"><path d="M11 11h5v6h-5zm-6 0h5v6H5z"/><path opacity=".4" d="M12 3h3v4h-3zM6 3h3v4H6z"/><path d="M6 3v4h3V3H6zM5 2h5v6H5V2zm7 1v4h3V3h-3zm-1-1h5v6h-5V2z"/><path opacity=".5" d="M0 18h21v1H0zM0 0h21v1H0zm0 9h21v1H0z"/></g>
      </IconBase>
    );
  }
  WrapStretch.displayName = 'WrapStretch';

  module.exports = WrapStretch;
