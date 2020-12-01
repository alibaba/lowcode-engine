import { UtilItem } from '@ali/lowcode-types';

export const DEFAULT_UTILS: UtilItem[] = [
  {
    type: 'npm',
    name: 'clone',
    content: {
      package: 'lodash',
      destructuring: true,
    },
  },
  {
    type: 'npm',
    name: 'moment',
    content: {
      package: 'moment',
      destructuring: false,
    },
  },
  {
    type: 'function',
    name: 'record',
    content: {
      type: 'JSFunction',
      value: `function(logkey, gmkey, gokey, reqMethod) {
  goldlog.record('/demo.event.' + logkey, gmkey, gokey, reqMethod);
}
`,
    },
  },
];
