
const React = require('react');
  const IconBase = require('@ali/vu-icon-base');

  function JustifyAroundV(props) {
    return (
      <IconBase viewBox="0 0 21 13" {...props}>
        <g fillRule="evenodd"><path d="M0 2h21v1H0V2zm5.5 0h10v1h-10V2zM0 10h21v1H0v-1zm5.5 0h10v1h-10v-1z" opacity=".5"/><path d="M6 8h9v5H6z"/><path opacity=".4" d="M7 1h7v3H7z"/><path d="M7 1v3h7V1H7zM6 0h9v5H6V0z"/></g>
      </IconBase>
    );
  }
  JustifyAroundV.displayName = 'JustifyAroundV';

  module.exports = JustifyAroundV;
