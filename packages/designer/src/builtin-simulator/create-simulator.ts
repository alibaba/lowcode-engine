// NOTE: 仅用作类型标注，切勿作为实体使用
import { BuiltinSimulatorHost } from './host';
import { AssetLevel, AssetLevels, AssetList, isAssetBundle, isAssetItem, AssetType, assetItem } from '@ali/lowcode-utils';
import { isCSSUrl } from '@ali/lowcode-utils';
import { BuiltinSimulatorRenderer } from './renderer';

export function createSimulator(
  host: BuiltinSimulatorHost,
  iframe: HTMLIFrameElement,
  vendors: AssetList = [],
): Promise<BuiltinSimulatorRenderer> {
  const win: any = iframe.contentWindow;
  const doc = iframe.contentDocument!;

  win.LCSimulatorHost = host;

  const styles: any = {};
  const scripts: any = {};
  AssetLevels.forEach(lv => {
    styles[lv] = [];
    scripts[lv] = [];
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
      const lv = asset.level || level || AssetLevel.Environment;
      if (asset.type === AssetType.JSUrl) {
        (scripts[lv] || scripts[AssetLevel.App]).push(`<script src="${asset.content}"${id}></script>`);
      } else if (asset.type === AssetType.JSText) {
        (scripts[lv] || scripts[AssetLevel.App]).push(`<script${id}>${asset.content}</script>`);
      } else if (asset.type === AssetType.CSSUrl) {
        (styles[lv] || styles[AssetLevel.App]).push(`<link rel="stylesheet" href="${asset.content}"${id} />`);
      } else if (asset.type === AssetType.CSSText) {
        (styles[lv] || styles[AssetLevel.App]).push(`<style type="text/css"${id}>${asset.content}</style>`);
      }
    }
  }

  parseAssetList(vendors);

  const styleFrags = Object.keys(styles)
    .map(key => {
      return styles[key].join('\n') + `<meta level="${key}" />`;
    })
    .join('');
  const scriptFrags = Object.keys(scripts)
    .map(key => {
      return scripts[key].join('\n');
    })
    .join('');

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
