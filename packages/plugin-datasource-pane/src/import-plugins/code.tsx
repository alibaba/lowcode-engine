/**
 * 源码导入插件
 * @todo editor 关联 types，并提供详细的出错信息
 */
import React, { PureComponent, createRef, MutableRefObject } from 'react';
import { Button } from '@alifd/next';
import _noop from 'lodash/noop';
import _isArray from 'lodash/isArray';
import _last from 'lodash/last';
import _isPlainObject from 'lodash/isPlainObject';
import MonacoEditor, { EditorWillMount } from 'react-monaco-editor';
import { editor } from 'monaco-editor';
import { DataSourceConfig } from '@ali/lowcode-types';
import Ajv from 'ajv';
import { DataSourcePaneImportPluginComponentProps } from '../types';

export interface DataSourceImportPluginCodeProps extends DataSourcePaneImportPluginComponentProps {
  defaultValue?: DataSourceConfig[];
}

export interface DataSourceImportPluginCodeState {
  code: string;
  isCodeValid: boolean;
}

export class DataSourceImportPluginCode extends PureComponent<
  DataSourceImportPluginCodeProps,
  DataSourceImportPluginCodeState
> {
  static defaultProps = {
    defaultValue: [
      {
        type: 'http',
        id: 'test',
      },
    ]
  };

  state = {
    code: '',
    isCodeValid: true,
  };

  private monacoRef = createRef<editor.IStandaloneCodeEditor>();

  constructor(props: DataSourceImportPluginCodeProps) {
    super(props);
    this.state.code = JSON.stringify(this.deriveValue(this.props.defaultValue));
    this.handleEditorWillMount = this.handleEditorWillMount.bind(this);
    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.handleComplete = this.handleComplete.bind(this);
  }

  deriveValue = (value: any) => {
    const { dataSourceTypes } = this.props;

    if (!_isArray(dataSourceTypes) || dataSourceTypes.length === 0) return [];

    let result = value;
    if (_isPlainObject(result)) {
      // 如果是对象则转化成数组
      result = [result];
    } else if (!_isArray(result)) {
      return [];
    }

    const ajv = new Ajv();

    return (result as DataSourceConfig[]).filter((dataSource) => {
      if (!dataSource.type) return false;
      const dataSourceType = dataSourceTypes.find((type) => type.type === dataSource.type);
      if (!dataSourceType) return false;
      return ajv.validate(dataSourceType.schema, dataSource);
    });
  };

  handleComplete = () => {
    if (this.monacoRef.current) {
      if (
        !(this.monacoRef.current as editor.IStandaloneCodeEditor)
          .getModelMarkers()
          .find((marker: editor.IMarker) => marker.owner === 'json')
      ) {
        this.setState({ isCodeValid: true });
        this.props?.onImport(this.deriveValue(JSON.parse(_last(this.monacoRef.current.getModels()).getValue())));
        return;
      }
    }
    this.setState({ isCodeValid: false });
  };

  handleEditorChange = () => {
    if (this.monacoRef.current) {
      if (
        !(this.monacoRef.current as editor.IStandaloneCodeEditor)
          .getModelMarkers()
          .find((marker: editor.IMarker) => marker.owner === 'json')
      ) {
        this.setState({ isCodeValid: true });
      }
    }
  };

  handleEditorWillMount: EditorWillMount = (editor) => {
    (this.monacoRef as MutableRefObject<editor.IStandaloneCodeEditor>).current = editor?.editor;
    // @todo 格式化一次
  };

  handleCodeChagne = (code) => {
    this.setState({ code });
  }

  render() {
    const { onCancel = _noop } = this.props;
    const { code, isCodeValid } = this.state;

    return (
      <div>
        <MonacoEditor
          theme="vs-dark"
          width={800}
          height={600}
          defaultValue={code}
          language="json"
          onChange={this.handleEditorChange}
          editorWillMount={this.handleEditorWillMount}
          formatOnType
          formatOnPaste
        />
        {!isCodeValid && <p>格式有误</p>}
        <p>
          <Button onClick={onCancel}>取消</Button>
          <Button onClick={this.handleComplete}>确认</Button>
        </p>
      </div>
    );
  }
}
