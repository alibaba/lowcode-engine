export default {
  version: '1.0.0',
  packages: {
    '@alifd/next': {
      title: 'fusion组件库',
      package: '@alifd/next',
      version: '1.19.18',
      urls: [
        'https://unpkg.antfin-inc.com/@alife/next@1.19.18/dist/next.js',
        'https://unpkg.antfin-inc.com/@alife/next@1.19.18/dist/next.css'
      ],
      library: 'Next'
    }
  },
  components: {
    Button: {
      componentName: 'Button',
      title: '按钮',
      devMode: 'proCode',
      npm: {
        package: '@alifd/next',
        version: '1.19.18',
        destructuring: true,
        exportName: 'Button'
      },
      props: [
        {
          name: 'type',
          propType: 'string'
        },
        {
          name: 'children',
          propType: 'string'
        }
      ],
      configure: {
        props: [
          {
            name: 'type',
            setter: {
              componentName: 'Input'
            }
          },
          {
            name: 'children',
            setter: {
              componentName: 'Input'
            }
          }
        ]
      }
    },
    Input: {
      componentName: 'Input',
      title: '输入框',
      devMode: 'proCode',
      npm: {
        package: '@alifd/next',
        version: '1.19.18',
        destructuring: true,
        exportName: 'Input'
      },
      props: [
        {
          name: 'placeholder',
          propType: 'string'
        }
      ],
      configure: {
        props: [
          {
            name: 'placeholder',
            setter: {
              componentName: 'Input'
            }
          }
        ]
      }
    }
  },
  componentList: [
    {
      title: '基础',
      icon: '',
      children: [
        {
          componentName: 'Button',
          title: '按钮',
          icon: '',
          package: '@alife/next',
          snippets: [
            {
              title: 'private',
              screenshort: '',
              schema: {
                componentName: 'Button',
                props: {
                  type: 'primary'
                },
                children: 'Primary'
              }
            },
            {
              title: 'secondary',
              screenshort: '',
              schema: {
                componentName: 'Button',
                props: {
                  type: 'secondary'
                },
                children: 'secondary'
              }
            },
            {
              title: 'normal',
              screenshort: '',
              schema: {
                componentName: 'Button',
                props: {
                  type: 'normal'
                },
                children: 'normal'
              }
            }
          ]
        }
      ]
    },
    {
      title: '表单',
      icon: '',
      children: [
        {
          componentName: 'Input',
          title: '输入框',
          icon: '',
          package: '@alife/next',
          snippets: [
            {
              title: '普通',
              screenshort: '',
              schema: {
                componentName: 'Input',
                props: {}
              }
            }
          ]
        }
      ]
    }
  ]
};
