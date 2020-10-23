
const React = require('react');
  const IconBase = require('@ali/vu-icon-base');

  function JustifyAround(props) {
    return (
      <IconBase viewBox="0 0 16 17" {...props}>
        <g fillRule="evenodd"><path d="M2 0h1v17H2V0zm0 3.5h1v10H2v-10zM13 0h1v17h-1V0zm0 3.5h1v10h-1v-10z" opacity=".5"/><path d="M11 4h5v9h-5z"/><path opacity=".4" d="M1 5h3v7H1z"/><path d="M1 5v7h3V5H1zM0 4h5v9H0V4z"/></g>
      </IconBase>
    );
  }
  JustifyAround.displayName = 'JustifyAround';

  module.exports = JustifyAround;
