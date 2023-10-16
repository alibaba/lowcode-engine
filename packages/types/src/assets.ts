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

export interface AssetItem {
  type: AssetType;
  content?: string | null;
  device?: string;
  level?: AssetLevel;
  id?: string;
  scriptType?: string;
}

export type AssetList = Array<Asset | undefined | null>;

export type Asset = AssetList | AssetBundle | AssetItem | URL;

export interface AssetBundle {
  type: AssetType.Bundle;
  level?: AssetLevel;
  assets?: Asset | AssetList | null;
}
