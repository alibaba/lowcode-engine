// @todo schema default
import React, { PureComponent, ReactElement, FC } from 'react';
import { SchemaForm, FormButtonGroup, Submit } from '@formily/next';
import { ArrayTable, Input, Switch, NumberPicker } from '@formily/next-components';
import _isPlainObject from 'lodash/isPlainObject';
import _isArray from 'lodash/isArray';
import _isNumber from 'lodash/isNumber';
import _isString from 'lodash/isString';
import _isBoolean from 'lodash/isBoolean';
import _cloneDeep from 'lodash/cloneDeep';
import _mergeWith from 'lodash/mergeWith';
import _get from 'lodash/get';
import _tap from 'lodash/tap';
import traverse from 'traverse';
import { ParamValue, JSFunction } from './form-components';
import { DataSourceType, DataSourceConfig } from './types';

// @todo $ref

const SCHEMA = {
  type: 'object',
  properties: {
    type: {
      title: '类型',
      type: 'string',
      editable: false,
    },
    id: {
      type: 'string',
      title: '数据源 ID',
      required: true,
    },
    isInit: {
      title: '是否自动请求',
      type: 'boolean',
      default: true,
    },
    dataHandler: {
      type: 'string',
      title: '单个数据结果处理函数',
      required: true,
      'x-component': 'JSFunction',
      default: 'function() {}',
    },
    options: {
      type: 'object',
      title: '请求参数',
      required: true,
      properties: {
        uri: {
          type: 'string',
          title: '请求地址',
          required: true,
        },
        params: {
          title: '请求参数',
          type: 'object',
          default: {},
        },
        method: {
          type: 'string',
          title: '请求方法',
          required: true,
          enum: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
          default: 'GET',
        },
        isCors: {
          type: 'boolean',
          title: '是否支持跨域',
          required: true,
          default: true,
        },
        timeout: {
          type: 'number',
          title: '超时时长（毫秒）',
          default: 5000,
        },
        headers: {
          type: 'object',
          title: '请求头信息',
          default: {},
        },
      },
    },
  },
};

export interface DataSourceFormProps {
  dataSourceType: DataSourceType;
  dataSource?: DataSourceConfig;
  omComplete?: (dataSource: DataSourceConfig) => void;
}

export interface DataSourceFormState {
}

/**
 * 通过是否存在 ID 来决定读写状态
 */
export class DataSourceForm extends PureComponent<DataSourceFormProps, DataSourceFormState> {
  state = {};

  handleFormSubmit = (formData) => {
    // @todo mutable?
    if (_isArray(_get(formData, 'options.params'))) {
      formData.options.params = formData.options.params.reduce((acc, cur) => {
        if (!cur.name) return;
        acc[cur.name] = cur.value;
        return acc;
      }, {});
    }
    if (_isArray(_get(formData, 'options.headers'))) {
      formData.options.headers = formData.options.headers.reduce((acc, cur) => {
        if (!cur.name) return;
        acc[cur.name] = cur.value;
        return acc;
      }, {});
    }
    console.log('submit', formData);
    this.props?.onComplete(formData);
  };

  deriveInitialData = (dataSource = {}) => {
    const { dataSourceType } = this.props;
    const result = _cloneDeep(dataSource);

    if (_isPlainObject(_get(result, 'options.params'))) {
      result.options.params = Object.keys(result.options.params).reduce(
        (acc, cur) => {
          acc.push({
            name: cur,
            value: result.options.params[cur]
          });
          return acc;
        },
        []
      );
    }
    if (_isPlainObject(_get(result, 'options.headers'))) {
      result.options.headers = Object.keys(result.options.headers).reduce(
        (acc, cur) => {
          acc.push({
            name: cur,
            value: result.options.headers[cur]
          });
          return acc;
        },
        []
      );
    }

    result.type = dataSourceType.type;

    return result;
  }

  deriveSchema = () => {
    const { dataSourceType } = this.props;

    // @todo 减小覆盖的风险
    const formSchema = _mergeWith({}, SCHEMA, dataSourceType.schema, (objValue, srcValue) => {
      if (_isArray(objValue)) {
        return srcValue;
      }
    });

    debugger;

    if (_get(formSchema, 'properties.options.properties.params')) {
      formSchema.properties.options.properties.params = {
        ...formSchema.properties.options.properties.params,
        type: 'array',
        'x-component': 'ArrayTable',
        'x-component-props': {
          operationsWidth: 100,
        },
        items: {
          type: 'object',
          properties: {
            name: {
              title: '参数名',
              type: 'string',
            },
            value: {
              title: '参数值',
              type: 'string',
              'x-component': 'ParamValue',
              'x-component-props': {
                types: [
                  'string',
                  'boolean',
                  'expression',
                  'number'
                ],
              },
            },
          },
        }
      };
      delete formSchema.properties.options.properties.params.properties;
    }
    if (_get(formSchema, 'properties.options.properties.headers')) {
      formSchema.properties.options.properties.headers = {
        ...formSchema.properties.options.properties.headers,
        type: 'array',
        'x-component': 'ArrayTable',
        'x-component-props': {
          operationsWidth: 100,
        },
        items: {
          type: 'object',
          properties: {
            name: {
              title: '参数名',
              type: 'string',
            },
            value: {
              title: '参数值',
              type: 'string',
              'x-component': 'ParamValue',
              'x-component-props': {
                types: [
                  'string'
                ],
              },
            },
          },
        },
      };
      delete formSchema.properties.options.properties.headers.properties;
    }

    return traverse(formSchema).forEach(function(node) {
      if (node?.type && !node['x-component']) {
        if (node.type === 'string') {
          node['x-component'] = 'Input';
        } else if (node.type === 'number') {
          node['x-component'] = 'NumberPicker';
        } else if (node.type === 'boolean') {
          node['x-component'] = 'Switch';
        }
      }
    });
  };

  render() {
    const { dataSource } = this.props;

    return (
      <div className="lowcode-plugin-datasource-pane-datasource">
        <SchemaForm
          onSubmit={this.handleFormSubmit}
          components={{
            ArrayTable,
            ParamValue,
            Input,
            NumberPicker,
            Switch,
            JSFunction,
          }}
          labelCol={3}
          wrapperCol={21}
          schema={this.deriveSchema()}
          initialValues={this.deriveInitialData(dataSource)}
        >
          <FormButtonGroup offset={7}>
            <Submit>提交</Submit>
          </FormButtonGroup>
        </SchemaForm>
      </div>
    );
  }
}
