// NOTE: 仅用作类型标注，切勿作为实体使用
import { BuiltinSimulatorHost } from './host';
import {
  AssetLevel,
  AssetList,
  AssetItem,
  isAssetBundle,
  isAssetItem,
  AssetType,
  assetItem,
  isCSSUrl,
} from '@alilc/lowcode-utils';

import { BuiltinSimulatorRenderer } from './renderer';

export function createSimulator(
  host: BuiltinSimulatorHost,
  iframe: HTMLIFrameElement,
  vendors: AssetList = [],
): Promise<BuiltinSimulatorRenderer> {
  const win: any = iframe.contentWindow;
  const doc = iframe.contentDocument!;

  win.LCSimulatorHost = host;

  const loadJsCss: (asset: AssetItem) => Promise<void> = (asset: AssetItem) => {
    return new Promise<void>((resolve) => {
      switch (asset.type) {
        case AssetType.JSUrl:
        case AssetType.JSText: {
          const script = doc.createElement('script');
          script.type = 'text/javascript';
          const isUrl = asset.type === AssetType.JSUrl;
          if (asset.id) {
            script.setAttribute('data-id', asset.id);
          }
          if (asset.level) {
            script.setAttribute('data-level', asset.level.toString());
          }
          script.async = false;
          if (isUrl) {
            script.src = asset.content as string;
            const loadFinish = () => {
              script.onload = null;
              script.onerror = null;
              resolve();
            };
            script.onload = loadFinish;
            script.onerror = loadFinish;
            doc.body.appendChild(script);
            if (!script.src) {
              resolve();
            }
          } else {
            try {
              win.eval(asset.content);
            } catch (e) {
              console.error(e);
            }
            resolve();
          }
          break;
        }
        case AssetType.CSSUrl:
        case AssetType.CSSText: {
          const link = doc.createElement('link');
          link.rel = 'stylesheet';
          const isUrl = asset.type === AssetType.CSSUrl;
          if (asset.id) {
            link.setAttribute('data-id', asset.id);
          }
          if (asset.level) {
            link.setAttribute('data-level', asset.level.toString());
          }
          if (isUrl) {
            link.href = asset.content as string;
            const loadFinish = () => {
              link.onload = null;
              link.onerror = null;
              resolve();
            };
            link.onload = loadFinish;
            link.onerror = loadFinish;
            doc.head.appendChild(link);
            if (!link.href) {
              resolve();
            }
          } else {
            link.appendChild(doc.createTextNode(asset.content as string));
            doc.head.appendChild(link);
            resolve();
          }
          break;
        }
        default: {
          resolve();
        }
      }
    });
  };

  const parseAssetList: (assets: AssetList, level?: AssetLevel) => AssetItem[] = (
    assets,
    level,
  ) => {
    const assetItemList: AssetItem[] = [];
    for (let asset of assets) {
      if (!asset) {
        continue;
      }
      if (isAssetBundle(asset)) {
        if (asset.assets) {
          assetItemList.push(
            ...parseAssetList(
              Array.isArray(asset.assets) ? asset.assets : [asset.assets],
              asset.level || level,
            ),
          );
        }
        continue;
      }
      if (Array.isArray(asset)) {
        assetItemList.push(...parseAssetList(asset, level));
        continue;
      }
      if (!isAssetItem(asset)) {
        asset = assetItem(isCSSUrl(asset) ? AssetType.CSSUrl : AssetType.JSUrl, asset, level)!;
      }
      assetItemList.push(asset);
    }
    return assetItemList;
  };

  return new Promise((resolve) => {
    const assetList = parseAssetList(vendors);
    assetList.sort(
      (m, n) => (m.level === undefined ? -1 : m.level) - (n.level === undefined ? -1 : n.level),
    );
    Promise.all(assetList.map(loadJsCss)).then(() => {
      const renderer = win.SimulatorRenderer || host.renderer;
      if (renderer) {
        return resolve(renderer);
      }
    });
  });
}
