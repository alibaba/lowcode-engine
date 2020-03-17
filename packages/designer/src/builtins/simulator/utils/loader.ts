import { load, evaluate } from './script';
import StylePoint from './style';
import {
  Asset,
  AssetLevel,
  AssetLevels,
  AssetType,
  AssetList,
  isAssetBundle,
  isAssetItem,
  assetItem,
  AssetItem,
} from './asset';
import { isCSSUrl } from '../../../utils/is-css-url';

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
}

export default new AssetLoader();
