const x = require('./assets1.json');
const fs = require('fs');

const metadatas = [];
const libraries = [];
x.content.componentDependencies.forEach((item) => {
  const componentName = item.alias || item.library;
  const metadata = {
    componentName,
    npm: {
      package: item.packageName,
      library: item.library,
      version: item.version,
      destructuring: false
    },
    props: [],
  };
  metadatas.push(metadata);

  libraries.push({
    "urls": item.urls,
    "library": item.library,
    "package": item.packageName,
    "version": item.version
  });

  if (item.prototypeConfigsUrl) {
    // componentName 基本无效 内部设置为 pending
    // 设置 componentMeta 实体为 pendingComponentMeta，以获取 prototype 的值
    // 技术处理手段: url?processId=xxxx
    // createPrototype 时，可获取 currentScript, 拿到 processId, 进行关联
    metadata['x-prototype-urls'] = item.prototypeConfigsUrl;
  }

  // 出现在没有prototypeConfig 的情况
  else if (item.components) {
    const meta = item.components[0];
    metadata.componentName = meta.componentName;
    metadata.configure = meta.configure;
    metadata.title = meta.title;
  }
});


fs.writeFileSync('./metadatas.json', JSON.stringify(metadatas, null, 2), 'utf-8');
fs.writeFileSync('./libraries.json', JSON.stringify(libraries, null, 2), 'utf-8');
