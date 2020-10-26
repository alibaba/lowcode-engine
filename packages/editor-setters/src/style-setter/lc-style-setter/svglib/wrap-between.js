
const React = require('react');
  const IconBase = require('@ali/vu-icon-base');

  function WrapBetween(props) {
    return (
      <IconBase viewBox="0 0 21 18" {...props}>
        <g fillRule="evenodd"><path d="M11 11h5v5h-5zm-6 0h5v5H5z"/><path opacity=".4" d="M12 3h3v3h-3z"/><path d="M12 3v3h3V3h-3zm-1-1h5v5h-5V2z"/><path opacity=".4" d="M6 3h3v3H6z"/><path d="M6 3v3h3V3H6zM5 2h5v5H5V2z"/><path opacity=".5" d="M0 17h21v1H0zM0 0h21v1H0z"/></g>
      </IconBase>
    );
  }
  WrapBetween.displayName = 'WrapBetween';

  module.exports = WrapBetween;
