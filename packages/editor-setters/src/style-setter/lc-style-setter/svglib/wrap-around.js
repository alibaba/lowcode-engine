
const React = require('react');
  const IconBase = require('@ali/vu-icon-base');

  function WrapAround(props) {
    return (
      <IconBase viewBox="0 0 21 13" {...props}>
        <g fillRule="evenodd"><path d="M0 2h21v1H0V2zm4.5 0h12v1h-12V2zM0 10h21v1H0v-1zm4.5 0h12v1h-12v-1z" opacity=".5"/><path d="M11 8h5v5h-5zM5 8h5v5H5z"/><path opacity=".4" d="M12 1h3v3h-3z"/><path d="M12 1v3h3V1h-3zm-1-1h5v5h-5V0z"/><path opacity=".4" d="M6 1h3v3H6z"/><path d="M6 1v3h3V1H6zM5 0h5v5H5V0z"/></g>
      </IconBase>
    );
  }
  WrapAround.displayName = 'WrapAround';

  module.exports = WrapAround;
