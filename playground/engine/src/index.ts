import { init } from '@alilc/lowcode-engine';

import './index.css';

init(document.getElementById('app')!, {
  locale: 'zh-CN',
  enableCondition: true,
  enableCanvasLock: true,
  // 默认绑定变量
  supportVariableGlobally: true,
  requestHandlersMap: {},
});
