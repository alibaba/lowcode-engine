import React, { Component } from 'react';
import { Tab } from '@alifd/next';
import { Editor } from '@ali/lowcode-editor-core';
import { js_beautify, css_beautify } from 'js-beautify';
import MonacoEditor from 'react-monaco-editor';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.main.js';
import './index.scss';
import transfrom from './transform';

const TAB_KEY = {
  JS_TAB: 'js_tab',
  CSS_TAB: 'css_tab',
};

const defaultEditorOption = {
  width: '100%',
  height: '95%',
  options: {
    readOnly: false,
    automaticLayout: true,
    folding: true, // 默认开启折叠代码功能
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
  functionName: string;
}

export default class SourceEditor extends Component<{
  editor: Editor;
}> {
  private monocoEditor;

  private editorCmd;

  private editorJsRef = React.createRef();

  private editorCssRef = React.createRef();

  private editorNode;

  state = {
    isFullScreen:false,
    tabKey: TAB_KEY.JS_TAB,
    isShowSaveBtn:true
  };

  // eslint-disable-next-line react/no-deprecated
  componentWillMount() {
    const { editor } = this.props;


    // 添加函数
    editor.on('sourceEditor.addFunction', (params: FunctionEventParam) => {
      this.callEditorEvent('sourceEditor.addFunction', params);
    });

    // 定位函数
    editor.on('sourceEditor.focusByFunction', (params: FunctionEventParam) => {
      this.callEditorEvent('sourceEditor.focusByFunction', params);
    });

    // 插件面板关闭事件,监听规则同上
    editor.on('skeleton.panel-dock.unactive', (pluginName) => {
      if (pluginName == 'sourceEditor') {
        this.saveSchema();
      }
    });

    // 插件面板打开事件,监听规则同上
    editor.on('skeleton.panel-dock.active', (pluginName) => {
      if (pluginName == 'sourceEditor') {
        this.initCode();
      }
    });

    this.initCode();
  }


  componentDidMount() {
    this.editorNode = this.editorJsRef.current; // 记录当前dom节点；
  }

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

    this.showJsEditor();

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

  initCode = () => {
    const { editor } = this.props;
    const schema = editor.get('designer').project.getSchema();
    const jsCode = js_beautify(transfrom.schema2Code(schema), { indent_size: 2, indent_empty_lines: true });
    let css;

    if (schema.componentsTree[0].css) {
      css = css_beautify(schema.componentsTree[0].css, { indent_size: 2 });
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
      { identifier: 'event_id', range, text: functionCode, forceMoveMarkers: true },
    ]);

    setTimeout(() => {
      const newPosition = new monaco.Position(count + 1, 2);
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
    const { functionName } = params;
    const matchedResult = this.monocoEditor
      .getModel()
      .findMatches(`${functionName}\\s*\\([\\s\\S]*\\)[\\s\\S]*\\{`, false, true)[0];
    if (matchedResult) {
      const { monocoEditor } = this;
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

  editorDidMount = (editor) => {
    this.monocoEditor = editor;

    if (this.editorCmd) {
      this.callEditorEvent(this.editorCmd.eventName, this.editorCmd.params);
    }
  };

  fullScreen = () => {
    document.body.appendChild(this.editorNode);

    const fullScreenOption = {
      ...defaultEditorOption,
      lineNumbers: 'on',
      folding: true,
      scrollBeyondLastLine: true,
      minimap: {
        enabled: true,
      },
    };

    this.monocoEditor.updateOptions(fullScreenOption);
    // if (this.editorParentNode) {
    //   if (this.editorParentNode.firstChild) {
    //     this.editorParentNode.insertBefore(this.editorNode, this.editorParentNode.firstChild);
    //   } else {
    //     this.editorParentNode.appendChild(this.editorNode);
    //   }
    // }
  };

  onTabChange = (key) => {
    const { editor } = this.props;
    const schema = editor.get('designer').project.getSchema();
    console.log(schema);

    this.setState({
      selectTab: key,
    });

    if (key === TAB_KEY.JS_TAB) {
      this.showJsEditor();
    } else {
      this.showCssEditor();
    }
  };

  showJsEditor = () => {
    document.getElementById('cssEditorDom').setAttribute('style', 'display:none');
    document.getElementById('jsEditorDom').setAttribute('style', 'block');
  };

  showCssEditor = () => {
    document.getElementById('jsEditorDom').setAttribute('style', 'display:none');
    document.getElementById('cssEditorDom').setAttribute('style', 'block');
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
  };


  saveSchema = () => {
    const { jsCode } = this.state;
    const { editor } = this.props;
    const functionMap = transfrom.code2Schema(jsCode);
    const schema = editor.get('designer').project.getSchema();
    const oldSchemaStr = JSON.stringify(schema);
    const newSchema = transfrom.setFunction2Schema(functionMap, schema);

    if (newSchema != '' && JSON.stringify(newSchema) != oldSchemaStr) {
      editor.get('designer').project.setSchema(newSchema);
      successFlag && Message.success('保存成功')
    }
  };

  render() {
    const { selectTab, jsCode, css ,isShowSaveBtn} = this.state;
    const tabs = [
      { tab: 'index.js', key: TAB_KEY.JS_TAB },
      { tab: 'style.css', key: TAB_KEY.CSS_TAB },
    ];

    return (
      <div className="source-editor-container">

        <Tab size="small" shape="wrapped" onChange={this.onTabChange} activeKey={selectTab}>
          {tabs.map((item) => (
            <Tab.Item key={item.key} title={item.tab} />
          ))}
        </Tab>
        { isShowSaveBtn && <div className="button-container"><Button type="primary" onClick={()=>this.saveSchema(successFlag)}>保存代码</Button></div>}

        <div style={{ height: '100%' }} className="editor-context-container">
          <div id="jsEditorDom" className="editor-context" ref={this.editorJsRef}>
            <MonacoEditor
              value={jsCode}
              {...defaultEditorOption}
              {...{ language: 'javascript' }}
              onChange={(newCode) => this.updateCode(newCode)}
              editorDidMount={(editor, monacoEditor) => this.editorDidMount.call(this, editor, monacoEditor, TAB_KEY.JS_TAB)}
            />
          </div>
          <div className="editor-context" id="cssEditorDom" ref={this.editorCssRef}>
            <MonacoEditor
              value={css}
              {...defaultEditorOption}
              {...{ language: 'css' }}
              onChange={(newCode) => this.updateCode(newCode)}
            />
          </div>
        </div>


        {/* <div className="full-screen-container" onClick={this.fullScreen}>
          <img src="https://gw.alicdn.com/tfs/TB1d7XqE1T2gK0jSZFvXXXnFXXa-200-200.png"></img>
        </div> */}
      </div>
    );
  }
}
