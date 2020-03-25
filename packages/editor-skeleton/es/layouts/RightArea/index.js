import _Tab from "@alifd/next/es/tab";
import _extends from "@babel/runtime/helpers/extends";
import _Badge from "@alifd/next/es/badge";
import _Icon from "@alifd/next/es/icon";
import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { AreaManager, utils } from '@ali/lowcode-editor-framework';
import './index.scss';
var isEmpty = utils.isEmpty;

var RightArea = /*#__PURE__*/function (_PureComponent) {
  _inheritsLoose(RightArea, _PureComponent);

  function RightArea(props) {
    var _this;

    _this = _PureComponent.call(this, props) || this;
    _this.editor = void 0;
    _this.areaManager = void 0;

    _this.handleSkeletonUpdate = function () {
      // 当前区域插件状态改变是更新区域
      if (_this.areaManager.isPluginStatusUpdate()) {
        var activeKey = _this.state.activeKey;

        var activePluginStatus = _this.areaManager.getPluginStatus(activeKey);

        if (activePluginStatus && activePluginStatus.visible) {
          _this.forceUpdate();
        } else {
          var currentPlugin = _this.areaManager.getPlugin(activeKey);

          if (currentPlugin) {
            currentPlugin.close().then(function () {
              _this.setState({
                activeKey: ''
              }, function () {
                var visiblePluginList = _this.areaManager.getVisiblePluginList('TabPanel');

                var firstPlugin = visiblePluginList && visiblePluginList[0];

                if (firstPlugin) {
                  _this.handlePluginChange(firstPlugin.pluginKey);
                }
              });
            });
          }
        }
      }
    };

    _this.handlePluginChange = function (key, isinit) {
      var activeKey = _this.state.activeKey;

      var currentPlugin = _this.areaManager.getPlugin(activeKey);

      var nextPlugin = _this.areaManager.getPlugin(key);

      var openPlugin = function openPlugin() {
        if (!nextPlugin) {
          console.error("plugin " + key + " has not regist in the editor");
          return;
        }

        nextPlugin.open().then(function () {
          _this.editor.set('rightNav', key);

          _this.setState({
            activeKey: key
          });
        });
      };

      if (key === activeKey && !isinit) return;

      if (currentPlugin) {
        currentPlugin.close().then(function () {
          openPlugin();
        });
      } else {
        openPlugin();
      }
    };

    _this.renderTabTitle = function (config) {
      var _ref = config.props || {},
          icon = _ref.icon,
          title = _ref.title;

      var pluginStatus = _this.editor.pluginStatus[config.pluginKey];
      var marked = pluginStatus.marked,
          disabled = pluginStatus.disabled,
          locked = pluginStatus.locked;
      var active = _this.state.activeKey === config.pluginKey;

      var renderTitle = function renderTitle() {
        return React.createElement("div", {
          className: classNames('right-plugin-title', {
            active: active,
            locked: locked,
            disabled: disabled
          })
        }, !!icon && React.createElement(_Icon, {
          size: "xs",
          type: icon
        }), title);
      };

      if (marked) {
        return React.createElement(_Badge, {
          dot: true
        }, renderTitle());
      }

      return renderTitle();
    };

    _this.renderTabPanels = function (list, height) {
      if (isEmpty(list)) {
        return null;
      }

      return React.createElement(_Tab, {
        className: "right-tabs",
        style: {
          height: height
        },
        activeKey: _this.state.activeKey,
        lazyLoad: false,
        onChange: _this.handlePluginChange
      }, list.map(function (item) {
        var Comp = _this.areaManager.getPluginClass(item.pluginKey);

        if (Comp) {
          return React.createElement(_Tab.Item, {
            key: item.pluginKey,
            title: _this.renderTabTitle(item),
            disabled: _this.editor.pluginStatus[item.pluginKey].disabled,
            style: {
              width: 100 / list.length + "%"
            }
          }, React.createElement(Comp, _extends({
            editor: _this.editor,
            config: item
          }, item.pluginProps)));
        }

        return null;
      }));
    };

    _this.renderPanels = function (list, height) {
      return list.map(function (item) {
        var Comp = _this.areaManager.getPluginClass(item.pluginKey);

        if (Comp) {
          return React.createElement("div", {
            className: "right-panel",
            style: {
              height: height
            },
            key: item.pluginKey
          }, React.createElement(Comp, _extends({
            editor: _this.editor,
            config: item
          }, item.pluginProps)));
        }

        return null;
      });
    };

    _this.editor = props.editor;
    _this.areaManager = new AreaManager(_this.editor, 'rightArea');
    _this.state = {
      activeKey: ''
    };
    return _this;
  }

  var _proto = RightArea.prototype;

  _proto.componentDidMount = function componentDidMount() {
    this.editor.on('skeleton.update', this.handleSkeletonUpdate);
    this.editor.on('rightNav.change', this.handlePluginChange);
    var visiblePluginList = this.areaManager.getVisiblePluginList('TabPanel');
    var defaultKey = visiblePluginList[0] && visiblePluginList[0].pluginKey || 'componentAttr';
    this.handlePluginChange(defaultKey, true);
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.editor.off('skeleton.update', this.handleSkeletonUpdate);
    this.editor.off('rightNav.change', this.handlePluginChange);
  };

  _proto.render = function render() {
    var tabList = this.areaManager.getVisiblePluginList('TabPanel');
    var panelList = this.areaManager.getVisiblePluginList('Panel');

    if (isEmpty(panelList) && isEmpty(tabList)) {
      return null;
    } else if (tabList.length === 1) {
      panelList.unshift(tabList[0]);
      tabList.splice(0, 1);
    }

    var height = Math.floor(100 / (panelList.length + (tabList.length > 0 ? 1 : 0))) + "%";
    return React.createElement("div", {
      className: "lowcode-right-area"
    }, this.renderTabPanels(tabList, height), this.renderPanels(panelList, height));
  };

  return RightArea;
}(PureComponent);

RightArea.displayName = 'LowcodeRightArea';
export { RightArea as default };