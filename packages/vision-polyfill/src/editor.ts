import { globalContext } from '@ali/lowcode-globals';
import Editor from '@ali/lowcode-editor-core';
import { Designer } from '@ali/lowcode-designer';
import { registerSetters } from '@ali/lowcode-setters';
import Outline, { Pane } from '@ali/lowcode-plugin-outline-pane';
import SettingsPane from '@ali/lowcode-plugin-settings-pane';
import DesignerPlugin from '@ali/lowcode-plugin-designer';
import { Skeleton } from './skeleton/skeleton';

// demo
import Preview from '@ali/lowcode-plugin-sample-preview';
import { createElement } from 'react';
import { Button } from '@alifd/next';

registerSetters();

export const editor = new Editor();
globalContext.register(editor, Editor);

export const skeleton = new Skeleton(editor);
editor.set(Skeleton, skeleton);

export const designer = new Designer({ eventPipe: editor });
editor.set(Designer, designer);

skeleton.mainArea.add({
  name: 'designer',
  type: 'Widget',
  content: DesignerPlugin,
});
skeleton.rightArea.add({
  name: 'settingsPane',
  type: 'Panel',
  content: SettingsPane,
});
skeleton.leftArea.add({
  name: 'outlinePane',
  type: 'PanelDock',
  props: {
    align: 'top',
    icon: 'toggle-right',
    description: '大纲树',
  },
  content: Pane,
  panelProps: {
    area: 'leftFixedArea',
  },
});


// demo

skeleton.leftArea.add({
  name: 'icon1',
  type: 'Dock',
  props: {
    align: 'bottom',
    icon: 'set',
    description: '设置',
  }
});
skeleton.leftArea.add({
  name: 'icon2',
  type: 'Dock',
  props: {
    align: 'bottom',
    icon: 'help',
    description: '帮助',
  }
});

skeleton.topArea.add({
  type: "Dock",
  name: 'preview',
  props: {
    align: "right",
  },
  content: createElement(Button, {
    size: 'small',
    children: '预览'
  }),
});
skeleton.topArea.add({
  type: "Dock",
  name: 'publish',
  props: {
    align: "right",
  },
  content: createElement(Button, {
    size: 'small',
    type: 'secondary',
    children: '发布'
  }),
});
skeleton.topArea.add({
  type: "Dock",
  name: 'save',
  props: {
    align: "right",
  },
  content: createElement(Button, {
    size: 'small',
    type: 'primary',
    children: '保存'
  }),
});
skeleton.topArea.add({
  type: "Dock",
  name: 'preview4',
  props: {
    align: "center",
  },
  content: createElement('img', {
    src: "https://img.alicdn.com/tfs/TB1WW.VC.z1gK0jSZLeXXb9kVXa-486-64.png",
    style: {
      height: 32
    }
  }),
});

skeleton.topArea.add({
  type: "Dock",
  name: 'preview1',
  props: {
    align: "left",
  },
  content: createElement('img', {
    src: "https://img.alicdn.com/tfs/TB1zqBfDlr0gK0jSZFnXXbRRXXa-440-64.png",
    style: {
      height: 32
    }
  }),
});
// skeleton.topArea.add({
//   type: "Dock",
//   name: 'preview2',
//   props: {
//     align: "center",
//     title: {
//       label: "345",
//       icon: "smile",
//       tip: "123123123"
//     }
//   },
// })
