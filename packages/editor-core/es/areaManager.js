import { clone, deepEqual } from './utils';

var AreaManager = /*#__PURE__*/function () {
  function AreaManager(editor, area) {
    this.pluginStatus = void 0;
    this.config = void 0;
    this.editor = void 0;
    this.area = void 0;
    this.editor = editor;
    this.area = area;
    this.config = editor && editor.config && editor.config.plugins && editor.config.plugins[this.area] || [];
    this.pluginStatus = clone(editor.pluginStatus);
  }

  var _proto = AreaManager.prototype;

  _proto.isPluginStatusUpdate = function isPluginStatusUpdate(pluginType, notUpdateStatus) {
    var _this = this;

    var pluginStatus = this.editor.pluginStatus;
    var list = pluginType ? this.config.filter(function (item) {
      return item.type === pluginType;
    }) : this.config;
    var isUpdate = list.some(function (item) {
      return !deepEqual(pluginStatus[item.pluginKey], _this.pluginStatus[item.pluginKey]);
    });

    if (!notUpdateStatus) {
      this.pluginStatus = clone(pluginStatus);
    }

    return isUpdate;
  };

  _proto.getVisiblePluginList = function getVisiblePluginList(pluginType) {
    var _this2 = this;

    var res = this.config.filter(function (item) {
      return !!(!_this2.pluginStatus[item.pluginKey] || _this2.pluginStatus[item.pluginKey].visible);
    });
    return pluginType ? res.filter(function (item) {
      return item.type === pluginType;
    }) : res;
  };

  _proto.getPlugin = function getPlugin(pluginKey) {
    if (pluginKey) {
      return this.editor && this.editor.plugins && this.editor.plugins[pluginKey];
    }
  };

  _proto.getPluginConfig = function getPluginConfig(pluginKey) {
    if (pluginKey) {
      return this.config.find(function (item) {
        return item.pluginKey === pluginKey;
      });
    }

    return this.config;
  };

  _proto.getPluginClass = function getPluginClass(pluginKey) {
    if (pluginKey) {
      return this.editor && this.editor.components && this.editor.components[pluginKey];
    }
  };

  _proto.getPluginStatus = function getPluginStatus(pluginKey) {
    if (pluginKey) {
      return this.editor && this.editor.pluginStatus && this.editor.pluginStatus[pluginKey];
    }
  };

  return AreaManager;
}();

export { AreaManager as default };