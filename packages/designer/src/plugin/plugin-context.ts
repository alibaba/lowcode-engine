import { Editor, Hotkey, hotkey } from '@ali/lowcode-editor-core';
import { Skeleton } from '@ali/lowcode-editor-skeleton';
import { ILowCodePluginConfig, ILowCodePluginManager, ILowCodePluginContext, IDesignerHelper } from '@ali/lowcode-types';
import { getLogger, Logger } from '../utils';
import {
  registerMetadataTransducer,
  addBuiltinComponentAction,
  removeBuiltinComponentAction,
} from '../component-meta';
import { Designer } from '../designer';

export default class PluginContext implements ILowCodePluginContext {
  editor: Editor;
  skeleton: Skeleton;
  designer: Designer;
  hotkey: Hotkey;
  logger: Logger;
  plugins: ILowCodePluginManager;
  designerHelper: IDesignerHelper;

  constructor(editor: Editor, plugins: ILowCodePluginManager) {
    this.editor = editor;
    this.designer = editor.get('designer')!;
    this.skeleton = editor.get('skeleton')!;
    this.hotkey = hotkey;
    this.plugins = plugins;
    this.designerHelper = this.createDesignerHelper();
  }

  private createDesignerHelper(): IDesignerHelper {
    return {
      registerMetadataTransducer,
      addBuiltinComponentAction,
      removeBuiltinComponentAction,
    };
  }

  setLogger(config: ILowCodePluginConfig): void {
    this.logger = getLogger({ level: 'log', bizName: `designer:plugin:${config.name}` });
  }
}

