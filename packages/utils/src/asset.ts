import { isCSSUrl } from './is-css-url';
import { createDefer } from './create-defer';
import { load, evaluate } from './script';

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

export interface AssetsJson {
  packages: Array;
  components: Array;
  componentList?: Array;
  bizComponentList?: Array
}

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
] */
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

export function megreAssets(assets: AssetsJson, increaseAssets: AssetsJson): AssetsJson {
  if (!increaseAssets.packages) {
    console.error('assets must have packages');
  }

  if (!increaseAssets.components) {
    console.error('assets must have components');
  }

  assets.packages = [...assets.packages, ...increaseAssets.packages];
  assets.components = [...assets.components, ...increaseAssets.components];

  megreAssetsComponentList(assets, increaseAssets, 'componentList');
  megreAssetsComponentList(assets, increaseAssets, 'bizComponentList');

  return assets;
}

function megreAssetsComponentList(assets: AssetsJson, increaseAssets: AssetsJson, listName: String): void {
  if (increaseAssets[listName]) {
    if (assets[listName]) {
      // 根据title进行合并
      increaseAssets[listName].map((item) => {
        let matchFlag = false;
        assets[listName].map((assetItem) => {
          if (assetItem.title === item.title) {
            assetItem.children = assetItem.children.concat(item.children);
            matchFlag = true;
          }

          return assetItem;
        });

        !matchFlag && assets[listName].push(item);
        return item;
      });
    }
  }
}

export class StylePoint {
  private lastContent: string | undefined;

  private lastUrl: string | undefined;

  private placeholder: Element | Text;

  readonly level: number;

  readonly id: string;

  constructor(level: number, id?: string) {
    this.level = level;
    if (id) {
      this.id = id;
    }
    let placeholder: any;
    if (id) {
      placeholder = document.head.querySelector(`style[data-id="${id}"]`);
    }
    if (!placeholder) {
      placeholder = document.createTextNode('');
      const meta = document.head.querySelector(`meta[level="${level}"]`);
      if (meta) {
        document.head.insertBefore(placeholder, meta);
      } else {
        document.head.appendChild(placeholder);
      }
    }
    this.placeholder = placeholder;
  }

  applyText(content: string) {
    if (this.lastContent === content) {
      return;
    }
    this.lastContent = content;
    this.lastUrl = undefined;
    const element = document.createElement('style');
    element.setAttribute('type', 'text/css');
    if (this.id) {
      element.setAttribute('data-id', this.id);
    }
    element.appendChild(document.createTextNode(content));
    document.head.insertBefore(element, this.placeholder.parentNode === document.head ? this.placeholder.nextSibling : null);
    document.head.removeChild(this.placeholder);
    this.placeholder = element;
  }

  applyUrl(url: string) {
    if (this.lastUrl === url) {
      return;
    }
    this.lastContent = undefined;
    this.lastUrl = url;
    const element = document.createElement('link');
    element.onload = onload;
    element.onerror = onload;

    const i = createDefer();
    function onload(e: any) {
      element.onload = null;
      element.onerror = null;
      if (e.type === 'load') {
        i.resolve();
      } else {
        i.reject();
      }
    }

    element.href = url;
    element.rel = 'stylesheet';
    if (this.id) {
      element.setAttribute('data-id', this.id);
    }
    document.head.insertBefore(element, this.placeholder.parentNode === document.head ? this.placeholder.nextSibling : null);
    document.head.removeChild(this.placeholder);
    this.placeholder = element;
    return i.promise();
  }
}

function parseAssetList(scripts: any, styles: any, assets: AssetList, level?: AssetLevel) {
  for (const asset of assets) {
    parseAsset(scripts, styles, asset, level);
  }
}

function parseAsset(scripts: any, styles: any, asset: Asset | undefined | null, level?: AssetLevel) {
  if (!asset) {
    return;
  }
  if (Array.isArray(asset)) {
    return parseAssetList(scripts, styles, asset, level);
  }

  if (isAssetBundle(asset)) {
    if (asset.assets) {
      if (Array.isArray(asset.assets)) {
        parseAssetList(scripts, styles, asset.assets, asset.level || level);
      } else {
        parseAsset(scripts, styles, asset.assets, asset.level || level);
      }
      return;
    }
    return;
  }

  if (!isAssetItem(asset)) {
    asset = assetItem(isCSSUrl(asset) ? AssetType.CSSUrl : AssetType.JSUrl, asset, level)!;
  }

  let lv = asset.level || level;

  if (!lv || AssetLevel[lv] == null) {
    lv = AssetLevel.App;
  }

  asset.level = lv;
  if (asset.type === AssetType.CSSUrl || asset.type == AssetType.CSSText) {
    styles[lv].push(asset);
  } else {
    scripts[lv].push(asset);
  }
}

export class AssetLoader {
  async load(asset: Asset) {
    const styles: any = {};
    const scripts: any = {};
    AssetLevels.forEach(lv => {
      styles[lv] = [];
      scripts[lv] = [];
    });
    parseAsset(scripts, styles, asset);
    const styleQueue: AssetItem[] = styles[AssetLevel.Environment].concat(
      styles[AssetLevel.Library],
      styles[AssetLevel.Theme],
      styles[AssetLevel.Runtime],
      styles[AssetLevel.App],
    );
    const scriptQueue: AssetItem[] = scripts[AssetLevel.Environment].concat(
      scripts[AssetLevel.Library],
      scripts[AssetLevel.Theme],
      scripts[AssetLevel.Runtime],
      scripts[AssetLevel.App],
    );
    await Promise.all(
      styleQueue.map(({ content, level, type, id }) => this.loadStyle(content, level!, type === AssetType.CSSUrl, id)),
    );
    await Promise.all(scriptQueue.map(({ content, type }) => this.loadScript(content, type === AssetType.JSUrl)));
  }

  private stylePoints = new Map<string, StylePoint>();

  private loadStyle(content: string | undefined | null, level: AssetLevel, isUrl?: boolean, id?: string) {
    if (!content) {
      return;
    }
    let point: StylePoint | undefined;
    if (id) {
      point = this.stylePoints.get(id);
      if (!point) {
        point = new StylePoint(level, id);
        this.stylePoints.set(id, point);
      }
    } else {
      point = new StylePoint(level);
    }
    return isUrl ? point.applyUrl(content) : point.applyText(content);
  }

  private loadScript(content: string | undefined | null, isUrl?: boolean) {
    if (!content) {
      return;
    }
    return isUrl ? load(content) : evaluate(content);
  }

  private async loadAsyncLibrary(asyncLibraryMap) {
    const promiseList = []; const libraryKeyList = [];
    for (const key in asyncLibraryMap) {
      // 需要异步加载
      if (asyncLibraryMap[key].async) {
        promiseList.push(window[asyncLibraryMap[key].library]);
        libraryKeyList.push(asyncLibraryMap[key].library);
      }
    }
    await Promise.all(promiseList).then((mods) => {
      if (mods.length > 0) {
        mods.map((item, index) => {
          window[libraryKeyList[index]] = item;
          return item;
        });
      }
    });
  }
}
