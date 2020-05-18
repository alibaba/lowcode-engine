/* eslint-disable */
import { createElement } from 'react';
import EventBindDialog from '@ali/lowcode-plugin-event-bind-dialog';
import ComponentPane from '../../../plugin-components-pane/src/index';
import { render } from 'react-dom';
import { Workbench } from '@ali/lowcode-editor-skeleton';

import { skeleton, editor } from './editor';

async function loadAssets() {
  const _assets = await editor.utils.get('./assets.json');
  _assets.components = Object.values(_assets.components);
  _assets.packages = Object.values(_assets.packages);
  editor.set('assets', _assets);
}

async function loadSchema() {
  const schema = await editor.utils.get('./schema.json');
  editor.set('schema', schema);
}

// demo
function initDemoPanes() {
  skeleton.add({
    "name": "ali-lowcode-components-panel",
    "content": createElement(ComponentPane, {
      editor
    }),
    "props": {
      icon: "add",
      "description": "组件库"
    },
    "type": "PanelDock",
    "area": "left",
    "panelProps": {
      "width": 300
    }
  });
  skeleton.add({
    name: 'eventBindDialog',
    type: 'Widget',
    content: EventBindDialog,
  });
  skeleton.add({
    area: 'leftArea',
    name: 'icon1',
    type: 'Dock',
    props: {
      align: 'bottom',
      icon: 'set',
      description: '设置'
    },
  });
}

async function init(container?: Element) {
  await loadAssets();
  await loadSchema();
  initDemoPanes();

  if (!container) {
    container = document.createElement('div');
    document.body.appendChild(container);
  }
  container.id = 'engine';

  render(
    createElement(Workbench, {
      skeleton,
      className: 'engine-main',
      topAreaItemClassName: 'engine-actionitem',
    }),
    container,
  );
}
init();
