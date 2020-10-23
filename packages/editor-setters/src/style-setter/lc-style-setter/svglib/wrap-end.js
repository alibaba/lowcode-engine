
const React = require('react');
  const IconBase = require('@ali/vu-icon-base');

  function WrapEnd(props) {
    return (
      <IconBase viewBox="0 0 21 18" {...props}>
        <g fillRule="evenodd"><path d="M11 11h5v5h-5zm-6 0h5v5H5z"/><path opacity=".4" d="M12 6h3v3h-3z"/><path d="M12 6v3h3V6h-3zm-1-1h5v5h-5V5z"/><path opacity=".4" d="M6 6h3v3H6z"/><path d="M6 6v3h3V6H6zM5 5h5v5H5V5z"/><path opacity=".5" d="M0 17h21v1H0z"/></g>
      </IconBase>
    );
  }
  WrapEnd.displayName = 'WrapEnd';

  module.exports = WrapEnd;
