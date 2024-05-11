const userAgent = navigator.userAgent;

export const isFirefox = userAgent.indexOf('Firefox') >= 0;
export const isWebKit = userAgent.indexOf('AppleWebKit') >= 0;
export const isChrome = userAgent.indexOf('Chrome') >= 0;
export const isSafari = !isChrome && userAgent.indexOf('Safari') >= 0;
export const isWebkitWebView = !isChrome && !isSafari && isWebKit;
export const isAndroid = userAgent.indexOf('Android') >= 0;
