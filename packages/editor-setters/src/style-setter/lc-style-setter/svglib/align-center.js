
const React = require('react');
  const IconBase = require('@ali/vu-icon-base');

  function AlignCenter(props) {
    return (
      <IconBase viewBox="0 0 21 9" {...props}>
        <g fillRule="evenodd"><path d="M0 4h21v1H0V4zm4.5 0h6v1h-6V4zm6 0h6v1h-6V4z" opacity=".5"/><path d="M11 0h5v9h-5z"/><path opacity=".4" d="M6 1h3v7H6z"/><path d="M6 1v7h3V1H6zM5 0h5v9H5V0z"/></g>
      </IconBase>
    );
  }
  AlignCenter.displayName = 'AlignCenter';

  module.exports = AlignCenter;
