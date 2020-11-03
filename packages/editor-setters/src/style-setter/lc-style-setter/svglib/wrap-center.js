
const React = require('react');
  const IconBase = require('@ali/vu-icon-base');

  function WrapCenter(props) {
    return (
      <IconBase viewBox="0 0 21 13" {...props}>
        <g fillRule="evenodd"><path opacity=".5" d="M0 6h21v1H0z"/><path d="M11 8h5v5h-5zM5 8h5v5H5z"/><path opacity=".4" d="M12 1h3v3h-3z"/><path d="M12 1v3h3V1h-3zm-1-1h5v5h-5V0z"/><path opacity=".4" d="M6 1h3v3H6z"/><path d="M6 1v3h3V1H6zM5 0h5v5H5V0z"/></g>
      </IconBase>
    );
  }
  WrapCenter.displayName = 'WrapCenter';

  module.exports = WrapCenter;
