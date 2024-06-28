export interface ExternalElementOptions {
  id?: string;
  root?: HTMLElement;
}

export async function appendExternalScript(
  url: string,
  { id, root = document.body }: ExternalElementOptions = {},
): Promise<HTMLElement> {
  if (id) {
    const el = document.getElementById(id);
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
    if (id) scriptElement.id = id;

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

export async function appendExternalCss(
  url: string,
  { id, root = document.head }: ExternalElementOptions = {},
): Promise<HTMLElement> {
  if (id) {
    const el = document.getElementById(id);
    if (el) return el;
  }

  return new Promise((resolve, reject) => {
    const el: HTMLLinkElement = document.createElement('link');
    el.rel = 'stylesheet';
    el.href = url;
    if (id) el.id = id;

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
  { id, root = document.head }: ExternalElementOptions = {},
): Promise<HTMLElement> {
  if (id) {
    const el = document.getElementById(id);
    if (el) return el;
  }

  return new Promise((resolve, reject) => {
    const el: HTMLStyleElement = document.createElement('style');
    el.innerText = cssText;
    if (id) el.id = id;

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
