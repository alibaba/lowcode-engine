import React from 'react';

var Greeting = function Greeting(_ref) {
  var name = _ref.name;
  return React.createElement("div", {
    style: {
      textAlign: 'center',
      fontSize: '40px',
      fontWeight: 'bold'
    }
  }, "Hello, ", name);
};

export default Greeting;