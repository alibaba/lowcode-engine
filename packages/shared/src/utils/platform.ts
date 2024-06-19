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

export const enum Platform {
  Web,
  Mac,
  Linux,
  Windows,
}
export type PlatformName = 'Web' | 'Windows' | 'Mac' | 'Linux';

export function platformToString(platform: Platform): PlatformName {
  switch (platform) {
    case Platform.Web:
      return 'Web';
    case Platform.Mac:
      return 'Mac';
    case Platform.Linux:
      return 'Linux';
    case Platform.Windows:
      return 'Windows';
  }
}

export let platform: Platform = Platform.Web;
if (isMacintosh) {
  platform = Platform.Mac;
} else if (isWindows) {
  platform = Platform.Windows;
} else if (isLinux) {
  platform = Platform.Linux;
}

export const isChrome = !!(userAgent && userAgent.indexOf('Chrome') >= 0);
export const isFirefox = !!(userAgent && userAgent.indexOf('Firefox') >= 0);
export const isSafari = !!(!isChrome && userAgent && userAgent.indexOf('Safari') >= 0);
export const isEdge = !!(userAgent && userAgent.indexOf('Edg/') >= 0);
export const isAndroid = !!(userAgent && userAgent.indexOf('Android') >= 0);
