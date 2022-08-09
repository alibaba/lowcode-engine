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

  node.src = url;

  // `async=false` is required to make sure all js resources execute sequentially.
  node.async = false;

  document.head.appendChild(node);

  return i.promise();
}

export function evaluateExpression(expr: string) {
  // eslint-disable-next-line no-new-func
  const fn = new Function(expr);
  return fn();
}

export function newFunction(args: string, code: string) {
  try {
    // eslint-disable-next-line no-new-func
    return new Function(args, code);
  } catch (e) {
    console.warn('Caught error, Cant init func');
    return null;
  }
}
