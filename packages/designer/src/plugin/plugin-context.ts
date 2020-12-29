import { Editor, Hotkey, hotkey } from '@ali/lowcode-editor-core';
import { Skeleton } from '@ali/lowcode-editor-skeleton';
import { ComponentAction, ILowCodePluginConfig } from '@ali/lowcode-types';
import { getLogger, Logger } from '../utils';
import {
  registerMetadataTransducer,
  addBuiltinComponentAction,
  removeBuiltinComponentAction,
  MetadataTransducer,
} from '../component-meta';
import { Designer } from '../designer';

export interface IDesignerHelper {
  registerMetadataTransducer: (transducer: MetadataTransducer, level = 100, id?: string) => void;
  addBuiltinComponentAction: (action: ComponentAction) => void;
  removeBuiltinComponentAction: (actionName: string) => void;
}

export interface ILowCodePluginContext {
  skeleton: Skeleton;
  designer: Designer;
  editor: Editor;
  hotkey: Hotkey;
  logger: Logger;
  plugins: LowCodePluginManager;
  designerHelper: IDesignerHelper;
  /**
    其他暂不增加，按需增加
  */
}

export default class PluginContext implements ILowCodePluginContext {
  editor: Editor;
  skeleton: Skeleton;
  designer: Designer;
  hotkey: Hotkey;
  logger: Logger;
  plugins: LowCodePluginManager;
  designerHelper: IDesignerHelper;

  constructor(editor: Editor, plugins: LowCodePluginManager) {
    this.editor = editor;
    this.designer = editor.get('designer');
    this.skeleton = editor.get('skeleton');
    this.hotkey = hotkey;
    this.plugins = plugins;
    this.designerHelper = this.createDesignerHelper();
  }

  private createDesignerHelper(): () => IDesignerHelper {
    return {
      registerMetadataTransducer,
      addBuiltinComponentAction,
      removeBuiltinComponentAction,
    };
  }

  setLogger(config: ILowCodePluginConfig): (config: ILowCodePluginConfig) => void {
    this.logger = getLogger({ level: 'log', bizName: `designer:plugin:${config.name}` });
  }
}

