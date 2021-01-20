import * as designerCabin from '@ali/lowcode-designer';

export {
  ILowCodePluginConfig,
  ILowCodePluginManager,
  ILowCodePluginContext,
  IDesignerCabin,
} from '@ali/lowcode-designer';

// 这样做的目的是为了去除 Node / DocumentModel 等的值属性，仅保留类型属性
export type Node = designerCabin.Node;
export type ParentalNode = designerCabin.ParentalNode;
export type DocumentModel = designerCabin.DocumentModel;
export type RootNode = designerCabin.RootNode;
export type EditingTarget = designerCabin.EditingTarget;
export type SaveHandler = designerCabin.SaveHandler;
export type ComponentMeta = designerCabin.ComponentMeta;
