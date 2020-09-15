import React, { PureComponent } from 'react';
import { PluginProps } from '@ali/lowcode-types';
import { DataSourcePane } from './pane';
import { DataSourcePaneImportPlugin, DataSourceType } from './types';
import { DataSourceImportPluginCode } from './import-plugins';

export { DataSourceImportPluginCode };

const PLUGIN_NAME = 'dataSourcePane';

export interface DataSourcePaneProps extends PluginProps {
  importPlugins: DataSourcePaneImportPlugin[];
  dataSourceTypes?: DataSourceType[];
}

export interface DataSourcePaneState {
  active: boolean;
}

const BUILTIN_DATASOURCE_TYPES = [
  {
    type: 'http',
    schema: {
      type: 'object',
      properties: {
        options: {
          type: 'object',
          properties: {},
        },
      },
    },
  },
  {
    type: 'mtop',
    schema: {
      type: 'object',
      properties: {
        options: {
          type: 'object',
          properties: {
            uri: {
              title: 'api',
            },
            v: {
              title: 'v',
              type: 'string',
            },
            appKey: {
              title: 'appKey',
              type: 'string',
            },
          },
        },
      },
    },
  },
];

const BUILTIN_IMPORT_PLUGINS = [
  {
    name: 'default',
    title: '源码',
    component: DataSourceImportPluginCode,
  },
];

export default class DataSourcePanePlugin extends PureComponent<DataSourcePaneProps, DataSourcePaneState> {
  static displayName = 'DataSourcePanePlugin';

  static defaultProps = {
    dataSourceTypes: [],
    importPlugins: [],
  };

  state = {
    active: false,
  };

  constructor(props: DataSourcePaneProps) {
    super(props);
    this.state.active = true;

    const { editor } = this.props;
    // @todo pluginName, to unsubscribe
    // 第一次 active 事件不会触发监听器
    editor.on('skeleton.panel-dock.active', (pluginName, dock) => {
      if (pluginName === PLUGIN_NAME) {
        this.setState({ active: true });
      }
    });
    editor.on('skeleton.panel-dock.unactive', (pluginName, dock) => {
      if (pluginName === PLUGIN_NAME) {
        this.setState({ active: false });
      }
    });
  }

  render() {
    const { importPlugins, dataSourceTypes, editor } = this.props;
    const { active } = this.state;

    if (!active) return null;

    const defaultSchema = editor.get('designer').project?.currentDocument?.schema?.dataSource ?? {};

    return (
      <DataSourcePane
        importPlugins={BUILTIN_IMPORT_PLUGINS.concat(importPlugins)}
        dataSourceTypes={BUILTIN_DATASOURCE_TYPES.concat(dataSourceTypes)}
        defaultSchema={defaultSchema}
      />
    );
  }
}
