import { Component, isValidElement, ReactElement, ReactNode } from 'react';
import { Tab, Search, Input, Button } from '@alifd/next';
import {Editor} from '@ali/lowcode-editor-core';
import { js_beautify, css_beautify } from 'js-beautify';
import MonacoEditor from 'react-monaco-editor';
import { Designer } from '@ali/lowcode-designer';
const TAB_KEY = {
  JS_TAB: 'js_tab',
  CSS_TAB: 'css_tab',
};

import './index.scss';
import transfrom from './transform';

const defaultEditorOption = {
  width: '100%',
  height: '96%',
  options: {
    readOnly: false,
    automaticLayout: true,
    folding: true, //默认开启折叠代码功能
    lineNumbers: 'on',
    wordWrap: 'off',
    formatOnPaste: true,
    fontSize: 12,
    tabSize: 2,
    scrollBeyondLastLine: false,
    fixedOverflowWidgets: false,
    snippetSuggestions: 'top',
    minimap: {
      enabled: false,
    },
    scrollbar: {
      vertical: 'auto',
      horizontal: 'auto',
    },
  },
};

interface FunctionEventParam {
  functionName: String;
}

export default class SourceEditor extends Component<{
  editor: Editor;
}> {
  private monocoEditor: Object;
  private editorCmd: Object;
  private editorRef = React.createRef();
  private editorNode: Object;
  private editorParentNode: Object;

  state = {
    isShow: false,
    tabKey: TAB_KEY.JS_TAB,
  };

  componentWillMount() {
    const { editor } = this.props;
    editor.on('leftPanel.show', (key: String) => {
      // debugger;
      if (key === 'sourceEditor' && !this.monocoEditor) {
        this.setState({
          isShow: true,
        });


        setTimeout(()=>{
          this.editorNode = this.editorRef.current; //记录当前dom节点；
          this.editorParentNode = this.editorNode.parentNode; //记录父节点;
          console.log(this.editorNode);
        },0)
      }
    });

    // 添加函数
    editor.on('sourceEditor.addFunction', (params: FunctionEventParam) => {
      this.callEditorEvent('sourceEditor.addFunction', params);
      this.openPluginPannel();
    });

    // 定位函数
    editor.on('sourceEditor.focusByFunction', (params: FunctionEventParam) => {
      this.callEditorEvent('sourceEditor.focusByFunction', params);
      this.openPluginPannel();
    });

    //editor.once('designer.mount', (designer: Designer) => {
      // let schema = designer.project.getSchema();
      // mock data
      let schema = {
        componentTree: [
          {
            state: {
              // 初始state：        选填 对象类型/变量表达式
              btnText: 'submit', // 默认数据值：              选填 变量表达式
            },
            css: 'body {font-size: 12px;} .botton{widht:100px;color:#ff00ff}', //css样式描述：      选填
            lifeCycles: {
              //生命周期:          选填 对象类型
              didMount: {
                type: 'JSExpression',
                value: "function() {\n \t\tconsole.log('did mount');\n\t}",
              },
              willUnmount: {
                type: 'JSExpression',
                value: "function() {\n \t\tconsole.log('will umount');\n\t}",
              },
            },
            methods: {
              //自定义方法对象：     选填 对象类型
              getData: {
                //自定义方法：                  选填 函数类型
                type: 'JSExpression',
                value: "function() {\n \t\tconsole.log('testFunc');\n \t}",
              },
            },
          },
        ],
      };

      this.initCode(schema);
    //});
  }

  componentDidMount(){


  }

  openPluginPannel = () => {
    const { editor } = this.props;
    // 判断面板是否处于激活状态
    if (!editor.leftNav || editor.leftNav != 'sourceEditor') {
      // 打开面板
      editor.emit('leftNav.change', 'sourceEditor');
    }
  };

  /**
   * 执行编辑器事件
   */
  callEditorEvent = (eventName, params) => {
    if (!this.monocoEditor) {
      this.editorCmd = {
        eventName,
        params,
      };
      return;
    }

    if (this.state.selectTab == TAB_KEY.CSS_TAB) {
      this.setState({
        selectTab: TAB_KEY.JS_TAB,
      });
    }

    if (eventName === 'sourceEditor.addFunction') {
      setTimeout(() => {
        this.addFunction(params);
      }, 100);
    } else if (eventName === 'sourceEditor.focusByFunction') {
      setTimeout(() => {
        this.focusByFunctionName(params);
      }, 100);
    }
  };

  initCode = (schema) => {
    let jsCode = js_beautify(transfrom.schema2Code(schema), { indent_size: 2, indent_empty_lines: true });
    let css;

    if (schema.componentTree[0].css) {
      css = css_beautify(schema.componentTree[0].css, { indent_size: 2 });
    }

    this.setState({
      jsCode,
      css,
      selectTab: TAB_KEY.JS_TAB,
    });
  };

  /**
   * 在js面板中添加一个新函数
   * @param params
   */
  addFunction(params: FunctionEventParam) {
    const count = this.monocoEditor.getModel().getLineCount() || 0;
    const range = new monaco.Range(count, 1, count, 1);
    const functionCode = transfrom.getNewFunctionCode(params.functionName);
    this.monocoEditor.executeEdits('log-source', [
      { identifier: 'event_id', range: range, text: functionCode, forceMoveMarkers: true },
    ]);
    setTimeout(() => {
      let newPosition = new monaco.Position(count + 1, 2);
      this.monocoEditor.setPosition(newPosition);
      this.monocoEditor.focus();
    }, 100);

    this.updateCode(this.monocoEditor.getModel().getValue());
  }

  /**
   * 根据函数名进行定位
   * @param functionName
   */
  focusByFunctionName(params: FunctionEventParam) {
    const functionName = params.functionName;
    const matchedResult = this.monocoEditor
      .getModel()
      .findMatches(`${functionName}\\s*\\([\\s\\S]*\\)[\\s\\S]*\\{`, false, true)[0];
    if (matchedResult) {
      let monocoEditor = this.monocoEditor;
      setTimeout(() => {
        monocoEditor.revealLineInCenter(matchedResult.range.startLineNumber);
        monocoEditor.setPosition({
          column: matchedResult.range.endColumn,
          lineNumber: matchedResult.range.endLineNumber,
        });
        monocoEditor.focus();
      }, 100);
    }
  }

  editorDidMount = (editor, monaco) => {
    console.log('editorDidMount', editor);

    // var commandId = editor.addCommand(
    //   0,
    //   function() {
    //     // services available in `ctx`
    //     alert('my command is executing!');
    //   },
    //   '',
    // );

    if (this.state.selectTab == TAB_KEY.JS_TAB) {
      this.monocoEditor = editor;
    }

    if (this.editorCmd) {
      this.callEditorEvent(this.editorCmd.eventName, this.editorCmd.params);
    }
  };

  onTabChange = (key) => {
    this.setState({
      selectTab: key,
    });
  };

  updateCode = (newCode) => {
    const { selectTab } = this.state;
    if (selectTab === TAB_KEY.JS_TAB) {
      this.setState({
        jsCode: newCode,
      });
    } else {
      this.setState({
        css: newCode,
      });
    }

    transfrom.code2Schema(newCode);
  };

  render() {
    const { isShow, selectTab, jsCode, css } = this.state;
    const tabs = [
      { tab: 'index.js', key: TAB_KEY.JS_TAB },
      { tab: 'style.css', key: TAB_KEY.CSS_TAB },
    ];

    return (
      <div className="source-editor-container" >
        <Tab size="small" shape="wrapped" onChange={this.onTabChange} activeKey={selectTab}>
          {tabs.map((item) => (
            <Tab.Item key={item.key} title={item.tab}>
              {isShow && (
                <div style={{ height: '100%' }} ref={this.editorRef}>
                  <MonacoEditor
                    value={selectTab == TAB_KEY.JS_TAB ? jsCode : css}
                    {...defaultEditorOption}
                    {...{ language: selectTab == TAB_KEY.JS_TAB ? 'typescript' : 'css' }}
                    onChange={(newCode) => this.updateCode(newCode)}
                    editorDidMount={(editor, monaco) => this.editorDidMount.call(this, editor, monaco)}
                  />
                </div>
              )}
            </Tab.Item>
          ))}
        </Tab>

        <div className="full-screen-container" onClick={this.fullScreen}>
          <img src="https://gw.alicdn.com/tfs/TB1d7XqE1T2gK0jSZFvXXXnFXXa-200-200.png"></img>
        </div>
      </div>
    );
  }
}
