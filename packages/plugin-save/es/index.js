import _Button from "@alifd/next/es/button";
import React from 'react';
import './index.scss';

var Save = function Save(props) {
  var handleClick = function handleClick() {
    console.log('save data:', props.editor.designer.currentDocument.schema);
  };

  return /*#__PURE__*/React.createElement("div", {
    className: "lowcode-plugin-save"
  }, /*#__PURE__*/React.createElement(_Button, {
    type: "primary",
    onClick: handleClick
  }, "\u4FDD\u5B58"));
};

export default Save;