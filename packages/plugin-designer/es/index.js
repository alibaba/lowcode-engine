import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inheritsLoose from "@babel/runtime/helpers/inheritsLoose";

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

import React, { PureComponent } from 'react';
// @ts-ignore
import Designer from 'designer';
import './index.scss';
var SCHEMA = {
  version: '1.0',
  componentsMap: [],
  componentsTree: [{
    componentName: 'Page',
    fileName: 'test',
    dataSource: {
      list: []
    },
    state: {
      text: 'outter'
    },
    props: {
      ref: 'outterView',
      autoLoading: true,
      style: {
        padding: 20
      }
    },
    children: [{
      componentName: 'Form',
      props: {
        labelCol: 3,
        style: {},
        ref: 'testForm'
      },
      children: [{
        componentName: 'Form.Item',
        props: {
          label: '姓名：',
          name: 'name',
          initValue: '李雷'
        },
        children: [{
          componentName: 'Input',
          props: {
            placeholder: '请输入',
            size: 'medium',
            style: {
              width: 320
            }
          }
        }]
      }, {
        componentName: 'Form.Item',
        props: {
          label: '年龄：',
          name: 'age',
          initValue: '22'
        },
        children: [{
          componentName: 'NumberPicker',
          props: {
            size: 'medium',
            type: 'normal'
          }
        }]
      }, {
        componentName: 'Form.Item',
        props: {
          label: '职业：',
          name: 'profession'
        },
        children: [{
          componentName: 'Select',
          props: {
            dataSource: [{
              label: '教师',
              value: 't'
            }, {
              label: '医生',
              value: 'd'
            }, {
              label: '歌手',
              value: 's'
            }]
          }
        }]
      }, {
        componentName: 'Div',
        props: {
          style: {
            textAlign: 'center'
          }
        },
        children: [{
          componentName: 'Button.Group',
          props: {},
          children: [{
            componentName: 'Button',
            props: {
              type: 'primary',
              style: {
                margin: '0 5px 0 5px'
              },
              htmlType: 'submit'
            },
            children: '提交'
          }, {
            componentName: 'Button',
            props: {
              type: 'normal',
              style: {
                margin: '0 5px 0 5px'
              },
              htmlType: 'reset'
            },
            children: '重置'
          }]
        }]
      }]
    }]
  }]
};

var DesignerPlugin = /*#__PURE__*/function (_PureComponent) {
  _inheritsLoose(DesignerPlugin, _PureComponent);

  var _super = _createSuper(DesignerPlugin);

  function DesignerPlugin() {
    var _this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _PureComponent.call.apply(_PureComponent, [this].concat(args)) || this;
    _this.displayName = void 0;

    _this.handleSchemaReset = function (schema) {
      var editor = _this.props.editor;

      if (_this.designer) {
        _this.designer.setSchema(schema);
      } else {
        editor.once('designer.ready', function (designer) {
          designer.setSchema(schema);
        });
      }
    };

    _this.handleDesignerMount = function (designer) {
      var editor = _this.props.editor;
      _this.designer = designer;
      editor.set('designer', designer);
      editor.emit('designer.ready', designer);
    };

    return _this;
  }

  var _proto = DesignerPlugin.prototype;

  _proto.componentDidMount = function componentDidMount() {
    var editor = this.props.editor;
    editor.on('schema.reset', this.handleSchemaReset);
  };

  _proto.componentWillUmount = function componentWillUmount() {
    var editor = this.props.editor;
    editor.off('schema.reset', this.handleSchemaReset);
  };

  _proto.render = function render() {
    var editor = this.props.editor;
    var assets = editor.get('assets') || {};
    return /*#__PURE__*/React.createElement(Designer, {
      onMount: this.handleDesignerMount,
      className: "lowcode-plugin-designer",
      defaultSchema: SCHEMA,
      eventPipe: editor,
      componentsDescription: Object.values(assets.components),
      simulatorProps: {
        library: Object.values(assets.packages)
      }
    });
  };

  return DesignerPlugin;
}(PureComponent);

export { DesignerPlugin as default };