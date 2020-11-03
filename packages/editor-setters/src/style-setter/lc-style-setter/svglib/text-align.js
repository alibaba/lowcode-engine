
const React = require('react');
  const IconBase = require('@ali/vu-icon-base');

  function TextAlign(props) {
    return (
      <IconBase viewBox="0 0 32 30" {...props}>
        <path d="M0,0 L2,0 L2,30 L0,30 L0,0 Z M4,2 L30,2 L30,4 L4,4 L4,2 Z M4,10 L32,10 L32,12 L4,12 L4,10 Z M4,18 L24,18 L24,20 L4,20 L4,18 Z M10,26 L14,26 L14,28 L10,28 L10,26 Z M4,6 L28,6 L28,8 L4,8 L4,6 Z M4,14 L28,14 L28,16 L4,16 L4,14 Z M3.93811035,27 L10,24 L10,30 L3.93811035,27 Z"/>
      </IconBase>
    );
  }
  TextAlign.displayName = 'TextAlign';

  module.exports = TextAlign;
