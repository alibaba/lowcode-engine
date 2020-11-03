
const React = require('react');
  const IconBase = require('@ali/vu-icon-base');

  function CursorDefault(props) {
    return (
      <IconBase viewBox="0 0 1024 1024" {...props}>
        <path d="M256 0l612.650667 573.824-250.282667 22.741333-45.44 4.096 18.901333 41.557333 151.850667 332.544L631.68 1024l-144.896-336.128-18.176-42.368-33.578667 31.530667-177.792 166.741333L256 0"/>
      </IconBase>
    );
  }
  CursorDefault.displayName = 'CursorDefault';

  module.exports = CursorDefault;
