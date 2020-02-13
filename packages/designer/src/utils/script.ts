import { createDefer } from './create-defer';

export function evaluate(script: string) {
  const scriptEl = document.createElement('script');
  scriptEl.text = script;
  document.head.appendChild(scriptEl);
  document.head.removeChild(scriptEl);
}

export function load(url: string) {
  const node: any = document.createElement('script');

  // node.setAttribute('crossorigin', 'anonymous');

  node.onload = onload;
  node.onerror = onload;

  const i = createDefer();

  function onload(e: any) {
    node.onload = null;
    node.onerror = null;
    if (e.type === 'load') {
      i.resolve();
    } else {
      i.reject();
    }
    // document.head.removeChild(node);
    // node = null;
  }

  // node.async = true;
  node.src = url;

  document.head.appendChild(node);

  return i.promise();
}
