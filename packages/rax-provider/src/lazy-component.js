import { createElement, useState, useEffect } from 'rax';
import { app } from '@ali/lowcode-runtime';

export default function LazyComponent(props) {
  const [schema, setSchema] = useState(null);

  useEffect(() => {
    (async () => {
      const { getPageData } = props || {};
      if (getPageData && !schema) {
        const data = await getPageData();
        setSchema(data);
      }
    })();
  });

  const { getPageData, ...restProps } = props || {};
  const Renderer = app.getRenderer();
  const Loading = app.getLoading();
  if (!Renderer || !schema) {
    if (!Loading) {
      return null;
    }
    // loading扩展点
    return createElement(Loading);
  }
  return createElement(Renderer, { schema, loading: Loading ? createElement(Loading) : null, ...restProps });
}
