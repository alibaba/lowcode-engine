import { ComponentMetadata } from "@alilc/lowcode-types";
export default {
  componentName: 'RootContent',
  npm: {
    package: '@ali/vc-page',
  },
  title: '容器',
  docUrl: 'https://github.com/alibaba/lowcode-materials/tree/main/docs',
  devMode: 'proCode',
  tags: ['布局'],
  configure: {
    props: [
      {
        type: 'field',
        name: 'behavior',
        title: '默认状态',
        extraProps: {
          display: 'inline',
          defaultValue: 'NORMAL',
        },
        setter: {
          componentName: 'MixedSetter',
          props: {
            setters: [
              {
                key: null,
                ref: null,
                props: {
                  options: [
                    {
                      title: '普通',
                      value: 'NORMAL',
                    },
                    {
                      title: '隐藏',
                      value: 'HIDDEN',
                    },
                  ],
                  loose: false,
                  cancelable: false,
                },
                _owner: null,
              },
              'VariableSetter',
            ],
          },
        },
      },
      {
        type: 'field',
        name: '__style__',
        title: {
          label: '样式设置',
          tip: '点击 ? 查看样式设置器用法指南',
          docUrl: 'https://lark.alipay.com/legao/help/design-tool-style',
        },
        extraProps: {
          display: 'accordion',
          defaultValue: {},
        },
        setter: {
          key: null,
          ref: null,
          props: {
            advanced: true,
          },
          _owner: null,
        },
      },
      {
        type: 'group',
        name: 'groupkgzzeo41',
        title: '高级',
        extraProps: {
          display: 'accordion',
        },
        items: [
          {
            type: 'field',
            name: 'fieldId',
            title: {
              label: '唯一标识',
            },
            extraProps: {
              display: 'block',
            },
            setter: {
              key: null,
              ref: null,
              props: {
                placeholder: '请输入唯一标识',
                multiline: false,
                rows: 10,
                required: false,
                pattern: null,
                maxLength: null,
              },
              _owner: null,
            },
          },
          {
            type: 'field',
            name: 'useFieldIdAsDomId',
            title: {
              label: '将唯一标识用作 DOM ID',
            },
            extraProps: {
              display: 'block',
              defaultValue: false,
            },
            setter: {
              key: null,
              ref: null,
              props: {},
              _owner: null,
            },
          },
          {
            type: 'field',
            name: 'customClassName',
            title: '自定义样式类',
            extraProps: {
              display: 'block',
              defaultValue: '',
            },
            setter: {
              componentName: 'MixedSetter',
              props: {
                setters: [
                  {
                    key: null,
                    ref: null,
                    props: {
                      placeholder: null,
                      multiline: false,
                      rows: 10,
                      required: false,
                      pattern: null,
                      maxLength: null,
                    },
                    _owner: null,
                  },
                  'VariableSetter',
                ],
              },
            },
          },
          {
            type: 'field',
            name: 'events',
            title: {
              label: '动作设置',
              tip: '点击 ? 查看如何设置组件的事件响应动作',
              docUrl: 'https://lark.alipay.com/legao/legao/events-call',
            },
            extraProps: {
              display: 'accordion',
              defaultValue: {
                ignored: true,
              },
            },
            setter: {
              key: null,
              ref: null,
              props: {
                events: [
                  {
                    name: 'onClick',
                    title: '当点击时',
                    initialValue:
                      "/**\n * 容器 当点击时\n */\nfunction onClick(event) {\n  console.log('onClick', event);\n}",
                  },
                  {
                    name: 'onMouseEnter',
                    title: '当鼠标进入时',
                    initialValue:
                      "/**\n * 容器 当鼠标进入时\n */\nfunction onMouseEnter(event) {\n  console.log('onMouseEnter', event);\n}",
                  },
                  {
                    name: 'onMouseLeave',
                    title: '当鼠标离开时',
                    initialValue:
                      "/**\n * 容器 当鼠标离开时\n */\nfunction onMouseLeave(event) {\n  console.log('onMouseLeave', event);\n}",
                  },
                ],
              },
              _owner: null,
            },
          },
          {
            type: 'field',
            name: 'onClick',
            extraProps: {
              defaultValue: {
                ignored: true,
              },
            },
            setter: 'I18nSetter',
          },
          {
            type: 'field',
            name: 'onMouseEnter',
            extraProps: {
              defaultValue: {
                ignored: true,
              },
            },
            setter: 'I18nSetter',
          },
          {
            type: 'field',
            name: 'onMouseLeave',
            extraProps: {
              defaultValue: {
                ignored: true,
              },
            },
            setter: 'I18nSetter',
          },
        ],
      },
    ],
    component: {
      isContainer: true,
      nestingRule: {
        // parentWhitelist: 'Div',
        // childWhitelist: 'Div',
      },
    },
    supports: {},
  },
  experimental: {
    callbacks: {},
    initials: [
      {
        name: 'behavior',
      },
      {
        name: '__style__',
      },
      {
        name: 'fieldId',
      },
      {
        name: 'useFieldIdAsDomId',
      },
      {
        name: 'customClassName',
      },
      {
        name: 'events',
      },
      {
        name: 'onClick',
      },
      {
        name: 'onMouseEnter',
      },
      {
        name: 'onMouseLeave',
      },
    ],
    filters: [
      {
        name: 'events',
      },
      {
        name: 'onClick',
      },
      {
        name: 'onMouseEnter',
      },
      {
        name: 'onMouseLeave',
      },
    ],
    autoruns: [],
  },
} as ComponentMetadata;
