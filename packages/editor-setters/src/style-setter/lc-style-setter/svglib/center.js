
const React = require('react');
  const IconBase = require('@ali/vu-icon-base');

  function Center(props) {
    return (
      <IconBase viewBox="0 0 1024 1024" {...props}>
        <path d="M0 472.615385h393.846154v78.76923H0zM630.153846 472.615385h393.846154v78.76923H630.153846zM472.615385 0h78.76923v393.846154h-78.76923zM472.615385 630.153846h78.76923v393.846154h-78.76923z"/>
      </IconBase>
    );
  }
  Center.displayName = 'Center';

  module.exports = Center;
