import _extends from "@babel/runtime/helpers/extends";
import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import React, { PureComponent } from 'react';
import LeftPlugin from '../../components/LeftPlugin';
import { utils, AreaManager } from '@ali/lowcode-editor-framework';
import './index.scss';
var isEmpty = utils.isEmpty;

var LeftAreaNav = /*#__PURE__*/function (_PureComponent) {
  _inheritsLoose(LeftAreaNav, _PureComponent);

  function LeftAreaNav(props) {
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

    _this.handlePluginChange = function (key) {
      var activeKey = _this.state.activeKey;
      var plugins = _this.editor.plugins;
      var prePlugin = plugins[activeKey];
      var nextPlugin = plugins[key];

      if (activeKey === 'none') {
        if (nextPlugin) {
          nextPlugin.open().then(function () {
            _this.updateActiveKey(key);
          });
        }
      } else if (activeKey === key) {
        if (prePlugin) {
          prePlugin.close().then(function () {
            _this.updateActiveKey('none');
          });
        }
      } else if (prePlugin) {
        // 先关后开
        prePlugin.close().then(function () {
          if (nextPlugin) {
            nextPlugin.open().then(function () {
              _this.updateActiveKey(key);
            });
          }
        });
      }
    };

    _this.handlePluginClick = function (item) {
      if (item.type === 'PanelIcon') {
        _this.handlePluginChange(item.pluginKey);
      }
    };

    _this.updateActiveKey = function (key) {
      _this.editor.set('leftNav', key);

      _this.setState({
        activeKey: key
      });

      _this.editor.emit('leftPanel.show', key);
    };

    _this.renderPluginList = function (list) {
      if (list === void 0) {
        list = [];
      }

      var activeKey = _this.state.activeKey;
      return list.map(function (item) {
        var pluginStatus = _this.areaManager.getPluginStatus(item.pluginKey);

        var pluginClass = _this.areaManager.getPluginClass(item.pluginKey);

        return React.createElement(LeftPlugin, _extends({
          key: item.pluginKey,
          config: item,
          editor: _this.editor,
          pluginClass: pluginClass,
          onClick: function onClick() {
            return _this.handlePluginClick(item);
          },
          active: activeKey === item.pluginKey
        }, pluginStatus));
      });
    };

    _this.editor = props.editor;
    _this.areaManager = new AreaManager(_this.editor, 'leftArea');
    _this.state = {
      activeKey: 'none'
    };
    return _this;
  }

  var _proto = LeftAreaNav.prototype;

  _proto.componentDidMount = function componentDidMount() {
    this.editor.on('skeleton.update', this.handleSkeletonUpdate);
    this.editor.on('leftNav.change', this.handlePluginChange);
    var visiblePanelPluginList = this.areaManager.getVisiblePluginList('IconPanel');
    var defaultKey = visiblePanelPluginList[0] && visiblePanelPluginList[0].pluginKey || 'componentAttr';
    this.handlePluginChange(defaultKey);
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.editor.off('skeleton.update', this.handleSkeletonUpdate);
    this.editor.off('leftNav.change', this.handlePluginChange);
  };

  _proto.render = function render() {
    var topList = [];
    var bottomList = [];
    var visiblePluginList = this.areaManager.getVisiblePluginList();

    if (isEmpty(visiblePluginList)) {
      return null;
    }

    visiblePluginList.forEach(function (item) {
      var align = item.props && item.props.align === 'bottom' ? 'bottom' : 'top';

      if (align === 'bottom') {
        bottomList.push(item);
      } else {
        topList.push(item);
      }
    });
    return React.createElement("div", {
      className: "lowcode-left-area-nav"
    }, React.createElement("div", {
      className: "bottom-area"
    }, this.renderPluginList(bottomList)), React.createElement("div", {
      className: "top-area"
    }, this.renderPluginList(topList)));
  };

  return LeftAreaNav;
}(PureComponent);

LeftAreaNav.displayName = 'LowcodeLeftAreaNav';
export { LeftAreaNav as default };