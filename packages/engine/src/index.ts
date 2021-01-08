import { createElement } from 'react';
import { render } from 'react-dom';
import * as editorHelper from '@ali/lowcode-editor-core';
import * as designerHelper from '@ali/lowcode-designer';
// import { Node } from '@ali/lowcode-designer';
import { skeleton, designer, editor, plugins } from './editor';
import * as skeletonHelper from '@ali/lowcode-editor-skeleton';

const { project, currentSelection: selection } = designer;
const { hotkey, monitor, getSetter, registerSetter } = editorHelper;
const { Workbench } = skeletonHelper;
const setters = {
  getSetter,
  registerSetter,
};

export {
  editor,
  editorHelper,
  skeleton,
  skeletonHelper,
  designer,
  designerHelper,
  plugins,
  setters,
  project,
  selection,
  /**
   * 注册一些全局的切面
   */
  // hooks,
  /**
   * 全局的一些数据存储
   */
  // store,
  hotkey,
  monitor,
};

// TODO: build-plugin-component 的 umd 开发态没有导出 AliLowCodeEngine，这里先简单绕过
(window as any).AliLowCodeEngine = {
  editor,
  editorHelper,
  skeleton,
  skeletonHelper,
  designer,
  designerHelper,
  plugins,
  setters,
  project,
  selection,
  /**
   * 注册一些全局的切面
   */
  // hooks,
  /**
   * 全局的一些数据存储
   */
  // store,
  hotkey,
  monitor,
}

export async function init(container?: Element) {
  let engineContainer = container;
  if (!engineContainer) {
    engineContainer = document.createElement('div');
    document.body.appendChild(engineContainer);
  }
  engineContainer.id = 'engine';

  await plugins.init();
  render(
    createElement(Workbench, {
      skeleton,
      className: 'engine-main',
      topAreaItemClassName: 'engine-actionitem',
    }),
    engineContainer,
  );
}

const version = '{VERSION}';

console.log(
  `%c AliLowCodeEngine %c v${version} `,
  'padding: 2px 1px; border-radius: 3px 0 0 3px; color: #fff; background: #606060; font-weight: bold;',
  'padding: 2px 1px; border-radius: 0 3px 3px 0; color: #fff; background: #42c02e; font-weight: bold;',
);

