// NOTE: 仅用作类型标注，切勿作为实体使用
import { SimulatorRenderer } from '../renderer/renderer';
import { SimulatorHost } from './host';
import { AssetLevel, AssetList, isAssetBundle, isAssetItem, isCSSUrl, AssetType, assetItem } from '../utils/asset';

export function createSimulator(host: SimulatorHost, iframe: HTMLIFrameElement, vendors: AssetList = []): Promise<SimulatorRenderer> {
  const win: any = iframe.contentWindow;
  const doc = iframe.contentDocument!;

  win.LCSimulatorHost = host;

  const styles: any = {};
  const scripts: any = {};
  Object.keys(AssetLevel).forEach((key) => {
    const v = (AssetLevel as any)[key];
    styles[v] = [];
    scripts[v] = [];
  });

  function parseAssetList(assets: AssetList, level?: AssetLevel) {
    for (let asset of assets) {
      if (!asset) {
        continue;
      }
      if (isAssetBundle(asset)) {
        if (asset.assets) {
          parseAssetList(Array.isArray(asset.assets) ? asset.assets : [asset.assets], asset.level || level);
        }
        continue;
      }
      if (Array.isArray(asset)) {
        parseAssetList(asset, level);
        continue;
      }
      if (!isAssetItem(asset)) {
        asset = assetItem(isCSSUrl(asset) ? AssetType.CSSUrl : AssetType.JSUrl, asset, level)!;
      }
      const id = asset.id ? ` data-id="${asset.id}"` : '';
      const lv = asset.level || level || AssetLevel.BaseDepends;
      if (asset.type === 'jsUrl') {
        (scripts[lv] || scripts[AssetLevel.App]).push(`<script src="${asset.content}"${id}></script>`)
      } else if (asset.type === 'jsText') {
        (scripts[lv] || scripts[AssetLevel.App]).push(`<script${id}>${asset.content}</script>`);
      } else if (asset.type === 'cssUrl') {
        (styles[lv] || styles[AssetLevel.App]).push(`<link rel="stylesheet" href="${asset.content}"${id} />`);
      } else if (asset.type === 'cssText') {
        (styles[lv] || styles[AssetLevel.App]).push(`<style type="text/css"${id}>${asset.content}</style>`);
      }
    }
  }

  parseAssetList(vendors);

  const styleFrags = Object.keys(styles).map(key => {
    return styles[key].join('\n') + `<meta level="${key}" />`;
  });
  const scriptFrags = Object.keys(scripts).map(key => {
    return styles[key].join('\n') + `<meta level="${key}" />`;
  });

  doc.open();
  doc.write(`<!doctype html><html><head><meta charset="utf-8"/>
  ${styleFrags}
</head><body>${scriptFrags}</body></html>`);
  doc.close();

  return new Promise(resolve => {
    if (win.SimulatorRenderer || host.renderer) {
      return resolve(win.SimulatorRenderer || host.renderer);
    }
    const loaded = () => {
      resolve(win.SimulatorRenderer || host.renderer);
      win.removeEventListener('load', loaded);
    };
    win.addEventListener('load', loaded);
  });
}
