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
    Page: {
      componentName: 'Page',
      title: '页面',
      configure: {
        events: {
          supportedLifecycles: [
            {
              description: '初始化时',
              name: 'constructor'
            },
            {
              description: '装载后',
              name: 'componentDidMount'
            },
            {
              description: '更新时',
              name: 'componentDidMount'
            },
            {
              description: '卸载时',
              name: 'componentWillUnmount'
            }
          ]
        },
        component: {
          isContainer: true
        }
      }
    },
    Div: {
      componentName: 'Div',
      title: '容器',
      configure: {
        component: {
          isContainer: true
        }
      }
    },
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
          name: 'prefix',
          propType: 'string',
          defaultValue: 'next-'
        },
        {
          name: 'rtl',
          propType: 'bool'
        },
        {
          name: 'type',
          propType: {
            type: 'oneOf',
            value: ['primary', 'secondary', 'normal']
          },
          description: '按钮的类型',
          defaultValue: 'normal'
        },
        {
          name: 'size',
          propType: {
            type: 'oneOf',
            value: ['small', 'medium', 'large']
          },
          description: '按钮的尺寸',
          defaultValue: 'medium'
        },
        {
          name: 'iconSize',
          propType: {
            type: 'oneOf',
            value: ['xxs', 'xs', 'small', 'medium', 'large', 'xl', 'xxl', 'xxxl']
          },
          description: '按钮中 Icon 的尺寸，用于替代 Icon 的默认大小'
        },
        {
          name: 'htmlType',
          propType: {
            type: 'oneOf',
            value: ['submit', 'reset', 'button']
          },
          description: "当 component = 'button' 时，设置 button 标签的 type 值",
          defaultValue: 'button'
        },
        {
          name: 'component',
          propType: {
            type: 'oneOf',
            value: ['button', 'a', 'div', 'span']
          },
          description: '设置标签类型',
          defaultValue: 'button'
        },
        {
          name: 'loading',
          propType: 'bool',
          description: '设置按钮的载入状态',
          defaultValue: false
        },
        {
          name: 'ghost',
          propType: {
            type: 'oneOf',
            value: [true, false, 'light', 'dark']
          },
          description: '是否为幽灵按钮',
          defaultValue: false
        },
        {
          name: 'text',
          propType: 'bool',
          description: '是否为文本按钮',
          defaultValue: false
        },
        {
          name: 'warning',
          propType: 'bool',
          description: '是否为警告按钮',
          defaultValue: false
        },
        {
          name: 'disabled',
          propType: 'bool',
          description: '是否禁用',
          defaultValue: false
        },
        {
          name: 'onClick',
          propType: 'func',
          description: '点击按钮的回调\n@param {Object} e Event Object'
        },
        {
          name: 'className',
          propType: 'string'
        },
        {
          name: 'onMouseUp',
          propType: 'func'
        },
        {
          name: 'children',
          propType: 'node'
        }
      ]
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
          name: 'rtl',
          propType: 'bool'
        },
        {
          name: 'prefix',
          propType: 'string',
          defaultValue: 'next-'
        },
        {
          name: 'size',
          propType: 'string',
          description: '统一设置 Button 组件的按钮大小',
          defaultValue: 'medium'
        },
        {
          name: 'className',
          propType: 'string'
        },
        {
          name: 'children',
          propType: 'node'
        }
      ],
      configure: {
        component: {
          isContainer: true,
          nestingRule: {
            childWhitelist: 'Button'
          }
        }
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
          name: 'label',
          propType: 'node',
          description: 'label'
        },
        {
          name: 'hasClear',
          propType: 'bool',
          description: '是否出现clear按钮'
        },
        {
          name: 'hasBorder',
          propType: 'bool',
          description: '是否有边框',
          defaultValue: 'true'
        },
        {
          name: 'state',
          propType: {
            type: 'oneOf',
            value: ['error', 'loading', 'success', 'warning']
          },
          description: '状态\n@enumdesc 错误, 校验中, 成功, 警告'
        },
        {
          name: 'size',
          propType: {
            type: 'oneOf',
            value: ['small', 'medium', 'large']
          },
          description: '尺寸\n@enumdesc 小, 中, 大',
          defaultValue: 'medium'
        },
        {
          name: 'onPressEnter',
          propType: 'func',
          description: '按下回车的回调',
          defaultValue: 'func.noop'
        },
        {
          name: 'onClear',
          propType: 'func'
        },
        {
          name: 'htmlType',
          propType: 'string',
          description: '原生type'
        },
        {
          name: 'htmlSize',
          propType: 'string'
        },
        {
          name: 'hint',
          propType: 'string',
          description: '水印 (Icon的type类型，和hasClear占用一个地方)'
        },
        {
          name: 'innerBefore',
          propType: 'node',
          description: '文字前附加内容'
        },
        {
          name: 'innerAfter',
          propType: 'node',
          description: '文字后附加内容'
        },
        {
          name: 'addonBefore',
          propType: 'node',
          description: '输入框前附加内容'
        },
        {
          name: 'addonAfter',
          propType: 'node',
          description: '输入框后附加内容'
        },
        {
          name: 'addonTextBefore',
          propType: 'node',
          description: '输入框前附加文字'
        },
        {
          name: 'addonTextAfter',
          propType: 'node',
          description: '输入框后附加文字'
        },
        {
          name: 'autoComplete',
          propType: 'string',
          description: '(原生input支持)',
          defaultValue: 'off'
        },
        {
          name: 'autoFocus',
          propType: 'bool',
          description: '自动聚焦(原生input支持)'
        },
        {
          name: 'inputRender',
          propType: 'func',
          defaultValue: 'el => el'
        },
        {
          name: 'extra',
          propType: 'node'
        },
        {
          name: 'innerBeforeClassName',
          propType: 'string'
        },
        {
          name: 'innerAfterClassName',
          propType: 'string'
        },
        {
          name: 'isPreview',
          propType: 'bool',
          description: '是否为预览态',
          defaultValue: 'false'
        },
        {
          name: 'renderPreview',
          propType: 'func',
          description: '预览态模式下渲染的内容\n@param {number} value 评分值'
        }
      ]
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
          name: 'prefix',
          propType: 'string',
          description: '样式前缀',
          defaultValue: 'next-'
        },
        {
          name: 'inline',
          propType: 'bool',
          description: '内联表单'
        },
        {
          name: 'size',
          propType: {
            type: 'oneOf',
            value: ['large', 'medium', 'small']
          },
          description:
            '单个 Item 的 size 自定义，优先级高于 Form 的 size, 并且当组件与 Item 一起使用时，组件自身设置 size 属性无效。\n@enumdesc 大, 中, 小',
          defaultValue: 'medium'
        },
        {
          name: 'fullWidth',
          propType: 'bool',
          description: '单个 Item 中表单类组件宽度是否是100%'
        },
        {
          name: 'labelAlign',
          propType: {
            type: 'oneOf',
            value: ['top', 'left', 'inset']
          },
          description: '标签的位置\n@enumdesc 上, 左, 内',
          defaultValue: 'left'
        },
        {
          name: 'labelTextAlign',
          propType: {
            type: 'oneOf',
            value: ['left', 'right']
          },
          description: '标签的左右对齐方式\n@enumdesc 左, 右'
        },
        {
          name: 'field',
          propType: 'any',
          description: 'field 实例, 传 false 会禁用 field'
        },
        {
          name: 'saveField',
          propType: 'func',
          description: '保存 Form 自动生成的 field 对象'
        },
        {
          name: 'labelCol',
          propType: 'object',
          description: '控制第一级 Item 的 labelCol'
        },
        {
          name: 'wrapperCol',
          propType: 'object',
          description: '控制第一级 Item 的 wrapperCol'
        },
        {
          name: 'onSubmit',
          propType: 'func',
          description: 'form内有 `htmlType="submit"` 的元素的时候会触发'
        },
        {
          name: 'children',
          propType: 'any',
          description: '子元素'
        },
        {
          name: 'className',
          propType: 'string',
          description: '扩展class'
        },
        {
          name: 'style',
          propType: 'object',
          description: '自定义内联样式'
        },
        {
          name: 'value',
          propType: 'object',
          description: '表单数值'
        },
        {
          name: 'onChange',
          propType: 'func',
          description:
            '表单变化回调\n@param {Object} values 表单数据\n@param {Object} item 详细\n@param {String} item.name 变化的组件名\n@param {String} item.value 变化的数据\n@param {Object} item.field field 实例'
        },
        {
          name: 'component',
          propType: {
            type: 'oneOfType',
            value: ['string', 'func']
          },
          description: '设置标签类型',
          defaultValue: 'form'
        },
        {
          name: 'fieldOptions',
          propType: 'object'
        },
        {
          name: 'rtl',
          propType: 'bool'
        },
        {
          name: 'device',
          propType: {
            type: 'oneOf',
            value: ['phone', 'tablet', 'desktop']
          },
          description: '预设屏幕宽度',
          defaultValue: 'desktop'
        },
        {
          name: 'responsive',
          propType: 'bool',
          description: '是否开启内置的响应式布局 （使用ResponsiveGrid）'
        },
        {
          name: 'isPreview',
          propType: 'bool',
          description: '是否开启预览态'
        }
      ],
      configure: {
        component: {
          isContainer: true
        }
      }
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
          name: 'prefix',
          propType: 'string',
          description: '样式前缀',
          defaultValue: 'next-'
        },
        {
          name: 'rtl',
          propType: 'bool'
        },
        {
          name: 'label',
          propType: 'node',
          description: 'label 标签的文本'
        },
        {
          name: 'labelCol',
          propType: 'object',
          description:
            'label 标签布局，通 `<Col>` 组件，设置 span offset 值，如 {span: 8, offset: 16}，该项仅在垂直表单有效'
        },
        {
          name: 'wrapperCol',
          propType: 'object',
          description: '需要为输入控件设置布局样式时，使用该属性，用法同 labelCol'
        },
        {
          name: 'help',
          propType: 'node',
          description: '自定义提示信息，如不设置，则会根据校验规则自动生成.'
        },
        {
          name: 'extra',
          propType: 'node',
          description:
            '额外的提示信息，和 help 类似，当需要错误信息和提示文案同时出现时，可以使用这个。 位于错误信息后面'
        },
        {
          name: 'validateState',
          propType: {
            type: 'oneOf',
            value: ['error', 'success', 'loading', 'warning']
          },
          description: '校验状态，如不设置，则会根据校验规则自动生成\n@enumdesc 失败, 成功, 校验中, 警告'
        },
        {
          name: 'hasFeedback',
          propType: 'bool',
          description: '配合 validateState 属性使用，是否展示 success/loading 的校验状态图标, 目前只有Input支持',
          defaultValue: false
        },
        {
          name: 'style',
          propType: 'object',
          description: '自定义内联样式'
        },
        {
          name: 'id',
          propType: 'string'
        },
        {
          name: 'children',
          propType: {
            type: 'oneOfType',
            value: ['node', 'func']
          },
          description: 'node 或者 function(values)'
        },
        {
          name: 'size',
          propType: {
            type: 'oneOf',
            value: ['large', 'small', 'medium']
          },
          description:
            '单个 Item 的 size 自定义，优先级高于 Form 的 size, 并且当组件与 Item 一起使用时，组件自身设置 size 属性无效。'
        },
        {
          name: 'fullWidth',
          propType: 'bool',
          description: '单个 Item 中表单类组件宽度是否是100%'
        },
        {
          name: 'labelAlign',
          propType: {
            type: 'oneOf',
            value: ['top', 'left', 'inset']
          },
          description: '标签的位置\n@enumdesc 上, 左, 内'
        },
        {
          name: 'labelTextAlign',
          propType: {
            type: 'oneOf',
            value: ['left', 'right']
          },
          description: '标签的左右对齐方式\n@enumdesc 左, 右'
        },
        {
          name: 'className',
          propType: 'string',
          description: '扩展class'
        },
        {
          name: 'required',
          propType: 'bool',
          description: '[表单校验] 不能为空'
        },
        {
          name: 'asterisk',
          propType: 'bool',
          description: 'required 的星号是否显示'
        },
        {
          name: 'requiredMessage',
          propType: 'string',
          description: 'required 自定义错误信息'
        },
        {
          name: 'requiredTrigger',
          propType: {
            type: 'oneOfType',
            value: ['string', 'array']
          },
          description: 'required 自定义触发方式'
        },
        {
          name: 'min',
          propType: 'number',
          description: '[表单校验] 最小值'
        },
        {
          name: 'max',
          propType: 'number',
          description: '[表单校验] 最大值'
        },
        {
          name: 'minmaxMessage',
          propType: 'string',
          description: 'min/max 自定义错误信息'
        },
        {
          name: 'minmaxTrigger',
          propType: {
            type: 'oneOfType',
            value: ['string', 'array']
          },
          description: 'min/max 自定义触发方式'
        },
        {
          name: 'minLength',
          propType: 'number',
          description: '[表单校验] 字符串最小长度 / 数组最小个数'
        },
        {
          name: 'maxLength',
          propType: 'number',
          description: '[表单校验] 字符串最大长度 / 数组最大个数'
        },
        {
          name: 'minmaxLengthMessage',
          propType: 'string',
          description: 'minLength/maxLength 自定义错误信息'
        },
        {
          name: 'minmaxLengthTrigger',
          propType: {
            type: 'oneOfType',
            value: ['string', 'array']
          },
          description: 'minLength/maxLength 自定义触发方式'
        },
        {
          name: 'length',
          propType: 'number',
          description: '[表单校验] 字符串精确长度 / 数组精确个数'
        },
        {
          name: 'lengthMessage',
          propType: 'string',
          description: 'length 自定义错误信息'
        },
        {
          name: 'lengthTrigger',
          propType: {
            type: 'oneOfType',
            value: ['string', 'array']
          },
          description: 'length 自定义触发方式'
        },
        {
          name: 'pattern',
          propType: 'any',
          description: '正则校验'
        },
        {
          name: 'patternMessage',
          propType: 'string',
          description: 'pattern 自定义错误信息'
        },
        {
          name: 'patternTrigger',
          propType: {
            type: 'oneOfType',
            value: ['string', 'array']
          },
          description: 'pattern 自定义触发方式'
        },
        {
          name: 'format',
          propType: {
            type: 'oneOf',
            value: ['number', 'email', 'url', 'tel']
          },
          description: '[表单校验] 四种常用的 pattern'
        },
        {
          name: 'formatMessage',
          propType: 'string',
          description: 'format 自定义错误信息'
        },
        {
          name: 'formatTrigger',
          propType: {
            type: 'oneOfType',
            value: ['string', 'array']
          },
          description: 'format 自定义触发方式'
        },
        {
          name: 'validator',
          propType: 'func',
          description: '[表单校验] 自定义校验函数'
        },
        {
          name: 'validatorTrigger',
          propType: {
            type: 'oneOfType',
            value: ['string', 'array']
          },
          description: 'validator 自定义触发方式'
        },
        {
          name: 'autoValidate',
          propType: 'bool',
          description: '是否修改数据时自动触发校验'
        },
        {
          name: 'device',
          propType: {
            type: 'oneOf',
            value: ['phone', 'tablet', 'desktop']
          },
          description: '预设屏幕宽度'
        },
        {
          name: 'responsive',
          propType: 'bool'
        },
        {
          name: 'colSpan',
          propType: 'number',
          description: '在响应式布局模式下，表单项占多少列'
        },
        {
          name: 'labelWidth',
          propType: {
            type: 'oneOfType',
            value: ['string', 'number']
          },
          description: '在响应式布局下，且label在左边时，label的宽度是多少',
          defaultValue: 100
        },
        {
          name: 'isPreview',
          propType: 'bool',
          description: '是否开启预览态'
        },
        {
          name: 'renderPreview',
          propType: 'func',
          description: '预览态模式下渲染的内容\n@param {any} value 根据包裹的组件的 value 类型而决定'
        }
      ],
      configure: {
        component: {
          isContainer: true,
          nestingRule: {
            parentWhitelist: 'Form'
          }
        }
      }
    },
    NumberPicker: {
      componentName: 'NumberPicker',
      title: '数字输入',
      devMode: 'proCode',
      npm: {
        package: '@alifd/next',
        version: '1.19.18',
        destructuring: true,
        exportName: 'NumberPicker'
      },
      props: [
        {
          name: 'prefix',
          propType: 'string',
          description: '样式前缀',
          defaultValue: 'next-'
        },
        {
          name: 'type',
          propType: {
            type: 'oneOf',
            value: ['normal', 'inline']
          },
          description: '设置类型\n@enumdesc 普通, 内联',
          defaultValue: 'normal'
        },
        {
          name: 'size',
          propType: {
            type: 'oneOf',
            value: ['large', 'medium']
          },
          description: '大小',
          defaultValue: 'medium'
        },
        {
          name: 'value',
          propType: 'number',
          description: '当前值'
        },
        {
          name: 'defaultValue',
          propType: 'number',
          description: '默认值'
        },
        {
          name: 'disabled',
          propType: 'bool',
          description: '是否禁用'
        },
        {
          name: 'step',
          propType: {
            type: 'oneOfType',
            value: ['number', 'string']
          },
          description: '步长',
          defaultValue: 1
        },
        {
          name: 'precision',
          propType: 'number',
          description: '保留小数点后位数',
          defaultValue: 0
        },
        {
          name: 'editable',
          propType: 'bool',
          description: '用户是否可以输入',
          defaultValue: true
        },
        {
          name: 'autoFocus',
          propType: 'bool',
          description: '自动焦点'
        },
        {
          name: 'onChange',
          propType: 'func',
          description: '数值被改变的事件\n@param {Number} value 数据\n@param {Event} e DOM事件对象'
        },
        {
          name: 'onKeyDown',
          propType: 'func',
          description: '键盘按下'
        },
        {
          name: 'onFocus',
          propType: 'func',
          description: '焦点获得'
        },
        {
          name: 'onBlur',
          propType: 'func',
          description: '焦点失去'
        },
        {
          name: 'onCorrect',
          propType: 'func',
          description: '数值订正后的回调\n@param {Object} obj {currentValue,oldValue:String}'
        },
        {
          name: 'onDisabled',
          propType: 'func'
        },
        {
          name: 'max',
          propType: 'number',
          description: '最大值',
          defaultValue: null
        },
        {
          name: 'min',
          propType: 'number',
          description: '最小值',
          defaultValue: null
        },
        {
          name: 'className',
          propType: 'string',
          description: '自定义class'
        },
        {
          name: 'style',
          propType: 'object',
          description: '自定义内联样式'
        },
        {
          name: 'state',
          propType: {
            type: 'oneOf',
            value: ['error']
          }
        },
        {
          name: 'format',
          propType: 'func',
          description: '格式化当前值\n@param {Number} value\n@return {String|Number}'
        },
        {
          name: 'upBtnProps',
          propType: 'object',
          description: '增加按钮的props'
        },
        {
          name: 'downBtnProps',
          propType: 'object',
          description: '减少按钮的props'
        },
        {
          name: 'label',
          propType: 'node',
          description: '内联 label'
        },
        {
          name: 'innerAfter',
          propType: 'node',
          description: 'inner after'
        },
        {
          name: 'rtl',
          propType: 'bool'
        },
        {
          name: 'isPreview',
          propType: 'bool',
          description: '是否为预览态'
        },
        {
          name: 'renderPreview',
          propType: 'func',
          description: '预览态模式下渲染的内容\n@param {number} value 评分值'
        },
        {
          name: 'device',
          propType: {
            type: 'oneOf',
            value: ['phone', 'tablet', 'desktop']
          },
          description: '预设屏幕宽度'
        }
      ]
    },
    Select: {
      componentName: 'Select',
      title: '下拉',
      devMode: 'proCode',
      npm: {
        package: '@alifd/next',
        version: '1.19.18',
        destructuring: true,
        exportName: 'Select'
      },
      props: [
        {
          name: 'mode',
          propType: {
            type: 'oneOf',
            value: ['single', 'multiple', 'tag']
          },
          description: '选择器模式',
          defaultValue: 'single'
        },
        {
          name: 'value',
          propType: 'any',
          description: '当前值，用于受控模式'
        },
        {
          name: 'defaultValue',
          propType: 'any',
          description: '初始的默认值'
        },
        {
          name: 'onChange',
          propType: 'func',
          description:
            "Select发生改变时触发的回调\n@param {*} value 选中的值\n@param {String} actionType 触发的方式, 'itemClick', 'enter', 'tag'\n@param {*} item 选中的值的对象数据 (useDetailValue=false有效)"
        },
        {
          name: 'dataSource',
          propType: {
            type: 'arrayOf',
            value: {
              type: 'oneOfType',
              value: [
                {
                  type: 'shape',
                  value: [
                    {
                      name: 'value',
                      propType: 'any'
                    },
                    {
                      name: 'label',
                      propType: 'any'
                    },
                    {
                      name: 'disabled',
                      propType: 'bool'
                    },
                    {
                      name: 'children',
                      propType: 'array'
                    }
                  ]
                },
                'bool',
                'number',
                'string'
              ]
            }
          },
          description: '传入的数据源，可以动态渲染子项，详见 [dataSource的使用](#dataSource的使用)'
        },
        {
          name: 'hasBorder',
          propType: 'bool',
          description: '是否有边框'
        },
        {
          name: 'hasArrow',
          propType: 'bool',
          description: '是否有下拉箭头',
          defaultValue: true
        },
        {
          name: 'showSearch',
          propType: 'bool',
          description: '展开后是否能搜索（tag 模式下固定为true）',
          defaultValue: false
        },
        {
          name: 'onSearch',
          propType: 'func',
          description: '当搜索框值变化时回调\n@param {String} value 数据'
        },
        {
          name: 'onSearchClear',
          propType: 'func',
          description:
            "当搜索框值被清空时候的回调\n@param {String} actionType 触发的方式, 'select'(选择清空), 'popupClose'(弹窗关闭清空)"
        },
        {
          name: 'hasSelectAll',
          propType: {
            type: 'oneOfType',
            value: ['bool', 'string']
          },
          description: '多选模式下是否有全选功能'
        },
        {
          name: 'fillProps',
          propType: 'string',
          description: '填充到选择框里的值的 key\b\b'
        },
        {
          name: 'useDetailValue',
          propType: 'bool',
          description: 'onChange 返回的 value 使用 dataSource 的对象'
        },
        {
          name: 'cacheValue',
          propType: 'bool',
          description: 'dataSource 变化的时是否保留已选的内容',
          defaultValue: true
        },
        {
          name: 'valueRender',
          propType: 'func',
          description:
            '渲染 Select 展现内容的方法\n@param {Object} item 渲染节点的item\n@return {ReactNode} 展现内容\n@default item => item.label \\|\\| item.value'
        },
        {
          name: 'itemRender',
          propType: 'func',
          description:
            '渲染 MenuItem 内容的方法\n@param {Object} item 渲染节点的item\n@param {String} searchValue 搜索关键字（如果开启搜索）\n@return {ReactNode} item node'
        },
        {
          name: 'notFoundContent',
          propType: 'node',
          description: '弹层内容为空的文案'
        },
        {
          name: 'style',
          propType: 'object'
        },
        {
          name: 'searchValue',
          propType: 'string',
          description: '受控搜索值，一般不需要设置\n@type {[type]}'
        },
        {
          name: 'tagInline',
          propType: 'bool',
          description: '是否一行显示，仅在 mode 为 multiple 的时候生效',
          defaultValue: false
        },
        {
          name: 'maxTagCount',
          propType: 'number',
          description: '最多显示多少个 tag'
        },
        {
          name: 'maxTagPlaceholder',
          propType: 'func',
          description:
            '隐藏多余 tag 时显示的内容，在 maxTagCount 生效时起作用\n@param {number} selectedValues 当前已选中的元素\n@param {number} totalValues 总待选元素'
        },
        {
          name: 'hiddenSelected',
          propType: 'bool',
          description: '选择后是否立即隐藏菜单 (mode=multiple/tag 模式生效)'
        },
        {
          name: 'onRemove',
          propType: 'func',
          description: 'tag 删除回调\n@param {object} item 渲染节点的item'
        },
        {
          name: 'onFocus',
          propType: 'func',
          description: '焦点事件'
        },
        {
          name: 'onBlur',
          propType: 'func',
          description: '失去焦点事件'
        },
        {
          name: 'onMouseEnter',
          propType: 'func'
        },
        {
          name: 'onMouseLeave',
          propType: 'func'
        },
        {
          name: 'onKeyDown',
          propType: 'func'
        },
        {
          name: 'locale',
          propType: 'object'
        }
      ],
      configure: {
        component: {
          isContainer: true,
          nestingRule: {
            childWhitelist: 'Select.Option'
          }
        },
        props: [
          {
            name: 'mode',
            title: '选择器模式',
            setter: {
              componentName: 'RadioGroupSetter',
              props: {
                defaultValue: 'single',
                dataSource: [
                  {
                    value: 'single',
                    label: 'single'
                  },
                  {
                    value: 'multiple',
                    label: 'multiple'
                  },
                  {
                    value: 'tag',
                    label: 'tag'
                  }
                ]
              }
            }
          },
          {
            name: 'mode',
            title: '选择器模式',
            setter: {
              componentName: 'SelectSetter',
              props: {
                defaultValue: 'single',
                dataSource: [
                  {
                    value: 'single',
                    label: 'single'
                  },
                  {
                    value: 'multiple',
                    label: 'multiple'
                  },
                  {
                    value: 'tag',
                    label: 'tag'
                  }
                ]
              }
            }
          },
          {
            name: 'value',
            title: '受控值',
            setter: 'StringSetter',
          },
          {
            name: 'hasBorder',
            title: '是否有边框',
            setter: {
              componentName: 'BoolSetter',
              props: {
                defaultValue: true
              }
            }
          },
          {
            name: 'maxTagCount',
            title: '最多显示多少个 tag',
            setter: 'NumberSetter'
          },
          {
            name: 'maxTagCount',
            title: '最多显示多少个 tag',
            setter: 'ExpressionSetter'
          },
          {
            name: 'MixinSetter',
            placeholder: '混合',
            setter: {
              componentName: 'MixinSetter',
              props: {
                types: [
                  {
                    name: 'StringSetter',
                    // 当前mixin setter API
                    props: {}
                  },
                  {
                    name: 'TextAreaSetter',
                    props: {}
                  },
                  {
                    name: 'SelectSetter',
                    // 当前mixin setter API
                    props: {
                      hasClear: true,
                      dataSource: [
                        {
                          label: '上',
                          value: 't'
                        },
                        {
                          label: '右',
                          value: 'r'
                        },
                        {
                          label: '下',
                          value: 'b'
                        },
                        {
                          label: '左',
                          value: 'l'
                        }
                      ]
                    }
                  },
                  {
                    name: 'NumberSetter',
                    props: {}
                  },
                  {
                    name: 'BoolSetter',
                    props: {}
                  }
                ],
                defaultType: 'SelectSetter'
              }
            }
          },
          {
            type: 'group',
            name: '扩展 Setter',
            items: [
              {
                name: 'TextAreaSetter',
                setter: 'TextAreaSetter'
              },
              {
                name: 'date',
                title: '测试日期',
                setter: 'DateSetter'
              },
              {
                name: 'date',
                title: '测试日期-年',
                setter: 'DateYearSetter'
              },
              {
                name: 'date',
                title: '测试日期-月',
                setter: 'DateMonthSetter'
              },
              {
                name: 'date',
                title: '测试日期-区间',
                setter: 'DateRangeSetter'
              }
            ]
          },
          {
            type: 'group',
            name: 'ArraySetter',
            items: [
              {
                name: 'arrayValue1',
                title: '字符数组',
                setter: {
                  componentName: 'ArraySetter',
                  props: {
                    itemSetter: {
                      componentName: 'StringSetter',
                      initialValue: ''
                    }
                  }
                }
              },
              {
                name: 'arrayValue2',
                title: '数字数组',
                setter: {
                  componentName: 'ArraySetter',
                  props: {
                    itemSetter: {
                      componentName: 'NumberSetter',
                      initialValue: 0
                    }
                  }
                }
              },
              {
                name: 'arrayValue3',
                title: '混合数组',
                setter: {
                  componentName: 'ArraySetter',
                  props: {
                    itemSetter: {
                      componentName: 'MixinSetter',
                      props: {
                        types: [
                          {
                            name: 'StringSetter',
                            // 当前mixin setter API
                            props: {}
                          },
                          {
                            name: 'ExpressionSetter',
                            props: {}
                          },
                          {
                            name: 'RadioGroupSetter',
                            // 当前mixin setter API
                            props: {
                              hasClear: true,
                              dataSource: [
                                {
                                  label: '上',
                                  value: 't'
                                },
                                {
                                  label: '右',
                                  value: 'r'
                                },
                                {
                                  label: '下',
                                  value: 'b'
                                },
                                {
                                  label: '左',
                                  value: 'l'
                                }
                              ]
                            }
                          }
                        ],
                        defaultType: 'SelectSetter'
                      }
                    }
                  }
                }
              },
              {
                name: 'arrayValue4',
                title: '对象数组',
                setter: {
                  componentName: 'ArraySetter',
                  props: {
                    itemSetter: {
                      componentName: 'ObjectSetter',
                      props: {
                        config: {
                          items: [{
                            name: 'username',
                            title: '姓名',
                            setter: 'StringSetter',
                            important: true,
                          }, {
                            name: 'phone',
                            title: '电话',
                            setter: 'StringSetter',
                            important: true,
                          }, {
                            name: 'age',
                            title: '年龄',
                            setter: 'NumberSetter'
                          }, {
                            name: 'married',
                            title: '婚否',
                            setter: 'BoolSetter'
                          }, {
                            type: 'group',
                            title: 'work',
                            items: [
                              {
                                name: 'job',
                                title: '工作岗位',
                                setter: {
                                  componentName: 'SelectSetter',
                                  props: {
                                    dataSource: [{
                                      label: '工程师',
                                      value: 1
                                    }, {
                                      label: '高级工程师',
                                      value: 2
                                    }, {
                                      label: '资深工程师',
                                      value: 3
                                    }]
                                  }
                                }
                              },
                              {
                                name: 'address',
                                title: '工作地点',
                                setter: 'TextAreaSetter'
                              }
                            ]
                          }],
                        }
                      },
                      initialValue: {},
                    }
                  }
                }
              },
              {
                name: 'arrayValue5',
                title: '对象数组',
                setter: {
                  componentName: 'ArraySetter',
                  props: {
                    itemSetter: {
                      componentName: 'ObjectSetter',
                      props: {
                        config: {
                          items: [{
                            name: 'username',
                            title: '姓名',
                            setter: 'StringSetter',
                            important: true,
                          }, {
                            name: 'age',
                            title: '年龄',
                            setter: 'NumberSetter',
                            important: true,
                          }, {
                            name: 'married',
                            title: '婚否',
                            setter: 'BoolSetter',
                            important: true,
                          }, {
                            name: 'log',
                            title: '到访记录',
                            setter: {
                              componentName: 'ArraySetter',
                              props: {
                                itemSetter: 'StringSetter'
                              }
                            },
                            important: true,
                          }, {
                            type: 'group',
                            title: 'work',
                            items: [
                              {
                                name: 'job',
                                title: '工作岗位',
                                setter: {
                                  componentName: 'SelectSetter',
                                  props: {
                                    dataSource: [{
                                      label: '工程师',
                                      value: 1
                                    }, {
                                      label: '高级工程师',
                                      value: 2
                                    }, {
                                      label: '资深工程师',
                                      value: 3
                                    }]
                                  }
                                }
                              },
                              {
                                name: 'address',
                                title: '工作地点',
                                setter: 'TextAreaSetter'
                              }
                            ]
                          }],
                        }
                      },
                      initialValue: {},
                    },
                    mode: 'popup'
                  }
                }
              },
            ],
            extraProps: {
              defaultCollapsed: false,
            }
          },
          {
            type: 'group',
            name: 'ObjectSetter',
            items: [
              {
                name: 'objectValue1',
                title: '对象数据1',
                setter: {
                  componentName: 'ObjectSetter',
                  props: {
                    config: {
                      items: [{
                        name: 'username',
                        title: '姓名',
                        setter: 'StringSetter',
                        important: true,
                      }, {
                        name: 'age',
                        title: '年龄',
                        setter: 'NumberSetter',
                        important: true,
                      }, {
                        name: 'married',
                        title: '婚否',
                        setter: 'BoolSetter',
                        important: true,
                      }, {
                        name: 'log',
                        title: '到访记录',
                        setter: {
                          componentName: 'ArraySetter',
                          props: {
                            itemSetter: 'StringSetter'
                          }
                        },
                        important: true,
                      }, {
                        type: 'group',
                        title: 'work',
                        items: [
                          {
                            name: 'job',
                            title: '工作岗位',
                            setter: {
                              componentName: 'SelectSetter',
                              props: {
                                dataSource: [{
                                  label: '工程师',
                                  value: 1
                                }, {
                                  label: '高级工程师',
                                  value: 2
                                }, {
                                  label: '资深工程师',
                                  value: 3
                                }]
                              }
                            }
                          },
                          {
                            name: 'address',
                            title: '工作地点',
                            setter: 'TextAreaSetter'
                          }
                        ]
                      }],
                    }
                  },
                  initialValue: {},
                }
              },
              {
                name: 'objectValue2',
                title: '对象数据2',
                setter: {
                  componentName: 'ObjectSetter',
                  props: {
                    mode: 'popup',
                    config: {
                      items: [{
                        name: 'username',
                        title: '姓名',
                        setter: 'StringSetter',
                        important: true,
                      }, {
                        name: 'age',
                        title: '年龄',
                        setter: 'NumberSetter',
                        important: true,
                      }, {
                        name: 'married',
                        title: '婚否',
                        setter: 'BoolSetter',
                        important: true,
                      }, {
                        name: 'log',
                        title: '到访记录',
                        setter: {
                          componentName: 'ArraySetter',
                          props: {
                            itemSetter: 'StringSetter'
                          }
                        },
                        important: true,
                      }, {
                        type: 'group',
                        title: 'work',
                        items: [
                          {
                            name: 'job',
                            title: '工作岗位',
                            setter: {
                              componentName: 'SelectSetter',
                              props: {
                                dataSource: [{
                                  label: '工程师',
                                  value: 1
                                }, {
                                  label: '高级工程师',
                                  value: 2
                                }, {
                                  label: '资深工程师',
                                  value: 3
                                }]
                              }
                            }
                          },
                          {
                            name: 'address',
                            title: '工作地点',
                            setter: 'TextAreaSetter'
                          }
                        ]
                      }],
                    }
                  },
                  initialValue: {},
                }
              }
            ]
          }
        ]
      }
    },
    'Select.Option': {
      componentName: 'Select.Option',
      title: '选择项',
      devMode: 'proCode',
      npm: {
        package: '@alifd/next',
        version: '1.19.18',
        destructuring: true,
        exportName: 'Select',
        subName: 'Option'
      },
      props: [
        {
          name: 'value',
          propType: {
            type: 'any',
            isRequired: true
          },
          description: '选项值'
        },
        {
          name: 'disabled',
          propType: 'bool',
          description: '是否禁用'
        },
        {
          name: 'children',
          propType: 'any'
        }
      ],
      configure: {
        component: {
          isContainer: true,
          nestingRule: {
            parentWhitelist: 'Select'
          }
        }
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
          libraryId: 2,
          snippets: [
            {
              title: 'private',
              screenshot: 'https://img.alicdn.com/tfs/TB16gZhi.H1gK0jSZSyXXXtlpXa-192-144.png',
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
              screenshot: 'https://img.alicdn.com/tfs/TB11Hkji1H2gK0jSZFEXXcqMpXa-192-144.png',
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
              screenshot: '',
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
          libraryId: 2,
          title: '输入框',
          icon: '',
          package: '@alife/next',
          snippets: [
            {
              title: '普通',
              screenshot: '',
              schema: {
                componentName: 'Input',
                props: {}
              }
            }
          ]
        },
        {
          componentName: 'Select',
          libraryId: 2,
          title: '选择框',
          icon: '',
          package: '@alife/next',
          snippets: [
            {
              title: '默认',
              screenshot: '',
              schema: {
                componentName: 'Select',
                props: {}
              }
            }
          ]
        },
        {
          componentName: 'NumberPicker',
          libraryId: 2,
          title: '数字',
          icon: '',
          package: '@alife/next',
          snippets: [
            {
              title: '默认',
              screenshot: '',
              schema: {
                componentName: 'NumberPicker',
                props: {}
              }
            }
          ]
        }
      ]
    },
    {
      title: '其他',
      icon: '',
      children: [
        {
          componentName: 'Div',
          libraryId: 3,
          title: '容器',
          icon: '',
          snippets: [
            {
              title: '默认',
              screenshot: '',
              schema: {
                componentName: 'Div',
                props: {}
              }
            }
          ]
        }
      ]
    }
  ]
};
