import React, { PureComponent } from 'react';

import Editor from '../../framework/index';
import { PluginConfig } from '../../framework/definitions';

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
        list: [
          {
            id: 'getComponentsMap',
            isInit: true,
            type: 'doServer',
            options: {
              method: 'POST',
              params: {
                libVersionIds: '1'
              },
              uri: 'getComponentsMap'
            }
          }
        ]
      },
      state: {
        text: 'outter'
      },
      props: {
        ref: 'outterView',
        autoLoading: true
      },
      children: [
        {
          componentName: 'Form',
          props: {
            labelCol: 4,
            style: {},
            ref: 'testForm'
          },
          children: [
            {
              componentName: 'FormItem',
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
              componentName: 'FormItem',
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
              componentName: 'FormItem',
              props: {
                label: '职业：',
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
                  componentName: 'ButtonGroup',
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
                      children: '提交'
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
                      children: '重置'
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
  static displayName: 'LowcodePluginDesigner';

  constructor(props) {
    super(props);
  }

  handleDesignerMount = (designer): void => {
    const {editor} = this.props;
    editor.set('designer', designer);
    editor.emit('designer.ready', designer);
  }

  render() {
    const { editor } = this.props;
    return (
      <Designer
        onMount={this.handleDesignerMount}
        className="lowcode-plugin-designer"
        defaultSchema={SCHEMA as any}
        eventPipe={editor as any}
        simulatorProps={{
          componentsAsset: [
            {
              type: 'jsUrl',
              content: 'https://unpkg.alibaba-inc.com/@alifd/next@1.18.17/dist/next.min.js',
              id: 'next',
              level: 2
            },
            {
              type: 'cssUrl',
              content: 'https://unpkg.alibaba-inc.com/@alifd/next@1.18.17/dist/next.min.css',
              id: 'next',
              level: 2
            }
          ]
        }}
      />
    );
  }
}
