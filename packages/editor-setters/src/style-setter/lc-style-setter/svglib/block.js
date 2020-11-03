
const React = require('react');
  const IconBase = require('@ali/vu-icon-base');

  function Block(props) {
    return (
      <IconBase viewBox="0 0 22 14" {...props}>
        <path opacity=".15" d="M19 3v8H3V3h16m1-1H2v10h18V2z"/>
  <path d="M19.8 1H2.2A1.2 1.2 0 0 0 1 2.2v9.6A1.2 1.2 0 0 0 2.2 13h17.6a1.2 1.2 0 0 0 1.2-1.2V2.2A1.2 1.2 0 0 0 19.8 1zm.2 11H2V2h18v10z"/>
  <path opacity=".35" d="M3 3h16v8H3z"/>
      </IconBase>
    );
  }
  Block.displayName = 'Block';

  module.exports = Block;
