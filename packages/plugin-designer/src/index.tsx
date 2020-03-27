import React, { PureComponent } from 'react';
import { Editor, PluginConfig } from '@ali/lowcode-editor-core';
import { DesignerView, Designer } from '@ali/lowcode-designer';
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
        list: [],
      },
      state: {
        text: 'outter',
      },
      props: {
        ref: 'outterView',
        autoLoading: true,
        style: {
          padding: 20,
        },
      },
      children: [
        {
          componentName: 'Form',
          props: {
            labelCol: 3,
            style: {},
            ref: 'testForm',
          },
          children: [
            {
              componentName: 'Form.Item',
              props: {
                label: '姓名：',
                name: 'name',
                initValue: '李雷',
              },
              children: [
                {
                  componentName: 'Input',
                  props: {
                    placeholder: '请输入',
                    size: 'medium',
                    style: {
                      width: 320,
                    },
                  },
                },
              ],
            },
            {
              componentName: 'Form.Item',
              props: {
                label: '年龄：',
                name: 'age',
                initValue: '22',
              },
              children: [
                {
                  componentName: 'NumberPicker',
                  props: {
                    size: 'medium',
                    type: 'normal',
                  },
                },
              ],
            },
            {
              componentName: 'Form.Item',
              props: {
                label: '职业：',
                name: 'profession',
              },
              children: [
                {
                  componentName: 'Select',
                  props: {
                    dataSource: [
                      {
                        label: '教师',
                        value: 't',
                      },
                      {
                        label: '医生',
                        value: 'd',
                      },
                      {
                        label: '歌手',
                        value: 's',
                      },
                    ],
                  },
                },
              ],
            },
            {
              componentName: 'Div',
              props: {
                style: {
                  textAlign: 'center',
                },
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
                          margin: '0 5px 0 5px',
                        },
                        htmlType: 'submit',
                      },
                      children: '提交',
                    },
                    {
                      componentName: 'Button',
                      props: {
                        type: 'normal',
                        style: {
                          margin: '0 5px 0 5px',
                        },
                        htmlType: 'reset',
                      },
                      children: '重置',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const BaseLibrary = ["https://g.alicdn.com/mylib/moment/2.24.0/min/moment.min.js"];

export default class DesignerPlugin extends PureComponent<PluginProps> {
  static displayName: 'LowcodePluginDesigner';

  componentDidMount(): void {
    const { editor } = this.props;
    editor.on('schema.reset', this.handleSchemaReset);
  }

  componentWillUmount(): void {
    const { editor } = this.props;
    editor.off('schema.reset', this.handleSchemaReset);
  }

  private designer?: Designer;
  state = {
    componentMetadatas: [],
    library: null,
  };
  handleSchemaReset = (schema: any): void => {
    const { editor } = this.props;
    const { components, packages } = editor.get('assets') || {};

    this.setState({
      componentMetadatas: components ? Object.values(components) : [],
      library: packages ? Object.values(packages) : [],
    });

    /*
    if (this.designer) {
      this.designer.setSchema(schema);
    } else {
      editor.once('designer.ready', (designer: Designer): void => {
        designer.setSchema(schema);
      });
    }
    */
  };

  handleDesignerMount = (designer: Designer): void => {
    const { editor } = this.props;
    this.designer = designer;
    editor.set('designer', designer);
    // editor.emit('designer.ready', designer);
  };

  render(): React.ReactNode {
    const { editor } = this.props;
    const { componentMetadatas, library } = this.state;

    if (!library) {
      return 'loading';
    }

    return (
      <DesignerView
        onMount={this.handleDesignerMount}
        className="lowcode-plugin-designer"
        defaultSchema={SCHEMA as any}
        eventPipe={editor}
        componentMetadatas={componentMetadatas}
        simulatorProps={{
          library: BaseLibrary.concat(library || []),
        }}
      />
    );
  }
}
