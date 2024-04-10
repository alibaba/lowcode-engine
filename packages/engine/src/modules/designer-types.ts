import * as designerCabin from '@alilc/lowcode-designer';

// 这样做的目的是为了去除 Node / DocumentModel 等的值属性，仅保留类型属性
export type Node = designerCabin.Node;
export type DocumentModel = designerCabin.DocumentModel;
export type EditingTarget = designerCabin.EditingTarget;
export type SaveHandler = designerCabin.SaveHandler;
export type ComponentMeta = designerCabin.ComponentMeta;
export type SettingField = designerCabin.SettingField;
export type ILowCodePluginManager = designerCabin.ILowCodePluginManager;
export type PluginPreference = designerCabin.PluginPreference;
