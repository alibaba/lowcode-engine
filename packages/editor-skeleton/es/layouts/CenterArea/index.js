import _extends from "@babel/runtime/helpers/extends";
import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import React, { PureComponent } from 'react';
import { AreaManager } from '@ali/lowcode-editor-core';
import './index.scss';

var CenterArea = /*#__PURE__*/function (_PureComponent) {
  _inheritsLoose(CenterArea, _PureComponent);

  function CenterArea(props) {
    var _this;

    _this = _PureComponent.call(this, props) || this;
    _this.editor = void 0;
    _this.areaManager = void 0;

    _this.handleSkeletonUpdate = function () {
      // 当前区域插件状态改变是更新区域
      if (_this.areaManager.isPluginStatusUpdate()) {
        _this.forceUpdate();
      }
    };

    _this.editor = props.editor;
    _this.areaManager = new AreaManager(_this.editor, 'centerArea');
    return _this;
  }

  var _proto = CenterArea.prototype;

  _proto.componentDidMount = function componentDidMount() {
    this.editor.on('skeleton.update', this.handleSkeletonUpdate);
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.editor.off('skeleton.update', this.handleSkeletonUpdate);
  };

  _proto.render = function render() {
    var _this2 = this;

    var visiblePluginList = this.areaManager.getVisiblePluginList();
    return React.createElement("div", {
      className: "lowcode-center-area"
    }, visiblePluginList.map(function (item) {
      var Comp = _this2.areaManager.getPluginClass(item.pluginKey);

      if (Comp) {
        return React.createElement(Comp, _extends({
          key: item.pluginKey,
          editor: _this2.editor,
          config: item
        }, item.pluginProps));
      }

      return null;
    }));
  };

  return CenterArea;
}(PureComponent);

CenterArea.displayName = 'LowcodeCenterArea';
export { CenterArea as default };