import React, { PureComponent } from 'react';

import Editor from '@ali/lowcode-editor-core';
import { PluginConfig } from '@ali/lowcode-editor-core/lib/definitions';
import assets from '../../config/assets';
// @ts-ignore
import Designer from '../../../../designer';

import './index.scss';

export interface PluginProps {
  editor: Editor;
  config: PluginConfig;
}

const SCHEMA = {
  version: '1.0',
  componentsMap: [],
  componentsTree: [
    {
      componentName: 'Page',
      fileName: 'test',
      dataSource: {
        list: []
      },
      state: {
        text: 'outter'
      },
      props: {
        ref: 'outterView',
        autoLoading: true,
        style: {
          padding: 20
        }
      },
      children: [
        {
          componentName: 'Form',
          props: {
            labelCol: 3,
            style: {},
            ref: 'testForm'
          },
          children: [
            {
              componentName: 'Form.Item',
              props: {
                label: '姓名：',
                name: 'name',
                initValue: '李雷'
              },
              children: [
                {
                  componentName: 'Input',
                  props: {
                    placeholder: '请输入',
                    size: 'medium',
                    style: {
                      width: 320
                    }
                  }
                }
              ]
            },
            {
              componentName: 'Form.Item',
              props: {
                label: '年龄：',
                name: 'age',
                initValue: '22'
              },
              children: [
                {
                  componentName: 'NumberPicker',
                  props: {
                    size: 'medium',
                    type: 'normal'
                  }
                }
              ]
            },
            {
              componentName: 'Form.Item',
              props: {
                label: {
                  type: 'JSSlot',
                  value: {
                    componentName: 'Div',
                    children: '职业：',
                  }
                },
                name: 'profession'
              },
              children: [
                {
                  componentName: 'Select',
                  props: {
                    dataSource: [
                      {
                        label: '教师',
                        value: 't'
                      },
                      {
                        label: '医生',
                        value: 'd'
                      },
                      {
                        label: '歌手',
                        value: 's'
                      }
                    ]
                  }
                }
              ]
            },
            {
              componentName: 'Div',
              props: {
                style: {
                  textAlign: 'center'
                }
              },
              children: [
                {
                  componentName: 'Button.Group',
                  props: {},
                  children: [
                    {
                      componentName: 'Button',
                      props: {
                        type: 'primary',
                        style: {
                          margin: '0 5px 0 5px'
                        },
                        htmlType: 'submit'
                      },
                      children: '提交',
                      condition: true,
                      loop: [1,2,3],
                      conditionGroup: '1'
                    },
                    {
                      componentName: 'Button',
                      props: {
                        type: 'normal',
                        style: {
                          margin: '0 5px 0 5px'
                        },
                        htmlType: 'reset'
                      },
                      children: '重置',
                      condition: false,
                      conditionGroup: '1'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export default class DesignerPlugin extends PureComponent<PluginProps> {
  displayName: 'LowcodePluginDesigner';

  componentDidMount(): void {
    const { editor } = this.props;
    editor.on('schema.reset', this.handleSchemaReset);
  }

  componentWillUmount(): void {
    const { editor } = this.props;
    editor.off('schema.reset', this.handleSchemaReset);
  }

  handleSchemaReset = (schema: object): void => {
    // const {editor} = this.props;
    // if (this.designer) {
    //   this.designer.setSchema(schema);
    // } else {
    //   editor.once('designer.ready', (designer): void => {
    //     designer.setSchema(schema);
    //   });
    // }
  };

  handleDesignerMount = (designer): void => {
    const { editor } = this.props;
    this.designer = designer;
    editor.set('designer', designer);
    editor.emit('designer.ready', designer);
  };

  render(): React.ReactNode {
    const { editor } = this.props;
    // const assets = editor.get('assets') || {};
    return (
      <Designer
        onMount={this.handleDesignerMount}
        className="lowcode-plugin-designer"
        defaultSchema={SCHEMA as any}
        eventPipe={editor as any}
        componentMetadatas={Object.values(assets.components) as any}
        simulatorProps={{
          library: Object.values(assets.packages || {})
        }}
      />
    );
  }
}
