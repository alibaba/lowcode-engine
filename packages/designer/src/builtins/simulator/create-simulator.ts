import { getCurrentAdaptor } from '../globals';
import Simulator from '../adaptors/simulator';
import { isCSSUrl } from '../utils/is-css-url';

export interface AssetMap {
  jsUrl?: string;
  cssUrl?: string;
  jsText?: string;
  cssText?: string;
}
export type AssetList = string[];
export type Assets = AssetMap[] | AssetList;

function isAssetMap(obj: any): obj is AssetMap {
  return obj && typeof obj === 'object';
}

export function createSimulator<T, I>(iframe: HTMLIFrameElement, vendors: Assets = []): Promise<Simulator<T, I>> {
  const currentAdaptor = getCurrentAdaptor();
  const win: any = iframe.contentWindow;
  const doc = iframe.contentDocument!;

  const styles: string[] = [];
  let scripts: string[] = [];
  const afterScripts: string[] = [];

  vendors.forEach((asset: any) => {
    if (!isAssetMap(asset)) {
      if (isCSSUrl(asset)) {
        asset = { cssUrl: asset };
      } else {
        if (asset.startsWith('!')) {
          afterScripts.push(`<script src="${asset.slice(1)}"></script>`);
          return;
        }
        asset = { jsUrl: asset };
      }
    }
    if (asset.jsText) {
      scripts.push(`<script>${asset.jsText}</script>`);
    }
    if (asset.jsUrl) {
      scripts.push(`<script src="${asset.jsUrl}"></script>`);
    }
    if (asset.cssUrl) {
      styles.push(`<link rel="stylesheet" href="${asset.cssUrl}" />`);
    }
    if (asset.cssText) {
      styles.push(`<style type="text/css">${asset.cssText}</style>`);
    }
  });

  currentAdaptor.simulatorUrls.forEach(url => {
    if (isCSSUrl(url)) {
      styles.push(`<link rel="stylesheet" href="${url}" />`);
    } else {
      scripts.push(`<script src="${url}"></script>`);
    }
  });
  scripts = scripts.concat(afterScripts);

  doc.open();
  doc.write(`<!doctype html><html><head><meta charset="utf-8"/>
${styles.join('\n')}
<style base-point></style>
${scripts.join('\n')}
</head></html>`);
  doc.close();

  return new Promise(resolve => {
    if (win.VisionSimulator) {
      return resolve(win.VisionSimulator);
    }
    const loaded = () => {
      resolve(win.VisionSimulator);
      win.removeEventListener('load', loaded);
    };
    win.addEventListener('load', loaded);
  });
}
