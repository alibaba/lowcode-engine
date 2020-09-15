import React, { PureComponent, createRef } from 'react';
import { Button, Input, Radio, NumberPicker, Switch } from '@alifd/next';
import { connect } from '@formily/react-schema-renderer';
import _isPlainObject from 'lodash/isPlainObject';
import _isArray from 'lodash/isArray';
import _isNumber from 'lodash/isNumber';
import _isString from 'lodash/isString';
import _isBoolean from 'lodash/isBoolean';
import _get from 'lodash/get';
import _tap from 'lodash/tap';
import MonacoEditor, { EditorWillMount } from 'react-monaco-editor';

const { Group: RadioGroup } = Radio;

export interface JSFunctionProps {
  className: string;
  value: any;
  onChange?: () => void;
}

export interface JSFunctionState {
}

class JSFunctionComp extends PureComponent<JSFunctionProps, JSFunctionState> {
  static isFieldComponent = true;

  private monacoRef = createRef<editor.IStandaloneCodeEditor>();

  constructor(props) {
    super(props);
    this.handleEditorChange = this.handleEditorChange.bind(this);
  }

  handleEditorChange = () => {
    if (this.monacoRef.current) {
      if (
        !(this.monacoRef.current as editor.IStandaloneCodeEditor)
          .getModelMarkers()
          .find((marker: editor.IMarker) => marker.owner === 'json')
      ) {
        this.props?.onChange(this.monacoRef.current?.getModels()?.[0]?.getValue());
      }
    }
  };

  handleEditorWillMount: EditorWillMount = (editor) => {
    (this.monacoRef as MutableRefObject<editor.IStandaloneCodeEditor>).current = editor?.editor;
  };

  render() {
    const { value, onChange } = this.props;
    return (
      <MonacoEditor
        theme="vs-dark"
        width={400}
        height={150}
        defaulvValue={value}
        language="js"
        onChange={this.handleEditorChange}
        editorWillMount={this.handleEditorWillMount}
      />
    );
  }
}

export const JSFunction = connect()(JSFunctionComp);
