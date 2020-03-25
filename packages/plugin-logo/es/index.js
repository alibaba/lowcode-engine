import React from 'react';
import './index.scss';

var Logo = function Logo(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "lowcode-plugin-logo"
  }, /*#__PURE__*/React.createElement("a", {
    className: "logo",
    target: "blank",
    href: props.href || '/',
    style: {
      backgroundImage: "url(" + props.logo + ")"
    }
  }));
};

export default Logo;