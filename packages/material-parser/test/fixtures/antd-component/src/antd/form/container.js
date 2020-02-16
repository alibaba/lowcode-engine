
      import Form from './../../../node_modules/antd/es/form/index.js';
      import manifest from './manifest.js';
      import FormItem from './item/container';
      export default { origin: Form, manifest, children: { Item: { ...FormItem } } };
