const userAgent: string = window.navigator.userAgent;

export const isWindows = userAgent.indexOf('Windows') >= 0;
export const isMacintosh = userAgent.indexOf('Macintosh') >= 0;
export const isLinux = userAgent.indexOf('Linux') >= 0;
export const isIOS =
  (isMacintosh || userAgent.indexOf('iPad') >= 0 || userAgent.indexOf('iPhone') >= 0) &&
  !!window.navigator.maxTouchPoints &&
  window.navigator.maxTouchPoints > 0;
export const isMobile = userAgent?.indexOf('Mobi') >= 0;

export const platformLocale = window.navigator.language;

export const enum PlatformEnum {
  Unknown,
  Mac,
  Linux,
  Windows,
}
export type PlatformName = 'Unknown' | 'Windows' | 'Mac' | 'Linux';

export function platformToString(platform: PlatformEnum): PlatformName {
  switch (platform) {
    case PlatformEnum.Mac:
      return 'Mac';
    case PlatformEnum.Linux:
      return 'Linux';
    case PlatformEnum.Windows:
      return 'Windows';
    default:
      return 'Unknown';
  }
}

export let platform: PlatformEnum = PlatformEnum.Unknown;
if (isMacintosh) {
  platform = PlatformEnum.Mac;
} else if (isWindows) {
  platform = PlatformEnum.Windows;
} else if (isLinux) {
  platform = PlatformEnum.Linux;
}

export const isChrome = !!(userAgent && userAgent.indexOf('Chrome') >= 0);
export const isFirefox = !!(userAgent && userAgent.indexOf('Firefox') >= 0);
export const isSafari = !!(!isChrome && userAgent && userAgent.indexOf('Safari') >= 0);
export const isEdge = !!(userAgent && userAgent.indexOf('Edg/') >= 0);
export const isAndroid = !!(userAgent && userAgent.indexOf('Android') >= 0);
