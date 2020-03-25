import _extends from "@babel/runtime/helpers/extends";
import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import React, { PureComponent, Fragment } from 'react';
import { AreaManager } from '@ali/lowcode-editor-framework';
import Panel from '../../components/Panel';
import './index.scss';

var LeftAreaPanel = /*#__PURE__*/function (_PureComponent) {
  _inheritsLoose(LeftAreaPanel, _PureComponent);

  function LeftAreaPanel(props) {
    var _this;

    _this = _PureComponent.call(this, props) || this;
    _this.editor = void 0;
    _this.areaManager = void 0;

    _this.handleSkeletonUpdate = function () {
      // 当前区域插件状态改变是更新区域
      if (_this.areaManager.isPluginStatusUpdate('PanelIcon')) {
        _this.forceUpdate();
      }
    };

    _this.handlePluginChange = function (key) {
      _this.setState({
        activeKey: key
      });
    };

    _this.editor = props.editor;
    _this.areaManager = new AreaManager(_this.editor, 'leftArea');
    _this.state = {
      activeKey: 'none'
    };
    return _this;
  }

  var _proto = LeftAreaPanel.prototype;

  _proto.componentDidMount = function componentDidMount() {
    this.editor.on('skeleton.update', this.handleSkeletonUpdate);
    this.editor.on('leftPanel.show', this.handlePluginChange);
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.editor.off('skeleton.update', this.handleSkeletonUpdate);
    this.editor.off('leftPanel.show', this.handlePluginChange);
  };

  _proto.render = function render() {
    var _this2 = this;

    var activeKey = this.state.activeKey;
    var list = this.areaManager.getVisiblePluginList('PanelIcon');
    return React.createElement(Fragment, null, list.map(function (item) {
      var Comp = _this2.areaManager.getPluginClass(item.pluginKey);

      if (Comp) {
        return React.createElement(Panel, _extends({
          key: item.pluginKey,
          visible: item.pluginKey === activeKey
        }, item.props && item.props.panelProps), React.createElement(Comp, _extends({
          editor: _this2.editor,
          config: item
        }, item.pluginProps)));
      }

      return null;
    }));
  };

  return LeftAreaPanel;
}(PureComponent);

LeftAreaPanel.displayName = 'LowcodeLeftAreaPanel';
export { LeftAreaPanel as default };