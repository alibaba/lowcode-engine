import React, { PureComponent } from 'react';
import { PluginProps, UtilItem, UtilsMap } from '@ali/lowcode-types';
import get from 'lodash/get';
import { UtilsPane, UtilTypeInfo } from './pane';

import './index.scss';
import { DEFAULT_UTILS_TYPES } from './utils-types';
import { DEFAULT_UTILS } from './utils-defaults';

const PLUGIN_NAME = 'utilsPane';

export interface UtilsPaneProps extends PluginProps {
  /**
   * 支持的 Util 的类型
   */
  utilsTypes: UtilTypeInfo[];

  /**
   * 初始的 Utils (若 schema 中尚未定义 utils)
   */
  initialUtils?: UtilItem[];
}

interface State {
  active: boolean;
}

export default class UtilsPanePlugin extends PureComponent<UtilsPaneProps, State> {
  static displayName = 'UtilsPanePlugin';

  static defaultProps = {
    initialUtils: DEFAULT_UTILS,
  };

  state = {
    active: false,
  };

  constructor(props: UtilsPaneProps) {
    super(props);
    this.state.active = true;

    const { editor } = this.props;

    // @todo pluginName, to unsubscribe
    // 第一次 active 事件不会触发监听器
    editor.on('skeleton.panel-dock.active', (pluginName) => {
      if (pluginName === PLUGIN_NAME) {
        this.setState({ active: true });
      }
    });

    editor.on('skeleton.panel-dock.unactive', (pluginName) => {
      if (pluginName === PLUGIN_NAME) {
        this.setState({ active: false });
      }
    });
  }

  render() {
    const { initialUtils = DEFAULT_UTILS, utilsTypes = DEFAULT_UTILS_TYPES, editor } = this.props;
    const { active } = this.state;

    if (!active) return null;

    const projectSchema = editor.get('designer').project.getSchema() ?? {};

    return (
      <UtilsPane
        initialUtils={initialUtils}
        utilTypes={utilsTypes}
        schema={get(projectSchema, 'utils')}
        onSchemaChange={this.handleSchemaChange}
      />
    );
  }

  private handleSchemaChange = (utilsMap: UtilsMap) => {
    const { editor } = this.props;

    // @TODO 姿势是否最优？
    if (editor.get('designer')) {
      editor.get('designer').project.set('utils', utilsMap);
    }
  };
}
