import Editor from '@ali/lowcode-editor-core';
import outlinePane from '@ali/lowcode-plugin-outline-pane';
import settingsPane from '@ali/lowcode-plugin-settings-pane';
import designer from '@ali/lowcode-plugin-designer';
import { registerSetters } from '@ali/lowcode-setters';

registerSetters();

export default new Editor(
  {
    plugins: {
      topArea: [],
      leftArea: [
        {
          pluginKey: 'outlinePane',
          type: 'PanelIcon',
          props: {
            align: 'top',
            icon: 'shuxingkongjian',
            title: '大纲树',
          },
          config: {
            package: '@ali/lowcode-plugin-outline-pane',
            version: '^0.8.0',
          },
          pluginProps: {},
        },
      ],
      rightArea: [
        {
          pluginKey: 'settingsPane',
          type: 'Panel',
          props: {},
          config: {
            package: '@ali/lowcode-plugin-settings-pane',
            version: '^0.8.0',
          },
          pluginProps: {},
        },
      ],
      centerArea: [
        {
          pluginKey: 'designer',
          type: '',
          props: {},
          config: {
            package: '@ali/lowcode-plugin-designer',
            version: '^0.8.0',
          },
        },
      ],
    },
  },
  {
    outlinePane,
    settingsPane,
    designer,
  },
);


// editor-core
//  1. di 实现
//  2. skeleton 区域管理
//  3. general bus: pub/sub
// editor-skeleton/workbench 视图实现
//  provide fixed left pane
//  provide float left pane
