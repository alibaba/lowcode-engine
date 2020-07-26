import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { js_beautify, css_beautify } from 'js-beautify';
import MonacoEditor from 'react-monaco-editor';
import classNames from 'classnames';

import { Icon, Message } from '@alife/next';
import ObjectButton from '@ali/iceluna-comp-object-button';
import FormItem from '@ali/iceluna-comp-form/lib/item';
import { serialize, jsonuri, generateI18n } from '@ali/iceluna-sdk/lib/utils';
import localeConfig from '@ali/iceluna-sdk/lib/hoc/localeConfig';

import Snippets from './locale/snippets';
import zhCN from './locale/zh-CN';
import './index.scss';

let registerApiAndSnippetStatus = false; //判断注册api机制

window.bt = js_beautify;
class MonacoEditorView extends PureComponent {
  static displayName = 'MonacoEditor';
  render() {
    const { type, ...restProps } = this.props;
    const Node = type == 'button' ? MonacoEditorButtonView : MonacoEditorDefaultView;
    return <Node {...restProps} registerApi={(apis) => Object.assign(this, apis)} />;
  }
}

localeConfig('MonacoEditor', MonacoEditorView);

//monaco编辑器存在3种主题：vs、vs-dark、hc-black
class MonacoEditorDefaultView extends PureComponent {
  static displayName = 'MonacoEditorDefault';
  static propTypes = {
    locale: PropTypes.string,
    messages: PropTypes.object,
    language: PropTypes.string,
  };
  static defaultProps = {
    locale: 'zh-CN',
    messages: zhCN,
    width: '100%',
    height: '300px',
    language: 'json',
    autoFocus: false, //自动获得焦点
    autoSubmit: true, //自动提交
    placeholder: '', //默认占位内容
    btnText: '提交',
    btnSize: 'small',
    rules: [], //校验规则
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
        enabled: true,
      },
      scrollbar: {
        vertical: 'hidden',
        horizontal: 'hidden',
        verticalScrollbarSize: 0,
      },
    },
  };
  strValue: string;
  i18n: any;
  editorRef: React.RefObject<unknown>;
  options: any;
  fullScreenOptions: any;
  position: any;
  editor: any;
  editorNode: unknown;
  editorParentNode: any;
  constructor(props: Readonly<{}>) {
    super(props);
    this.strValue = '';
    this.i18n = generateI18n(props.locale, props.messages);
    this.editorRef = React.createRef();
    this.options = Object.assign({}, MonacoEditorDefaultView.defaultProps.options, props.options);
    this.fullScreenOptions = {
      ...this.options,
      lineNumbers: 'on',
      folding: true,
      scrollBeyondLastLine: true,
      minimap: {
        enabled: true,
      },
    };
    this.state = {
      isFullScreen: false,
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.fullScreen = this.fullScreen.bind(this);
    this.format = this.format.bind(this);
  }

  componentDidUpdate() {
    //如果是全屏操作，获得焦点，光标保留在原来位置;
    if (this.position) {
      this.editor.focus();
      this.editor.setPosition(this.position);
      delete this.position;
    }
  }
  componentDidMount() {
    this.editorNode = this.editorRef.current; //记录当前dom节点；
    this.editorParentNode = this.editorNode.parentNode; //记录父节点;
    //自动获得焦点, 格式化需要时间
    if (this.props.autoFocus) {
      setTimeout(() => {
        this.editor.setPosition({
          column: 4,
          lineNumber: 2,
        });
        this.editor.focus();
      }, 100);
    }
    //快捷键编码
    const CtrlCmd = 2048;
    const KEY_S = 49;
    const Shift = 1024;
    const KEY_F = 36;
    const KEY_B = 32;
    const Escape = 9;

    this.editor.addCommand(CtrlCmd | KEY_S, () => {
      this.onSubmit(); //保存快捷键
    });
    this.editor.addCommand(CtrlCmd | Shift | KEY_F, () => {
      this.fullScreen(); //全屏快捷键
    });
    this.editor.addCommand(CtrlCmd | KEY_B, () => {
      this.format(); //美化快捷键
    });
    this.editor.addCommand(Escape, () => {
      this.props.onEscape && this.props.onEscape();
    });
    //注册api
    this.editor.submit = this.onSubmit;
    this.editor.format = this.format;
    this.editor.fullScreen = this.fullScreen;
    this.editor.toJson = this.toJson;
    this.editor.toObject = this.toObject;
    this.editor.toFunction = this.toFunction;
    //针对object情况，改写setValue和getValue api
    if (this.props.language === 'object') {
      const getValue = this.editor.getValue;
      const setValue = this.editor.setValue;
      this.editor.getValue = () => {
        return getValue.call(this.editor).substring(this.valuePrefix.length);
      };
      this.editor.setValue = (value) => {
        return setValue.call(this.editor, [this.valuePrefix + value]);
      };
    }
  }

  render() {
    const {
      value,
      placeholder,
      style,
      className,
      width,
      height,
      language,
      theme,
      editorWillMount,
      editorDidMount,
      registerApi,
    } = this.props;

    const { isFullScreen } = this.state;
    this.valuePrefix = ''; //值前缀
    if (language === 'object') this.valuePrefix = 'export default ';
    if (!this.isFullScreenAction) {
      //将值转换成目标值
      const nowValue = this.valueHandler(value || placeholder, language);
      const curValue = this.valueHandler(this.strValue, language);
      if (nowValue !== curValue) this.strValue = nowValue;
      if (language === 'object') this.strValue = this.strValue || placeholder || '{\n\t\n}'; //设置初始化值
      if (language === 'json' && this.strValue === '{}') this.strValue = '{\n\t\n}';
    }
    this.isFullScreenAction = false;
    //真实高亮语言
    let tarLanguage = language;
    if (language === 'object' || language === 'function') {
      tarLanguage = 'javascript';
    }
    const classes = classNames('monaco-editor-wrap', {
      'monaco-fullscreen': !!isFullScreen,
      'monaco-nofullscreen': !isFullScreen,
    });
    const tarStyle = Object.assign({ minHeight: 60, width, height }, style);
    let tempValue = this.valuePrefix + this.strValue;
    if (tarLanguage === 'json') {
      try {
        tempValue = JSON.stringify(JSON.parse(tempValue || '{}'), null, 2);
      } catch (err) {
        console.log(err);
      }
    }
    return (
      <div className={className} style={tarStyle}>
        <div ref={this.editorRef} style={{ height: '100%' }} className={classes}>
          <MonacoEditor
            value={tempValue}
            width="100%"
            height="300"
            language={tarLanguage}
            theme={theme || window.__monacoTheme || 'vs-dark'}
            options={isFullScreen ? this.fullScreenOptions : this.options}
            onChange={this.onChange}
            editorWillMount={editorWillMount}
            editorDidMount={(editor, monaco) => {
              this.editor = editor;
              registerApi({ editor });
              this.registerApiAndSnippet(monaco);
              editorDidMount && editorDidMount.call(this, arguments);
            }}
          />
          <a
            onClick={this.fullScreen}
            className="monaco_fullscreen_icon"
            title={
              isFullScreen ? `${this.i18n('cancelFullScreen')} cmd+shift+f` : `${this.i18n('fullScreen')} cmd+shift+f`
            }
          >
            <Icon type={isFullScreen ? 'quxiaoquanping' : 'quanping'} />
          </a>
        </div>
      </div>
    );
  }

  //值变化
  onChange(curValue) {
    if (curValue === this.valuePrefix + this.strValue) return;
    const { onAfterChange, language, autoSubmit, onChange } = this.props;
    this.strValue = curValue; //记录当前格式
    if (this.ct) clearTimeout(this.ct);
    this.ct = setTimeout(() => {
      this.position = this.editor.getPosition();
      const ret = this.resultHandler(curValue, language);
      if (autoSubmit) onChange && onChange(ret.value);
      onAfterChange && onAfterChange(ret.value, ret.error, this.editor);
    }, 300);
  }

  //提交动作
  onSubmit() {
    const { onSubmit, onChange, language } = this.props;
    const curValue = this.editor.getValue();
    const ret = this.resultHandler(curValue, language);
    if (!ret.error) onChange && onChange(ret.value);
    onSubmit && onSubmit(ret.value, ret.error, this.editor);
  }

  //值类型转换处理
  valueHandler(value, language) {
    let tarValue = value || '';
    if (language === 'json') {
      if (value && typeof value === 'object') {
        tarValue = JSON.stringify(value, null, 2);
      } else if (value && typeof value === 'string') {
        try {
          const ret = this.toJson(value);
          if (!ret.error) tarValue = JSON.stringify(ret.value, null, 2);
        } catch (err) {}
      }
    } else if (language === 'function') {
      if (typeof value === 'function') {
        tarValue = value.toString();
      }
      if (tarValue && typeof tarValue === 'string') {
        tarValue = js_beautify(tarValue, { indent_size: 2, indent_empty_lines: true });
      }
    } else if (language === 'object') {
      //先转成对象，在进行序列化和格式化；
      value = value || {};
      if (value && typeof value === 'object') {
        try {
          tarValue = serialize(value, { unsafe: true });
          tarValue = js_beautify(tarValue, { indent_size: 2, indent_empty_lines: true });
        } catch (err) {}
      } else if (typeof value === 'string') {
        try {
          const ret = this.resultHandler(value, 'object');
          tarValue = ret.error ? ret.value : serialize(ret.value, { unsafe: true });
          tarValue = js_beautify(tarValue, { indent_size: 2, indent_empty_lines: true });
        } catch (err) {}
      }
    }
    return tarValue;
  }

  //结果处理
  resultHandler(value, language) {
    let ret = { value };
    if (language === 'json') {
      ret = this.toJson(value);
    } else if (language === 'object') {
      ret = this.toObject(value);
    } else if (language === 'function') {
      ret = this.toFunction(value);
    }
    return ret;
  }

  //设置全屏时的动作
  fullScreen() {
    if (!this.editorRef) return;
    //还原到原来位置；
    this.position = this.editor.getPosition();
    if (this.state.isFullScreen) {
      if (this.editorParentNode) {
        if (this.editorParentNode.firstChild) {
          this.editorParentNode.insertBefore(this.editorNode, this.editorParentNode.firstChild);
        } else {
          this.editorParentNode.appendChild(this.editorNode);
        }
      }
    } else {
      document.body.appendChild(this.editorNode);
    }
    const nextFs = !this.state.isFullScreen;
    this.isFullScreenAction = true; //记录是全屏幕操作
    this.setState(
      {
        isFullScreen: nextFs,
      },
      () => {
        this.editor.updateOptions(nextFs ? this.fullScreenOptions : this.options);
      },
    );
  }

  //美化代码
  format() {
    const { language } = this.props;
    if (!this.editor) return;
    if (/^\$_obj?\{.*?\}$/m.test(this.editor.getValue())) return;
    if (this.props.language === 'json' || this.props.language === 'object' || this.props.language === 'function') {
      const tarValue = js_beautify(this.editor.getValue(), { indent_size: 2 });
      this.editor.setValue(tarValue);
    } else if (this.props.language === 'less' || this.props.language === 'css' || this.props.language === 'scss') {
      const tarValue = css_beautify(this.editor.getValue(), { indent_size: 2 });
      this.editor.setValue(tarValue);
    } else {
      this.editor.getAction('editor.action.formatDocument').run();
    }
  }

  //校验是否是json
  toJson(value) {
    try {
      const obj = new Function(`'use strict'; return ${value.replace(/[\r\n\t]/g, '')}`)();
      if (typeof obj === 'object' && obj) {
        const tarValue = new Function(`'use strict'; return ${value}`)();
        return { value: JSON.parse(JSON.stringify(tarValue)) };
      }
      return { error: this.i18n('jsonIllegal'), value };
    } catch (err) {
      return { error: err, value };
    }
  }

  //校验是否为object对象
  toObject(value) {
    try {
      const obj = new Function(`'use strict';return ${value}`)();
      if (obj && typeof obj === 'object') {
        if (jsonuri.isCircular(obj)) return { error: this.i18n('circularRef'), value };
        return { value: obj };
      } else {
        return { error: this.i18n('objectIllegal'), value };
      }
    } catch (err) {
      return { error: err, value };
    }
  }

  //校验是否为function
  toFunction(value) {
    try {
      const fun = new Function(`'use strict';return ${value}`)();
      if (fun && typeof fun === 'function') {
        return { value: fun };
      } else {
        return { error: this.i18n('functionIllegal'), value };
      }
    } catch (err) {
      return { error: err, value };
    }
  }

  //注册api和代码片段
  registerApiAndSnippet(monaco) {
    if (registerApiAndSnippetStatus) return;
    registerApiAndSnippetStatus = true;
    //注册this.提示的方法;
    const thisSuggestions = [];
    Snippets.map((item) => {
      if (!item.label || !item.kind || !item.insertText) return;
      const tarItem = Object.assign(item, {
        label: item.label,
        kind: monaco.languages.CompletionItemKind[item.kind],
        insertText: item.insertText,
      });
      if (item.insertTextRules)
        tarItem.insertTextRules = monaco.languages.CompletionItemInsertTextRule[item.insertTextRules];
      thisSuggestions.push(tarItem);
    });
    monaco.languages.registerCompletionItemProvider('javascript', {
      provideCompletionItems: (model, position) => {
        const textUntilPosition = model.getValueInRange({
          startLineNumber: position.lineNumber,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });
        const match = textUntilPosition.match(/(^this\.)|(\sthis\.)/);
        const suggestions = match ? thisSuggestions : [];
        return { suggestions: suggestions };
      },
      triggerCharacters: ['.'],
    });
  }
}
const prefix = 'data:text/javascript;charset=utf-8,';
const baseUrl = 'https://g.alicdn.com/iceluna/iceluna-vendor/0.0.1/';
window.MonacoEnvironment = {
  getWorkerUrl: function(label: string) {
    if (label === 'json') {
      return `${prefix}${encodeURIComponent(`
        importScripts('${baseUrl}json.worker.js');`)}`;
    }
    if (['css', 'less', 'scss'].includes(label)) {
      return `${prefix}${encodeURIComponent(`
        importScripts('${baseUrl}css.worker.js');`)}`;
    }
    if (label === 'html') {
      return `${prefix}${encodeURIComponent(`
        importScripts('${baseUrl}html.worker.js');`)}`;
    }
    if (['typescript', 'javascript'].includes(label)) {
      return `${prefix}${encodeURIComponent(`
        importScripts('${baseUrl}typescript.worker.js');`)}`;
    }
    return `${prefix}${encodeURIComponent(`
      importScripts('${baseUrl}editor.worker.js');`)}`;
  },
};

