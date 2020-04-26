export interface AssetItem {
  type: AssetType;
  content?: string | null;
  device?: string;
  level?: AssetLevel;
  id?: string;
}

export enum AssetLevel {
  // 环境依赖库 比如 react, react-dom
  Environment = 1,
  // 基础类库，比如 lodash deep fusion antd
  Library = 2,
  // 主题
  Theme = 3,
  // 运行时
  Runtime = 4,
  // 业务组件
  Components = 5,
  // 应用 & 页面
  App = 6,
}

export const AssetLevels = [
  AssetLevel.Environment,
  AssetLevel.Library,
  AssetLevel.Theme,
  AssetLevel.Runtime,
  AssetLevel.Components,
  AssetLevel.App,
];

export type URL = string;

export enum AssetType {
  JSUrl = 'jsUrl',
  CSSUrl = 'cssUrl',
  CSSText = 'cssText',
  JSText = 'jsText',
  Bundle = 'bundle',
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

/*
urls: "view.js,view2 <device selector>, view3 <device selector>",
urls: [
  "view.js",
  "view.js *",
  "view1.js mobile|pc",
  "view2.js <device selector>"
]*/
export function assetItem(type: AssetType, content?: string | null, level?: AssetLevel, id?: string): AssetItem | null {
  if (!content) {
    return null;
  }
  return {
    type,
    content,
    level,
    id,
  };
}
