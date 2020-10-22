import React, { PureComponent } from 'react';
import { PluginProps, DataSource } from '@ali/lowcode-types';
import _get from 'lodash/get';
import _set from 'lodash/set';
import { DataSourcePane } from './pane';
import { DataSourcePaneImportPlugin, DataSourceType } from './types';
import { DataSourceImportPluginCode } from './import-plugins';

import './index.scss';

export { DataSourceImportPluginCode };

const PLUGIN_NAME = 'dataSourcePane';

export interface DataSourcePaneProps extends PluginProps {
  importPlugins: DataSourcePaneImportPlugin[];
  dataSourceTypes?: DataSourceType[];
}

export interface DataSourcePaneState {
  active: boolean;
}

const BUILTIN_DATASOURCE_TYPES: DataSourceType[] = [
  {
    type: 'fetch',
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
  {
    type: 'jsonp',
    schema: {
      type: 'object',
      properties: {
        options: {
          type: 'object',
          properties: {
            method: {
              enum: ['GET'],
            },
          },
        },
      },
    },
  },
];

const BUILTIN_IMPORT_PLUGINS: DataSourcePaneImportPlugin[] = [
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

  handleSchemaChange = (schema: DataSource) => {
    const { editor } = this.props;

    // @TODO 姿势是否最优？
    if (editor.get('designer')) {
      const docSchema = editor.get('designer').project.getSchema();
      _set(docSchema, 'componentsTree[0].dataSource', schema);
      editor.get('designer').project.load(docSchema, true);
      // console.log('check datasorce save result', editor.get('designer').project.getSchema());
    }
  };

  render() {
    const { importPlugins, dataSourceTypes = [], editor } = this.props;
    const { active } = this.state;

    if (!active) return null;

    const projectSchema = editor.get('designer').project.getSchema() ?? {};

    return (
      <DataSourcePane
        importPlugins={BUILTIN_IMPORT_PLUGINS.concat(importPlugins)}
        dataSourceTypes={BUILTIN_DATASOURCE_TYPES.concat(dataSourceTypes)}
        defaultSchema={_get(projectSchema, 'componentsTree[0].dataSource')}
        onSchemaChange={this.handleSchemaChange}
      />
    );
  }
}

export * from './types';
