
const React = require('react');
  const IconBase = require('@ali/vu-icon-base');

  function Auto(props) {
    return (
      <IconBase viewBox="0 0 1024 1024" {...props}>
        <path d="M486.4 102.4l51.2 0 0 409.6-51.2 0 0-409.6Z"/>
  <path d="M486.4 819.2l51.2 0 0 102.4-51.2 0 0-102.4Z"/>
  <path d="M307.2 204.8l409.6 0 0 256-409.6 0 0-256Z"/>
  <path d="M768 563.2l0 204.8L256 768l0-204.8L768 563.2M819.2 512 204.8 512l0 307.2 614.4 0L819.2 512 819.2 512z"/>
      </IconBase>
    );
  }
  Auto.displayName = 'Auto';

  module.exports = Auto;
