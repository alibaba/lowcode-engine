
import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { Button, Icon, Dialog } from '@alifd/next';
import MonacoEditor from 'react-monaco-editor';
import { js_beautify } from 'js-beautify';

const defaultEditorOption = {
  width: '100%',
  height: '100%',
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


interface JsonSetterProps {
  value: string;
  type: string;
  defaultValue: string;
  placeholder: string;
  hasClear: boolean;
  onChange: (icon: string) => undefined;
  icons: string[];
}
export default class JsonSetter extends PureComponent<JsonSetterProps> {

  private datasourceCode = '';

  state = {
    isShowDialog: false,
    value: JSON.stringify(this.props.value),
  };

  openDialog = () => {
    const { value } = this.state;
    this.setState({
      isShowDialog: true,
    });

    this.datasourceCode = value;
  };

  closeDialog = () => {
    this.setState({
      isShowDialog: false,
    });
  };

  /**
   * 渲染按钮
   */
  renderButton = (value) => {
    return !value ? <Button type="normal" onClick={this.openDialog}>绑定数据</Button> : <Button type="primary" onClick={this.openDialog}><Icon type="edit" />编辑数据</Button>;
  };

  updateCode = (newCode) => {
    this.datasourceCode = newCode;
  };

  onDialogOk = () => {
    const { onChange } = this.props;
    onChange(JSON.parse(this.datasourceCode));
    this.closeDialog();
  };


  /**
   * 渲染编辑函数按钮(可直接编辑函数内容)
   */
  renderEditFunctionButton = () => {
    return (
      <div>
        <Button type="primary" onClick={this.openDialog}><Icon type="edit" />编辑数据</Button>
      </div>
    );
  };


  render() {
    const { value } = this.state;
    const { isShowDialog } = this.state;
    return (
      <div>
        {
          this.renderButton(value)
        }
        {

          <Dialog visible={isShowDialog} closeable={'close'} title="数据编辑" onCancel={this.closeDialog} onOk={this.onDialogOk} onClose={() => { this.closeDialog(); }}>
            <div style={{ width: '500px', height: '400px' }}>
              <MonacoEditor
                value={js_beautify(value)}
                {...defaultEditorOption}
                {...{ language: 'json' }}
                onChange={(newCode) => this.updateCode(newCode)}
              />
            </div>
          </Dialog>
      }
      </div>
    );
  }
}
