
const React = require('react');
  const IconBase = require('@ali/vu-icon-base');

  function TextAlignCenter(props) {
    return (
      <IconBase viewBox="0 0 26 22" {...props}>
        <path d="M0,0 L26,0 L26,2 L0,2 L0,0 Z M2,8 L24,8 L24,10 L2,10 L2,8 Z M4,16 L22,16 L22,18 L4,18 L4,16 Z M4,4 L22,4 L22,6 L4,6 L4,4 Z M0,12 L26,12 L26,14 L0,14 L0,12 Z M2,20 L24,20 L24,22 L2,22 L2,20 Z"/>
      </IconBase>
    );
  }
  TextAlignCenter.displayName = 'TextAlignCenter';

  module.exports = TextAlignCenter;
