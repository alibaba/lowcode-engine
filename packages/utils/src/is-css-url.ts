export function isCSSUrl(url: string): boolean {
  return /\.css(\?.*)?$/.test(url);
}
