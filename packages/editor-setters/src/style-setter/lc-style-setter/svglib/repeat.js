
const React = require('react');
  const IconBase = require('@ali/vu-icon-base');

  function Repeat(props) {
    return (
      <IconBase viewBox="0 0 1024 1024" {...props}>
        <path d="M0 658.285714h292.571429V365.714286H0v292.571428z m365.714286-365.714285h292.571428V0H365.714286v292.571429zM0 292.571429h292.571429V0H0v292.571429zM292.571429 879.013303L147.698834 1024 0 879.013303h115.644709V731.428571h61.282011v147.584732zM879.013303 292.571429L1024 147.698834 879.013303 0v115.644709H731.428571v61.282011h147.584732z"/>
      </IconBase>
    );
  }
  Repeat.displayName = 'Repeat';

  module.exports = Repeat;
