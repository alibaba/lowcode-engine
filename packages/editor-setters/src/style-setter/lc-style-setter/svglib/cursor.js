
const React = require('react');
  const IconBase = require('@ali/vu-icon-base');

  function Cursor(props) {
    return (
      <IconBase viewBox="0 0 1024 1024" {...props}>
        <path d="M597.333333 981.333333C597.333333 981.333333 597.333333 981.333333 597.333333 981.333333c-17.066667 0-34.133333-12.8-38.4-29.866667l-98.133333-294.4c-8.533333-21.333333 4.266667-46.933333 25.6-55.466667 21.333333-8.533333 46.933333 4.266667 55.466667 25.6l59.733333 183.466667 260.266667-652.8L209.066667 422.4l183.466667 59.733333c21.333333 8.533333 34.133333 29.866667 25.6 55.466667-8.533333 21.333333-29.866667 34.133333-55.466667 25.6l-294.4-98.133333C55.466667 460.8 42.666667 443.733333 42.666667 426.666667c0-17.066667 8.533333-34.133333 25.6-42.666667l853.333333-341.333333C938.666667 38.4 955.733333 42.666667 968.533333 55.466667 981.333333 68.266667 985.6 85.333333 977.066667 102.4l-341.333333 853.333333C631.466667 972.8 614.4 981.333333 597.333333 981.333333z"/>
  <path d="M170.666667 981.333333c-34.133333 0-64-12.8-89.6-38.4-51.2-51.2-51.2-132.266667 0-179.2l268.8-268.8c17.066667-17.066667 42.666667-17.066667 59.733333 0s17.066667 42.666667 0 59.733333l-268.8 268.8C132.266667 832 128 840.533333 128 853.333333s4.266667 21.333333 12.8 29.866667c17.066667 17.066667 42.666667 17.066667 59.733333 0l268.8-268.8c17.066667-17.066667 42.666667-17.066667 59.733333 0s17.066667 42.666667 0 59.733333l-268.8 268.8C234.666667 968.533333 204.8 981.333333 170.666667 981.333333z"/>
      </IconBase>
    );
  }
  Cursor.displayName = 'Cursor';

  module.exports = Cursor;
