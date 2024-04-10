const addLeadingSlash = (path: string): string => {
  return path.charAt(0) === '/' ? path : `/${path}`;
};

export function getElementById(id: string, tag: string = 'div') {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement(tag);
    el.id = id;
  }

  return el;
}

const enum AssetType {
  STYLE = 'style',
  SCRIPT = 'script',
  UNKONWN = 'unkonwn',
}

function getAssetTypeByUrl(url: string): AssetType {
  const IS_CSS_REGEX = /\.css(\?((?!\.js$).)+)?$/;
  const IS_JS_REGEX = /\.[t|j]sx?(\?((?!\.css$).)+)?$/;
  const IS_JSON_REGEX = /\.json$/;

  if (IS_CSS_REGEX.test(url)) {
    return AssetType.STYLE;
  } else if (IS_JS_REGEX.test(url) || IS_JSON_REGEX.test(url)) {
    return AssetType.SCRIPT;
  }

  return AssetType.UNKONWN;
}

export async function loadPackageUrls(urls: string[]) {
  const styles: string[] = [];
  const scripts: string[] = [];

  for (const url of urls) {
    const type = getAssetTypeByUrl(url);

    if (type === AssetType.SCRIPT) {
      scripts.push(url);
    } else if (type === AssetType.STYLE) {
      styles.push(url);
    }
  }

  await Promise.all(styles.map((item) => appendExternalCss(item)));
  await Promise.all(scripts.map((item) => appendExternalScript(item)));
}

async function appendExternalScript(
  url: string,
  root: HTMLElement = document.body,
): Promise<HTMLElement> {
  if (url) {
    const el = getIfExistAssetByUrl(url, 'script');
    if (el) return el;
  }

  return new Promise((resolve, reject) => {
    const scriptElement = document.createElement('script');

    // scriptElement.type = moduleType === 'module' ? 'module' : 'text/javascript';
    /**
     * `async=false` is required to make sure all js resources execute sequentially.
     */
    scriptElement.async = false;
    scriptElement.crossOrigin = 'anonymous';
    scriptElement.src = url;

    scriptElement.addEventListener(
      'load',
      () => {
        resolve(scriptElement);
      },
      false,
    );
    scriptElement.addEventListener('error', (error) => {
      if (root.contains(scriptElement)) {
        root.removeChild(scriptElement);
      }
      reject(error);
    });

    root.appendChild(scriptElement);
  });
}

async function appendExternalCss(
  url: string,
  root: HTMLElement = document.head,
): Promise<HTMLElement> {
  if (url) {
    const el = getIfExistAssetByUrl(url, 'link');
    if (el) return el;
  }

  return new Promise((resolve, reject) => {
    const el: HTMLLinkElement = document.createElement('link');
    el.rel = 'stylesheet';
    el.href = url;

    el.addEventListener(
      'load',
      () => {
        resolve(el);
      },
      false,
    );
    el.addEventListener('error', (error) => {
      reject(error);
    });

    root.appendChild(el);
  });
}

export async function appendExternalStyle(
  cssText: string,
  root: HTMLElement = document.head,
): Promise<HTMLElement> {
  return new Promise((resolve, reject) => {
    const el: HTMLStyleElement = document.createElement('style');
    el.innerText = cssText;

    el.addEventListener(
      'load',
      () => {
        resolve(el);
      },
      false,
    );
    el.addEventListener('error', (error) => {
      reject(error);
    });

    root.appendChild(el);
  });
}

function getIfExistAssetByUrl(
  url: string,
  tag: 'link' | 'script',
): HTMLLinkElement | HTMLScriptElement | undefined {
  return Array.from(document.getElementsByTagName(tag)).find((item) => {
    const elUrl = (item as HTMLLinkElement).href || (item as HTMLScriptElement).src;

    if (/^(https?:)?\/\/([\w.]+\/?)\S*/gi.test(url)) {
      // if url === http://xxx.xxx
      return url === elUrl;
    } else {
      // if url === /xx/xx/xx.xx
      return `${location.origin}${addLeadingSlash(url)}` === elUrl;
    }
  });
}
