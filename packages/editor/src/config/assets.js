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
          name: 'onClick',
          propType: 'func'
        },
        {
          name: 'children',
          propType: 'string'
        }
      ],
    },
    'Button.Group': {
      componentName: 'Button.Group',
      title: '按钮组',
      devMode: 'proCode',
      npm: {
        package: '@alifd/next',
        version: '1.19.18',
        destructuring: true,
        exportName: 'Button',
        subName: 'Group'
      },
      props: [
        {
          name: 'size',
          propType: 'string'
        }
      ],
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
        },
        {
          name: 'onChange',
          propType: 'func'
        },
        {
          name: 'onKeyDown',
          propType: 'func'
        },
        {
          name: 'onFocus',
          propType: 'func'
        },
        {
          name: 'onBlur',
          propType: 'func'
        }
      ],
    },
    Form: {
      componentName: 'Form',
      title: '表单容器',
      devMode: 'proCode',
      npm: {
        package: '@alifd/next',
        version: '1.19.18',
        destructuring: true,
        exportName: 'Form'
      },
      props: [
        {
          name: 'device',
          propType: 'string'
        },
        {
          name: 'onChange',
          propType: 'func'
        },
      ],
    },
    'Form.Item': {
      componentName: 'Form.Item',
      title: '表单项',
      devMode: 'proCode',
      npm: {
        package: '@alifd/next',
        version: '1.19.18',
        destructuring: true,
        exportName: 'Form',
        subName: 'Item'
      },
      props: [
        {
          name: 'label',
          propType: 'string',
        },
        {
          name: 'device',
          propType: 'string'
        }
      ],
    },
    NumberPicker: {
      componentName: 'NumberPicker',
      title: '数字输入',
      devMode: 'proCode',
      npm: {
        package: '@alifd/next',
        version: '1.19.18',
        destructuring: true,
        exportName: 'NumberPicker',
      },
      props: [
        {
          name: 'size',
          propType: 'string',
        },
        {
          name: 'defaultValue',
          propType: 'number'
        },
        {
          name: 'onChange',
          propType: 'func'
        },
        {
          name: 'onKeyDown',
          propType: 'func'
        },
        {
          name: 'onFocus',
          propType: 'func'
        },
        {
          name: 'onBlur',
          propType: 'func'
        },
        {
          name: 'onCorrect',
          propType: 'func'
        }
      ],
    },
    Select: {
      componentName: 'Select',
      title: '下拉',
      devMode: 'proCode',
      npm: {
        package: '@alifd/next',
        version: '1.19.18',
        destructuring: true,
        exportName: 'Select',
      },
      props: [
        {
          name: 'size',
          propType: 'string',
        },
        {
          name: 'defaultValue',
          propType: 'number'
        },
        {
          name: 'placeholder',
          propType: 'string'
        },
        {
          name: 'onChange',
          propType: 'func'
        },
        {
          name: 'onVisibleChange',
          propType: 'func'
        },
        {
          name: 'onToggleHighlightItem',
          propType: 'func'
        },
        {
          name: 'onSearch',
          propType: 'func'
        },
        {
          name: 'onSearchClear',
          propType: 'func'
        },
        {
          name: 'onRemove',
          propType: 'func'
        },
        {
          name: 'onFocus',
          propType: 'func'
        },
        {
          name: 'onBlur',
          propType: 'func'
        }
      ],
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
