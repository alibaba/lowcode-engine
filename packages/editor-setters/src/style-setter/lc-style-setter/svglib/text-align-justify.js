
const React = require('react');
  const IconBase = require('@ali/vu-icon-base');

  function TextAlignJustify(props) {
    return (
      <IconBase viewBox="0 0 22 22" {...props}>
        <path d="M0,0 L22,0 L22,2 L0,2 L0,0 Z M0,8 L22,8 L22,10 L0,10 L0,8 Z M0,16 L22,16 L22,18 L0,18 L0,16 Z M0,4 L22,4 L22,6 L0,6 L0,4 Z M0,12 L22,12 L22,14 L0,14 L0,12 Z M0,20 L12,20 L12,22 L0,22 L0,20 Z"/>
      </IconBase>
    );
  }
  TextAlignJustify.displayName = 'TextAlignJustify';

  module.exports = TextAlignJustify;
