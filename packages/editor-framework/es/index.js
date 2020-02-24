import _extends from "@babel/runtime/helpers/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";
import * as React from 'react';
export default function TSDemo(props) {
  var type = props.type,
      others = _objectWithoutPropertiesLoose(props, ["type"]);

  return React.createElement("div", _extends({
    className: "TSDemo"
  }, others), "Hello TSDemo");
}
TSDemo.propTypes = {};
TSDemo.defaultProps = {};