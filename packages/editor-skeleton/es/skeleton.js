import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/objectWithoutPropertiesLoose";
import _ConfigProvider from "@alifd/next/es/config-provider";
import _Loading from "@alifd/next/es/loading";
import _extends from "@babel/runtime/helpers/extends";
import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";
import React, { PureComponent } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import Editor, { utils } from '@ali/lowcode-editor-core';
import defaultConfig from './config/skeleton';
import skeletonUtils from './config/utils';
import TopArea from './layouts/TopArea';
import LeftArea from './layouts/LeftArea';
import CenterArea from './layouts/CenterArea';
import RightArea from './layouts/RightArea';
import './global.scss';
var comboEditorConfig = utils.comboEditorConfig,
    parseSearch = utils.parseSearch;
var renderIdx = 0;
export var Skeleton = /*#__PURE__*/function (_PureComponent) {
  _inheritsLoose(Skeleton, _PureComponent);

  Skeleton.getDerivedStateFromError = function getDerivedStateFromError() {
    return {
      __hasError: true
    };
  };

  function Skeleton(props) {
    var _this;

    _this = _PureComponent.call(this, props) || this;
    _this.editor = void 0;

    _this.init = function (isReset) {
      if (isReset === void 0) {
        isReset = false;
      }

      if (_this.editor) {
        _this.editor.destroy();
      }

      var _this$props = _this.props,
          utils = _this$props.utils,
          config = _this$props.config,
          components = _this$props.components;
      var editor = new Editor(comboEditorConfig(defaultConfig, config), components, _extends({}, skeletonUtils, {}, utils));
      _this.editor = editor; // eslint-disable-next-line no-underscore-dangle

      window.__ctx = {
        editor: editor,
        appHelper: editor
      };
      editor.once('editor.reset', function () {
        _this.setState({
          initReady: false
        });

        editor.emit('editor.beforeReset');

        _this.init(true);
      });

      _this.editor.init().then(function () {
        _this.setState({
          initReady: true,
          // 刷新IDE时生成新的skeletonKey保证插件生命周期重新执行
          skeletonKey: isReset ? "skeleton" + ++renderIdx : _this.state.skeletonKey
        }, function () {
          editor.emit('editor.ready');
          isReset && editor.emit('editor.afterReset');
        });
      });
    };

    _this.state = {
      initReady: false,
      skeletonKey: "skeleton" + renderIdx
    };

    _this.init();

    return _this;
  }

  var _proto = Skeleton.prototype;

  _proto.componentWillUnmount = function componentWillUnmount() {
    this.editor && this.editor.destroy();
  };

  _proto.componentDidCatch = function componentDidCatch(err) {
    console.error(err);
  };

  _proto.render = function render() {
    var _this$state = this.state,
        initReady = _this$state.initReady,
        skeletonKey = _this$state.skeletonKey,
        __hasError = _this$state.__hasError;
    var _this$props2 = this.props,
        location = _this$props2.location,
        history = _this$props2.history,
        match = _this$props2.match;

    if (__hasError || !this.editor) {
      return 'error';
    }

    location.query = parseSearch(location.search);
    this.editor.set('location', location);
    this.editor.set('history', history);
    this.editor.set('match', match);
    return React.createElement(_ConfigProvider, null, React.createElement(_Loading, {
      tip: "Loading",
      size: "large",
      visible: !initReady,
      fullScreen: true
    }, React.createElement("div", {
      className: "lowcode-editor",
      key: skeletonKey
    }, React.createElement(TopArea, {
      editor: this.editor
    }), React.createElement("div", {
      className: "lowcode-main-content"
    }, React.createElement(LeftArea.Nav, {
      editor: this.editor
    }), React.createElement(LeftArea.Panel, {
      editor: this.editor
    }), React.createElement(CenterArea, {
      editor: this.editor
    }), React.createElement(RightArea, {
      editor: this.editor
    })))));
  };

  return Skeleton;
}(PureComponent); // 通过React-Router包裹，支持编辑器内页面根据路由切换

Skeleton.displayName = 'LowcodeEditorSkeleton';

var SkeletonWithRouter = function SkeletonWithRouter(props) {
  var config = props.config,
      otherProps = _objectWithoutPropertiesLoose(props, ["config"]);

  return React.createElement(Router, null, React.createElement(Route, {
    path: "/*",
    component: function component(routerProps) {
      return React.createElement(Skeleton, _extends({}, routerProps, otherProps, config.skeleton && config.skeleton.props, {
        config: config
      }));
    }
  }));
};

export default SkeletonWithRouter;