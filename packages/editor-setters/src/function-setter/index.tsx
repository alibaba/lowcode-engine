import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { Button, Icon,Dialog } from '@alifd/next';
import MonacoEditor from 'react-monaco-editor';
import { js_beautify, css_beautify } from 'js-beautify';
import './index.scss';
import { timingSafeEqual } from 'crypto';

const SETTER_NAME = 'function-setter'

const defaultEditorOption = {
  width: '100%',
  height: '100%',
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


interface FunctionSetterProps {
  value: string;
  type: string;
  defaultValue: string;
  placeholder: string;
  hasClear: boolean;
  onChange: (icon: string | object) => undefined;
  icons: string[];
}
export default class FunctionSetter extends PureComponent<FunctionSetterProps, {}> {
  static defaultProps = {
    value: undefined,
    type: 'string',
    defaultValue: '',
    hasClear: true,
    placeholder: '请点击选择 Icon',
    onChange: (icon: string | object) => undefined,
  };

  private emitEventName = '';

  state = {
    firstLoad: true,
    isShowDialog:false,
    functionCode:null
  };

  componentDidMount() {
    const { editor } = this.props.field;
    this.emitEventName = `${SETTER_NAME}-${this.props.field.id}`;
    editor.on(`${this.emitEventName}.bindEvent`, this.bindEvent)
  }

  bindEvent = (eventName) => {
    this.bindEventCallback(eventName);
  }


  componentWillUnmount() {
    const { editor } = this.props.field;
    editor.off(`${this.emitEventName}.bindEvent`, this.bindEvent)
  }


  bindFunction = () => {
    const { field, value } = this.props;
    field.editor.emit('eventBindDialog.openDialog', field.name, this.emitEventName);
  }

  openDialog = () => {
    const {value={}} = this.props;
    this.setState({
      isShowDialog:true
    })

    this.functionCode = value.value;
    
  }

  closeDialog = () => {
    this.setState({
      isShowDialog:false
    })
  }

  removeFunctionBind = () => {
    const { field ,removeProp} = this.props;
    removeProp();
  }

  parseFunctionName = (functionString: String) => {
    // 因为函数格式是固定的，所以可以按照字符换去匹配获取函数名
    let funNameStr = functionString.split('this.')[1];


    if (funNameStr){
      let endIndex = funNameStr.indexOf('(');
      return funNameStr.substr(0, endIndex);
    }else{
      return ''
    }
  }

  /**
   * 渲染按钮(初始状态)
   */
  renderButton = () => {
    return <Button type="normal" onClick={() => this.bindFunction()}>绑定函数</Button>
  }

  updateCode = (newCode) => {
    this.functionCode = newCode;
  }

  onDialogOk = () => {
    const {onChange} = this.props;
    onChange({
      type: 'JSFunction',
      value: this.functionCode
    });

    this.closeDialog();
  }

  focusFunctionName = (functionName) => {
    const { editor } = this.props.field;

    editor.get('skeleton').getPanel('sourceEditor').show();

    setTimeout(() => {
      editor.emit('sourceEditor.focusByFunction', {
        functionName
      })
    }, 300)
  }

  /**
   * 渲染绑定函数
   */
  renderBindFunction = () => {
    const { value } = this.props;
 
    // 解析函数名
    let functionName = this.parseFunctionName(value.value);
    return <div className="function-container">
      <img className="funtion-icon" src="https://gw.alicdn.com/tfs/TB1NXNhk639YK4jSZPcXXXrUFXa-200-200.png"></img>
      <span className="function-name" onClick={() => this.focusFunctionName(functionName)}>{functionName}</span>
      <Icon type="set" size="medium" className="funtion-operate-icon" onClick={this.bindFunction} />
      <Icon type="ashbin" size="medium" className="funtion-operate-icon" onClick={this.removeFunctionBind} />
    </div>
  }


  /**
   * 渲染编辑函数按钮(可直接编辑函数内容)
   */
  renderEditFunctionButton = () => {
      return <div>
          <Button type="primary" onClick={this.openDialog}><Icon type="edit" />编辑函数</Button>
      </div>
  }


  bindEventCallback = (eventName: String) => {
    const { onChange } = this.props;
    onChange({
      type: 'JSFunction',
      value: `function(){ this.${eventName}() }`,
    });
  }

  render() {
    const { value } = this.props;
    const {isShowDialog} = this.state;

    let functionName = '';
    if (value && value.value){
      functionName = this.parseFunctionName(value.value);
    }
    return <div className="lc-function-setter">
      {
        value ? (functionName?this.renderBindFunction():this.renderEditFunctionButton()) : this.renderButton()
      }

      {
         value && value.value && <Dialog visible={isShowDialog} closeable={'close'} title="函数编辑" onCancel={this.closeDialog} onOk={this.onDialogOk} onClose={()=>{this.closeDialog()}}>
         <div style={{width:'500px',height:'400px'}}>
         <MonacoEditor
               value={js_beautify(value.value)}
               {...defaultEditorOption}
               {...{ language: 'javascript' }}
               onChange={(newCode) => this.updateCode(newCode)}
             />
         </div>
         </Dialog>
      }
      

    </div>;
  }
}
