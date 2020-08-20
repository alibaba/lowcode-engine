const publicPath = (document.currentScript as HTMLScriptElement)?.src.replace(/^(.*\/)[^/]+$/, '$1');

export function getPublicPath(): string {
  return publicPath || '';
}
