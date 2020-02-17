export interface AssetItem {
  type: AssetType;
  content?: string | null;
  level?: AssetLevel;
  id?: string;
}

export enum AssetLevel {
  // 基础依赖库
  BaseDepends = 1,
  // 基础组件库
  BaseComponents = 2,
  // 主题包
  Theme = 3,
  // 运行时
  Runtime = 4,
  // 业务组件
  Components = 5,
  // 应用 & 页面
  App = 6,
}

export type URL = string;

export enum AssetType {
  JSUrl = 'jsUrl',
  CSSUrl = 'cssUrl',
  CSSText = 'cssText',
  JSText = 'jsText',
  Bundle = 'bundel',
}

export interface AssetBundle {
  type: AssetType.Bundle;
  level?: AssetLevel;
  assets?: Asset | AssetList | null;
}

export type Asset = AssetList | AssetBundle | AssetItem | URL;

export type AssetList = Array<Asset | undefined | null>;

export function isAssetItem(obj: any): obj is AssetItem {
  return obj && obj.type;
}

export function isAssetBundle(obj: any): obj is AssetBundle {
  return obj && obj.type === AssetType.Bundle;
}

export function isCSSUrl(url: string): boolean {
  return /\.css$/.test(url);
}

export function assetBundle(assets?: Asset | AssetList | null, level?: AssetLevel): AssetBundle | null {
  if (!assets) {
    return null;
  }
  return {
    type: AssetType.Bundle,
    assets,
    level,
  };
}

export function assetItem(type: AssetType, content?: string | null, level?: AssetLevel, id?: string): AssetItem | null {
  if (content) {
    return null;
  }
  return {
    type,
    content,
    level,
    id,
  };
}
