export function upgradeAssetsBundle(assets) {
  const components = [];
  const xPrototypes = [];
  const componentList = [];
  const packages = assets.externals.map(({ urls, library, name, version }) => {
    return {
      package: name,
      version,
      urls,
      library,
    };
  });
  assets.componentDependencies.forEach((item) => {
    const componentName = item.alias || item.library;
    const metadata = {
      componentName,
      npm: {
        package: item.packageName,
        library: item.library,
        version: item.version,
        destructuring: false,
      },
      props: [],
    };

    if (item.prototypeConfigsUrl) {
      xPrototypes.push({
        package: item.packageName,
        urls: item.prototypeConfigsUrl,
      });
    } else if (item.components) {
      packages.push({
        urls: item.urls,
        library: item.library,
        package: item.packageName,
        version: item.version,
      });
      const meta = item.components[0];
      metadata.componentName = meta.componentName;
      metadata.configure = meta.configure;
      metadata.title = meta.title;
      components.push(metadata);
      // TODO:
      if (meta.snippets) {
        componentList.push({
          title: meta.category,
          icon: '',
          children: [
            {
              title: 'json格式化展示',
              icon: '',
              snippets: meta.snippets,
            },
          ],
        });
      }
    }
  });

  return {
    "version": "1.0.0",
    packages,
    'x-prototypes': xPrototypes,
    components,
    componentList
  };
}
