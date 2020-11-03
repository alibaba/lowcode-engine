/* eslint-disable @typescript-eslint/indent */
// @todo 缩进问题
/**
 * 源码导入插件
 * @todo editor 关联 types，并提供详细的出错信息
 */
import React, { PureComponent } from 'react';
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

import './code.scss';

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
    ],
  };

  state = {
    code: '',
    isCodeValid: true,
  };

  private monacoRef: any;

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
    if (this.monacoRef) {
      if (!this.monacoRef.getModelMarkers().find((marker: editor.IMarker) => marker.owner === 'json')) {
        this.setState({ isCodeValid: true });
        const model: any = _last(this.monacoRef.getModels());
        if (!model) return;
        this.props.onImport?.(this.deriveValue(JSON.parse(model.getValue())));
        return;
      }
    }
    this.setState({ isCodeValid: false });
  };

  handleEditorChange = () => {
    if (this.monacoRef) {
      if (!this.monacoRef.getModelMarkers().find((marker: editor.IMarker) => marker.owner === 'json')) {
        this.setState({ isCodeValid: true });
      }
    }
  };

  handleEditorWillMount: EditorWillMount = (editor) => {
    this.monacoRef = editor?.editor;
    // @todo 格式化一次
  };

  handleCodeChagne = (code: string) => {
    this.setState({ code });
  };

  render() {
    const { onCancel = _noop } = this.props;
    const { code, isCodeValid } = this.state;

    // @todo
    // formatOnType formatOnPaste
    return (
      <div className="lowcode-plugin-datasource-import-plugin-code">
        <MonacoEditor
          theme="vs-dark"
          width={800}
          height={400}
          defaultValue={code}
          language="json"
          onChange={this.handleEditorChange}
          editorWillMount={this.handleEditorWillMount}
        />
        {!isCodeValid && <p className="error-msg">格式有误</p>}
        <p className="btns">
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" onClick={this.handleComplete}>
            确认
          </Button>
        </p>
      </div>
    );
  }
}
