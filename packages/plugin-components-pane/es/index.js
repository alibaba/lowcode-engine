import _Select from "@alifd/next/es/select";
import _Search from "@alifd/next/es/search";
import _Icon from "@alifd/next/es/icon";
import _extends from "@babel/runtime/helpers/extends";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

import React, { PureComponent } from 'react';
import MaterialShow from '@ali/iceluna-comp-material-show';
import './index.scss';

var ComponentListPlugin = /*#__PURE__*/function (_PureComponent) {
  _inheritsLoose(ComponentListPlugin, _PureComponent);

  var _super = _createSuper(ComponentListPlugin);

  function ComponentListPlugin(props) {
    var _this;

    _this = _PureComponent.call(this, props) || this;

    _this.transformMaterial = function (componentList) {
      return componentList.map(function (category) {
        return {
          name: category.title,
          items: category.children.map(function (comp) {
            return _extends({}, comp, {
              name: comp.componentName,
              snippets: comp.snippets.map(function (snippet) {
                return {
                  name: snippet.title,
                  screenshot: snippet.screenshot,
                  code: JSON.stringify(snippet.schema)
                };
              })
            });
          })
        };
      });
    };

    _this.initComponentList = function () {
      var editor = _this.props.editor;
      var assets = editor.assets || {};
      var list = [];
      var libs = [];
      Object.values(assets.packages).forEach(function (item) {
        list.push(item.library);
        libs.push({
          label: item.title,
          value: item.library
        });
      });

      if (list.length > 1) {
        libs.unshift({
          label: '全部',
          value: list.join(',')
        });
      }

      var componentList = _this.transformMaterial(assets.componentList);

      _this.setState({
        libs: libs,
        componentList: componentList,
        currentLib: libs[0] && libs[0].value
      });

      editor.set('dndHelper', {
        handleResourceDragStart: function handleResourceDragStart(ev, tagName, schema) {
          // 物料面板中组件snippet的dragStart回调
          // ev: 原始的domEvent；tagName: 组件的描述文案；schema: snippet的schema
          if (editor.designer) {
            editor.designer.dragon.boost({
              type: 'nodedata',
              data: schema
            }, ev.nativeEvent);
          }
        }
      });
    };

    _this.searchAction = function (value) {
      _this.setState({
        searchKey: value
      });
    };

    _this.filterMaterial = function () {
      var _this$state = _this.state,
          searchKey = _this$state.searchKey,
          currentLib = _this$state.currentLib,
          componentList = _this$state.componentList;
      var libs = currentLib.split(',');
      return (componentList || []).map(function (cate) {
        return _extends({}, cate, {
          items: (cate.items || []).filter(function (item) {
            var libFlag = libs.some(function (lib) {
              return lib == item.library;
            });
            var keyFlag = true;

            if (searchKey) {
              keyFlag = ((item.name || '') + " " + (item.title || '')).toLowerCase().indexOf(searchKey.trim().toLowerCase()) >= 0;
            } else {
              keyFlag = item.is_show === undefined || !!(item.is_show == 1);
            }

            return libFlag && keyFlag;
          })
        });
      }).filter(function (cate) {
        return cate.items && cate.items.length > 0;
      });
    };

    _this.state = {
      loading: false,
      libs: [{
        label: '全部',
        value: 'all'
      }],
      searchKey: '',
      currentLib: 'all',
      componentList: []
    };
    return _this;
  }

  var _proto = ComponentListPlugin.prototype;

  _proto.componentDidMount = function componentDidMount() {
    var editor = this.props.editor;

    if (editor.assets) {
      this.initComponentList();
    } else {
      editor.once('editor.ready', this.initComponentList);
    }
  };

  _proto.render = function render() {
    var _this2 = this;

    var _this$state2 = this.state,
        libs = _this$state2.libs,
        loading = _this$state2.loading,
        currentLib = _this$state2.currentLib;
    return /*#__PURE__*/React.createElement("div", {
      className: "lowcode-component-list"
    }, /*#__PURE__*/React.createElement("div", {
      className: "title"
    }, /*#__PURE__*/React.createElement(_Icon, {
      type: "jihe",
      size: "small"
    }), /*#__PURE__*/React.createElement("span", null, "\u7EC4\u4EF6\u5E93")), /*#__PURE__*/React.createElement(_Search, {
      shape: "simple",
      size: "small",
      className: "search",
      placeholder: "\u8BF7\u8F93\u5165\u5173\u952E\u8BCD",
      onChange: this.searchAction,
      onSearch: this.searchAction,
      hasClear: true
    }), /*#__PURE__*/React.createElement(_Select, {
      size: "small",
      className: "select",
      dataSource: libs,
      value: currentLib,
      onChange: function onChange(value) {
        _this2.setState({
          currentLib: value
        });
      }
    }), /*#__PURE__*/React.createElement(MaterialShow, {
      className: "components-show",
      loading: loading,
      type: "component",
      dataSource: this.filterMaterial()
    }));
  };

  return ComponentListPlugin;
}(PureComponent);

ComponentListPlugin.displayName = 'LowcodeComponentListPlugin';
export { ComponentListPlugin as default };