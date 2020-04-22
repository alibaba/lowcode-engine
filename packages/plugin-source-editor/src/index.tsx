import { Component, isValidElement, ReactElement, ReactNode } from 'react';
import { Tab, Search, Input, Button } from '@alifd/next';
import Editor from '@ali/lowcode-editor-core';
import { js_beautify, css_beautify } from 'js-beautify';
import MonacoEditor from 'react-monaco-editor';
import Panel from '../../vision-polyfill/src/skeleton/panel';

// import lolizer from './sorceEditorPlugin',

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
  panel?: Panel
}> {
  private monocoEditer: Object;
  private editorCmd: Object;

  state = {
    isShow: false,
    tabKey: TAB_KEY.JS_TAB,
  };

  async componentWillMount() {
    const { editor } = this.props;
    editor.on('leftPanel.show', (key: String) => {
      if (key === 'sourceEditor' && !this.monocoEditer) {
        this.setState({
          isShow: true,
        });
      }
    });

    // 添加函数
    editor.on('sourceEditor.addFunction', (params: FunctionEventParam) => {
      this.callEditorEvent('sourceEditor.addFunction', params);
      this.openPluginPannel();
    });

    // 定位函数
    editor.on('sourceEditor.focusByFunction',(params:FunctionEventParam)=>{
      this.callEditorEvent('sourceEditor.focusByFunction', params);
      this.openPluginPannel();
    })

    const designer = await editor.onceGot(Designer);
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
  }

  openPluginPannel = () => {
    const { editor, panel } = this.props;
    // 判断面板是否处于激活状态
    if (!editor.leftNav || editor.leftNav != 'sourceEditor') {
      // 打开面板
      editor.emit('leftNav.change', 'sourceEditor');
    }
    if (panel) {
      panel.show();
    }
  }

  callEditorEvent = (eventName, params) => {
    if (!this.monocoEditer) {
      this.editorCmd = {
        eventName,
        params,
      };
      return;
    }

    if (eventName === 'sourceEditor.addFunction') {
      this.addFunction(params);
    }else if (eventName === 'sourceEditor.focusByFunction'){
      this.focusByFunctionName(params);
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
    const count = this.monocoEditer.getModel().getLineCount() || 0;
    const range = new monaco.Range(count, 1, count, 1);
    const functionCode = transfrom.getNewFunctionCode(params.functionName);
    this.monocoEditer.executeEdits('log-source', [
      { identifier: 'event_id', range: range, text: functionCode, forceMoveMarkers: true },
    ]);
    setTimeout(() => {
      let newPosition = new monaco.Position(count + 1, 2);
      this.monocoEditer.setPosition(newPosition);
      this.monocoEditer.focus();
    }, 100);

    this.updateCode(this.monocoEditer.getModel().getValue());
  }

  /**
   * 根据函数名进行定位
   * @param functionName
   */
  focusByFunctionName(params: FunctionEventParam) {
    const functionName = params.functionName;
    const matchedResult = this.monocoEditer
      .getModel()
      .findMatches(`${functionName}\\s*\\([\\s\\S]*\\)[\\s\\S]*\\{`, false, true)[0];
    if (matchedResult) {

      setTimeout(()=>{
        this.monocoEditer.revealLineInCenter(matchedResult.range.startLineNumber);
        this.monocoEditer.setPosition({
          column: matchedResult.range.endColumn,
          lineNumber: matchedResult.range.endLineNumber,
        });

        this.monocoEditer.focus();
      },100)
    }
  }

  editorDidMount = (editor, monaco) => {
    console.log('editorDidMount', editor);
    this.monocoEditer = editor;

    if (this.editorCmd) {
      this.callEditorEvent(this.editorCmd.eventName, this.editorCmd.params);
    }

    // var commandId = editor.addCommand(
    //   0,
    //   function() {
    //     // services available in `ctx`
    //     alert('my command is executing!');
    //   },
    //   '',
    // );

    // monaco.languages.registerCodeLensProvider('javascript', {
    //   provideCodeLenses: function(model, token) {
    //     return {
    //       lenses: [
    //         {
    //           range: {
    //             startLineNumber: 1,
    //             startColumn: 1,
    //             endLineNumber: 1,
    //             endColumn: 1,
    //           },
    //           id: 'First Line',
    //           command: {
    //             id: commandId,
    //             title: 'First Line',
    //           },
    //         },
    //       ],
    //     };
    //   },
    //   resolveCodeLens: function(model, codeLens, token) {
    //     return codeLens;
    //   },
    // });
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
      <div className="source-editor-container">
        <Tab size="small" shape="wrapped" onChange={this.onTabChange}>
          {tabs.map((item) => (
            <Tab.Item key={item.key} title={item.tab}>
              {isShow && (
                <MonacoEditor
                  value={selectTab == TAB_KEY.JS_TAB ? jsCode : css}
                  {...defaultEditorOption}
                  {...{ language: selectTab == TAB_KEY.JS_TAB ? 'javascript' : 'css' }}
                  onChange={(newCode) => this.updateCode(newCode)}
                  editorDidMount={this.editorDidMount}
                />
              )}
            </Tab.Item>
          ))}
        </Tab>
      </div>
    );
  }
}
