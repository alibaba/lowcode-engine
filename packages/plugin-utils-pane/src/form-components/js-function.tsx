import React, { PureComponent } from 'react';
import { connect } from '@formily/react-schema-renderer';
import MonacoEditor, { EditorWillMount } from 'react-monaco-editor';
import noop from 'lodash/noop';

export interface JSFunctionProps {
  className: string;
  value: string;
  onChange?: (val: string) => void;
}

type Arg0TypeOf<T> = T extends (arg0: infer U) => any ? U : never;
type MonacoRef = Arg0TypeOf<EditorWillMount>;

class InternalJSFunction extends PureComponent<JSFunctionProps, unknown> {
  static isFieldComponent = true;

  static defaultProps = {
    onChange: noop,
  };

  private monacoRef: MonacoRef | null = null;

  private handleEditorChange = () => {
    if (
      this.monacoRef &&
      this.monacoRef.editor &&
      !this.monacoRef.editor.getModelMarkers({}).find((marker) => marker.owner === 'json') &&
      this.props.onChange
    ) {
      this.props.onChange(this.monacoRef.editor.getModels()?.[0]?.getValue());
    }
  };

  private handleEditorWillMount: EditorWillMount = (monaco) => {
    this.monacoRef = monaco;
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

export const JSFunction = connect()(InternalJSFunction);
