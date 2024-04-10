import { init, plugins } from '@alilc/lowcode-engine';
import EditorInitPlugin from './plugins/plugin-editor-init';

import '@alilc/lowcode-engine/dist/style.css';
import './index.css';

async function run() {
  await plugins.register(EditorInitPlugin, {
    scenarioName: 'general',
    displayName: '综合场景',
    info: {
      urls: [
        {
          key: '设计器',
          value: 'https://github.com/alibaba/lowcode-demo/tree/main/demo-general',
        },
        {
          key: 'fusion-ui 物料',
          value: 'https://github.com/alibaba/lowcode-materials/tree/main/packages/fusion-ui',
        },
        {
          key: 'fusion 物料',
          value: 'https://github.com/alibaba/lowcode-materials/tree/main/packages/fusion-lowcode-materials',
        }
      ],
    },
  });

  await init(document.getElementById('app')!, {
    locale: 'zh-CN',
    enableCondition: true,
    enableCanvasLock: true,
    // 默认绑定变量
    supportVariableGlobally: true,
    requestHandlersMap: {},
    simulatorUrl: [
      'https://alifd.alicdn.com/npm/@alilc/lowcode-react-simulator-renderer@1.1.1/dist/css/react-simulator-renderer.css',
      'https://alifd.alicdn.com/npm/@alilc/lowcode-react-simulator-renderer@1.1.1/dist/js/react-simulator-renderer.js'
    ],
    enableContextMenu: true,
  });
}

run()
