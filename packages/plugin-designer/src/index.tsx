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

interface DesignerPluginState {
  componentMetadatas?: any[] | null;
  library?: any[] | null;
}

export default class DesignerPlugin extends PureComponent<PluginProps, DesignerPluginState> {
  static displayName: 'LowcodePluginDesigner';

  state: DesignerPluginState = {
    componentMetadatas: null,
    library: null,
  };

  private _lifeState = 0;

  constructor(props: any) {
    super(props);
    const { editor } = this.props;
    const assets = editor.get('assets');

    if (assets) {
      this.setupAssets(assets);
    } else {
      editor.once('assets.loaded', this.setupAssets);
    }
    this._lifeState = 1;
  }

  setupAssets = (assets: any) => {
    if (this._lifeState < 0) {
      return;
    }
    const { components, packages } = assets;
    const state = {
      componentMetadatas: components ? Object.values(components) : [],
      library: packages ? Object.values(packages) : [],
    };
    if (this._lifeState === 0) {
      this.state = state;
    } else {
      this.setState(state);
    }
  };

  componentWillUnmount() {
    this._lifeState = -1;
  }

  handleDesignerMount = (designer: Designer): void => {
    const { editor } = this.props;
    editor.set('designer', designer);
    editor.emit('designer.ready', designer);
    const schema = editor.get('schema');
    if (schema) {
      designer.project.open(schema);
    }
    editor.on('schema.loaded', (schema) => {
      designer.project.open(schema);
    });
  };

  render(): React.ReactNode {
    const { editor } = this.props;
    const { componentMetadatas, library } = this.state;

    if (!library || !componentMetadatas) {
      // TODO: use a Loading
      return null;
    }

    return (
      <DesignerView
        onMount={this.handleDesignerMount}
        className="lowcode-plugin-designer"
        eventPipe={editor}
        componentMetadatas={componentMetadatas}
        simulatorProps={{
          library,
        }}
      />
    );
  }
}
