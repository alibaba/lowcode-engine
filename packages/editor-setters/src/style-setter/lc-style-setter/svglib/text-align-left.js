
const React = require('react');
  const IconBase = require('@ali/vu-icon-base');

  function TextAlignLeft(props) {
    return (
      <IconBase viewBox="0 0 22 22" {...props}>
        <path d="M0,0 L22,0 L22,2 L0,2 L0,0 Z M0,8 L22,8 L22,10 L0,10 L0,8 Z M0,16 L22,16 L22,18 L0,18 L0,16 Z M0,4 L18,4 L18,6 L0,6 L0,4 Z M0,12 L20,12 L20,14 L0,14 L0,12 Z M0,20 L14,20 L14,22 L0,22 L0,20 Z"/>
      </IconBase>
    );
  }
  TextAlignLeft.displayName = 'TextAlignLeft';

  module.exports = TextAlignLeft;
