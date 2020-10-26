
const React = require('react');
  const IconBase = require('@ali/vu-icon-base');

  function Layer(props) {
    return (
      <IconBase viewBox="0 0 1024 1024" {...props}>
        <path d="M512.28 881.25 124.847 579.972l-85.104 66.192 472.799 367.732 472.799-367.732-85.629-66.454C899.712 579.71 512.28 881.25 512.28 881.25zM512.542 747.816 899.45 447.063l85.892-66.98L512.542 12.351 39.743 380.083l85.629 66.454L512.542 747.816z"/>
      </IconBase>
    );
  }
  Layer.displayName = 'Layer';

  module.exports = Layer;
