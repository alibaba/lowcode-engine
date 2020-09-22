import React, { PureComponent } from 'react';
import { connect } from '@formily/react-schema-renderer';
import MonacoEditor, { EditorWillMount } from 'react-monaco-editor';
import _noop from 'lodash/noop';
import { editor } from 'monaco-editor';

export interface JSFunctionProps {
  className: string;
  value: any;
  onChange?: (val: any) => void;
}

export type JSFunctionState = {};

class JSFunctionComp extends PureComponent<JSFunctionProps, JSFunctionState> {
  static isFieldComponent = true;

  static defaultProps = {
    onChange: _noop,
  };

  private monacoRef: any = null;

  handleEditorChange = () => {
    if (this.monacoRef) {
      if (!(this.monacoRef as any).getModelMarkers().find((marker: editor.IMarker) => marker.owner === 'json')) {
        this.props.onChange?.((this.monacoRef as any)?.getModels()?.[0]?.getValue());
      }
    }
  };

  handleEditorWillMount: EditorWillMount = (editor) => {
    this.monacoRef = editor?.editor;
  };

  render() {
    const { value } = this.props;
    return (
      <MonacoEditor
        theme="vs-dark"
        width={400}
        height={150}
        defaultValue={value}
        language="js"
        onChange={this.handleEditorChange}
        editorWillMount={this.handleEditorWillMount}
      />
    );
  }
}

export const JSFunction = connect()(JSFunctionComp);
