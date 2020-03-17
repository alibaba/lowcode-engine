import { IProjectSchema, IResultDir, IResultFile } from '@/types';

import CodeGenerator from '@/index';

const schema: IProjectSchema = {
  version: '1.0.0',
  componentsMap: [
    {
      componentName: 'Button',
      package: 'alife/next',
      version: '1.0.0',
      destructuring: true,
      exportName: 'Select',
      subName: 'Button',
    },
  ],
  componentsTree: [
    {
      componentName: 'Page',
      fileName: 'Page1',
      props: {},
      css: 'body {font-size: 12px;} .table { width: 100px;}',
      children: [
        {
          componentName: 'Div',
          props: {
            className: '',
          },
          children: [
            {
              componentName: 'Button',
              props: {
                prop1: 1234,
                prop2: [
                  {
                    label: '选项1',
                    value: 1,
                  },
                  {
                    label: '选项2',
                    value: 2,
                  },
                ],
                prop3: [
                  {
                    name: 'myName',
                    rule: {
                      type: 'JSExpression',
                      value: '/w+/i',
                    },
                  },
                ],
                valueBind: {
                  type: 'JSExpression',
                  value: 'this.state.user.name',
                },
                onClick: {
                  type: 'JSExpression',
                  value: 'function(e) { console.log(e.target.innerText) }',
                },
                onClick2: {
                  type: 'JSExpression',
                  value: 'this.submit',
                },
              },
            },
          ],
        },
      ],
    },
  ],
  utils: [
    {
      name: 'clone',
      type: 'npm',
      content: {
        package: 'lodash',
        version: '0.0.1',
        exportName: 'clone',
        subName: '',
        destructuring: false,
        main: '/lib/clone',
      },
    },
    {
      name: 'beforeRequestHandler',
      type: 'function',
      content: {
        type: 'JSExpression',
        value: 'function(){\n ... \n}',
      },
    },
  ],
  constants: {
    ENV: 'prod',
    DOMAIN: 'xxx.alibaba-inc.com',
  },
  css: 'body {font-size: 12px;} .table { width: 100px;}',
  config: {
    sdkVersion: '1.0.3',
    historyMode: 'hash',
    targetRootID: 'J_Container',
    layout: {
      componentName: 'BasicLayout',
      props: {
        logo: '...',
        name: '测试网站',
      },
    },
    theme: {
      package: '@alife/theme-fusion',
      version: '^0.1.0',
    },
  },
  meta: {
    name: 'demo应用',
    git_group: 'appGroup',
    project_name: 'app_demo',
    description: '这是一个测试应用',
    spma: 'spa23d',
    creator: '月飞',
  },
  i18n: {
    'zh-CN': {
      i18nJwg27yo4: '你好',
      i18nJwg27yo3: '中国',
    },
    'en-US': {
      i18nJwg27yo4: 'Hello',
      i18nJwg27yo3: 'China',
    },
  },
};

function flatFiles(rootName: string | null, dir: IResultDir): IResultFile[] {
  const dirRoot: string = rootName ? `${rootName}/${dir.name}` : dir.name;
  const files: IResultFile[] = dir.files.map(file => ({
    name: `${dirRoot}/${file.name}.${file.ext}`,
    content: file.content,
    ext: '',
  }));
  const filesInSub = dir.dirs.map(subDir => flatFiles(`${dirRoot}`, subDir));
  const result: IResultFile[] = files.concat.apply(files, filesInSub);

  return result;
}

function main() {
  const createIceJsProjectBuilder = CodeGenerator.solutions.icejs;
  const builder = createIceJsProjectBuilder();
  builder.generateProject(schema).then(result => {
    const files = flatFiles('.', result);
    files.forEach(file => {
      console.log(`========== ${file.name} Start ==========`);
      console.log(file.content);
      console.log(`========== ${file.name} End   ==========`);
    });
  });
}

main();
