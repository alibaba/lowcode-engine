import './index.scss';

import React, { isValidElement, PureComponent } from 'react';

import { Designer, SettingEntry, SettingField, SettingPropEntry } from '@ali/lowcode-designer';
import { Editor, getSetter } from '@ali/lowcode-editor-core';
import { PopupService } from '@ali/lowcode-editor-skeleton';

import type { PluginProps, SetterType, FieldConfig, UtilsMap } from '@ali/lowcode-types';

// 插件自定义props
export interface UtilsPaneProps {}

// 插件自定义state
interface State {
  utils: UtilsMap;
}

export class UtilsPane extends PureComponent<UtilsPaneProps & PluginProps, State> {
  static displayName = 'UtilsPane';

  // 插件初始化处理函数
  static init = function (editor: Editor): void {};

  state: State = {
    utils: this.props.editor.get('designer')?.project?.get('utils') || [],
  };

  private _itemSetter: SetterType = {
    componentName: 'ObjectSetter',
    props: {
      config: {
        items: [
          {
            name: 'name',
            title: '名称',
            setter: {
              componentName: 'StringSetter',
            },
          },
          {
            name: 'type',
            title: '类型',
            initialValue: 'npm',
            setter: {
              componentName: 'RadioGroupSetter',
              props: {
                dataSource: [
                  { label: 'NPM 包', value: 'npm' },
                  // { label: '自定义函数', value: 'function' },
                ],
              },
            },
          },
          {
            name: 'content',
            title: '内容',
            setter: {
              componentName: 'ObjectSetter',
              props: {
                config: {
                  items: [
                    {
                      name: 'componentName',
                      title: '组件名称',
                      setter: {
                        componentName: 'StringSetter',
                      },
                    },
                    {
                      name: 'package',
                      title: '包名',
                      setter: {
                        componentName: 'StringSetter',
                      },
                    },
                    {
                      name: 'version',
                      title: '版本号',
                      setter: {
                        componentName: 'StringSetter',
                      },
                    },
                    {
                      name: 'destructuring',
                      title: '解构',
                      setter: {
                        componentName: 'BoolSetter',
                      },
                    },
                    {
                      name: 'exportName',
                      title: '导出名',
                      setter: {
                        componentName: 'StringSetter',
                      },
                    },
                    {
                      name: 'subName',
                      title: '子导出名',
                      setter: {
                        componentName: 'StringSetter',
                      },
                    },
                    {
                      name: 'main',
                      title: '主入口',
                      setter: {
                        componentName: 'StringSetter',
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    },
  };

  private _field = new SettingField(this._getSettingEntry(), this._getFieldConfig());
  private _cleanups: Array<() => void> = [];

  // 打开或激活插件前的切片处理函数
  open(): void | boolean | Promise<void> {}

  // 关闭或挂起插件前的切片处理函数
  close(): void | boolean | Promise<void> {}

  componentDidMount() {
    this._cleanups.push(
      this._field.onValueChange(() => {
        this.setState({
          utils: this._field.getHotValue(),
        });
      }),
    );
  }

  componentWillUnmount() {
    this._cleanups.forEach((clean) => {
      clean();
    });
  }

  render(): React.ReactNode {
    const ArraySetter = this._getArraySetter();

    return (
      <div className="lowcode-plugin-utils-pane">
        <p>I am a lowcode engine demo</p>
        <PopupService align="r">
          <ArraySetter
            field={this._field}
            value={this.state.utils}
            onChange={this._handleValueChange}
            mode="list"
            itemSetter={this._itemSetter}
          />
        </PopupService>
      </div>
    );
  }

  private _handleValueChange = (value: UtilsMap) => {
    this.setState({ utils: value });
    this._updateProjectUtils(value);
  };

  private _getSettingEntry(): SettingEntry {
    const editor = this.props.editor;
    const designer = editor.get('designer') as Designer;
    const document = designer.currentDocument!;
    const rootNode = document.rootNode!;

    // TODO: remove debug code :
    Object.assign(window, { editor, designer, utilsPane: this });

    return new SettingPropEntry(rootNode.settingEntry, '__internal', 'field');
  }

  private _getFieldConfig(): FieldConfig {
    return {
      name: '__utils',
      setter: this._itemSetter,
    };
  }

  private _getArraySetter(): React.ComponentType<any> {
    const arraySetter = getSetter('ArraySetter');
    if (!arraySetter) {
      return () => <span>Error: ArraySetter is missing!</span>;
    }

    const { component: ArraySetter } = arraySetter;
    if (isValidElement(ArraySetter)) {
      return (props: unknown) => React.cloneElement(ArraySetter);
    }

    return ArraySetter;
  }

  private get _designer(): Designer {
    return this.props.editor.get('designer')!;
  }

  private _updateProjectUtils(utils: UtilsMap) {
    this._designer.project.set('utils', utils);
  }
}

export default UtilsPane;
