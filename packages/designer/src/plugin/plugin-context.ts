import { Editor, Hotkey, hotkey, getSetter, registerSetter, getSettersMap } from '@ali/lowcode-editor-core';
import { Skeleton } from '@ali/lowcode-editor-skeleton';
import { ILowCodePluginConfig, ILowCodePluginManager, ILowCodePluginContext, IDesignerCabin } from './plugin-types';
import { getLogger, Logger } from '../utils';
import {
  registerMetadataTransducer,
  addBuiltinComponentAction,
  removeBuiltinComponentAction,
} from '../component-meta';
import { Designer } from '../designer';
import { Setters } from '../types';

export default class PluginContext implements ILowCodePluginContext {
  editor: Editor;
  skeleton: Skeleton;
  designer: Designer;
  hotkey: Hotkey;
  logger: Logger;
  plugins: ILowCodePluginManager;
  designerCabin: IDesignerCabin;
  setters: Setters;

  constructor(editor: Editor, plugins: ILowCodePluginManager) {
    this.editor = editor;
    this.designer = editor.get('designer')!;
    this.skeleton = editor.get('skeleton')!;
    this.hotkey = hotkey;
    this.plugins = plugins;
    this.designerCabin = this.createDesignerCabin();
    this.setters = {
      getSetter,
      registerSetter,
      getSettersMap,
    };
  }

  private createDesignerCabin(): IDesignerCabin {
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