export default class MonacoEditorButtonView extends PureComponent {
  static displayName = 'MonacoEditorButton';
  static propTypes = {
    locale: PropTypes.string,
    messages: PropTypes.object,
  };
  static defaultProps = {
    locale: 'zh-CN',
    messages: zhCN,
  };
  i18n: any;
  objectButtonRef: React.RefObject<unknown>;
  constructor(props: Readonly<{}>) {
    super(props);
    this.i18n = generateI18n(props.locale, props.messages);
    this.objectButtonRef = React.createRef();
    // 兼容代码，待去除
    window.__ctx.appHelper.constants = window.__ctx.appHelper.constants || {};
  }
  afterHandler(value: { nrs_temp_field: any }) {
    if (!value) return;
    return value.nrs_temp_field;
  }
  beforeHandler(value: any) {
    if (!value) return;
    return { nrs_temp_field: value };
  }
  message(type: string, title: any, dom: Element | null) {
    Message.show({
      type,
      title,
      duration: 1000,
      align: 'cc cc',
      overlayProps: {
        target: dom,
      },
    });
  }
  componentDidMount() {
    const { registerApi } = this.props;
    const objectButtonThis = this.objectButtonRef;
    registerApi &&
      registerApi({
        show: objectButtonThis.showModal,
        hide: objectButtonThis.hideModal,
        submit: objectButtonThis.submitHandler,
        setValues: objectButtonThis.setValues,
      });
  }
  render() {
    const self = this;
    const { locale, messages, value, onChange, field, languages, ...restProps } = this.props;
    const { id } = field;
    const tarRestProps = { ...restProps };
    tarRestProps.autoSubmit = true;
    tarRestProps.autoFocus = true;
    const tarOnSubmit = tarRestProps.onSubmit;
    //确保monaco快捷键保存，能出发最外层的保存
    tarRestProps.onSubmit = (value, error) => {
      const msgDom = document.querySelector('.object-button-overlay .next-dialog-body');
      if (error) return this.message('error', this.i18n('formatError'), msgDom);
      this.objectButtonRef &&
        this.objectButtonRef.current &&
        this.objectButtonRef.current.submitHandler(() => {
          this.message('success', this.i18n('saved'), msgDom);
        });
    };
    const tarObjProps = {};
    tarObjProps.className = 'luna-monaco-button';
    if (tarRestProps['data-meta']) {
      delete tarRestProps['data-meta'];
      tarObjProps['data-meta'] = 'Field';
    }

    tarObjProps.id = id;
    tarObjProps.value = value || '';
    tarObjProps.onChange = onChange;
    const tarRule = [];
    //判断，如果是json，function, object等类型，自动追加校验规则；
    if (tarRestProps.language && ['json', 'function', 'object'].includes(tarRestProps.language)) {
      if (['json', 'object'].includes(tarRestProps.language)) {
        tarRule.push({
          validator: function(value: any, callback: (arg0: undefined) => void) {
            if (typeof value !== 'object') {
              callback(self.i18n('formatError'));
            } else {
              callback();
            }
          },
        });
      } else {
        tarRule.push({
          validator: function(value: any, callback: (arg0: undefined) => void) {
            if (typeof value !== 'function') {
              callback(self.i18n('formatError'));
            } else {
              callback();
            }
          },
        });
      }
    }
    return (
      <div>
        <ObjectButton
          locale={locale}
          messages={messages}
          {...tarObjProps}
          ref={this.objectButtonRef}
          beforeHandler={this.beforeHandler.bind(this)}
          afterHandler={this.afterHandler.bind(this)}
          onSubmit={tarOnSubmit}
        >
          <FormItem name="nrs_temp_field" rules={tarRule}>
            <MonacoEditorDefaultView {...tarRestProps} registerApi={(apis: any) => Object.assign(this, apis)} />
          </FormItem>
        </ObjectButton>
      </div>
    );
  }
}
