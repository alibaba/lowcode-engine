// @todo schema default
import { UtilItem } from '@ali/lowcode-types';
import { Button } from '@alifd/next';
import { FormButtonGroup, registerValidationFormats, SchemaForm, Submit } from '@formily/next';
import { ArrayTable, Input, NumberPicker, Switch } from '@formily/next-components';
import memorize from 'lodash/memoize';
import React, { PureComponent } from 'react';

import { JSFunction } from './form-components';

registerValidationFormats({
  util_npm_version_format: /^\d+\.\d+\.\d+(-[a-z0-9-]+(\.[a-z0-9]+))?$/i, // 版本号的规范
  util_name_js_identifier: /^[a-z$_][a-z$_0-9]*$/i, // JS 标识符的规范
});

type FlatUtilItem = {
  name: string;
  type: UtilItem['type'];

  // NPM/TNPM util:
  componentName?: string;
  package?: string;
  version?: string;
  destructuring?: boolean;
  exportName?: string;
  subName?: string;
  main?: string;

  // function util
  functionExpr?: string;
};

const FORM_SCHEMA_NPM = {
  type: 'object',
  properties: {
    type: TYPE_FIELD(),
    name: NAME_FIELD(),
    componentName: {
      type: 'string',
      title: 'componentName',
      display: false,
    },
    package: {
      type: 'string',
      title: '包名',
      required: true,
    },
    version: {
      type: 'string',
      title: '版本号',
      required: false,
      'x-rules': {
        format: 'util_npm_version_format',
      },
    },
    destructuring: {
      type: 'boolean',
      title: '需解构',
      required: false,
    },
    exportName: {
      type: 'string',
      title: '导出名',
      // hide: '{{!destructuring}}', // TODO: 这联动一直报错
      required: false,
    },
    subName: {
      type: 'string',
      title: '子导出名',
      // hide: '{{!destructuring}}',
      required: false,
    },
    main: {
      type: 'string',
      title: '入口文件',
      required: false,
    },
  },
};

const FORM_SCHEMA_FUNCTION = {
  type: 'object',
  properties: {
    type: TYPE_FIELD(),
    name: NAME_FIELD(),
    functionExpr: {
      type: 'string',
      title: '函数定义',
      required: true,
      'x-component': 'JSFunction',
      'x-component-props': {
        defaultValue: `/**
 * 这里是一个 util 函数的示例
 * 在工具类扩展中，可以通过 this.xxx 来访问各种上下文 API
 **/
function () {
  console.log("Hello world! (Context: %o)", this);
  // TODO: 完善这个 util 函数
}
`,
      },
    },
  },
};

export interface UtilsFormProps {
  item?: Partial<UtilItem> | null;
  onComplete?: (item: UtilItem) => void;
  onCancel?: () => void;
}

/**
 * 通过是否存在 ID 来决定读写状态
 */
export class UtilsForm extends PureComponent<UtilsFormProps, unknown> {
  state = {};

  private handleFormSubmit = (formData: any) => {
    const utilItem = parseFlatUtilItem(formData);

    if (this.props.onComplete) {
      this.props.onComplete(utilItem);
    }
  };

  private handleCancel = () => {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  };

  private getInitialValues = memorize((utilItem: Partial<UtilItem> | undefined | null) => {
    return flattenUtilItem(utilItem || {});
  });

  private readonly formComponents = {
    string: Input,
    boolean: Switch,
    number: NumberPicker,
    ArrayTable,
    Input,
    NumberPicker,
    Switch,
    JSFunction,
  };

  private readonly formLabelCol = {
    span: 6,
  };

  private readonly formWrapperCol = {
    span: 16,
  };

  private get schema() {
    return this.props.item?.type === 'function' ? FORM_SCHEMA_FUNCTION : FORM_SCHEMA_NPM;
  }

  render() {
    const { item } = this.props;

    return (
      <div className="lowcode-plugin-utils-form">
        <SchemaForm
          onSubmit={this.handleFormSubmit}
          components={this.formComponents}
          labelCol={this.formLabelCol}
          wrapperCol={this.formWrapperCol}
          schema={this.schema}
          initialValues={this.getInitialValues(item)}
        >
          <FormButtonGroup offset={this.formLabelCol.span}>
            <Submit>保存</Submit>
            <Button onClick={this.handleCancel}>取消</Button>
          </FormButtonGroup>
        </SchemaForm>
      </div>
    );
  }
}

function TYPE_FIELD() {
  return {
    title: '类型',
    type: 'string',
    editable: false,
    'x-component': 'Input',
    'x-component-props': {
      readOnly: true,
    },
  };
}

function NAME_FIELD() {
  return {
    type: 'string',
    title: '引用名',
    required: true,
    'x-component-props': {
      placeholder: '请输入引用名（工具类扩展在引用时的名称）',
      autoFocus: true,
    },
    'x-rules': {
      format: 'util_name_js_identifier',
    },
  };
}

function flattenUtilItem(utilItem: Partial<UtilItem>): FlatUtilItem {
  return {
    ...(utilItem.type === 'function'
      ? {
        functionExpr: utilItem.content?.value,
      }
      : utilItem.content),

    name: utilItem.name || '',
    type: utilItem.type || 'npm',
  };
}

function parseFlatUtilItem(flatUtil: FlatUtilItem): UtilItem {
  if (flatUtil.type === 'function') {
    return {
      name: flatUtil.name,
      type: flatUtil.type,
      content: {
        type: 'JSFunction',
        value: flatUtil.functionExpr || '',
      },
    };
  }

  return {
    name: flatUtil.name,
    type: flatUtil.type,
    content: {
      componentName: flatUtil.componentName || flatUtil.name,
      package: flatUtil.package || '',
      version: flatUtil.version,
      destructuring: flatUtil.destructuring ?? false,
      exportName: flatUtil.exportName,
      subName: flatUtil.subName,
      main: flatUtil.main,
    },
  };
}
