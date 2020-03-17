import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import _Grid from "@alifd/next/es/grid";
import React, { PureComponent } from 'react';
import TopPlugin from '../../components/TopPlugin';
import './index.scss';
var Row = _Grid.Row,
    Col = _Grid.Col;

var TopArea = /*#__PURE__*/function (_PureComponent) {
  _inheritsLoose(TopArea, _PureComponent);

  function TopArea(props) {
    var _this;

    _this = _PureComponent.call(this, props) || this;

    _this.handlePluginStatusChange = function () {};

    _this.renderPluginList = function (list) {
      if (list === void 0) {
        list = [];
      }

      return list.map(function (item, idx) {
        var isDivider = item.type === 'Divider';
        return React.createElement(Col, {
          className: isDivider ? 'divider' : '',
          key: isDivider ? idx : item.pluginKey,
          style: {
            width: item.props && item.props.width || 40,
            flex: 'none'
          }
        }, !isDivider && React.createElement(TopPlugin, {
          config: item,
          pluginClass: _this.editor.pluginComponents[item.pluginKey],
          status: _this.editor.pluginStatus[item.pluginKey]
        }));
      });
    };

    _this.editor = props.editor;
    _this.config = _this.editor.config.plugins && _this.editor.config.plugins.topArea;
    return _this;
  }

  var _proto = TopArea.prototype;

  _proto.componentDidMount = function componentDidMount() {};

  _proto.componentWillUnmount = function componentWillUnmount() {};

  _proto.render = function render() {
    if (!this.config) return null;
    var leftList = [];
    var rightList = [];
    this.config.forEach(function (item) {
      var align = item.props && item.props.align === 'right' ? 'right' : 'left'; // 分隔符不允许相邻

      if (item.type === 'Divider') {
        var currentList = align === 'right' ? rightList : leftList;
        if (currList.length === 0 || currList[currList.length - 1].type === 'Divider') return;
      }

      if (align === 'right') {
        rightList.push(item);
      } else {
        leftList.push(item);
      }
    });
    return React.createElement("div", {
      className: "lowcode-top-area"
    }, React.createElement("div", {
      className: "left-area"
    }, this.renderPluginList(leftList)), React.createElement("div", {
      classname: "right-area"
    }, this.renderPluginList(rightList)));
  };

  return TopArea;
}(PureComponent);

TopArea.displayName = 'lowcodeTopArea';
export { TopArea as default };