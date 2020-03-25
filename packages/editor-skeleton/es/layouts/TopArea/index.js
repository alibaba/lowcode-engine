import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import _Grid from "@alifd/next/es/grid";
import React, { PureComponent } from 'react';
import { AreaManager } from '@ali/lowcode-editor-framework';
import TopPlugin from '../../components/TopPlugin';
import './index.scss';
var Row = _Grid.Row,
    Col = _Grid.Col;

var TopArea = /*#__PURE__*/function (_PureComponent) {
  _inheritsLoose(TopArea, _PureComponent);

  function TopArea(props) {
    var _this;

    _this = _PureComponent.call(this, props) || this;
    _this.areaManager = void 0;
    _this.editor = void 0;

    _this.handleSkeletonUpdate = function () {
      // 当前区域插件状态改变是更新区域
      if (_this.areaManager.isPluginStatusUpdate()) {
        _this.forceUpdate();
      }
    };

    _this.renderPluginList = function (list) {
      if (list === void 0) {
        list = [];
      }

      return list.map(function (item, idx) {
        var isDivider = item.type === 'Divider';

        var PluginClass = _this.areaManager.getPluginClass(item.pluginKey);

        return React.createElement(Col, {
          className: isDivider ? 'divider' : '',
          key: isDivider ? idx : item.pluginKey,
          style: {
            width: item.props && item.props.width || 36,
            flex: 'none'
          }
        }, !isDivider && React.createElement(TopPlugin, {
          config: item,
          pluginClass: PluginClass,
          editor: _this.editor
        }));
      });
    };

    _this.editor = props.editor;
    _this.areaManager = new AreaManager(props.editor, 'topArea');
    return _this;
  }

  var _proto = TopArea.prototype;

  _proto.componentDidMount = function componentDidMount() {
    this.editor.on('skeleton.update', this.handleSkeletonUpdate);
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.editor.off('skeleton.update', this.handleSkeletonUpdate);
  };

  _proto.render = function render() {
    var leftList = [];
    var rightList = [];
    var visiblePluginList = this.areaManager.getVisiblePluginList();
    visiblePluginList.forEach(function (item) {
      var align = item.props && item.props.align === 'right' ? 'right' : 'left'; // 分隔符不允许相邻

      if (item.type === 'Divider') {
        var currList = align === 'right' ? rightList : leftList;
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
    }, React.createElement(Row, null, this.renderPluginList(leftList))), React.createElement("div", {
      className: "right-area"
    }, React.createElement(Row, {
      justify: "end"
    }, this.renderPluginList(rightList))));
  };

  return TopArea;
}(PureComponent);

TopArea.displayName = 'LowcodeTopArea';
export { TopArea as default };